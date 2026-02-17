"use client"

import type { Job } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Battery, Sun, Zap, Cpu, Calendar, MapPin, User } from "lucide-react"

const issueIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  battery: Battery,
  panel: Sun,
  wiring: Zap,
  inverter: Cpu,
}

const statusColors: Record<string, string> = {
  requested: "bg-slate-100 text-slate-700",
  assigned: "bg-blue-100 text-blue-700",
  enroute: "bg-amber-100 text-amber-700",
  "in-progress": "bg-orange-100 text-orange-700",
  completed: "bg-emerald-100 text-emerald-700",
}

interface JobCardProps {
  job: Job
  onClick?: () => void
  showUser?: boolean
}

export function JobCard({ job, onClick, showUser }: JobCardProps) {
  const Icon = issueIcons[job.issueType] || Zap

  return (
    <Card
      className={cn(
        "cursor-pointer transition-shadow hover:shadow-md",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Icon className="h-5 w-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground capitalize">
                {job.issueType} Issue
              </h3>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {job.description}
              </p>
            </div>
          </div>
          <Badge className={cn("shrink-0 text-xs", statusColors[job.status])}>
            {job.status === "in-progress" ? "In Progress" : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.cluster}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
          {showUser && job.userName && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {job.userName}
            </span>
          )}
          {job.technicianName && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Tech: {job.technicianName}
            </span>
          )}
        </div>

        {job.rating !== null && (
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={cn("text-sm", i < job.rating! ? "text-amber-500" : "text-slate-200")}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
