import { NextResponse } from "next/server";

type RSVPRequestBody = {
  eventType?: string;
  name?: string;
  attendance?: string;
  guestCount?: number;
  message?: string;
  page?: string;
};

export async function GET() {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Google Script URL is not configured.",
        },
        { status: 500 }
      );
    }

    const googleResponse = await fetch(`${scriptUrl}?mode=stats`, {
      method: "GET",
      cache: "no-store",
    });

    const googleData = await googleResponse.json();

    if (!googleResponse.ok || !googleData.success) {
      return NextResponse.json(
        {
          success: false,
          message: googleData.message || "Failed to load RSVP stats.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stats: googleData.stats,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading RSVP stats.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Google Script URL is not configured.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RSVPRequestBody;

    const eventType = String(body.eventType || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const attendance = String(body.attendance || "").trim();
    const guestCount = Number(body.guestCount || 0);
    const message = String(body.message || "").trim();
    const page = String(body.page || "").trim();

    if (eventType !== "wedding" && eventType !== "homecoming") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid RSVP event type.",
        },
        { status: 400 }
      );
    }

    if (!name || !attendance) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and attendance are required.",
        },
        { status: 400 }
      );
    }

    const googleResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventType,
        name,
        attendance,
        guestCount,
        message,
        page,
      }),
      cache: "no-store",
    });

    const googleData = await googleResponse.json();

    if (!googleResponse.ok || !googleData.success) {
      return NextResponse.json(
        {
          success: false,
          message: googleData.message || "Failed to save RSVP.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "RSVP saved successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while saving RSVP.",
      },
      { status: 500 }
    );
  }
}