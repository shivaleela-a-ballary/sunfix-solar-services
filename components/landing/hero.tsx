"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, ArrowRight, Zap, Shield, Users } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-50">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500">
            <Sun className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-xl font-bold tracking-tight">SunFix</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-800 hover:text-slate-50 sm:size-default" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" className="bg-amber-500 text-slate-950 hover:bg-amber-400 sm:size-default" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-16 text-center sm:px-6 lg:pb-32 lg:pt-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400">
          <Zap className="h-3.5 w-3.5" />
          Empowering Women Solar Technicians
        </div>

        <h1 className="max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Solar service at your{" "}
          <span className="text-amber-500">doorstep</span>, powered by local women
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-400">
          SunFix connects solar households in Belgaum with nearby certified women
          technicians. Report issues, track repairs in real-time, and keep your
          solar systems running — all from one simple platform.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" className="bg-amber-500 text-slate-950 hover:bg-amber-400" asChild>
            <Link href="/signup">
              Launch App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-50" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-8 border-t border-slate-800 pt-10 sm:grid-cols-3 lg:mt-20">
          <div className="flex flex-col items-center gap-1">
            <Users className="mb-2 h-5 w-5 text-amber-500" />
            <span className="text-2xl font-bold text-slate-50">5+</span>
            <span className="text-sm text-slate-400">Active Clusters</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Shield className="mb-2 h-5 w-5 text-amber-500" />
            <span className="text-2xl font-bold text-slate-50">{"<24hrs"}</span>
            <span className="text-sm text-slate-400">Avg Response Time</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Zap className="mb-2 h-5 w-5 text-amber-500" />
            <span className="text-2xl font-bold text-slate-50">Women-Led</span>
            <span className="text-sm text-slate-400">Technician Network</span>
          </div>
        </div>
      </div>
    </section>
  )
}
