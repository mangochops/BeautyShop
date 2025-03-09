"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, CheckCircle2, ArrowLeft, LockIcon } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import OrderSummary from "@/components/order-summary"
import { formatCurrency } from "@/lib/format"

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart()
  const [step, setStep] = useState(1)

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-8">You don't have any items in your cart yet.</p>
        <Link href="/products">
          <Button>Shop Now</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/cart" className="text-pink-600 hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to cart
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Checkout</h1>
              <div className="flex items-center text-sm">
                <LockIcon className="h-4 w-4 mr-1 text-green-600" />
                <span>Secure Checkout</span>
              </div>
            </div>

            <div className="flex mb-8">
              <div className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? "bg-pink-600 text-white" : "bg-muted"}`}
                >
                  {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                </div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
              <div className="mx-4 border-t border-border flex-1 self-center"></div>
              <div className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? "bg-pink-600 text-white" : "bg-muted"}`}
                >
                  {step > 2 ? <CheckCircle2 className="h-5 w-5" /> : "2"}
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
              <div className="mx-4 border-t border-border flex-1 self-center"></div>
              <div className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 3 ? "bg-pink-600 text-white" : "bg-muted"}`}
                >
                  3
                </div>
                <span className="ml-2 font-medium">Review</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your shipping details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Nairobi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">County</Label>
                    <Select>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nairobi">Nairobi</SelectItem>
                        <SelectItem value="mombasa">Mombasa</SelectItem>
                        <SelectItem value="kisumu">Kisumu</SelectItem>
                        <SelectItem value="nakuru">Nakuru</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input id="zip" placeholder="00100" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select defaultValue="kenya">
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kenya">Kenya</SelectItem>
                      <SelectItem value="uganda">Uganda</SelectItem>
                      <SelectItem value="tanzania">Tanzania</SelectItem>
                      <SelectItem value="ethiopia">Ethiopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="0712 345 678" />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="saveAddress" />
                  <label htmlFor="saveAddress" className="text-sm">
                    Save this address for future orders
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose your payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup defaultValue="card">
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" /> Credit/Debit Card
                    </Label>
                  </div>

                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input id="nameOnCard" placeholder="John Doe" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa">M-Pesa</Label>
                  </div>
                </RadioGroup>

                <div className="flex items-center space-x-2">
                  <Checkbox id="savePayment" />
                  <label htmlFor="savePayment" className="text-sm">
                    Save this payment method for future orders
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700" onClick={() => setStep(3)}>
                  Continue to Review
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
                <CardDescription>Please review your order details before placing your order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>John Doe</p>
                    <p>123 Main St</p>
                    <p>Nairobi, 00100</p>
                    <p>Kenya</p>
                    <p>john.doe@example.com</p>
                    <p>0712 345 678</p>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-pink-600" onClick={() => setStep(1)}>
                    Edit
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Credit Card ending in 3456</span>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-pink-600" onClick={() => setStep(2)}>
                    Edit
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <div className="w-16 h-16 bg-muted rounded-md overflow-hidden mr-4">
                          <img
                            src={item.image || getProductImage(item.category)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                          <p className="text-sm">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700">Place Order</Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="lg:w-1/3">
          <OrderSummary />
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

