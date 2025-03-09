import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { quantity } = body

    if (quantity === undefined) {
      return NextResponse.json({ error: "Quantity is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Check if item exists
    const item = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        cartId,
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (quantity <= 0) {
      // Delete item if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ success: true, deleted: true })
    } else {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: params.id },
        data: {
          quantity,
        },
      })

      return NextResponse.json(updatedItem)
    }
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Check if item exists
    const item = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        cartId,
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Delete item
    await prisma.cartItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting cart item:", error)
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 })
  }
}

