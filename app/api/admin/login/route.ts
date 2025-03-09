import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // Simple authentication check
  if (email === "admin@example.com" && password === "password") {
    // Create a simple session
    const sessionData = {
      user: {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    }

    // Set a cookie with the session data
    cookies().set({
      name: "admin-session",
      value: JSON.stringify(sessionData),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "lax",
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
}

