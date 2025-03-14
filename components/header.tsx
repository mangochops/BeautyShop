"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Search, User, Heart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function Header() {
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-700">
      {/* Top Bar */}
      <div className="bg-pink-600 text-white py-2 text-center text-sm">
        Free shipping on orders over KES 5,000 | Use code BEAUTY20 for 20% off your first order
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-gray-300"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center text-2xl font-bold text-white">
            <Image
              src="/logo.png"
              alt="GlowShop Logo"
              height={100}
              width={100}
              className="mr-2"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="font-medium text-white hover:text-gray-300">
              Home
            </Link>
            <Link href="/products" className="font-medium text-white hover:text-gray-300">
              Shop
            </Link>
            <Link href="/products?category=skincare" className="font-medium text-white hover:text-gray-300">
              Skincare
            </Link>
            <Link href="/products?category=makeup" className="font-medium text-white hover:text-gray-300">
              Makeup
            </Link>
            <Link href="/products?category=haircare" className="font-medium text-white hover:text-gray-300">
              Haircare
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-white hover:text-gray-300"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hidden md:flex text-white hover:text-gray-300">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="ghost" size="icon" className="hidden md:flex text-white hover:text-gray-300">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-white hover:text-gray-300">
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
            <Input
              placeholder="Search for products..."
              className="pr-10 bg-gray-800 text-white border-gray-700 placeholder-gray-400"
            />
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full text-white hover:text-gray-300">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 overflow-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-6">
              <Link href="/" className="text-2xl font-bold text-white">
                BeautyShop
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="mb-6">
              <Input
                placeholder="Search for products..."
                className="mb-4 bg-gray-800 text-white border-gray-700 placeholder-gray-400"
              />
            </div>

            <nav className="space-y-6">
              <Link
                href="/"
                className="block text-lg font-medium py-2 border-b border-gray-700 text-white hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block text-lg font-medium py-2 border-b border-gray-700 text-white hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop All
              </Link>
              <Link
                href="/products?category=skincare"
                className="block text-lg font-medium py-2 border-b border-gray-700 text-white hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Skincare
              </Link>
              <Link
                href="/products?category=makeup"
                className="block text-lg font-medium py-2 border-b border-gray-700 text-white hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Makeup
              </Link>
              <Link
                href="/products?category=haircare"
                className="block text-lg font-medium py-2 border-b border-gray-700 text-white hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Haircare
              </Link>
              <Link
                href="/account"
                className="block text-lg font-medium py-2 border-b border-gray-700 text-white hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                My Account
              </Link>
              <Link
                href="/wishlist"
                className="block text-lg font-medium py-2 border-b border-gray-700 text-white hover:text-gray-300"
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