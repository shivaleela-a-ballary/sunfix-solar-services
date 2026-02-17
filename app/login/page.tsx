"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const { login, user, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    router.replace(`/${user.role}/dashboard`)
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const result = login({ email, password })
    if (result.success) {
      toast.success("Welcome back!")
      // The useEffect in landing page handles redirect, but let's be explicit
      const currentUser = JSON.parse(localStorage.getItem("sunfix_current_user") || "null")
      if (currentUser) {
        router.push(`/${currentUser.role}/dashboard`)
      }
    } else {
      toast.error(result.error || "Login failed")
    }
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-slate-800 bg-slate-900 text-slate-50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
            <Sun className="h-6 w-6 text-slate-950" />
          </div>
          <CardTitle className="text-2xl text-slate-50">Welcome back</CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to your SunFix account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500 focus:border-amber-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-slate-700 bg-slate-800 pr-10 text-slate-50 placeholder:text-slate-500 focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-amber-500 text-slate-950 hover:bg-amber-400"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            {"Don't have an account? "}
            <Link href="/signup" className="font-medium text-amber-500 hover:text-amber-400">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
