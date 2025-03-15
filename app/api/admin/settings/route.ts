import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { key: "store" },
    })

    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 })
    }

    return NextResponse.json(settings.value)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    const settings = await prisma.settings.upsert({
      where: { key: "store" },
      update: { value: body },
      create: {
        key: "store",
        value: body,
      },
    })

    return NextResponse.json(settings.value)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

