"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Globe, ImageIcon, Home, LogOut, LayoutDashboard, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/admin" className="text-xl font-bold hover:opacity-80 transition-opacity">
            Dale Hostel
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:block">
              <ul className="flex space-x-4">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Home className="h-4 w-4" />
                    View Site
                  </Link>
                </li>
              </ul>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="w-64 border-r border-white/10 p-4 hidden md:block">
          <AdminNavigation />
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black pt-16 md:hidden">
            <div className="p-4">
              <AdminNavigation mobile onNavClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 bg-black p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

// Extracted navigation component to avoid duplication
function AdminNavigation({ mobile = false, onNavClick = () => {} }: { mobile?: boolean; onNavClick?: () => void }) {
  return (
    <nav>
      <div className="mb-6">
        <p className="text-xs uppercase text-white/40 font-medium mb-2 px-2">General</p>
        <ul className="space-y-1">
          <NavItem href="/admin" icon={<LayoutDashboard className="h-4 w-4" />} onClick={onNavClick}>
            Dashboard
          </NavItem>
          <NavItem href="/admin/translations" icon={<Globe className="h-4 w-4" />} onClick={onNavClick}>
            Translations
          </NavItem>
          <NavItem href="/admin/images" icon={<ImageIcon className="h-4 w-4" />} onClick={onNavClick}>
            Images
          </NavItem>
        </ul>
      </div>

      {mobile && (
        <NavItem href="/" icon={<Home className="h-4 w-4" />} onClick={onNavClick}>
          View Site
        </NavItem>
      )}

      <div className="mt-auto pt-6 border-t border-white/10">
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 p-2 rounded-md w-full text-left text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </nav>
  )
}

// Navigation item component
function NavItem({
  href,
  icon,
  children,
  onClick,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}) {
  // Check if the current path matches the href
  const isActive = typeof window !== "undefined" && window.location.pathname === href

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
          isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5",
        )}
        onClick={onClick}
      >
        {icon}
        <span>{children}</span>
      </Link>
    </li>
  )
}
