import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductForm from "@/components/admin/product-form"
import { getCategories } from "@/lib/products"
import { createProduct } from "@/lib/admin"

export default async function NewProductPage() {
  const categories = await getCategories()

  async function handleCreateProduct(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const originalPrice = formData.get("originalPrice")
      ? Number.parseFloat(formData.get("originalPrice") as string)
      : undefined
    const category = formData.get("category") as string
    const featured = formData.get("featured") === "on"
    const inStock = formData.get("inStock") === "on"

    // Create the product
    await createProduct({
      name,
      description,
      price,
      originalPrice,
      category,
      featured,
      inStock,
      image: "/placeholder.svg?height=500&width=500&text=New+Product",
      rating: 0,
      reviews: 0,
    })

    redirect("/admin/products")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <Link href="/admin/products">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <ProductForm categories={categories} action={handleCreateProduct} />
    </div>
  )
}

