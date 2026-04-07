"use client"

import { useEffect, useState } from "react"
import { getMe, GetMeResponse } from "@/lib/api"
import { getToken } from "@/lib/auth"

export function useMe() {
  const [me, setMe] = useState<GetMeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const token = getToken()
    if (!token) {
      setMe(null)
      return
    }

    setIsLoading(true)
    getMe()
      .then((data) => {
        if (!isMounted) return
        setMe(data)
        setError(null)
      })
      .catch((err: Error) => {
        if (!isMounted) return
        setError(err.message || "Erro ao carregar perfil")
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { me, isLoading, error }
}
