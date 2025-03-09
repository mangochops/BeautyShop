"use client"

import Link from "next/link"
import { Menu, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAdminSession } from "@/lib/use-admin-session"
import AdminSidebarContent from "./admin-sidebar-content"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminHeader() {
  const { session, logout } = useAdminSession()

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 py-4">
                <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold text-pink-600">
                  Beauty Shop Admin
                </Link>
                <AdminSidebarContent />
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold text-pink-600 md:text-xl">
            Beauty Shop Admin
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <Link href="/" className="text-sm text-muted-foreground hover:text-pink-600">
            View Store
          </Link>
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span className="hidden md:inline-flex">{session.user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

