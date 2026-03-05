"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { PublicProfilePage } from "@/components/public-profile-page"

export default function PublicProfileRoutePage({
  params,
}: {
  params: { username: string }
}) {
  const router = useRouter()
  const [activePage, setActivePage] = useState("profile")

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("kpop-hall-logged-in")
    if (!isLoggedIn) router.replace("/")
  }, [router])

  const usernameTitle = useMemo(() => `@${params.username.replace("@", "")}`, [params.username])

  const handleNavigate = (page: string) => {
    localStorage.setItem("kpop-hall-target-page", page)
    router.push("/")
  }

  const handleLogout = () => {
    localStorage.removeItem("kpop-hall-logged-in")
    router.push("/")
  }

  return (
    <AppShell
      activePage={activePage}
      onNavigate={(p) => {
        setActivePage(p)
        handleNavigate(p)
      }}
      onLogout={handleLogout}
      titleOverride={usernameTitle}
      notificationsBadgeCount={2}
    >
      <PublicProfilePage username={params.username} />
    </AppShell>
  )
}

