"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Star, MapPin, Phone, Mail, Briefcase, DollarSign } from "lucide-react"

export default function TechProfilePage() {
  const { user } = useAuth()
  const { getTechByUserId, toggleOnline, refreshTechnicians } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "technician") {
      router.replace("/login")
      return
    }
    refreshTechnicians()
  }, [user, router, refreshTechnicians])

  const tech = user ? getTechByUserId(user.id) : undefined

  if (!user || user.role !== "technician" || !tech) return null

  return (
    <div>
      <DashboardHeader title="My Profile" />
      <div className="space-y-6 p-6">

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-2xl font-bold text-amber-600">
                {tech.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{tech.name}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      tech.gender === "female"
                        ? "border-pink-300 bg-pink-50 text-pink-700"
                        : "border-blue-300 bg-blue-50 text-blue-700"
                    }
                  >
                    {tech.gender}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      tech.online
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-slate-300 bg-slate-50 text-slate-600"
                    }
                  >
                    {tech.online ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Availability</span>
              <Switch
                checked={tech.online}
                onCheckedChange={() => {
                  toggleOnline(tech.id)
                  refreshTechnicians()
                }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{tech.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">{tech.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Cluster</p>
                <p className="text-sm font-medium text-foreground">{tech.cluster}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="text-2xl font-bold text-foreground">
                {tech.rating > 0 ? tech.rating.toFixed(1) : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Jobs</p>
              <p className="text-2xl font-bold text-foreground">{tech.totalJobs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="text-xl font-bold text-foreground">
                {"₹"}{tech.earningsToday.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Earned</p>
              <p className="text-xl font-bold text-foreground">
                {"₹"}{tech.earningsTotal.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
