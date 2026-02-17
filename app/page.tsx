"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { LandingFooter } from "@/components/landing/footer"
import { CallToAction } from "@/components/landing/cta"

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace(`/${user.role}/dashboard`)
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  if (user) return null

  return (
    <main className="min-h-screen">
      <LandingHero />
      <LandingFeatures />
      <HowItWorks />
      <CallToAction />
      <LandingFooter />
    </main>
  )
}
