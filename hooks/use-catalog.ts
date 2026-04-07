"use client"

import { useEffect, useState } from "react"
import { buildCatalog, CatalogData } from "@/lib/catalog"

let catalogCache: CatalogData | null = null
let catalogPromise: Promise<CatalogData> | null = null

async function getCatalogCached() {
  if (catalogCache) return catalogCache
  if (!catalogPromise) {
    catalogPromise = buildCatalog()
  }
  catalogCache = await catalogPromise
  return catalogCache
}

export function useCatalog() {
  const [data, setData] = useState<CatalogData | null>(catalogCache)
  const [isLoading, setIsLoading] = useState(!catalogCache)
  const [error, setError] = useState<string | null>(null)

  const load = (isMountedRef: { current: boolean }) => {
    if (!catalogCache) setIsLoading(true)

    getCatalogCached()
      .then((result) => {
        if (!isMountedRef.current) return
        setData(result)
        setError(null)
      })
      .catch((err: Error) => {
        if (!isMountedRef.current) return
        setError(err.message || "Erro ao carregar catalogo")
      })
      .finally(() => {
        if (!isMountedRef.current) return
        setIsLoading(false)
      })
  }

  useEffect(() => {
    const mountedRef = { current: true }
    load(mountedRef)
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refresh = () => {
    catalogCache = null
    catalogPromise = null
    const mountedRef = { current: true }
    load(mountedRef)
  }

  return { data, isLoading, error, refresh }
}
