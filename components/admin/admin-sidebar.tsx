"use client"

import AdminSidebarContent from "./admin-sidebar-content"

export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 border-r bg-muted/50 md:block">
      <nav className="flex flex-col gap-4 p-4">
        <AdminSidebarContent />
      </nav>
    </aside>
  )
}

