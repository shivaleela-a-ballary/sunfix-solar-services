"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/context/auth-context"
import { DataProvider } from "@/context/data-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>{children}</DataProvider>
    </AuthProvider>
  )
}
