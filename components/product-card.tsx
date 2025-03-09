"use client"

import Link from "next/link"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/format"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <div className="group relative">
      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.image || getProductImage(product.category)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Quick actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Sale badge */}
        {product.originalPrice && (
          <Badge className="absolute top-2 left-2 bg-pink-600">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </Badge>
        )}

        {/* Quick add to cart */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button className="w-full bg-white text-black hover:bg-gray-100" onClick={() => addToCart(product)}>
            <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center mb-1">
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                />
              ))}
          </div>
          <span className="ml-1 text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-sm md:text-base hover:text-pink-600 transition-colors">{product.name}</h3>
        </Link>

        <div className="mt-1 flex items-center">
          <span className="font-medium text-pink-600">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-muted-foreground line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to get product images based on category
function getProductImage(category: string): string {
  const images = {
    skincare: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500&auto=format&fit=crop",
    makeup: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500&auto=format&fit=crop",
    haircare: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=500&auto=format&fit=crop",
    fragrance: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=500&auto=format&fit=crop",
    "bath-body": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop",
    tools: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=500&auto=format&fit=crop",
  }

  return (
    images[category as keyof typeof images] ||
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=500&auto=format&fit=crop"
  )
}

