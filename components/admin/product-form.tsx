"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductImage {
  id?: string
  url: string
  alt?: string
  isMain: boolean
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  categoryId: string
  featured: boolean
  inStock: boolean
  stockQuantity: number
  sku?: string
  images: ProductImage[]
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: "",
      description: "",
      price: 0,
      originalPrice: undefined,
      categoryId: "",
      featured: false,
      inStock: true,
      stockQuantity: 0,
      sku: "",
      images: [],
    },
  )

  const [imageUrls, setImageUrls] = useState<string[]>(product?.images?.map((img) => img.url) || [""])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageChange = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)

    // Remove empty urls except the last one
    const filteredUrls = newUrls.filter((url, i) => url || i === newUrls.length - 1)
    setImageUrls(filteredUrls)

    // Update form data
    const images = filteredUrls
      .filter((url) => url)
      .map((url, i) => ({
        url,
        alt: `${formData.name} image ${i + 1}`,
        isMain: i === 0,
      }))

    setFormData((prev) => ({ ...prev, images }))
  }

  const addImageField = () => {
    setImageUrls([...imageUrls, ""])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare images data
      const images = imageUrls
        .filter((url) => url)
        .map((url, i) => ({
          url,
          alt: `${formData.name} image ${i + 1}`,
          isMain: i === 0,
        }))

      const data = {
        ...formData,
        images,
      }

      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products"

      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Something went wrong")
      }

      toast({
        title: product ? "Product updated" : "Product created",
        description: `${formData.name} has been ${product ? "updated" : "created"} successfully.`,
      })

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add a new image field when the last one is filled
  useEffect(() => {
    const lastUrl = imageUrls[imageUrls.length - 1]
    if (lastUrl) {
      addImageField()
    }
  }, [imageUrls])

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic product information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (KES)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (KES) (Optional)</Label>
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.originalPrice || ""}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload and manage product images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center"
                  >
                    {url ? (
                      <div className="relative w-full h-full">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          className="h-full w-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleImageChange(index, "")}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="mt-2 text-sm text-gray-500">Enter image URL</div>
                        </div>
                        <Input
                          className="mt-2"
                          placeholder="https://example.com/image.jpg"
                          value={url}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory & Options</CardTitle>
              <CardDescription>Manage inventory and product options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) => handleCheckboxChange("inStock", checked as boolean)}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                <Input id="sku" name="sku" value={formData.sku || ""} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}

