import type { Technician } from "@/lib/types"
import { store, generateId } from "@/lib/store"

export interface RegisterTechData {
  userId: string
  name: string
  email: string
  phone: string
  gender: "male" | "female"
  cluster: string
}

export function registerTechnician(data: RegisterTechData): Technician {
  const techs = store.getTechnicians()

  const tech: Technician = {
    id: generateId(),
    userId: data.userId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    cluster: data.cluster,
    online: false,
    rating: 0,
    totalJobs: 0,
    earningsToday: 0,
    earningsWeekly: 0,
    earningsTotal: 0,
    createdAt: new Date().toISOString(),
  }

  techs.push(tech)
  store.setTechnicians(techs)
  return tech
}

export function getTechnicianByUserId(userId: string): Technician | undefined {
  return store.getTechnicians().find((t) => t.userId === userId)
}

export function getTechnicianById(id: string): Technician | undefined {
  return store.getTechnicians().find((t) => t.id === id)
}

export function getAllTechnicians(): Technician[] {
  return store.getTechnicians()
}

export function getByCluster(cluster: string): Technician[] {
  return store.getTechnicians().filter((t) => t.cluster === cluster)
}

export function toggleOnline(techId: string): Technician | undefined {
  const techs = store.getTechnicians()
  const index = techs.findIndex((t) => t.id === techId)
  if (index === -1) return undefined

  techs[index] = { ...techs[index], online: !techs[index].online }
  store.setTechnicians(techs)
  return techs[index]
}

export function updateEarnings(techId: string, amount: number): void {
  const techs = store.getTechnicians()
  const index = techs.findIndex((t) => t.id === techId)
  if (index === -1) return

  techs[index] = {
    ...techs[index],
    earningsToday: techs[index].earningsToday + amount,
    earningsWeekly: techs[index].earningsWeekly + amount,
    earningsTotal: techs[index].earningsTotal + amount,
    totalJobs: techs[index].totalJobs + 1,
  }
  store.setTechnicians(techs)
}

export function updateTechRating(techId: string, newRating: number): void {
  const techs = store.getTechnicians()
  const index = techs.findIndex((t) => t.id === techId)
  if (index === -1) return

  const tech = techs[index]
  const totalRatings = tech.totalJobs || 1
  const updatedRating = tech.rating === 0
    ? newRating
    : ((tech.rating * (totalRatings - 1)) + newRating) / totalRatings

  techs[index] = { ...techs[index], rating: Math.round(updatedRating * 10) / 10 }
  store.setTechnicians(techs)
}

export function updateTechProfile(techId: string, updates: Partial<Technician>): void {
  const techs = store.getTechnicians()
  const index = techs.findIndex((t) => t.id === techId)
  if (index === -1) return

  techs[index] = { ...techs[index], ...updates }
  store.setTechnicians(techs)
}
