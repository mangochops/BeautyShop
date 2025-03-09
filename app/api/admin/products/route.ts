import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const sort = searchParams.get("sort") || "createdAt:desc"

  const [field, order] = sort.split(":")

  const skip = (page - 1) * limit

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { categoryId: category } : {}),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          where: { isMain: true },
          take: 1,
        },
      },
      orderBy: {
        [field]: order.toLowerCase() === "asc" ? "asc" : "desc",
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, price, originalPrice, categoryId, featured, inStock, stockQuantity, sku, images } = body

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        originalPrice,
        categoryId,
        featured: featured || false,
        inStock: inStock || true,
        stockQuantity: stockQuantity || 0,
        sku,
      },
    })

    // Add product images
    if (images && images.length > 0) {
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

