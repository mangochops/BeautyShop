"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Search, User, Heart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top Bar */}
      <div className="bg-pink-600 text-white py-2 text-center text-sm">
        Free shipping on orders over KES 5,000 | Use code BEAUTY20 for 20% off your first order
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-pink-600">
            GlowShop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="font-medium hover:text-pink-600">
              Home
            </Link>
            <Link href="/products" className="font-medium hover:text-pink-600">
              Shop
            </Link>
            <Link href="/products?category=skincare" className="font-medium hover:text-pink-600">
              Skincare
            </Link>
            <Link href="/products?category=makeup" className="font-medium hover:text-pink-600">
              Makeup
            </Link>
            <Link href="/products?category=haircare" className="font-medium hover:text-pink-600">
              Haircare
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 relative">
            <Input placeholder="Search for products..." className="pr-10" />
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-background z-50 overflow-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-6">
              <Link href="/" className="text-2xl font-bold text-pink-600">
                BeautyShop
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="mb-6">
              <Input placeholder="Search for products..." className="mb-4" />
            </div>

            <nav className="space-y-6">
              <Link
                href="/"
                className="block text-lg font-medium py-2 border-b border-border"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block text-lg font-medium py-2 border-b border-border"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop All
              </Link>
              <Link
                href="/products?category=skincare"
                className="block text-lg font-medium py-2 border-b border-border"
                onClick={() => setIsMenuOpen(false)}
              >
                Skincare
              </Link>
              <Link
                href="/products?category=makeup"
                className="block text-lg font-medium py-2 border-b border-border"
                onClick={() => setIsMenuOpen(false)}
              >
                Makeup
              </Link>
              <Link
                href="/products?category=haircare"
                className="block text-lg font-medium py-2 border-b border-border"
                onClick={() => setIsMenuOpen(false)}
              >
                Haircare
              </Link>
              <Link
                href="/account"
                className="block text-lg font-medium py-2 border-b border-border"
                onClick={() => setIsMenuOpen(false)}
              >
                My Account
              </Link>
              <Link
                href="/wishlist"
                className="block text-lg font-medium py-2 border-b border-border"
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist
              </Link>
              <div className="py-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

