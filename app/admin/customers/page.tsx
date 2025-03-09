import Link from "next/link"
import { Search, Filter, ArrowUpDown, MoreHorizontal, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCustomers } from "@/lib/admin"

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string }
}) {
  const customers = await getCustomers()

  // Filter and sort customers based on search params
  let filteredCustomers = [...customers]

  // Search filter
  if (searchParams.q) {
    const query = searchParams.q.toLowerCase()
    filteredCustomers = filteredCustomers.filter(
      (customer) => customer.name.toLowerCase().includes(query) || customer.email.toLowerCase().includes(query),
    )
  }

  // Sort
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "name-asc":
        filteredCustomers.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filteredCustomers.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "orders-asc":
        filteredCustomers.sort((a, b) => a.orders - b.orders)
        break
      case "orders-desc":
        filteredCustomers.sort((a, b) => b.orders - a.orders)
        break
      case "spent-asc":
        filteredCustomers.sort((a, b) => a.totalSpent - b.totalSpent)
        break
      case "spent-desc":
        filteredCustomers.sort((a, b) => b.totalSpent - a.totalSpent)
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search customers..." className="pl-8" defaultValue={searchParams.q || ""} />
        </div>
        <div className="flex gap-2">
          <Select defaultValue={searchParams.sort || "name-asc"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="orders-desc">Orders (High to Low)</SelectItem>
              <SelectItem value="orders-asc">Orders (Low to High)</SelectItem>
              <SelectItem value="spent-desc">Spent (High to Low)</SelectItem>
              <SelectItem value="spent-asc">Spent (Low to High)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Orders
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Total Spent
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.orders}</TableCell>
                <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell>{new Date(customer.lastOrder).toLocaleDateString()}</TableCell>
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
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No customers found.
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

