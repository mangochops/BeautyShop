import type { Product } from "@/types/product"
import type { Category } from "@/types/category"

// Mock data for dashboard stats
export async function getDashboardStats() {
  return {
    totalSales: 12450.75,
    totalOrders: 156,
    totalCustomers: 89,
    totalProducts: 48,
  }
}

// Mock data for recent orders
export async function getRecentOrders() {
  return [
    {
      id: "1001",
      customer: "Sarah Johnson",
      date: "2023-11-15T10:30:00Z",
      status: "completed",
      items: 3,
      total: 129.99,
    },
    {
      id: "1002",
      customer: "Michael Chen",
      date: "2023-11-14T15:45:00Z",
      status: "processing",
      items: 2,
      total: 79.98,
    },
    {
      id: "1003",
      customer: "Emily Rodriguez",
      date: "2023-11-14T09:15:00Z",
      status: "pending",
      items: 1,
      total: 49.99,
    },
    {
      id: "1004",
      customer: "David Kim",
      date: "2023-11-13T14:20:00Z",
      status: "completed",
      items: 4,
      total: 159.96,
    },
    {
      id: "1005",
      customer: "Jessica Taylor",
      date: "2023-11-12T11:10:00Z",
      status: "cancelled",
      items: 2,
      total: 89.98,
    },
  ]
}

// Mock data for all orders
export async function getOrders() {
  const recentOrders = await getRecentOrders()

  // Add more orders to the list
  return [
    ...recentOrders,
    {
      id: "1006",
      customer: "Robert Johnson",
      date: "2023-11-11T16:30:00Z",
      status: "completed",
      items: 2,
      total: 99.98,
    },
    {
      id: "1007",
      customer: "Amanda Lee",
      date: "2023-11-10T13:45:00Z",
      status: "completed",
      items: 1,
      total: 39.99,
    },
    {
      id: "1008",
      customer: "Daniel Wilson",
      date: "2023-11-09T10:20:00Z",
      status: "processing",
      items: 3,
      total: 119.97,
    },
  ]
}

// Mock data for a specific order
export async function getOrderById(id: string) {
  const orders = await getOrders()
  const order = orders.find((order) => order.id === id)

  if (!order) return null

  // Add more details to the order
  return {
    ...order,
    email: "customer@example.com",
    phone: "(123) 456-7890",
    paymentMethod: "Credit Card",
    shippingMethod: "Standard Shipping",
    trackingNumber: order.status !== "pending" ? "TRK123456789" : null,
    shippingAddress: {
      name: order.customer,
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    items: [
      {
        id: "1",
        name: "Hydrating Facial Serum",
        price: 39.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80&text=Serum",
      },
      {
        id: "2",
        name: "Matte Liquid Lipstick",
        price: 24.99,
        quantity: 2,
        variant: "Ruby Red",
        image: "/placeholder.svg?height=80&width=80&text=Lipstick",
      },
    ],
    subtotal: order.total - 10 - 5,
    shipping: 10,
    tax: 5,
  }
}

// Mock data for customers
export async function getCustomers() {
  return [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(123) 456-7890",
      orders: 5,
      totalSpent: 249.95,
      lastOrder: "2023-11-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "(234) 567-8901",
      orders: 3,
      totalSpent: 159.97,
      lastOrder: "2023-11-14T15:45:00Z",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      phone: "(345) 678-9012",
      orders: 2,
      totalSpent: 89.98,
      lastOrder: "2023-11-14T09:15:00Z",
    },
    {
      id: "4",
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "(456) 789-0123",
      orders: 7,
      totalSpent: 349.93,
      lastOrder: "2023-11-13T14:20:00Z",
    },
    {
      id: "5",
      name: "Jessica Taylor",
      email: "jessica.taylor@example.com",
      phone: "(567) 890-1234",
      orders: 1,
      totalSpent: 49.99,
      lastOrder: "2023-11-12T11:10:00Z",
    },
  ]
}

// Get a specific category by ID
export async function getCategoryById(id: string) {
  const categories = await import("@/lib/products").then((mod) => mod.getCategories())
  return categories.find((category) => category.id === id) || null
}

// Create a new product
export async function createProduct(product: Omit<Product, "id">) {
  // In a real application, this would make an API call to create the product
  console.log("Creating product:", product)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: Math.random().toString(36).substring(2, 9),
    ...product,
  }
}

// Update an existing product
export async function updateProduct(id: string, product: Omit<Product, "id">) {
  // In a real application, this would make an API call to update the product
  console.log("Updating product:", id, product)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id,
    ...product,
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  // In a real application, this would make an API call to delete the product
  console.log("Deleting product:", id)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}

// Create a new category
export async function createCategory(category: Omit<Category, "id">) {
  // In a real application, this would make an API call to create the category
  console.log("Creating category:", category)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: Math.random().toString(36).substring(2, 9),
    ...category,
  }
}

// Update an existing category
export async function updateCategory(id: string, category: Omit<Category, "id">) {
  // In a real application, this would make an API call to update the category
  console.log("Updating category:", id, category)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id,
    ...category,
  }
}

// Delete a category
export async function deleteCategory(id: string) {
  // In a real application, this would make an API call to delete the category
  console.log("Deleting category:", id)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}

// Update order status
export async function updateOrderStatus(id: string, status: string) {
  // In a real application, this would make an API call to update the order status
  console.log("Updating order status:", id, status)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}

