import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const BACKEND_URL = "http://localhost:8080"

export async function GET() {
  const sessionCookie = cookies().get("admin-session")

  if (!sessionCookie) {
    return NextResponse.json({ session: null })
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value)

    // Check if the session is expired
    if (new Date(sessionData.expires) < new Date()) {
      cookies().delete("admin-session")
      return NextResponse.json({ session: null })
    }

    // Optionally verify session with Go backend
    // const res = await fetch(`${BACKEND_URL}/admin/session`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ session: sessionData }),
    // })
    // if (!res.ok) {
    //   cookies().delete("admin-session")
    //   return NextResponse.json({ session: null })
    // }

    return NextResponse.json({ session: sessionData })
  } catch (error) {
    return NextResponse.json({ session: null })
  }
}

