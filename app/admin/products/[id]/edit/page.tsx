import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductForm from "@/components/admin/product-form"
import { getProductById, getCategories } from "@/lib/products"
import { updateProduct } from "@/lib/admin"

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProductById(params.id)
  const categories = await getCategories()

  if (!product) {
    notFound()
  }

  async function handleUpdateProduct(formData: FormData) {
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

    // Update the product
    await updateProduct(params.id, {
      name,
      description,
      price,
      originalPrice,
      category,
      featured,
      inStock,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
    })

    redirect("/admin/products")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <Link href="/admin/products">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <ProductForm product={product} categories={categories} action={handleUpdateProduct} />
    </div>
  )
}

