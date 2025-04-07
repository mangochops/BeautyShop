"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// Define Order interface to match Go backend schema
interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  total: number
  user?: {
    name: string | null
    email: string
  } | null
  items: {
    id: string
    name: string
    price: number
    quantity: number
    variant: string | null
  }[]
}

// Define Product interface for low stock products
interface LowStockProduct {
  id: string
  name: string
  stockQuantity: number
}

interface DashboardStats {
  productsCount: number
  ordersCount: number
  customersCount: number
  totalSales: number
  lowStockProducts: LowStockProduct[]
  pendingOrders: number
  recentOrders: Order[]
  salesGrowth: number
  ordersGrowth: number
  customersGrowth: number
  productsGrowth: number
}

// Format currency helper function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount / 100)
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null

    if (!token || !user || user.role !== "ADMIN") {
      router.push("/login?redirect=/admin")
      return
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats")
        }

        const data = await response.json()

        // Transform the data to match our interface
        const transformedData: DashboardStats = {
          productsCount: data.data.productCount || 0,
          ordersCount: data.data.orderCount || 0,
          customersCount: data.data.userCount || 0,
          totalSales: data.data.totalRevenue || 0,
          lowStockProducts: data.data.lowStockProducts || [],
          pendingOrders: data.data.pendingOrdersCount || 0,
          recentOrders: data.data.recentOrders || [],
          salesGrowth: data.data.salesGrowth || 12.5, // Default values if not provided by API
          ordersGrowth: data.data.ordersGrowth || 8.2,
          customersGrowth: data.data.customersGrowth || 5.7,
          productsGrowth: data.data.productsGrowth || 3,
        }

        setStats(transformedData)
      } catch (err) {
        setError("Failed to load dashboard stats. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200"></div>
                <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-gray-200"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-5 w-1/4 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent>
            <div className="h-40 animate-pulse rounded bg-gray-200"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
              {error || "Failed to load dashboard stats"}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
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
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
            <p className="text-xs text-muted-foreground">+{stats.salesGrowth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersCount}</div>
            <p className="text-xs text-muted-foreground">+{stats.ordersGrowth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customersCount}</div>
            <p className="text-xs text-muted-foreground">+{stats.customersGrowth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsCount}</div>
            <p className="text-xs text-muted-foreground">+{stats.productsGrowth} new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            {stats.recentOrders.length > 0
              ? `Showing the latest ${stats.recentOrders.length} orders`
              : "No recent orders available"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length > 0 ? (
            <>
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
                  {stats.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                      <TableCell>{order.user?.name || order.user?.email || "Guest"}</TableCell>
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
                                  : order.status === "PROCESSING"
                                    ? "bg-orange-500"
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
            </>
          ) : (
            <p className="text-center text-muted-foreground">No orders to display</p>
          )}
        </CardContent>
      </Card>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.lowStockProducts.length > 0 && (
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                <div>
                  <h4 className="font-semibold">Low Stock Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    {stats.lowStockProducts.length} products are running low on inventory
                  </p>
                  <Link href="/admin/products?filter=low-stock" className="text-sm text-pink-600 hover:underline">
                    View Products
                  </Link>
                </div>
              </div>
            )}
            {stats.pendingOrders > 0 && (
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <Clock className="mt-0.5 h-5 w-5 text-yellow-500" />
                <div>
                  <h4 className="font-semibold">Pending Orders</h4>
                  <p className="text-sm text-muted-foreground">{stats.pendingOrders} orders are pending fulfillment</p>
                  <Link href="/admin/orders?status=PENDING" className="text-sm text-pink-600 hover:underline">
                    View Orders
                  </Link>
                </div>
              </div>
            )}
            {stats.totalSales > 0 && (
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <TrendingUp className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-semibold">Sales Update</h4>
                  <p className="text-sm text-muted-foreground">Total sales: {formatCurrency(stats.totalSales)}</p>
                  <Link href="/admin/reports/sales" className="text-sm text-pink-600 hover:underline">
                    View Report
                  </Link>
                </div>
              </div>
            )}
            {stats.lowStockProducts.length === 0 && stats.pendingOrders === 0 && stats.totalSales === 0 && (
              <p className="text-sm text-muted-foreground">No alerts or notifications at this time</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

