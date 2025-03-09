import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  // Delete the session cookie
  cookies().delete("admin-session")

  return NextResponse.json({ success: true })
}

