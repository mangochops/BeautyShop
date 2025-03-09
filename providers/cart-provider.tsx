"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  variant?: string
  image?: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (productId: string, quantity?: number, variant?: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  cartTotal: number
  isLoading: boolean
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch cart from API on initial render
  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await fetch("/api/cart")
        if (response.ok) {
          const data = await response.json()
          setCart(data.items || [])
          setCartTotal(data.subtotal || 0)
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [])

  const addToCart = async (productId: string, quantity = 1, variant?: string) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity, variant }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add item to cart")
      }

      // Refresh cart
      const cartResponse = await fetch("/api/cart")
      const data = await cartResponse.json()
      setCart(data.items || [])
      setCartTotal(data.subtotal || 0)

      toast({
        title: "Item added to cart",
        description: `${quantity} item(s) have been added to your cart.`,
      })
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update cart")
      }

      // Check if item was deleted (quantity was 0)
      const data = await response.json()
      if (data.deleted) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id))
      }

      // Refresh cart
      const cartResponse = await fetch("/api/cart")
      const cartData = await cartResponse.json()
      setCart(cartData.items || [])
      setCartTotal(cartData.subtotal || 0)
    } catch (error) {
      console.error("Failed to update cart:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to remove item from cart")
      }

      // Update local state
      setCart((prevCart) => prevCart.filter((item) => item.id !== id))

      // Refresh cart total
      const cartResponse = await fetch("/api/cart")
      const cartData = await cartResponse.json()
      setCartTotal(cartData.subtotal || 0)

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove item from cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setIsLoading(true)
      // Remove each item from the cart
      await Promise.all(cart.map((item) => removeItem(item.id)))
      setCart([])
      setCartTotal(0)

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      })
    } catch (error) {
      console.error("Failed to clear cart:", error)
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

