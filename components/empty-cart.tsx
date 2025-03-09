import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="h-10 w-10 text-pink-600" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added any products to your cart yet. Browse our collection and find something you'll
        love!
      </p>
      <Link href="/products">
        <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
          Start Shopping
        </Button>
      </Link>
    </div>
  )
}

