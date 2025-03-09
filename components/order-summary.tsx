import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/format"

export default function OrderSummary() {
  const { cart, cartTotal } = useCart()

  // Calculate shipping (free over KES 5,000)
  const shipping = cartTotal >= 5000 ? 0 : 500

  // Calculate tax (assume 16% VAT)
  const tax = cartTotal * 0.16

  // Calculate order total
  const orderTotal = cartTotal + shipping + tax

  return (
    <div className="bg-muted rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
          <span>{formatCurrency(cartTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          {shipping === 0 ? <span className="text-green-600">Free</span> : <span>{formatCurrency(shipping)}</span>}
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">VAT (16%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between font-bold">
          <span>Order Total</span>
          <span>{formatCurrency(orderTotal)}</span>
        </div>
      </div>

      {cartTotal < 5000 && (
        <div className="bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 p-3 rounded-md text-sm mb-6">
          Add {formatCurrency(5000 - cartTotal)} more to qualify for free shipping!
        </div>
      )}

      <div className="text-sm text-muted-foreground space-y-2">
        <p>• Free shipping on orders over KES 5,000</p>
        <p>• 30-day easy returns</p>
        <p>• Satisfaction guaranteed</p>
      </div>
    </div>
  )
}

