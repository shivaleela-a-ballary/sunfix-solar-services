"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CLUSTERS, ISSUE_TYPES } from "@/lib/types"
import type { IssueType } from "@/lib/types"
import { Battery, Sun, Zap, Cpu, Upload, X } from "lucide-react"
import { toast } from "sonner"

const issueIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  battery: Battery,
  panel: Sun,
  wiring: Zap,
  inverter: Cpu,
}

export default function NewRequestPage() {
  const { user } = useAuth()
  const { createJob } = useData()
  const router = useRouter()

  const [issueType, setIssueType] = useState<IssueType | "">("")
  const [description, setDescription] = useState("")
  const [cluster, setCluster] = useState(user?.cluster || "")
  const [location, setLocation] = useState("")
  const [preferredTime, setPreferredTime] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!user) return null

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!issueType) {
      toast.error("Please select an issue type")
      return
    }

    setSubmitting(true)

    const job = createJob({
      userId: user.id,
      userName: user.name,
      issueType: issueType as IssueType,
      description,
      imageUrl: imagePreview,
      cluster,
      location,
      preferredTime,
    })

    if (job.technicianId) {
      toast.success(`Request created! Technician ${job.technicianName} has been assigned.`)
    } else {
      toast.success("Request created! Waiting for technician assignment.")
    }

    router.push("/user/dashboard")
    setSubmitting(false)
  }

  return (
    <div>
      <DashboardHeader title="New Service Request" />
      <div className="mx-auto max-w-2xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Report an Issue</CardTitle>
            <CardDescription>
              Describe your solar system problem and we will match you with the nearest available technician.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Issue Type */}
              <div className="flex flex-col gap-2">
                <Label>Issue Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {ISSUE_TYPES.map((it) => {
                    const Icon = issueIcons[it.value]
                    const selected = issueType === it.value
                    return (
                      <button
                        key={it.value}
                        type="button"
                        onClick={() => setIssueType(it.value)}
                        className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                          selected
                            ? "border-amber-500 bg-amber-500/5"
                            : "border-border hover:border-amber-500/30"
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          selected ? "bg-amber-500/10" : "bg-secondary"
                        }`}>
                          <Icon className={`h-5 w-5 ${selected ? "text-amber-600" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{it.label}</p>
                          <p className="text-xs text-muted-foreground">{it.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <Label>Photo (optional)</Label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Issue photo preview"
                      className="h-40 w-auto rounded-lg border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-amber-500/30">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload a photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Cluster */}
              <div className="flex flex-col gap-2">
                <Label>Cluster / Location</Label>
                <Select value={cluster} onValueChange={setCluster}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your cluster" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLUSTERS.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location detail */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Address / Landmark</Label>
                <Input
                  id="location"
                  placeholder="e.g. Near Hanuman Temple, Tilakwadi"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Preferred Time */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select value={preferredTime} onValueChange={setPreferredTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="When works best?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                    <SelectItem value="evening">Evening (4PM - 7PM)</SelectItem>
                    <SelectItem value="urgent">Urgent (ASAP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={submitting || !issueType}
                className="mt-2 bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                {submitting ? "Submitting..." : "Submit Service Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
