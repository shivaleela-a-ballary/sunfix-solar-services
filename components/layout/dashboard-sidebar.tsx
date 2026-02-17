"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import type { UserRole } from "@/lib/types"
import {
  Sun,
  LayoutDashboard,
  Plus,
  History,
  Briefcase,
  DollarSign,
  UserCircle,
  Users,
  Wrench,
  MapPin,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: Record<UserRole, NavItem[]> = {
  user: [
    { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/user/new-request", label: "New Request", icon: Plus },
    { href: "/user/history", label: "Service History", icon: History },
  ],
  technician: [
    { href: "/technician/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/technician/jobs", label: "My Jobs", icon: Briefcase },
    { href: "/technician/earnings", label: "Earnings", icon: DollarSign },
    { href: "/technician/profile", label: "Profile", icon: UserCircle },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/technicians", label: "Technicians", icon: Wrench },
    { href: "/admin/jobs", label: "All Jobs", icon: Briefcase },
    { href: "/admin/clusters", label: "Clusters", icon: MapPin },
  ],
}

export function DashboardSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  const items = navItems[user.role] || []

  const roleLabel =
    user.role === "user"
      ? "Solar User"
      : user.role === "technician"
        ? "Technician"
        : "SELCO Admin"

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-50 shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-slate-50 transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-50 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500">
            <Sun className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-xl font-bold tracking-tight">SunFix</span>
        </div>

        {/* User info */}
        <div className="mx-4 mb-4 rounded-xl bg-slate-900 px-4 py-3">
          <p className="text-sm font-medium text-slate-50">{user.name}</p>
          <p className="text-xs text-slate-400">{roleLabel}</p>
          <p className="mt-0.5 text-xs text-amber-500">{user.cluster}</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-800 p-4">
          <button
            onClick={() => {
              logout()
              window.location.href = "/"
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
