"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sun, Eye, EyeOff } from "lucide-react"
import { CLUSTERS } from "@/lib/types"
import type { UserRole } from "@/lib/types"
import { toast } from "sonner"

export default function SignupPage() {
  const { signup, user, loading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<UserRole>("user")
  const [cluster, setCluster] = useState("")
  const [gender, setGender] = useState<"male" | "female">("female")
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    router.replace(`/${user.role}/dashboard`)
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cluster) {
      toast.error("Please select a cluster")
      return
    }

    setSubmitting(true)
    const result = signup({
      name,
      email,
      phone,
      password,
      role,
      cluster,
      gender: role === "technician" ? gender : undefined,
    })

    if (result.success) {
      toast.success("Account created successfully!")
      router.push(`/${role}/dashboard`)
    } else {
      toast.error(result.error || "Signup failed")
    }
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 sm:py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-slate-800 bg-slate-900 text-slate-50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
            <Sun className="h-6 w-6 text-slate-950" />
          </div>
          <CardTitle className="text-2xl text-slate-50">Create your account</CardTitle>
          <CardDescription className="text-slate-400">
            Join the SunFix solar service network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-slate-300">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="text-slate-300">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border-slate-700 bg-slate-800 pr-10 text-slate-50 placeholder:text-slate-500"
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

            <div className="flex flex-col gap-2">
              <Label className="text-slate-300">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Solar User</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="admin">Admin (SELCO)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "technician" && (
              <div className="flex flex-col gap-2">
                <Label className="text-slate-300">Gender</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as "male" | "female")}>
                  <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label className="text-slate-300">Cluster</Label>
              <Select value={cluster} onValueChange={setCluster}>
                <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-50">
                  <SelectValue placeholder="Select your cluster" />
                </SelectTrigger>
                <SelectContent>
                  {CLUSTERS.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-amber-500 text-slate-950 hover:bg-amber-400"
            >
              {submitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-amber-500 hover:text-amber-400">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
