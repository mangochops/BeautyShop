import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

const BACKEND_URL = "http://localhost:8080"

// Helper to get or create cartId cookie
function getOrCreateCartId() {
  const cookieStore = cookies()
  let cartId = cookieStore.get("cartId")?.value

  if (!cartId) {
    cartId = uuidv4()
    cookieStore.set("cartId", cartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })
  }
  return cartId
}

export async function GET() {
  try {
    const cartId = getOrCreateCartId()
    const res = await fetch(`${BACKEND_URL}/cart?cartId=${cartId}`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cartId = getOrCreateCartId()
    const body = await request.json()
    const res = await fetch(`${BACKEND_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, cartId }),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}

