import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth(async (req: NextRequest) => {
  if (!(req as any).auth) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      // For API routes, return a 401 response
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    } else {
      // For normal pages, redirect to the home page or login page
      const loginUrl = new URL("/", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // "/medications/:path*",
    // "/add-medication/:path*",
    // "/schedule/:path*",
    // "/api/medications/:path*", // API routes
    // "/api/schedule/:path*",
  ],
};
