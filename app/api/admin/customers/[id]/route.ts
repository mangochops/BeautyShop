import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const BACKEND_URL = "http://localhost:8080"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const res = await fetch(`${BACKEND_URL}/customers/${params.id}`)
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 })
      }
      throw new Error("Failed to fetch customer")
    }
    const customer = await res.json()
    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

