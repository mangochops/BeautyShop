import { NextResponse } from "next/server";

type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
import prisma from "@/lib/prisma"; // Only import the default export
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as OrderStatus | undefined;
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "createdAt:desc";

    const [field, order] = sort.split(":");

    const skip = (page - 1) * limit;

    const where = {
      ...(status ? { status: status } : {}),
      ...(search
        ? {
            OR: [
              { orderNumber: { contains: search, mode: "insensitive" as const } },
              { user: { name: { contains: search, mode: "insensitive" as const } } },
              { user: { email: { contains: search, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            select: {
              id: true,
              quantity: true,
            },
          },
        },
        orderBy: {
          [field]: order.toLowerCase() === "asc" ? "asc" : "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}