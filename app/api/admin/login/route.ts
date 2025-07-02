import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const BACKEND_URL = "http://localhost:8080"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // Authenticate with Go backend
  const res = await fetch(`${BACKEND_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (res.ok) {
    const user = await res.json()
    const sessionData = {
      user,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    }

    cookies().set({
      name: "admin-session",
      value: JSON.stringify(sessionData),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
}

