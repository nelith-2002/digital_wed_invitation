import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "dashboard_session";

function hasValidDashboardSession(request: NextRequest) {
  const sessionToken = process.env.DASHBOARD_SESSION_TOKEN;

  if (!sessionToken) {
    return process.env.NODE_ENV !== "production";
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  return sessionCookie?.value === sessionToken;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardPage = pathname === "/";
  const isDashboardStatsRequest =
    pathname === "/api/rsvp" && request.method === "GET";

  const shouldProtect = isDashboardPage || isDashboardStatsRequest;

  if (!shouldProtect) {
    return NextResponse.next();
  }

  if (hasValidDashboardSession(request)) {
    return NextResponse.next();
  }

  if (isDashboardStatsRequest) {
    return NextResponse.json(
      {
        success: false,
        message: "Dashboard authentication required.",
      },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/", "/api/rsvp"],
};