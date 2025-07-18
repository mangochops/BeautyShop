import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts, getCategories } from "@/lib/products"
import ProductCard from "@/components/product-card"
import CategoryCard from "@/components/category-card"
import HeroSection from "@/components/hero-section"
import TestimonialSection from "@/components/testimonial-section"

export default function Home() {
  const featuredProducts = getFeaturedProducts()
  const categories = getCategories()

  return (
    <main className="flex-1">
      <HeroSection />

      {/* Categories */}
      <section className="py-16 px-4 md:px-6 bg-pink-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products" className="flex items-center text-pink-600 hover:text-pink-700">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-r from-pink-100 to-purple-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Offer</h2>
              <p className="text-lg mb-6">
                Get 20% off on your first purchase. Use code <span className="font-bold">BEAUTY20</span> at checkout.
              </p>
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                Shop Now
              </Button>
            </div>
            <div className="md:w-1/2">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Beauty products special offer"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection />
    </main>
  )
}

