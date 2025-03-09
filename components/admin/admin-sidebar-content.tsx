"use client"

import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings } from "lucide-react"

export default function AdminSidebarContent() {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href="/admin"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-pink-600"
      >
        <LayoutDashboard className="h-5 w-5" />
        Dashboard
      </Link>
      <Link
        href="/admin/products"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-pink-600"
      >
        <Package className="h-5 w-5" />
        Products
      </Link>
      <Link
        href="/admin/categories"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-pink-600"
      >
        <Tag className="h-5 w-5" />
        Categories
      </Link>
      <Link
        href="/admin/orders"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-pink-600"
      >
        <ShoppingCart className="h-5 w-5" />
        Orders
      </Link>
      <Link
        href="/admin/customers"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-pink-600"
      >
        <Users className="h-5 w-5" />
        Customers
      </Link>
      <Link
        href="/admin/settings"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-pink-600"
      >
        <Settings className="h-5 w-5" />
        Settings
      </Link>
    </div>
  )
}

