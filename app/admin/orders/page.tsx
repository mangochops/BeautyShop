import Link from "next/link"
import { Search, Filter, ArrowUpDown, MoreHorizontal, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrders } from "@/lib/admin"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; sort?: string }
}) {
  const orders = await getOrders()

  // Filter and sort orders based on search params
  let filteredOrders = [...orders]

  // Search filter
  if (searchParams.q) {
    const query = searchParams.q.toLowerCase()
    filteredOrders = filteredOrders.filter(
      (order) => order.id.toString().includes(query) || order.customer.toLowerCase().includes(query),
    )
  }

  // Status filter
  if (searchParams.status && searchParams.status !== "all") {
    filteredOrders = filteredOrders.filter((order) => order.status === searchParams.status)
  }

  // Sort
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "date-asc":
        filteredOrders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "date-desc":
        filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "total-asc":
        filteredOrders.sort((a, b) => a.total - b.total)
        break
      case "total-desc":
        filteredOrders.sort((a, b) => b.total - a.total)
        break
      default:
        break
    }
  } else {
    // Default sort by date descending
    filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search orders..." className="pl-8" defaultValue={searchParams.q || ""} />
        </div>
        <div className="flex gap-2">
          <Select defaultValue={searchParams.status || "all"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={searchParams.sort || "date-desc"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="total-desc">Total (High to Low)</SelectItem>
              <SelectItem value="total-asc">Total (Low to High)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Total
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" className="bg-pink-600 text-white">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  )
}

