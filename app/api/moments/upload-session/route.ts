import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

type EventType = "wedding" | "homecoming";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

function getFolderId(event: EventType) {
  if (event === "wedding") {
    return process.env.GOOGLE_DRIVE_WEDDING_FOLDER_ID;
  }

  if (event === "homecoming") {
    return process.env.GOOGLE_DRIVE_HOMECOMING_FOLDER_ID;
  }

  return undefined;
}

function getSafeFileName(name: string) {
  return name
    .replace(/[^\w.\- ()]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export async function POST(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Upload service is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const event = String(body.event || "") as EventType;
    const originalName = String(body.fileName || "");
    const mimeType = String(body.mimeType || "application/octet-stream");
    const fileSize = Number(body.fileSize);

    if (event !== "wedding" && event !== "homecoming") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid event.",
        },
        { status: 400 }
      );
    }

    if (!originalName || !Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file information.",
        },
        { status: 400 }
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "This file is too large. Maximum size is 500 MB.",
        },
        { status: 413 }
      );
    }

    const allowedMimeType =
      mimeType.startsWith("image/") || mimeType.startsWith("video/");

    if (!allowedMimeType) {
      return NextResponse.json(
        {
          success: false,
          message: "Only photos and videos can be uploaded.",
        },
        { status: 415 }
      );
    }

    const folderId = getFolderId(event);

    if (!folderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Destination folder is not configured.",
        },
        { status: 500 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const accessToken = await oauth2Client.getAccessToken();

    if (!accessToken.token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to authorize Google Drive upload.",
        },
        { status: 500 }
      );
    }

    const safeName = getSafeFileName(originalName);

    const finalName = `${Date.now()}-${safeName}`;

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,parents,size",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Type": mimeType,
          "X-Upload-Content-Length": String(fileSize),
        },
        body: JSON.stringify({
          name: finalName,
          parents: [folderId],
        }),
      }
    );

    if (!response.ok) {
      const googleError = await response.text();

      console.error(
        "Unable to create Google Drive upload session:",
        googleError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Unable to prepare the upload.",
        },
        { status: 502 }
      );
    }

    const uploadUrl = response.headers.get("location");

    if (!uploadUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Google Drive did not create an upload session.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      uploadUrl,
      fileName: finalName,
    });
  } catch (error) {
    console.error("Upload-session error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to prepare your upload. Please try again.",
      },
      { status: 500 }
    );
  }
}