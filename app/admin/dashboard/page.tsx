"use client"

import { useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CLUSTERS, ISSUE_TYPES } from "@/lib/types"
import {
  Users,
  Wrench,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  MapPin,
} from "lucide-react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const PIE_COLORS = ["#f59e0b", "#22c55e", "#3b82f6", "#ef4444"]

export default function AdminDashboardPage() {
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

  const stats = useMemo(() => {
    const total = jobs.length
    const completed = jobs.filter((j) => j.status === "completed").length
    const pending = jobs.filter((j) => j.status === "requested").length
    const inProgress = jobs.filter(
      (j) => j.status === "assigned" || j.status === "enroute" || j.status === "in-progress"
    ).length
    const onlineTechs = technicians.filter((t) => t.online).length
    const totalEarnings = technicians.reduce((sum, t) => sum + t.earningsTotal, 0)
    const avgRating =
      technicians.length > 0
        ? technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.filter((t) => t.rating > 0).length || 0
        : 0
    const womenTechs = technicians.filter((t) => t.gender === "female").length

    return { total, completed, pending, inProgress, onlineTechs, totalEarnings, avgRating, womenTechs }
  }, [jobs, technicians])

  const clusterData = useMemo(() => {
    return CLUSTERS.map((c) => ({
      name: c.name.replace("Belgaum ", "").replace("Rural ", "R."),
      jobs: jobs.filter((j) => j.cluster === c.name).length,
      techs: technicians.filter((t) => t.cluster === c.name).length,
    }))
  }, [jobs, technicians])

  const issueData = useMemo(() => {
    return ISSUE_TYPES.map((it) => ({
      name: it.label,
      value: jobs.filter((j) => j.issueType === it.value).length,
    }))
  }, [jobs])

  if (!user || user.role !== "admin") return null

  return (
    <div>
      <DashboardHeader title="Admin Dashboard" />
      <div className="space-y-6 p-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Jobs</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Technicians</p>
              <p className="text-2xl font-bold">{technicians.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Online Now</p>
              <p className="text-2xl font-bold">{stats.onlineTechs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
              <p className="text-xl font-bold">
                {"₹"}{stats.totalEarnings.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Clusters</p>
              <p className="text-2xl font-bold">{CLUSTERS.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Jobs by Cluster</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.total === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No jobs yet. Data will appear here as jobs are created.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={clusterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0,0%,100%)",
                      border: "1px solid hsl(214,32%,91%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="jobs" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Jobs" />
                  <Bar dataKey="techs" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Technicians" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Issue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.total === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No jobs yet. Data will appear here as jobs are created.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={issueData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
                    labelLine={false}
                  >
                    {issueData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend fontSize={12} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No jobs have been created yet.
            </p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="pb-2 pr-4">Job ID</th>
                      <th className="pb-2 pr-4">User</th>
                      <th className="pb-2 pr-4">Issue</th>
                      <th className="pb-2 pr-4">Cluster</th>
                      <th className="pb-2 pr-4">Technician</th>
                      <th className="pb-2 pr-4">Status</th>
                      <th className="pb-2">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs
                      .slice()
                      .reverse()
                      .slice(0, 10)
                      .map((job) => (
                        <tr key={job.id} className="border-b last:border-0">
                          <td className="py-2.5 pr-4 font-mono text-xs">{job.id.slice(0, 8)}</td>
                          <td className="py-2.5 pr-4">{job.userName}</td>
                          <td className="py-2.5 pr-4">
                            {ISSUE_TYPES.find((i) => i.value === job.issueType)?.label}
                          </td>
                          <td className="py-2.5 pr-4 text-xs">{job.cluster}</td>
                          <td className="py-2.5 pr-4">{job.technicianName || "Unassigned"}</td>
                          <td className="py-2.5 pr-4">
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
                                    : ""
                              }
                            >
                              {job.status}
                            </Badge>
                          </td>
                          <td className="py-2.5">
                            {job.rating ? `${job.rating}/5` : "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="flex flex-col gap-3 md:hidden">
                {jobs
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((job) => (
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
                                : ""
                          }
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Tech: {job.technicianName || "Unassigned"}</span>
                        <span>{job.rating ? `${job.rating}/5 stars` : ""}</span>
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
