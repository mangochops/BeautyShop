import Link from "next/link"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/format"

export default async function AdminDashboard() {
  // Get dashboard stats
  const [productsCount, ordersCount, customersCount, totalSales, lowStockProducts, pendingOrders, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.aggregate({
        where: {
          status: {
            in: ["DELIVERED", "SHIPPED"],
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.product.findMany({
        where: {
          stockQuantity: {
            lte: 10,
          },
          inStock: true,
        },
        take: 5,
      }),
      prisma.order.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          items: true,
        },
      }),
    ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button>Export Reports</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales._sum.total || 0)}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCount}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersCount}</div>
            <p className="text-xs text-muted-foreground">+5.7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount}</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Showing the latest {recentOrders.length} orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                  <TableCell>{order.user?.name || "Guest"}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        order.status === "DELIVERED"
                          ? "bg-green-500"
                          : order.status === "SHIPPED"
                            ? "bg-blue-500"
                            : order.status === "PENDING"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }
                    >
                      {order.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Link href="/admin/orders">
              <Button variant="outline">View All Orders</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowStockProducts.length > 0 && (
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                <div>
                  <h4 className="font-semibold">Low Stock Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    {lowStockProducts.length} products are running low on inventory.
                  </p>
                  <Link href="/admin/products?filter=low-stock" className="text-sm text-pink-600 hover:underline">
                    View Products
                  </Link>
                </div>
              </div>
            )}
            {pendingOrders > 0 && (
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <Clock className="mt-0.5 h-5 w-5 text-yellow-500" />
                <div>
                  <h4 className="font-semibold">Pending Orders</h4>
                  <p className="text-sm text-muted-foreground">{pendingOrders} orders are pending fulfillment.</p>
                  <Link href="/admin/orders?status=PENDING" className="text-sm text-pink-600 hover:underline">
                    View Orders
                  </Link>
                </div>
              </div>
            )}
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <TrendingUp className="mt-0.5 h-5 w-5 text-green-500" />
              <div>
                <h4 className="font-semibold">Sales Increase</h4>
                <p className="text-sm text-muted-foreground">Sales have increased by 15% this week.</p>
                <Link href="/admin/reports/sales" className="text-sm text-pink-600 hover:underline">
                  View Report
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

