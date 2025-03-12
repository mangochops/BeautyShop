import Link from "next/link";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";

// Define Order interface to match Prisma schema
interface Order {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  user?: {
    name: string | null;
    email: string;
  } | null;
  items: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
    price: number;
    orderId: string;
    quantity: number;
    variant: string | null;
  }[];
}

// Define Product interface for low stock products
interface LowStockProduct {
  id: string;
  name: string;
  stockQuantity: number;
}

interface AdminDashboardProps {
  productsCount: number;
  ordersCount: number;
  customersCount: number;
  totalSales: number;
  lowStockProducts: LowStockProduct[];
  pendingOrders: number;
  recentOrders: Order[];
}

export default async function AdminDashboard() {
  let productsCount = 0;
  let ordersCount = 0;
  let customersCount = 0;
  let totalSales = 0;
  let lowStockProducts: LowStockProduct[] = [];
  let pendingOrders = 0;
  let recentOrders: Order[] = [];

  try {
    const [
      productsCountResult,
      ordersCountResult,
      customersCountResult,
      totalSalesResult,
      lowStockProductsResult,
      pendingOrdersResult,
      recentOrdersResult,
    ] = await Promise.all([
      prisma.product.count().catch((error) => {
        console.error("Failed to count products:", error);
        return 0;
      }),
      prisma.order.count().catch((error) => {
        console.error("Failed to count orders:", error);
        return 0;
      }),
      prisma.user.count({ where: { role: "USER" } }).catch((error) => {
        console.error("Failed to count customers:", error);
        return 0;
      }),
      prisma.order.aggregate({
        where: { status: { in: ["DELIVERED", "SHIPPED"] } },
        _sum: { total: true },
      }).catch((error) => {
        console.error("Failed to aggregate total sales:", error);
        return { _sum: { total: 0 } };
      }),
      prisma.product.findMany({
        where: { stockQuantity: { lte: 10 }, inStock: true },
        take: 5,
        select: { id: true, name: true, stockQuantity: true },
      }).catch((error) => {
        console.error("Failed to fetch low stock products:", error);
        return [];
      }),
      prisma.order.count({ where: { status: "PENDING" } }).catch((error) => {
        console.error("Failed to count pending orders:", error);
        return 0;
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
      }).catch((error) => {
        console.error("Failed to fetch recent orders:", error);
        return [];
      }),
    ]);

    productsCount = productsCountResult;
    ordersCount = ordersCountResult;
    customersCount = customersCountResult;
    totalSales = totalSalesResult._sum.total ?? 0; // Handle null with default 0
    lowStockProducts = lowStockProductsResult;
    pendingOrders = pendingOrdersResult;
    recentOrders = recentOrdersResult;
  } catch (error) {
    console.error("Unexpected error in AdminDashboard data fetching:", error);
  }

  const props: AdminDashboardProps = {
    productsCount,
    ordersCount,
    customersCount,
    totalSales,
    lowStockProducts,
    pendingOrders,
    recentOrders,
  };

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
            <div className="text-2xl font-bold">{formatCurrency(props.totalSales)}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{props.ordersCount}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{props.customersCount}</div>
            <p className="text-xs text-muted-foreground">+5.7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{props.productsCount}</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            {props.recentOrders.length > 0
              ? `Showing the latest ${props.recentOrders.length} orders`
              : "No recent orders available"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {props.recentOrders.length > 0 ? (
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
                  {props.recentOrders.map((order) => (
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
            {props.lowStockProducts.length > 0 && (
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-5 00" />
                <div>
                  <h4 className="font-semibold">Low Stock Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    {props.lowStockProducts.length} products are running low on inventory
                  </p>
                  <Link href="/admin/products?filter=low-stock" className="text-sm text-pink-600 hover:underline">
                    View Products
                  </Link>
                </div>
              </div>
            )}
            {props.pendingOrders > 0 && (
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <Clock className="mt-0.5 h-5 w-5 text-yellow-500" />
                <div>
                  <h4 className="font-semibold">Pending Orders</h4>
                  <p className="text-sm text-muted-foreground">
                    {props.pendingOrders} orders are pending fulfillment
                  </p>
                  <Link href="/admin/orders?status=PENDING" className="text-sm text-pink-600 hover:underline">
                    View Orders
                  </Link>
                </div>
              </div>
            )}
            {props.totalSales > 0 && (
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <TrendingUp className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-semibold">Sales Update</h4>
                  <p className="text-sm text-muted-foreground">
                    Total sales: {formatCurrency(props.totalSales)}
                  </p>
                  <Link href="/admin/reports/sales" className="text-sm text-pink-600 hover:underline">
                    View Report
                  </Link>
                </div>
              </div>
            )}
            {props.lowStockProducts.length === 0 && props.pendingOrders === 0 && props.totalSales === 0 && (
              <p className="text-sm text-muted-foreground">No alerts or notifications at this time</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour (ISR)