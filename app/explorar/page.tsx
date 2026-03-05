"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { ExplorePage } from "@/components/explore-page"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExplorarRoutePage() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("kpop-hall-logged-in")
    if (!isLoggedIn) {
      router.replace("/")
      return
    }
    setIsReady(true)
  }, [router])

  const handleNavigate = (page: string) => {
    localStorage.setItem("kpop-hall-target-page", page)
    router.push("/")
  }

  const handleLogout = () => {
    localStorage.removeItem("kpop-hall-logged-in")
    router.push("/")
  }

  if (!isReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="mt-3 h-4 w-44" />
          <Skeleton className="mt-6 h-9 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <AppShell
      activePage="explore"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      notificationsBadgeCount={2}
    >
      <ExplorePage />
    </AppShell>
  )
}

