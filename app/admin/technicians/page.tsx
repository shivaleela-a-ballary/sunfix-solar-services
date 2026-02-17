"use client"

import { useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Star, Wrench } from "lucide-react"

export default function AdminTechniciansPage() {
  const { user } = useAuth()
  const { technicians, refreshTechnicians } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/login")
      return
    }
    refreshTechnicians()
  }, [user, router, refreshTechnicians])

  if (!user || user.role !== "admin") return null

  return (
    <div>
      <DashboardHeader title="Technician Management" />
      <div className="space-y-6 p-6">

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
          <Wrench className="h-3.5 w-3.5" />
          {technicians.length} technicians
        </Badge>
        <Badge variant="secondary" className="gap-1.5 bg-green-100 px-3 py-1.5 text-green-700 hover:bg-green-100">
          {technicians.filter((t) => t.online).length} online
        </Badge>
        <Badge variant="secondary" className="gap-1.5 bg-pink-100 px-3 py-1.5 text-pink-700 hover:bg-pink-100">
          {technicians.filter((t) => t.gender === "female").length} women
        </Badge>
      </div>

      {technicians.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No technicians have registered yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {technicians.map((tech) => (
            <Card key={tech.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{tech.name}</h3>
                    <p className="text-xs text-muted-foreground">{tech.email}</p>
                    <p className="text-xs text-muted-foreground">{tech.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
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

                <div className="mt-3 flex items-center gap-4 border-t pt-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{tech.totalJobs}</p>
                    <p className="text-[10px] text-muted-foreground">Jobs</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-lg font-bold text-foreground">
                        {tech.rating > 0 ? tech.rating.toFixed(1) : "-"}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {"₹"}{tech.earningsTotal.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Earned</p>
                  </div>
                </div>

                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {tech.cluster}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
