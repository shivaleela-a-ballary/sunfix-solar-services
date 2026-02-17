"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JobCard } from "@/components/job/job-card"
import { StatusTimeline } from "@/components/job/status-timeline"
import { RatingModal } from "@/components/job/rating-modal"
import type { Job } from "@/lib/types"
import { Plus, History, Clock, Wrench } from "lucide-react"
import { toast } from "sonner"

export default function UserDashboard() {
  const { user } = useAuth()
  const { jobs, refreshJobs, submitRating, getRatingForJob } = useData()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [ratingJob, setRatingJob] = useState<Job | null>(null)

  useEffect(() => {
    refreshJobs()
  }, [refreshJobs])

  if (!user) return null

  const myJobs = jobs.filter((j) => j.userId === user.id)
  const activeJobs = myJobs.filter((j) => j.status !== "completed")
  const completedJobs = myJobs.filter((j) => j.status === "completed")
  const latestActive = activeJobs.length > 0 ? activeJobs[activeJobs.length - 1] : null

  return (
    <div>
      <DashboardHeader title="Dashboard" />
      <div className="p-6">
        {/* Quick Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Wrench className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{myJobs.length}</p>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeJobs.length}</p>
                <p className="text-xs text-muted-foreground">Active Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <History className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedJobs.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Job & Timeline */}
          <div className="lg:col-span-2">
            {latestActive ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Active Service Request</CardTitle>
                  <Badge className="bg-amber-100 text-amber-700">
                    {latestActive.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm font-medium capitalize text-foreground">
                      {latestActive.issueType} Issue
                    </p>
                    <p className="text-sm text-muted-foreground">{latestActive.description}</p>
                    {latestActive.technicianName && (
                      <p className="mt-2 text-sm">
                        <span className="text-muted-foreground">Technician: </span>
                        <span className="font-medium text-foreground">{latestActive.technicianName}</span>
                      </p>
                    )}
                  </div>
                  <StatusTimeline
                    currentStatus={latestActive.status}
                    statusHistory={latestActive.statusHistory}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center gap-4 py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <Wrench className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">No active requests</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Create a new service request to get help with your solar system.
                    </p>
                  </div>
                  <Button className="bg-amber-500 text-slate-950 hover:bg-amber-400" asChild>
                    <Link href="/user/new-request">
                      <Plus className="mr-2 h-4 w-4" />
                      New Request
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <Button className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400" asChild>
              <Link href="/user/new-request">
                <Plus className="mr-2 h-4 w-4" />
                Create New Request
              </Link>
            </Button>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recent History</CardTitle>
              </CardHeader>
              <CardContent>
                {completedJobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No completed jobs yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {completedJobs.slice(-3).reverse().map((job) => {
                      const hasRating = getRatingForJob(job.id)
                      return (
                        <div key={job.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="text-sm font-medium capitalize">{job.issueType}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {!hasRating ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRatingJob(job)}
                              className="text-xs"
                            >
                              Rate
                            </Button>
                          ) : (
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span
                                  key={i}
                                  className={i < (job.rating || 0) ? "text-amber-500" : "text-slate-200"}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                {completedJobs.length > 0 && (
                  <Button variant="ghost" className="mt-3 w-full text-sm" asChild>
                    <Link href="/user/history">View All History</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {ratingJob && ratingJob.technicianId && (
        <RatingModal
          open={!!ratingJob}
          onClose={() => setRatingJob(null)}
          technicianName={ratingJob.technicianName || "Technician"}
          onSubmit={(score, comment) => {
            submitRating({
              jobId: ratingJob.id,
              userId: user.id,
              technicianId: ratingJob.technicianId!,
              score,
              comment,
            })
            toast.success("Rating submitted!")
            setRatingJob(null)
            refreshJobs()
          }}
        />
      )}
    </div>
  )
}
