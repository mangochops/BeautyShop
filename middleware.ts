import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path starts with /admin (except for /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Check for our custom session cookie
    const sessionCookie = request.cookies.get("admin-session")

    if (!sessionCookie) {
      // No session cookie found, redirect to login
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    try {
      // Parse the session data
      const sessionData = JSON.parse(sessionCookie.value)

      // Check if the session is expired
      if (new Date(sessionData.expires) < new Date()) {
        // Session expired, redirect to login
        const url = new URL("/admin/login", request.url)
        return NextResponse.redirect(url)
      }

      // Check if the user is an admin
      if (sessionData.user?.role !== "admin") {
        // Not an admin, redirect to login
        const url = new URL("/admin/login", request.url)
        return NextResponse.redirect(url)
      }
    } catch (error) {
      // Invalid session data, redirect to login
      const url = new URL("/admin/login", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

