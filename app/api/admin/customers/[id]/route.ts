import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const customer = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        addresses: true,
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Calculate total spent
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

    return NextResponse.json({
      ...customer,
      totalSpent: totalSpent._sum.total || 0,
    })
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

