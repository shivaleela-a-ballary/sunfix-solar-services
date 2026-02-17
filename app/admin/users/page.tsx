"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { store } from "@/lib/store"
import type { User } from "@/lib/types"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Search, Users } from "lucide-react"

export default function AdminUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/login")
      return
    }
    setUsers(store.getUsers())
  }, [user, router])

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.cluster.toLowerCase().includes(search.toLowerCase())
  )

  if (!user || user.role !== "admin") return null

  return (
    <div>
      <DashboardHeader title="User Management" />
      <div className="space-y-6 p-6">

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or cluster..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
          <Users className="h-3.5 w-3.5" />
          {users.length} users
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {users.length === 0
                ? "No users have registered yet."
                : "No users match your search."}
            </p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="pb-2 pr-4">Name</th>
                      <th className="pb-2 pr-4">Email</th>
                      <th className="pb-2 pr-4">Phone</th>
                      <th className="pb-2 pr-4">Role</th>
                      <th className="pb-2 pr-4">Cluster</th>
                      <th className="pb-2">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="py-2.5 pr-4 font-medium">{u.name}</td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{u.email}</td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{u.phone}</td>
                        <td className="py-2.5 pr-4">
                          <Badge
                            variant="outline"
                            className={
                              u.role === "admin"
                                ? "border-amber-300 bg-amber-50 text-amber-700"
                                : u.role === "technician"
                                  ? "border-blue-300 bg-blue-50 text-blue-700"
                                  : "border-slate-300 bg-slate-50 text-slate-700"
                            }
                          >
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-2.5 pr-4 text-xs">{u.cluster}</td>
                        <td className="py-2.5 text-xs text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="flex flex-col gap-3 md:hidden">
                {filtered.map((u) => (
                  <div key={u.id} className="rounded-xl border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          u.role === "admin"
                            ? "border-amber-300 bg-amber-50 text-amber-700"
                            : u.role === "technician"
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : "border-slate-300 bg-slate-50 text-slate-700"
                        }
                      >
                        {u.role}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{u.cluster}</span>
                      <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
