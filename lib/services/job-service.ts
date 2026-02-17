import type { Job, JobStatus, IssueType, StatusHistoryEntry } from "@/lib/types"
import { store, generateId } from "@/lib/store"
import { updateEarnings } from "./tech-service"

export interface CreateJobData {
  userId: string
  userName: string
  issueType: IssueType
  description: string
  imageUrl: string | null
  cluster: string
  location: string
  preferredTime: string
}

function matchTechnician(cluster: string): { id: string; name: string } | null {
  const techs = store.getTechnicians()
  const available = techs
    .filter((t) => t.cluster === cluster && t.online)
    .sort((a, b) => {
      // Women first
      if (a.gender === "female" && b.gender !== "female") return -1
      if (a.gender !== "female" && b.gender === "female") return 1
      // Then by rating
      return b.rating - a.rating
    })

  if (available.length === 0) return null
  return { id: available[0].id, name: available[0].name }
}

export function createJob(data: CreateJobData): Job {
  const jobs = store.getJobs()
  const now = new Date().toISOString()

  const matched = matchTechnician(data.cluster)

  const statusHistory: StatusHistoryEntry[] = [{ status: "requested", timestamp: now }]
  let status: JobStatus = "requested"

  if (matched) {
    status = "assigned"
    statusHistory.push({ status: "assigned", timestamp: now })
  }

  const job: Job = {
    id: generateId(),
    userId: data.userId,
    userName: data.userName,
    technicianId: matched?.id ?? null,
    technicianName: matched?.name ?? null,
    issueType: data.issueType,
    description: data.description,
    imageUrl: data.imageUrl,
    cluster: data.cluster,
    location: data.location,
    preferredTime: data.preferredTime,
    status,
    rating: null,
    createdAt: now,
    updatedAt: now,
    statusHistory,
  }

  jobs.push(job)
  store.setJobs(jobs)
  return job
}

export function updateJobStatus(jobId: string, newStatus: JobStatus): Job | undefined {
  const jobs = store.getJobs()
  const index = jobs.findIndex((j) => j.id === jobId)
  if (index === -1) return undefined

  const now = new Date().toISOString()
  const job = jobs[index]

  job.status = newStatus
  job.updatedAt = now
  job.statusHistory.push({ status: newStatus, timestamp: now })

  if (newStatus === "completed" && job.technicianId) {
    const earningsPerJob = 200 + Math.floor(Math.random() * 100)
    updateEarnings(job.technicianId, earningsPerJob)
  }

  jobs[index] = { ...job }
  store.setJobs(jobs)
  return jobs[index]
}

export function getJobsByUser(userId: string): Job[] {
  return store.getJobs().filter((j) => j.userId === userId)
}

export function getJobsByTechnician(techId: string): Job[] {
  return store.getJobs().filter((j) => j.technicianId === techId)
}

export function getAllJobs(): Job[] {
  return store.getJobs()
}

export function getJobById(jobId: string): Job | undefined {
  return store.getJobs().find((j) => j.id === jobId)
}

export function rateJob(jobId: string, rating: number): void {
  const jobs = store.getJobs()
  const index = jobs.findIndex((j) => j.id === jobId)
  if (index === -1) return

  jobs[index] = { ...jobs[index], rating }
  store.setJobs(jobs)
}
