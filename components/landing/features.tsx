"use client"

import { Battery, MapPin, Clock, BarChart3, Star, Shield } from "lucide-react"

const features = [
  {
    icon: Battery,
    title: "Quick Issue Reporting",
    description:
      "Select your issue type, upload a photo, and submit in under 2 minutes. Battery, panel, wiring, or inverter — we cover it all.",
  },
  {
    icon: MapPin,
    title: "Cluster-Based Matching",
    description:
      "Automatically matched with the nearest available technician in your cluster. Women technicians are prioritized in our ecosystem.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description:
      "Track your job from request to completion with a live status timeline. Know exactly when your technician is en route.",
  },
  {
    icon: BarChart3,
    title: "Earnings Dashboard",
    description:
      "Technicians see daily, weekly, and total earnings at a glance. Transparent pay for every completed job.",
  },
  {
    icon: Star,
    title: "Rating System",
    description:
      "Rate your technician after every service. Ratings drive better matching and accountability across the platform.",
  },
  {
    icon: Shield,
    title: "Admin Oversight",
    description:
      "SELCO coordinators get a powerful dashboard with cluster performance, job analytics, and technician management.",
  },
]

export function LandingFeatures() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
            Features
          </p>
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need for solar service
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            A complete platform connecting solar households, technicians, and
            administrators in one seamless experience.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10">
                <feature.icon className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
