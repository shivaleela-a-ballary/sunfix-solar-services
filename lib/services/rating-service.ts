import type { Rating } from "@/lib/types"
import { store, generateId } from "@/lib/store"
import { updateTechRating } from "./tech-service"
import { rateJob } from "./job-service"

export interface SubmitRatingData {
  jobId: string
  userId: string
  technicianId: string
  score: number
  comment: string
}

export function submitRating(data: SubmitRatingData): Rating {
  const ratings = store.getRatings()

  const rating: Rating = {
    id: generateId(),
    jobId: data.jobId,
    userId: data.userId,
    technicianId: data.technicianId,
    score: data.score,
    comment: data.comment,
    createdAt: new Date().toISOString(),
  }

  ratings.push(rating)
  store.setRatings(ratings)

  // Update technician average rating
  updateTechRating(data.technicianId, data.score)
  // Update job with the rating
  rateJob(data.jobId, data.score)

  return rating
}

export function getRatingsByTechnician(techId: string): Rating[] {
  return store.getRatings().filter((r) => r.technicianId === techId)
}

export function getRatingForJob(jobId: string): Rating | undefined {
  return store.getRatings().find((r) => r.jobId === jobId)
}
