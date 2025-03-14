import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Newsletter */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h3 className="text-2xl font-bold mb-2">Join Our Newsletter</h3>
          <p className="text-gray-600 mb-6">Subscribe to get special offers, free giveaways, and beauty tips.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input placeholder="Your email address" type="email" />
            <Button className="bg-pink-600 hover:bg-pink-700">Subscribe</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=skincare" className="text-gray-600 hover:text-pink-600">
                  Skincare
                </Link>
              </li>
              <li>
                <Link href="/products?category=makeup" className="text-gray-600 hover:text-pink-600">
                  Makeup
                </Link>
              </li>
              <li>
                <Link href="/products?category=haircare" className="text-gray-600 hover:text-pink-600">
                  Haircare
                </Link>
              </li>
              <li>
                <Link href="/products?category=fragrance" className="text-gray-600 hover:text-pink-600">
                  Fragrance
                </Link>
              </li>
              <li>
                <Link href="/products?category=bath-body" className="text-gray-600 hover:text-pink-600">
                  Bath & Body
                </Link>
              </li>
              <li>
                <Link href="/products?category=tools" className="text-gray-600 hover:text-pink-600">
                  Tools & Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-pink-600">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-pink-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-gray-600 hover:text-pink-600">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-pink-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-pink-600">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-pink-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-pink-600">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-pink-600">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-600 hover:text-pink-600">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-pink-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-pink-600">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <address className="not-italic text-gray-600 mb-4">
              <p>123 Beauty Lane</p>
              <p>Nairobi GPO</p>
              <p>Kenya</p>
              <p className="mt-2">
                <a href="mailto:hello@beautyshop.com" className="hover:text-pink-600">
                  hello@glowshop.com
                </a>
              </p>
              <p>
                <a href="tel:+1-800-123-4567" className="hover:text-pink-600">
                  +1 (800) 123-4567
                </a>
              </p>
            </address>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-pink-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} GlowShop. All rights reserved.
            </p>

            <div className="flex items-center space-x-4">
              <img src="/placeholder.svg?height=30&width=50&text=Visa" alt="Visa" className="h-8" />
              <img src="/placeholder.svg?height=30&width=50&text=MC" alt="Mastercard" className="h-8" />
              <img src="/placeholder.svg?height=30&width=50&text=Amex" alt="American Express" className="h-8" />
              <img src="/placeholder.svg?height=30&width=50&text=PayPal" alt="PayPal" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

