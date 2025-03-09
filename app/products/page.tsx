import { getProducts, getCategories } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { Star } from "lucide-react"

export default function ProductsPage() {
  const products = getProducts()
  const categories = getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={`category-${category.id}`} />
                  <label htmlFor={`category-${category.id}`} className="text-sm">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">Price Range</h3>
            <Slider defaultValue={[0, 100]} max={100} step={1} className="mb-6" />
            <div className="flex items-center justify-between">
              <div className="w-20">
                <Input type="number" placeholder="Min" />
              </div>
              <span>-</span>
              <div className="w-20">
                <Input type="number" placeholder="Max" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                    {Array(rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    {Array(5 - rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-gray-300" />
                      ))}
                    <span className="ml-1">& Up</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full">Apply Filters</Button>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <Button variant="outline" className="w-full flex items-center justify-center">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
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
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

