import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Missing Google OAuth environment variables" },
      { status: 500 }
    );
  }

  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code was not returned by Google" },
      { status: 400 }
    );
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return NextResponse.json(
        {
          error: "Google did not return a refresh token.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      refreshToken: tokens.refresh_token,
    });
  } catch (error) {
    console.error("Google OAuth error:", error);

    return NextResponse.json(
      { error: "Failed to complete Google authorization" },
      { status: 500 }
    );
  }
}