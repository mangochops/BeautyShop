"use client"

import { useState } from "react"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/types/product"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
}

export default function AddToCartButton({ product, quantity = 1 }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product, quantity)

    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <Button
      size="lg"
      className="bg-pink-600 hover:bg-pink-700 flex items-center"
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      <ShoppingBag className="mr-2 h-5 w-5" />
      {isAdding ? "Added!" : "Add to Cart"}
    </Button>
  )
}

