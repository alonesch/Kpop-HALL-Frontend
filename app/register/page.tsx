"use client"

import { useRouter } from "next/navigation"
import { RegisterScreen } from "@/components/register-screen"

export default function RegisterPage() {
  const router = useRouter()

  return (
    <RegisterScreen
      onRegisterSuccess={() => {
        router.push("/")
      }}
      onBackToLogin={() => router.push("/")}
    />
  )
}

