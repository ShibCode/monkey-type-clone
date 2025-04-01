import { NextResponse } from "next/server";

import { jwtVerify } from "jose";

export const revalidate = 0;

export async function middleware(req) {
  const pathname = new URL(req.url).pathname;

  // exclude auth route
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    // disallow access to account page
    if (pathname.startsWith("/account")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

  try {
    await jwtVerify(token, secret);

    // disallow access to login page if user is already logged in
    if (pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url)); // if token is invalid
  }

  //   return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    // Match specific paths
    "/",
    "/login",
    "/settings",
    "/account",
    "/leaderboards",
    // Match all API routes
    "/api/:path*",
  ],
};
