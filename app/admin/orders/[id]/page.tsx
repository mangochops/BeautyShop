import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOrderById } from "@/lib/admin"
import UpdateOrderStatusButton from "@/components/admin/update-order-status-button"

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrderById(params.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <Badge
            className={
              order.status === "completed"
                ? "bg-green-500"
                : order.status === "processing"
                  ? "bg-blue-500"
                  : order.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
            }
          >
            {order.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Order details and customer information</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm">
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Order Date</dt>
                <dd>{new Date(order.date).toLocaleString()}</dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Customer</dt>
                <dd>{order.customer}</dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Email</dt>
                <dd>{order.email}</dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Phone</dt>
                <dd>{order.phone}</dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Payment Method</dt>
                <dd>{order.paymentMethod}</dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Status</dt>
                <dd>
                  <UpdateOrderStatusButton orderId={order.id} currentStatus={order.status} />
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
            <CardDescription>Delivery address and shipping details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="font-medium">Shipping Address</dt>
                <dd className="mt-1">
                  <address className="not-italic">
                    {order.shippingAddress.name}
                    <br />
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                    <br />
                    {order.shippingAddress.country}
                  </address>
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Shipping Method</dt>
                <dd>{order.shippingMethod}</dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Tracking Number</dt>
                <dd>{order.trackingNumber || "Not available"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Products purchased in this order</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg?height=48&width=48"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.name}
                    {item.variant && <div className="text-sm text-gray-500">{item.variant}</div>}
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Order Summary */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-4 font-medium">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

