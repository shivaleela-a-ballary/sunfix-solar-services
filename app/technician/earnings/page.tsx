"use client"

import { useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Briefcase, Calendar } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

export default function EarningsPage() {
  const { user } = useAuth()
  const { jobs, refreshJobs, refreshTechnicians, getTechByUserId } = useData()

  useEffect(() => {
    refreshJobs()
    refreshTechnicians()
  }, [refreshJobs, refreshTechnicians])

  if (!user) return null
  const tech = getTechByUserId(user.id)
  if (!tech) return null

  const myCompletedJobs = jobs.filter(
    (j) => j.technicianId === tech.id && j.status === "completed"
  )

  // Generate chart data for last 7 days
  const chartData = useMemo(() => {
    const days: { day: string; earnings: number; jobs: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" })

      const dayJobs = myCompletedJobs.filter(
        (j) => j.updatedAt.split("T")[0] === dateStr
      )

      days.push({
        day: dayLabel,
        earnings: dayJobs.length * (200 + Math.floor(Math.random() * 100)),
        jobs: dayJobs.length,
      })
    }
    return days
  }, [myCompletedJobs])

  return (
    <div>
      <DashboardHeader title="Earnings" />
      <div className="p-6">
        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{"₹"}{tech.earningsToday}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{"₹"}{tech.earningsWeekly}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{"₹"}{tech.earningsTotal}</p>
                <p className="text-xs text-muted-foreground">All Time</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-500/10">
                <Briefcase className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{tech.totalJobs}</p>
                <p className="text-xs text-muted-foreground">Total Jobs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Earnings (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0 0% 100%)",
                        borderColor: "hsl(214 32% 91%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`₹${value}`, "Earnings"]}
                    />
                    <Bar dataKey="earnings" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jobs Completed (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0 0% 100%)",
                        borderColor: "hsl(214 32% 91%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="jobs"
                      stroke="hsl(38 92% 50%)"
                      strokeWidth={2}
                      dot={{ fill: "hsl(38 92% 50%)", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Completed Jobs */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Recent Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {myCompletedJobs.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No completed jobs yet. Complete your first job to start earning!
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {[...myCompletedJobs].reverse().slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">{job.issueType} Issue</p>
                      <p className="text-xs text-muted-foreground">
                        {job.userName} &middot; {new Date(job.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <Calendar className="h-3 w-3" />
                      {"₹200+"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
