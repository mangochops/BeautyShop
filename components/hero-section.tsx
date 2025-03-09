import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-pink-50 dark:bg-pink-950/20 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Discover Your <span className="text-pink-600">Natural Beauty</span>
            </h1>
            <p className="text-lg mb-8 max-w-md">
              Premium beauty products that enhance your natural beauty. Cruelty-free, sustainable, and made with love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop"
              alt="Beauty products showcase"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-pink-600 text-2xl">🌿</span>
            </div>
            <h3 className="font-bold mb-2">Natural Ingredients</h3>
            <p className="text-muted-foreground">Made with the finest natural ingredients for your skin.</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-pink-600 text-2xl">🐰</span>
            </div>
            <h3 className="font-bold mb-2">Cruelty-Free</h3>
            <p className="text-muted-foreground">We never test on animals and care about ethical practices.</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-pink-600 text-2xl">♻️</span>
            </div>
            <h3 className="font-bold mb-2">Sustainable</h3>
            <p className="text-muted-foreground">Eco-friendly packaging and sustainable sourcing.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

