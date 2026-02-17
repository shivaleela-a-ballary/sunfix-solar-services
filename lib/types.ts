export type UserRole = "user" | "technician" | "admin"

export type JobStatus = "requested" | "assigned" | "enroute" | "in-progress" | "completed"

export type IssueType = "battery" | "panel" | "wiring" | "inverter"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  cluster: string
  createdAt: string
}

export interface Technician {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  gender: "male" | "female"
  cluster: string
  online: boolean
  rating: number
  totalJobs: number
  earningsToday: number
  earningsWeekly: number
  earningsTotal: number
  createdAt: string
}

export interface StatusHistoryEntry {
  status: JobStatus
  timestamp: string
}

export interface Job {
  id: string
  userId: string
  userName: string
  technicianId: string | null
  technicianName: string | null
  issueType: IssueType
  description: string
  imageUrl: string | null
  cluster: string
  location: string
  preferredTime: string
  status: JobStatus
  rating: number | null
  createdAt: string
  updatedAt: string
  statusHistory: StatusHistoryEntry[]
}

export interface Rating {
  id: string
  jobId: string
  userId: string
  technicianId: string
  score: number
  comment: string
  createdAt: string
}

export interface Cluster {
  id: string
  name: string
  location: string
  description: string
}

export const CLUSTERS: Cluster[] = [
  { id: "cl-1", name: "Belgaum North", location: "Belgaum, Karnataka", description: "Urban cluster covering north Belgaum residential areas" },
  { id: "cl-2", name: "Belgaum South", location: "Belgaum, Karnataka", description: "Southern residential and semi-urban areas" },
  { id: "cl-3", name: "Belgaum Rural East", location: "Belgaum, Karnataka", description: "Eastern rural villages with solar installations" },
  { id: "cl-4", name: "Belgaum Rural West", location: "Belgaum, Karnataka", description: "Western rural cluster near agricultural zones" },
  { id: "cl-5", name: "Khanapur", location: "Belgaum, Karnataka", description: "Khanapur taluk solar service zone" },
]

export const ISSUE_TYPES: { value: IssueType; label: string; description: string }[] = [
  { value: "battery", label: "Battery Issue", description: "Battery not charging, swollen, or leaking" },
  { value: "panel", label: "Solar Panel", description: "Panel damage, low output, or dirty panels" },
  { value: "wiring", label: "Wiring Problem", description: "Loose connections, burnt wires, or short circuit" },
  { value: "inverter", label: "Inverter Fault", description: "Inverter not working, overheating, or error codes" },
]
