"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface RatingModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (score: number, comment: string) => void
  technicianName: string
}

export function RatingModal({ open, onClose, onSubmit, technicianName }: RatingModalProps) {
  const [score, setScore] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [comment, setComment] = useState("")

  function handleSubmit() {
    if (score === 0) return
    onSubmit(score, comment)
    setScore(0)
    setComment("")
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your technician</DialogTitle>
          <DialogDescription>
            How was your experience with {technicianName}?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* Stars */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setScore(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-1 text-2xl transition-transform hover:scale-110"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <span
                  className={cn(
                    star <= (hoveredStar || score) ? "text-amber-500" : "text-slate-200"
                  )}
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {score === 0 ? "Select a rating" : `${score} star${score > 1 ? "s" : ""}`}
          </p>

          <Textarea
            placeholder="Leave a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={score === 0}
            onClick={handleSubmit}
            className="bg-amber-500 text-slate-950 hover:bg-amber-400"
          >
            Submit Rating
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
