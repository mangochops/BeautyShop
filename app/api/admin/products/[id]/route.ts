import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: true,
        attributes: true,
        variants: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, price, originalPrice, categoryId, featured, inStock, stockQuantity, sku, images } = body

    // Generate slug from name if name is changed
    let slug
    if (name) {
      slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(originalPrice !== undefined && { originalPrice }),
        ...(categoryId && { categoryId }),
        ...(featured !== undefined && { featured }),
        ...(inStock !== undefined && { inStock }),
        ...(stockQuantity !== undefined && { stockQuantity }),
        ...(sku && { sku }),
      },
    })

    // Update product images
    if (images && images.length > 0) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: params.id },
      })

      // Add new images
      await Promise.all(
        images.map((image: { url: string; alt?: string; isMain: boolean }, index: number) =>
          prisma.productImage.create({
            data: {
              url: image.url,
              alt: image.alt || product.name,
              isMain: image.isMain || index === 0,
              productId: product.id,
            },
          }),
        ),
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

