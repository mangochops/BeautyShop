import  prisma  from "@/lib/prisma";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

export type { Product, Category };

// Fetch all products
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: { where: { isMain: true }, take: 1 },
        reviews: { select: { rating: true } },
      },
      where: { inStock: true },
    });

    if (!Array.isArray(products)) {
      console.error("getProducts: Expected array, got:", products);
      return [];
    }

    return products.map((product): Product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      image: product.images[0]?.url ?? undefined,
      category: product.category?.slug ?? "",
      featured: product.featured,
      rating: product.reviews.length
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0,
      reviews: product.reviews.length,
      inStock: product.inStock,
    }));
  } catch (error) {
    console.error("Error in getProducts:", error);
    return [];
  }
}

// Fetch featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: { where: { isMain: true }, take: 1 },
        reviews: { select: { rating: true } },
      },
      where: { featured: true, inStock: true },
    });

    if (!Array.isArray(products)) {
      console.error("getFeaturedProducts: Expected array, got:", products);
      return [];
    }

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
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    return [];
  }
}

// Fetch a product by ID
export async function getProductById(id: string): Promise<Product | null> {
  if (!id) {
    console.warn("getProductById: No ID provided");
    return null;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { where: { isMain: true }, take: 1 },
        reviews: { select: { rating: true } },
      },
    });

    if (!product) {
      console.warn(`getProductById: Product not found for id ${id}`);
      return null;
    }

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
  } catch (error) {
    console.error(`Error in getProductById for id ${id}:`, error);
    return null;
  }
}

// Fetch related products by category
export async function getRelatedProducts(category: string): Promise<Product[]> {
  if (!category) {
    console.warn("getRelatedProducts: No category provided");
    return [];
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: { where: { isMain: true }, take: 1 },
        reviews: { select: { rating: true } },
      },
      where: { category: { slug: category }, inStock: true },
      take: 4,
    });

    if (!Array.isArray(products)) {
      console.error("getRelatedProducts: Expected array, got:", products);
      return [];
    }

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
  } catch (error) {
    console.error(`Error in getRelatedProducts for category ${category}:`, error);
    return [];
  }
}

// Fetch categories
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!Array.isArray(categories)) {
      console.error("getCategories: Expected array, got:", categories);
      return [];
    }

    return categories.map((category): Category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image ?? undefined,
      productCount: category._count.products, // Added product count
    }));
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
}