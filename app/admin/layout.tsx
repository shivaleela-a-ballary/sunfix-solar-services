"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const { refresh } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    } else if (!loading && user && user.role !== "admin") {
      router.replace(`/${user.role}/dashboard`)
    }
  }, [user, loading, router])

  useEffect(() => {
    refresh()
  }, [refresh])

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <DashboardSidebar />
      <main className="lg:pl-64">{children}</main>
    </div>
  )
}
