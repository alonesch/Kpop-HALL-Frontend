"use client"

import { useState, useEffect } from "react"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { LoginScreen } from "@/components/login-screen"
import { RegisterScreen } from "@/components/register-screen"
import { HomeScreen } from "@/components/home-screen"
import { clearSession } from "@/lib/auth"

type AppScreen = "loading" | "onboarding" | "login" | "register" | "home"

export default function Page() {
  const [screen, setScreen] = useState<AppScreen>("loading")
  const [homeInitialPage, setHomeInitialPage] = useState<string | undefined>(undefined)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("kpop-hall-onboarding")
    const isLoggedIn = localStorage.getItem("kpop-hall-logged-in")
    const targetPage = localStorage.getItem("kpop-hall-target-page")

    if (!hasSeenOnboarding) {
      setScreen("onboarding")
    } else if (!isLoggedIn) {
      setScreen("login")
    } else {
      if (targetPage) {
        setHomeInitialPage(targetPage)
        localStorage.removeItem("kpop-hall-target-page")
      }
      setScreen("home")
    }
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem("kpop-hall-onboarding", "true")
    setScreen("login")
  }

  const handleLogin = () => {
    localStorage.setItem("kpop-hall-logged-in", "true")
    setScreen("home")
  }

  const handleLogout = () => {
    clearSession()
    setScreen("login")
  }

  const handleSignUp = () => {
    setScreen("register")
  }

  if (screen === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#7B5EA7]">
        <div className="animate-pulse text-2xl font-bold text-white">
          Kpop! HALL
        </div>
      </div>
    )
  }

  if (screen === "onboarding") {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />
  }

  if (screen === "login") {
    return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} />
  }

  if (screen === "register") {
    return (
      <RegisterScreen
        onRegisterSuccess={() => {
          // Futuro: integrar com fluxo real de autenticacao
          setScreen("login")
        }}
        onBackToLogin={() => setScreen("login")}
      />
    )
  }

  return <HomeScreen onLogout={handleLogout} initialPage={homeInitialPage} />
}
