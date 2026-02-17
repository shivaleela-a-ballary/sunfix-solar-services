"use client"

import { useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CLUSTERS } from "@/lib/types"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MapPin, Wrench, Briefcase, Users, Star } from "lucide-react"

export default function AdminClustersPage() {
  const { user } = useAuth()
  const { jobs, technicians, refresh } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/login")
      return
    }
    refresh()
  }, [user, router, refresh])

  const clusterStats = useMemo(() => {
    return CLUSTERS.map((c) => {
      const clusterJobs = jobs.filter((j) => j.cluster === c.name)
      const clusterTechs = technicians.filter((t) => t.cluster === c.name)
      const completed = clusterJobs.filter((j) => j.status === "completed").length
      const active = clusterJobs.filter(
        (j) => j.status !== "completed" && j.status !== "requested"
      ).length
      const pending = clusterJobs.filter((j) => j.status === "requested").length
      const onlineTechs = clusterTechs.filter((t) => t.online).length
      const womenTechs = clusterTechs.filter((t) => t.gender === "female").length
      const avgRating =
        clusterTechs.length > 0
          ? clusterTechs.filter((t) => t.rating > 0).reduce((sum, t) => sum + t.rating, 0) /
              (clusterTechs.filter((t) => t.rating > 0).length || 1)
          : 0

      return {
        ...c,
        totalJobs: clusterJobs.length,
        completed,
        active,
        pending,
        totalTechs: clusterTechs.length,
        onlineTechs,
        womenTechs,
        avgRating,
      }
    })
  }, [jobs, technicians])

  if (!user || user.role !== "admin") return null

  return (
    <div>
      <DashboardHeader title="Cluster Overview" />
      <div className="space-y-6 p-6">

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clusterStats.map((cluster) => (
          <Card key={cluster.id} className="overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                <h3 className="font-semibold text-slate-50">{cluster.name}</h3>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">{cluster.location}</p>
            </div>
            <CardContent className="p-4">
              <p className="mb-3 text-xs text-muted-foreground">{cluster.description}</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-muted p-2 text-center">
                  <Briefcase className="mx-auto mb-1 h-4 w-4 text-amber-500" />
                  <p className="text-lg font-bold text-foreground">{cluster.totalJobs}</p>
                  <p className="text-[10px] text-muted-foreground">Jobs</p>
                </div>
                <div className="rounded-lg bg-muted p-2 text-center">
                  <Wrench className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                  <p className="text-lg font-bold text-foreground">{cluster.totalTechs}</p>
                  <p className="text-[10px] text-muted-foreground">Techs</p>
                </div>
                <div className="rounded-lg bg-muted p-2 text-center">
                  <Star className="mx-auto mb-1 h-4 w-4 text-amber-400" />
                  <p className="text-lg font-bold text-foreground">
                    {cluster.avgRating > 0 ? cluster.avgRating.toFixed(1) : "-"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Avg Rating</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {cluster.onlineTechs > 0 && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">
                    {cluster.onlineTechs} online
                  </Badge>
                )}
                {cluster.womenTechs > 0 && (
                  <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100 text-[10px]">
                    {cluster.womenTechs} women
                  </Badge>
                )}
                {cluster.active > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px]">
                    {cluster.active} active
                  </Badge>
                )}
                {cluster.pending > 0 && (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px]">
                    {cluster.pending} pending
                  </Badge>
                )}
                {cluster.completed > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {cluster.completed} done
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </div>
  )
}
