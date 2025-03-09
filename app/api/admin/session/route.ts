import { cookies } from "next/headers"
import { NextResponse } from "next/server"

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

    return NextResponse.json({ session: sessionData })
  } catch (error) {
    return NextResponse.json({ session: null })
  }
}

