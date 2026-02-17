"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Job, Technician, Rating, JobStatus, IssueType } from "@/lib/types"
import * as jobService from "@/lib/services/job-service"
import * as techService from "@/lib/services/tech-service"
import * as ratingService from "@/lib/services/rating-service"

interface DataContextValue {
  // Jobs
  jobs: Job[]
  refreshJobs: () => void
  createJob: (data: jobService.CreateJobData) => Job
  updateJobStatus: (jobId: string, status: JobStatus) => Job | undefined

  // Technicians
  technicians: Technician[]
  refreshTechnicians: () => void
  toggleOnline: (techId: string) => Technician | undefined
  getTechByUserId: (userId: string) => Technician | undefined

  // Ratings
  submitRating: (data: ratingService.SubmitRatingData) => Rating
  getRatingForJob: (jobId: string) => Rating | undefined

  // Refresh all
  refresh: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])

  const refreshJobs = useCallback(() => {
    setJobs(jobService.getAllJobs())
  }, [])

  const refreshTechnicians = useCallback(() => {
    setTechnicians(techService.getAllTechnicians())
  }, [])

  const refresh = useCallback(() => {
    refreshJobs()
    refreshTechnicians()
  }, [refreshJobs, refreshTechnicians])

  const createJob = useCallback(
    (data: jobService.CreateJobData) => {
      const job = jobService.createJob(data)
      refreshJobs()
      refreshTechnicians()
      return job
    },
    [refreshJobs, refreshTechnicians]
  )

  const updateJobStatus = useCallback(
    (jobId: string, status: JobStatus) => {
      const job = jobService.updateJobStatus(jobId, status)
      refreshJobs()
      refreshTechnicians()
      return job
    },
    [refreshJobs, refreshTechnicians]
  )

  const toggleOnline = useCallback(
    (techId: string) => {
      const tech = techService.toggleOnline(techId)
      refreshTechnicians()
      return tech
    },
    [refreshTechnicians]
  )

  const getTechByUserId = useCallback((userId: string) => {
    return techService.getTechnicianByUserId(userId)
  }, [])

  const submitRating = useCallback(
    (data: ratingService.SubmitRatingData) => {
      const rating = ratingService.submitRating(data)
      refreshJobs()
      refreshTechnicians()
      return rating
    },
    [refreshJobs, refreshTechnicians]
  )

  const getRatingForJob = useCallback((jobId: string) => {
    return ratingService.getRatingForJob(jobId)
  }, [])

  return (
    <DataContext.Provider
      value={{
        jobs,
        refreshJobs,
        createJob,
        updateJobStatus,
        technicians,
        refreshTechnicians,
        toggleOnline,
        getTechByUserId,
        submitRating,
        getRatingForJob,
        refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}
