import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Type for POST request body
interface ProductCreateInput {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  featured?: boolean;
  inStock?: boolean;
  stockQuantity?: number;
  sku?: string;
  images?: { url: string; alt?: string; isMain?: boolean }[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "createdAt:desc";

  const [field, order] = sort.split(":");

  const skip = (page - 1) * limit;

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(category ? { categoryId: category } : {}),
  };

  try {
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
    ]);

    return NextResponse.json({
      products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: ProductCreateInput = await request.json();
    const { name, description, price, originalPrice, categoryId, featured, inStock, stockQuantity, sku, images } = body;

    // Basic validation
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price, or categoryId" },
        { status: 400 }
      );
    }

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Ensure slug uniqueness
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`; // Append timestamp to avoid duplicates
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        originalPrice,
        categoryId,
        featured: featured ?? false,
        inStock: inStock ?? true,
        stockQuantity: stockQuantity ?? 0,
        sku,
      },
    });

    // Add product images
    if (images && images.length > 0) {
      await Promise.all(
        images.map((image, index) =>
          prisma.productImage.create({
            data: {
              url: image.url,
              alt: image.alt || product.name,
              isMain: image.isMain ?? index === 0, // First image is main by default
              productId: product.id,
            },
          })
        )
      );
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}