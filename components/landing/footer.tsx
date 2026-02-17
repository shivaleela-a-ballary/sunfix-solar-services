"use client"

import { Sun } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 px-4 py-12 text-slate-400 sm:px-6 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
            <Sun className="h-4 w-4 text-slate-950" />
          </div>
          <span className="text-lg font-bold text-slate-50">SunFix</span>
        </div>
        <p className="max-w-md text-sm leading-relaxed">
          Empowering rural solar households and women technicians through
          decentralized, cluster-based service delivery. Built for SELCO
          Foundation, Belgaum.
        </p>
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
          <span>SDG 7: Affordable Clean Energy</span>
          <span className="hidden text-slate-600 sm:inline">|</span>
          <span>SDG 5: Gender Equality</span>
        </div>
        <p className="text-xs text-slate-600">
          {"SunFix 2026. Hackathon MVP."}
        </p>
      </div>
    </footer>
  )
}
