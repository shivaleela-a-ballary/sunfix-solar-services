"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { JobCard } from "@/components/job/job-card"
import { StatusTimeline } from "@/components/job/status-timeline"
import { RatingModal } from "@/components/job/rating-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Job } from "@/lib/types"
import { toast } from "sonner"

export default function HistoryPage() {
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

  return (
    <div>
      <DashboardHeader title="Service History" />
      <div className="p-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({myJobs.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <JobList
              jobs={myJobs}
              onSelect={setSelectedJob}
              onRate={setRatingJob}
              getRatingForJob={getRatingForJob}
            />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <JobList
              jobs={activeJobs}
              onSelect={setSelectedJob}
              onRate={setRatingJob}
              getRatingForJob={getRatingForJob}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <JobList
              jobs={completedJobs}
              onSelect={setSelectedJob}
              onRate={setRatingJob}
              getRatingForJob={getRatingForJob}
            />
          </TabsContent>
        </Tabs>

        {/* Selected job detail */}
        {selectedJob && (
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base capitalize">{selectedJob.issueType} Issue Detail</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                  {selectedJob.imageUrl && (
                    <img
                      src={selectedJob.imageUrl}
                      alt="Issue photo"
                      className="mt-4 h-48 w-auto rounded-lg border object-cover"
                    />
                  )}
                  <div className="mt-4 flex flex-col gap-1 text-sm">
                    <p><span className="text-muted-foreground">Cluster:</span> {selectedJob.cluster}</p>
                    <p><span className="text-muted-foreground">Location:</span> {selectedJob.location || "N/A"}</p>
                    <p><span className="text-muted-foreground">Technician:</span> {selectedJob.technicianName || "Unassigned"}</p>
                    <p><span className="text-muted-foreground">Created:</span> {new Date(selectedJob.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <StatusTimeline
                  currentStatus={selectedJob.status}
                  statusHistory={selectedJob.statusHistory}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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

function JobList({
  jobs,
  onSelect,
  onRate,
  getRatingForJob,
}: {
  jobs: import("@/lib/types").Job[]
  onSelect: (j: import("@/lib/types").Job) => void
  onRate: (j: import("@/lib/types").Job) => void
  getRatingForJob: (jobId: string) => import("@/lib/types").Rating | undefined
}) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
        <p className="text-sm text-muted-foreground">No jobs found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {[...jobs].reverse().map((job) => (
        <div key={job.id} className="relative">
          <JobCard job={job} onClick={() => onSelect(job)} />
          {job.status === "completed" && !getRatingForJob(job.id) && job.technicianId && (
            <Button
              size="sm"
              className="absolute right-4 top-4 bg-amber-500 text-slate-950 hover:bg-amber-400"
              onClick={(e) => {
                e.stopPropagation()
                onRate(job)
              }}
            >
              Rate
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
