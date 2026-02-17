"use client"

import { cn } from "@/lib/utils"
import type { StatusHistoryEntry, JobStatus } from "@/lib/types"
import { Check, Clock, Truck, Wrench, CircleDot } from "lucide-react"

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  requested: { label: "Requested", icon: CircleDot, color: "text-slate-400" },
  assigned: { label: "Assigned", icon: Clock, color: "text-blue-500" },
  enroute: { label: "En Route", icon: Truck, color: "text-amber-500" },
  "in-progress": { label: "In Progress", icon: Wrench, color: "text-orange-500" },
  completed: { label: "Completed", icon: Check, color: "text-emerald-500" },
}

const ALL_STATUSES: JobStatus[] = ["requested", "assigned", "enroute", "in-progress", "completed"]

interface StatusTimelineProps {
  currentStatus: JobStatus
  statusHistory: StatusHistoryEntry[]
}

export function StatusTimeline({ currentStatus, statusHistory }: StatusTimelineProps) {
  const currentIndex = ALL_STATUSES.indexOf(currentStatus)

  return (
    <div className="flex flex-col gap-0">
      {ALL_STATUSES.map((status, i) => {
        const config = STATUS_CONFIG[status]
        const isCompleted = i < currentIndex
        const isCurrent = i === currentIndex
        const historyEntry = statusHistory.find((h) => h.status === status)
        const Icon = config.icon

        return (
          <div key={status} className="flex gap-3">
            {/* Line + circle column */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  isCompleted && "border-emerald-500 bg-emerald-500/10",
                  isCurrent && "border-amber-500 bg-amber-500/10",
                  !isCompleted && !isCurrent && "border-slate-200 bg-slate-50"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isCompleted && "text-emerald-500",
                    isCurrent && "text-amber-500",
                    !isCompleted && !isCurrent && "text-slate-300"
                  )}
                />
              </div>
              {i < ALL_STATUSES.length - 1 && (
                <div
                  className={cn(
                    "h-8 w-0.5",
                    i < currentIndex ? "bg-emerald-500" : "bg-slate-200"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-4">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCompleted && "text-emerald-600",
                  isCurrent && "text-amber-600",
                  !isCompleted && !isCurrent && "text-slate-400"
                )}
              >
                {config.label}
              </p>
              {historyEntry && (
                <p className="text-xs text-muted-foreground">
                  {new Date(historyEntry.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
