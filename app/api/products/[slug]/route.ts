import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        images: true,
        attributes: true,
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        inStock: true,
      },
      include: {
        images: {
          where: { isMain: true },
          take: 1,
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 4,
    })

    // Calculate average rating for related products
    const relatedProductsWithRating = relatedProducts.map((relatedProduct) => {
      const totalRelatedRating = relatedProduct.reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRelatedRating =
        relatedProduct.reviews.length > 0 ? totalRelatedRating / relatedProduct.reviews.length : 0
      const reviewsCount = relatedProduct.reviews.length

      return {
        ...relatedProduct,
        rating: averageRelatedRating,
        reviews: reviewsCount,
      }
    })

    return NextResponse.json({
      ...product,
      rating: averageRating,
      relatedProducts: relatedProductsWithRating,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

