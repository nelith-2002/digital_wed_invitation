import { NextRequest, NextResponse } from "next/server";

const ALLOWED_GOOGLE_HOSTS = new Set([
  "www.googleapis.com",
]);

function isAllowedUploadUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      ALLOWED_GOOGLE_HOSTS.has(url.hostname) &&
      url.pathname.startsWith("/upload/drive/")
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const uploadUrl = request.headers.get("x-upload-url");
    const contentRange = request.headers.get("x-content-range");
    const contentType =
      request.headers.get("x-file-type") ||
      "application/octet-stream";

    if (!uploadUrl || !isAllowedUploadUrl(uploadUrl)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid upload session.",
        },
        { status: 400 }
      );
    }

    if (!contentRange) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing upload range.",
        },
        { status: 400 }
      );
    }

    const chunk = await request.arrayBuffer();

    if (chunk.byteLength === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Upload chunk is empty.",
        },
        { status: 400 }
      );
    }

    const googleResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(chunk.byteLength),
        "Content-Range": contentRange,
      },
      body: chunk,
    });

    /*
      Google resumable upload:
      308 = chunk received, upload not complete
      200 / 201 = complete
    */

    if (googleResponse.status === 308) {
      return NextResponse.json({
        success: true,
        complete: false,
        range: googleResponse.headers.get("range"),
      });
    }

    if (
      googleResponse.status === 200 ||
      googleResponse.status === 201
    ) {
      const data = await googleResponse.json();

      return NextResponse.json({
        success: true,
        complete: true,
        file: {
          id: data.id,
          name: data.name,
          size: data.size,
          parents: data.parents,
        },
      });
    }

    const googleError = await googleResponse.text();

    console.error(
      "Google Drive chunk upload failed:",
      googleResponse.status,
      googleError
    );

    return NextResponse.json(
      {
        success: false,
        message: "Google Drive rejected part of the upload.",
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("Chunk upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "The upload connection was interrupted. Please try again.",
      },
      { status: 500 }
    );
  }
}