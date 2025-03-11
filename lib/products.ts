import { prisma } from "@/lib/prisma";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

export type { Product, Category };

// Fetch all products
export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { where: { isMain: true }, take: 1 },
      reviews: { select: { rating: true } },
    },
    where: { inStock: true },
  });

  if (!products) return []; // Ensure an array is returned

  return products.map((product): Product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice || undefined,
    image: product.images[0]?.url || undefined,
    category: product.category?.slug || '',
    featured: product.featured,
    rating: product.reviews.length 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
      : 0,
    reviews: product.reviews.length,
    inStock: product.inStock,
  }));
}

// Fetch featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { where: { isMain: true }, take: 1 },
      reviews: { select: { rating: true } },
    },
    where: { featured: true, inStock: true },
  });

  if (!Array.isArray(products)) return [];

  return products.map((product): Product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    image: product.images?.[0]?.url ?? undefined,
    category: product.category?.slug ?? "",
    featured: product.featured,
    rating: product.reviews.length
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0,
    reviews: product.reviews.length,
    inStock: product.inStock,
  }));
}

// Fetch a product by ID
export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { where: { isMain: true }, take: 1 },
      reviews: { select: { rating: true } },
    },
  });

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    image: product.images?.[0]?.url ?? undefined,
    category: product.category?.slug ?? "",
    featured: product.featured,
    rating: product.reviews.length
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0,
    reviews: product.reviews.length,
    inStock: product.inStock,
  };
}

// Fetch related products by category
export async function getRelatedProducts(category: string): Promise<Product[]> {
  if (!category) return [];

  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { where: { isMain: true }, take: 1 },
      reviews: { select: { rating: true } },
    },
    where: { category: { slug: category }, inStock: true },
    take: 4,
  });

  if (!Array.isArray(products)) return [];

  return products.map((product): Product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    image: product.images?.[0]?.url ?? undefined,
    category: product.category?.slug ?? "",
    featured: product.featured,
    rating: product.reviews.length
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0,
    reviews: product.reviews.length,
    inStock: product.inStock,
  }));
}

// Fetch categories
export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
  });

  if (!Array.isArray(categories)) return [];

  return categories.map((category): Category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image ?? undefined,
  }));
}
