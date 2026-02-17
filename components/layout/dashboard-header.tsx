"use client"

import { useAuth } from "@/context/auth-context"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader({ title }: { title: string }) {
  const { user } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4 pl-16 lg:pl-6">
      <div>
        <h1 className="text-xl font-bold text-foreground lg:text-2xl">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <>
            <Badge variant="outline" className="hidden text-xs sm:inline-flex">
              {user.cluster}
            </Badge>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-slate-950">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
