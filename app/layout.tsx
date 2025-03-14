import type React from "react"
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/providers/cart-provider"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Glow Shop - Premium Beauty Products",
  description: "Shop the finest beauty products for skincare, makeup, haircare, and more.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}><StackProvider app={stackServerApp}><StackTheme>
        <ThemeProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              {children}
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </StackTheme></StackProvider></body>
    </html>
  )
}



import './globals.css'