"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sun } from "lucide-react"

export function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24 lg:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500">
          <Sun className="h-8 w-8 text-slate-950" />
        </div>

        <h2 className="text-balance text-3xl font-bold text-slate-50 sm:text-4xl">
          Ready to keep your solar running?
        </h2>
        <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-slate-400">
          Join the SunFix network today. Whether you are a solar household
          needing support or a technician looking to earn, we have got you
          covered.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-amber-500 text-slate-950 hover:bg-amber-400"
            asChild
          >
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-50"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
