"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ISSUE_TYPES, type JobStatus } from "@/lib/types"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Search, Briefcase } from "lucide-react"

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "requested", label: "Requested" },
  { value: "assigned", label: "Assigned" },
  { value: "enroute", label: "En Route" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

export default function AdminJobsPage() {
  const { user } = useAuth()
  const { jobs, refresh } = useData()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/login")
      return
    }
    refresh()
  }, [user, router, refresh])

  const filtered = useMemo(() => {
    return jobs
      .filter((j) => {
        if (statusFilter !== "all" && j.status !== statusFilter) return false
        if (search) {
          const s = search.toLowerCase()
          return (
            j.userName.toLowerCase().includes(s) ||
            j.technicianName?.toLowerCase().includes(s) ||
            j.cluster.toLowerCase().includes(s) ||
            j.id.toLowerCase().includes(s)
          )
        }
        return true
      })
      .slice()
      .reverse()
  }, [jobs, search, statusFilter])

  if (!user || user.role !== "admin") return null

  return (
    <div>
      <DashboardHeader title="All Jobs" />
      <div className="space-y-6 p-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user, technician, cluster, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 whitespace-nowrap">
          <Briefcase className="h-3.5 w-3.5" />
          {filtered.length} jobs
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-0">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {jobs.length === 0 ? "No jobs have been created yet." : "No jobs match your filters."}
            </p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="p-3 pr-4">ID</th>
                      <th className="p-3 pr-4">User</th>
                      <th className="p-3 pr-4">Issue</th>
                      <th className="p-3 pr-4">Cluster</th>
                      <th className="p-3 pr-4">Technician</th>
                      <th className="p-3 pr-4">Status</th>
                      <th className="p-3 pr-4">Created</th>
                      <th className="p-3">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((job) => (
                      <tr key={job.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="p-3 pr-4 font-mono text-xs">{job.id.slice(0, 8)}</td>
                        <td className="p-3 pr-4 font-medium">{job.userName}</td>
                        <td className="p-3 pr-4">
                          {ISSUE_TYPES.find((i) => i.value === job.issueType)?.label}
                        </td>
                        <td className="p-3 pr-4 text-xs">{job.cluster}</td>
                        <td className="p-3 pr-4">{job.technicianName || "Unassigned"}</td>
                        <td className="p-3 pr-4">
                          <Badge
                            variant={
                              job.status === "completed"
                                ? "default"
                                : job.status === "requested"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              job.status === "completed"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : job.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                  : job.status === "enroute"
                                    ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                    : job.status === "assigned"
                                      ? "bg-cyan-100 text-cyan-700 hover:bg-cyan-100"
                                      : ""
                            }
                          >
                            {job.status}
                          </Badge>
                        </td>
                        <td className="p-3 pr-4 text-xs text-muted-foreground">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">{job.rating ? `${job.rating}/5` : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="flex flex-col gap-3 p-4 md:hidden">
                {filtered.map((job) => (
                  <div key={job.id} className="rounded-xl border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium capitalize text-foreground">
                          {job.issueType} Issue
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job.userName} &middot; {job.cluster}
                        </p>
                      </div>
                      <Badge
                        variant={
                          job.status === "completed"
                            ? "default"
                            : job.status === "requested"
                              ? "destructive"
                              : "secondary"
                        }
                        className={
                          job.status === "completed"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : job.status === "in-progress"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : job.status === "enroute"
                                ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                : job.status === "assigned"
                                  ? "bg-cyan-100 text-cyan-700 hover:bg-cyan-100"
                                  : ""
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Tech: {job.technicianName || "Unassigned"}</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
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
