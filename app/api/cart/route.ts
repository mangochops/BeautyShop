import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Helper function to get or create cart
async function getOrCreateCart() {
  const cookieStore = cookies()
  let cartId = cookieStore.get("cartId")?.value

  if (!cartId) {
    // Create a new cart
    cartId = uuidv4()
    cookieStore.set("cartId", cartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    await prisma.cart.create({
      data: {
        id: cartId,
        sessionId: cartId,
      },
    })
  } else {
    // Check if cart exists
    const existingCart = await prisma.cart.findUnique({
      where: { sessionId: cartId },
    })

    if (!existingCart) {
      // Create a new cart with the existing ID
      await prisma.cart.create({
        data: {
          id: cartId,
          sessionId: cartId,
        },
      })
    }
  }

  return cartId
}

export async function GET() {
  try {
    const cartId = await getOrCreateCart()

    const cart = await prisma.cart.findUnique({
      where: { sessionId: cartId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isMain: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({ items: [], subtotal: 0 })
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    return NextResponse.json({
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        variant: item.variant,
        image: item.product.images[0]?.url || null,
      })),
      subtotal,
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, quantity, variant } = body

    if (!productId || !quantity) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 })
    }

    // Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (!product.inStock) {
      return NextResponse.json({ error: "Product is out of stock" }, { status: 400 })
    }

    const cartId = await getOrCreateCart()

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        variant: variant || null,
      },
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      })

      return NextResponse.json(updatedItem)
    } else {
      // Add new item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity,
          variant: variant || null,
        },
      })

      return NextResponse.json(newItem)
    }
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}

