import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "dashboard_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    const expectedUsername = process.env.DASHBOARD_USERNAME;
    const expectedPassword = process.env.DASHBOARD_PASSWORD;
    const sessionToken = process.env.DASHBOARD_SESSION_TOKEN;

    if (!expectedUsername || !expectedPassword || !sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Dashboard login is not configured correctly.",
        },
        { status: 500 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter both username and password.",
        },
        { status: 400 }
      );
    }

    const isValidLogin =
      username === expectedUsername && password === expectedPassword;

    if (!isValidLogin) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect username or password.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to login. Please try again.",
      },
      { status: 500 }
    );
  }
}