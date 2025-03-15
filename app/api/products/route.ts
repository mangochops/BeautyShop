import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "12");
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt:desc";
  const minPrice = Number.parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "1000000");
  const featured = searchParams.get("featured") === "true";

  const [field, order] = sort.split(":");

  const skip = (page - 1) * limit;

  // Handle NaN by providing fallback values
  const safeMinPrice = isNaN(minPrice) ? 0 : minPrice;
  const safeMaxPrice = isNaN(maxPrice) ? 1000000 : maxPrice;

  const where = {
    inStock: true,
    price: {
      gte: safeMinPrice,
      lte: safeMaxPrice,
    },
    ...(category ? { category: { slug: category } } : {}),
    ...(featured ? { featured: true } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
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
        orderBy: {
          [field]: order.toLowerCase() === "asc" ? "asc" : "desc",
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating and reviews count, excluding full reviews array
    const productsWithRating = products.map((product) => {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;
      const reviewsCount = product.reviews.length;

      // Exclude reviews array from response, only include count and average
      const { reviews, ...productWithoutReviews } = product;
      return {
        ...productWithoutReviews,
        rating: averageRating,
        reviews: reviewsCount,
      };
    });

    return NextResponse.json({
      products: productsWithRating,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}