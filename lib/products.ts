import { prisma } from "@/lib/prisma"
import type { Product } from "@/types/product"
import type { Category } from "@/types/category"

// Helper functions to get data from the database
export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
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
    where: {
      inStock: true,
    },
  })

  // Calculate average rating for each product
  return products.map((product) => {
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0
    const reviewsCount = product.reviews.length

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.images[0]?.url || undefined,
      category: product.category.slug,
      featured: product.featured,
      rating: averageRating,
      reviews: reviewsCount,
      inStock: product.inStock,
    }
  })
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
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
    where: {
      featured: true,
      inStock: true,
    },
  })

  // Calculate average rating for each product
  return products.map((product) => {
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0
    const reviewsCount = product.reviews.length

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.images[0]?.url || undefined,
      category: product.category.slug,
      featured: product.featured,
      rating: averageRating,
      reviews: reviewsCount,
      inStock: product.inStock,
    }
  })
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
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
  })

  if (!product) return undefined

  // Calculate average rating
  const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0
  const reviewsCount = product.reviews.length

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice || undefined,
    image: product.images[0]?.url || undefined,
    category: product.category.slug,
    featured: product.featured,
    rating: averageRating,
    reviews: reviewsCount,
    inStock: product.inStock,
  }
}

export async function getRelatedProducts(category: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
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
    where: {
      category: {
        slug: category,
      },
      inStock: true,
    },
    take: 4,
  })

  // Calculate average rating for each product
  return products.map((product) => {
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0
    const reviewsCount = product.reviews.length

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.images[0]?.url || undefined,
      category: product.category.slug,
      featured: product.featured,
      rating: averageRating,
      reviews: reviewsCount,
      inStock: product.inStock,
    }
  })
}

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image || undefined,
  }))
}

