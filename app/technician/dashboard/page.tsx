"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DollarSign,
  Briefcase,
  Star,
  TrendingUp,
  Award,
} from "lucide-react"

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const { jobs, technicians, refreshJobs, refreshTechnicians, toggleOnline, getTechByUserId, updateJobStatus } = useData()

  useEffect(() => {
    refreshJobs()
    refreshTechnicians()
  }, [refreshJobs, refreshTechnicians])

  if (!user) return null

  const tech = getTechByUserId(user.id)
  if (!tech) {
    return (
      <div>
        <DashboardHeader title="Dashboard" />
        <div className="flex flex-col items-center gap-4 p-12">
          <p className="text-muted-foreground">Technician profile not found. Please contact admin.</p>
        </div>
      </div>
    )
  }

  const myJobs = jobs.filter((j) => j.technicianId === tech.id)
  const activeJobs = myJobs.filter((j) => j.status !== "completed")
  const assignedJobs = myJobs.filter((j) => j.status === "assigned")

  return (
    <div>
      <DashboardHeader title="Dashboard" />
      <div className="p-6">
        {/* Online toggle + Women badge */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Card className="flex-1">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${tech.online ? "bg-emerald-500" : "bg-slate-300"}`} />
                <div>
                  <Label className="text-sm font-medium">
                    {tech.online ? "You are Online" : "You are Offline"}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {tech.online ? "Accepting new jobs" : "Toggle on to receive jobs"}
                  </p>
                </div>
              </div>
              <Switch
                checked={tech.online}
                onCheckedChange={() => toggleOnline(tech.id)}
              />
            </CardContent>
          </Card>

          {tech.gender === "female" && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="flex items-center gap-3 p-4">
                <Award className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Women Solar Leader</p>
                  <p className="text-xs text-amber-600">Certified technician</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {"₹"}{tech.earningsToday}
                </p>
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
                <p className="text-2xl font-bold text-foreground">
                  {"₹"}{tech.earningsWeekly}
                </p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Briefcase className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{tech.totalJobs}</p>
                <p className="text-xs text-muted-foreground">Jobs Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {tech.rating > 0 ? tech.rating.toFixed(1) : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incoming Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Incoming Jobs</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/technician/jobs">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {assignedJobs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {tech.online
                    ? "No incoming jobs right now. Stay online to receive new requests."
                    : "Go online to start receiving job requests."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {assignedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize text-foreground">
                        {job.issueType} Issue
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {job.userName} &middot; {job.cluster}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{job.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-amber-500 text-slate-950 hover:bg-amber-400"
                        onClick={() => updateJobStatus(job.id, "enroute")}
                      >
                        Accept
                      </Button>
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
