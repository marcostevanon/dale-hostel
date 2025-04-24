import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply to /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Skip the login page itself
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Check if the user is authenticated
  const authCookie = request.cookies.get("admin-auth")

  if (!authCookie || authCookie.value !== "authenticated") {
    // Redirect to login page
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
