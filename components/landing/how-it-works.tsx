"use client"

import { FileText, UserCheck, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Report an Issue",
    description:
      "Select your issue type, describe the problem, snap a photo, and submit your service request in under 2 minutes.",
  },
  {
    icon: UserCheck,
    step: "02",
    title: "Get Matched",
    description:
      "Our system instantly matches you with the nearest available certified technician in your cluster — women techs are prioritized.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Track & Rate",
    description:
      "Follow your job status in real-time from assigned to completed. Rate your technician and build your service history.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
            How It Works
          </p>
          <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl">
            Three simple steps
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.step} className="relative flex flex-col items-center text-center">
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-amber-300 sm:block" />
              )}
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
                <s.icon className="h-7 w-7 text-amber-600" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-950">
                  {s.step}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
