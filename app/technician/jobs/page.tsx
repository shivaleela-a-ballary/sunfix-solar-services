"use client"

import { useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusTimeline } from "@/components/job/status-timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Job, JobStatus } from "@/lib/types"
import { MapPin, Calendar, User } from "lucide-react"
import { toast } from "sonner"

const nextStatus: Partial<Record<JobStatus, JobStatus>> = {
  assigned: "enroute",
  enroute: "in-progress",
  "in-progress": "completed",
}

const nextStatusLabel: Partial<Record<JobStatus, string>> = {
  assigned: "Accept & Go",
  enroute: "Start Work",
  "in-progress": "Mark Completed",
}

export default function TechJobsPage() {
  const { user } = useAuth()
  const { jobs, refreshJobs, updateJobStatus, getTechByUserId } = useData()

  useEffect(() => {
    refreshJobs()
  }, [refreshJobs])

  if (!user) return null

  const tech = getTechByUserId(user.id)
  if (!tech) return null

  const myJobs = jobs.filter((j) => j.technicianId === tech.id)
  const activeJobs = myJobs.filter((j) => j.status !== "completed")
  const completedJobs = myJobs.filter((j) => j.status === "completed")

  function handleStatusUpdate(job: Job) {
    const next = nextStatus[job.status]
    if (!next) return
    updateJobStatus(job.id, next)
    toast.success(`Job updated to ${next === "in-progress" ? "In Progress" : next}`)
  }

  return (
    <div>
      <DashboardHeader title="My Jobs" />
      <div className="p-6">
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {activeJobs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
                <p className="text-sm text-muted-foreground">No active jobs</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {[...activeJobs].reverse().map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-semibold capitalize text-foreground">
                                {job.issueType} Issue
                              </h3>
                              <p className="mt-0.5 text-sm text-muted-foreground">
                                {job.description}
                              </p>
                            </div>
                            <Badge className="shrink-0 bg-amber-100 text-amber-700">
                              {job.status}
                            </Badge>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {job.userName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location || job.cluster}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {job.imageUrl && (
                            <img
                              src={job.imageUrl}
                              alt="Issue photo"
                              className="mt-3 h-32 w-auto rounded-lg border object-cover"
                            />
                          )}

                          {nextStatus[job.status] && (
                            <Button
                              className="mt-4 bg-amber-500 text-slate-950 hover:bg-amber-400"
                              onClick={() => handleStatusUpdate(job)}
                            >
                              {nextStatusLabel[job.status]}
                            </Button>
                          )}
                        </div>

                        <div className="lg:w-48">
                          <StatusTimeline
                            currentStatus={job.status}
                            statusHistory={job.statusHistory}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            {completedJobs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
                <p className="text-sm text-muted-foreground">No completed jobs yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {[...completedJobs].reverse().map((job) => (
                  <Card key={job.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium capitalize">{job.issueType} Issue</p>
                        <p className="text-xs text-muted-foreground">
                          {job.userName} &middot; {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.rating && (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span
                                key={i}
                                className={i < job.rating! ? "text-amber-500" : "text-slate-200"}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                        <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
