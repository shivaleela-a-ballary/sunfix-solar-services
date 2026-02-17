"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User, UserRole } from "@/lib/types"
import * as authService from "@/lib/services/auth-service"
import type { SignupData, LoginData } from "@/lib/services/auth-service"
import { registerTechnician } from "@/lib/services/tech-service"

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (data: LoginData) => { success: boolean; error?: string }
  signup: (data: SignupData & { gender?: "male" | "female" }) => { success: boolean; error?: string }
  logout: () => void
  isRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const current = authService.getCurrentUser()
    setUser(current)
    setLoading(false)
  }, [])

  const login = useCallback((data: LoginData) => {
    const result = authService.login(data)
    if (result.success && result.user) {
      setUser(result.user)
    }
    return { success: result.success, error: result.error }
  }, [])

  const signup = useCallback((data: SignupData & { gender?: "male" | "female" }) => {
    const result = authService.signup(data)
    if (result.success && result.user) {
      setUser(result.user)
      // If technician, register technician profile
      if (data.role === "technician") {
        registerTechnician({
          userId: result.user.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender || "female",
          cluster: data.cluster,
        })
      }
    }
    return { success: result.success, error: result.error }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const isRole = useCallback((role: UserRole) => user?.role === role, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
