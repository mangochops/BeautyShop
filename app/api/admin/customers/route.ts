import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const sort = searchParams.get("sort") || "createdAt:desc"

    const [field, order] = sort.split(":")

    const skip = (page - 1) * limit

    const where = {
      role: "USER",
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
          orders: {
            select: {
              total: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          [field]: order.toLowerCase() === "asc" ? "asc" : "desc",
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    // Calculate total spent for each customer
    const customersWithTotalSpent = await Promise.all(
      customers.map(async (customer) => {
        const totalSpent = await prisma.order.aggregate({
          where: {
            userId: customer.id,
            status: {
              in: ["DELIVERED", "SHIPPED"],
            },
          },
          _sum: {
            total: true,
          },
        })

        return {
          ...customer,
          totalSpent: totalSpent._sum.total || 0,
          lastOrder: customer.orders[0]?.createdAt || null,
        }
      }),
    )

    return NextResponse.json({
      customers: customersWithTotalSpent,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

