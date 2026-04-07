"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Heart, Search, SlidersHorizontal, X, Check, RefreshCcw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useCatalog } from "@/hooks/use-catalog"
import { CatalogPhotocard } from "@/lib/catalog"
import { readStringArray, writeStringArray, STORAGE_OWNED, STORAGE_WISHLIST } from "@/lib/storage"

type PhotocardType = "Regular" | "Irregular"

type ExplorePhotocard = CatalogPhotocard

function ExploreSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="mt-2 h-4 w-44" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-44 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-[5/7] w-full rounded-2xl" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ToastBar({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-20 left-4 right-4 z-[70] flex items-center gap-3 rounded-2xl bg-[#2D1B3D] px-4 py-3 shadow-lg animate-in slide-in-from-bottom duration-300">
      <Check className="h-4.5 w-4.5 text-green-400 shrink-0" />
      <span className="flex-1 text-sm font-medium text-white">{message}</span>
      <button onClick={onClose} className="text-white/60 active:text-white" aria-label="Fechar">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function FilterPanel({
  onClose,
  filters,
  onApply,
  groups,
  albums,
  catalog,
}: {
  onClose: () => void
  filters: { group: string; album: string; type: "" | PhotocardType; sort: "recent" | "oldest" | "az" | "za" }
  onApply: (f: { group: string; album: string; type: "" | PhotocardType; sort: "recent" | "oldest" | "az" | "za" }) => void
  groups: string[]
  albums: string[]
  catalog: ExplorePhotocard[]
}) {
  const [localFilters, setLocalFilters] = useState(filters)

  const visibleAlbums = useMemo(() => {
    if (!localFilters.group) return albums
    return albums.filter((a) => catalog.some((c) => c.group === localFilters.group && c.album === a))
  }, [albums, catalog, localFilters.group])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-lg flex-col rounded-t-3xl bg-background shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80dvh]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-lg font-bold text-foreground">Filtros</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-label="Fechar">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-foreground">Artista</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLocalFilters((f) => ({ ...f, group: "", album: "" }))}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${!localFilters.group ? "bg-[#7B5EA7] text-white" : "bg-muted text-muted-foreground"}`}
              >
                Todos
              </button>
              {groups.map((g) => (
                <button
                  key={g}
                  onClick={() => setLocalFilters((f) => ({ ...f, group: g, album: "" }))}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${localFilters.group === g ? "bg-[#7B5EA7] text-white" : "bg-muted text-muted-foreground"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-foreground">Album</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLocalFilters((f) => ({ ...f, album: "" }))}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${!localFilters.album ? "bg-[#7B5EA7] text-white" : "bg-muted text-muted-foreground"}`}
              >
                Todos
              </button>
              {visibleAlbums.map((a) => (
                <button
                  key={a}
                  onClick={() => setLocalFilters((f) => ({ ...f, album: a }))}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${localFilters.album === a ? "bg-[#7B5EA7] text-white" : "bg-muted text-muted-foreground"}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-foreground">Tipo</label>
            <div className="flex gap-2">
              {["", "Regular", "Irregular"].map((t) => (
                <button
                  key={t}
                  onClick={() => setLocalFilters((f) => ({ ...f, type: t as "" | PhotocardType }))}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${localFilters.type === t ? "bg-[#7B5EA7] text-white" : "bg-muted text-muted-foreground"}`}
                >
                  {t || "Todos"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-foreground">Ordenar por</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "recent", label: "Mais recente" },
                { value: "oldest", label: "Mais antigo" },
                { value: "az", label: "Nome A-Z" },
                { value: "za", label: "Nome Z-A" },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setLocalFilters((f) => ({ ...f, sort: s.value as any }))}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${localFilters.sort === s.value ? "bg-[#7B5EA7] text-white" : "bg-muted text-muted-foreground"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border px-5 py-4">
          <button
            onClick={() => setLocalFilters({ group: "", album: "", type: "", sort: "recent" })}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground active:bg-muted/50"
          >
            Limpar filtros
          </button>
          <button
            onClick={() => {
              onApply(localFilters)
              onClose()
            }}
            className="flex-1 rounded-xl bg-[#7B5EA7] py-2.5 text-sm font-semibold text-white active:bg-[#6A4F91]"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}

export function ExplorePage() {
  const { data, isLoading, error, refresh } = useCatalog()
  const hasError = Boolean(error)

  const [search, setSearch] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<{ group: string; album: string; type: "" | PhotocardType; sort: "recent" | "oldest" | "az" | "za" }>({
    group: "",
    album: "",
    type: "",
    sort: "recent",
  })

  const [ownedIds, setOwnedIds] = useState<string[]>([])
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const owned = readStringArray(STORAGE_OWNED)
    const wishlist = readStringArray(STORAGE_WISHLIST)
    setOwnedIds(owned)
    setWishlistIds(wishlist)
  }, [])

  useEffect(() => {
    writeStringArray(STORAGE_OWNED, ownedIds)
  }, [ownedIds])

  useEffect(() => {
    writeStringArray(STORAGE_WISHLIST, wishlistIds)
  }, [wishlistIds])

  const catalog = data?.photocards ?? []

  const groups = useMemo(() => [...new Set(catalog.map((c) => c.group))].sort(), [catalog])
  const albums = useMemo(() => [...new Set(catalog.map((c) => c.album))].sort(), [catalog])

  const filtered = useMemo(() => {
    let result = [...catalog]

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.member.toLowerCase().includes(term) ||
          c.group.toLowerCase().includes(term) ||
          c.album.toLowerCase().includes(term),
      )
    }

    if (filters.group) result = result.filter((c) => c.group === filters.group)
    if (filters.album) result = result.filter((c) => c.album === filters.album)
    if (filters.type) result = result.filter((c) => c.type === filters.type)

    switch (filters.sort) {
      case "az":
        result.sort((a, b) => a.member.localeCompare(b.member))
        break
      case "za":
        result.sort((a, b) => b.member.localeCompare(a.member))
        break
      case "oldest":
        result.sort((a, b) => a.id - b.id)
        break
      default:
        result.sort((a, b) => b.id - a.id)
    }

    return result
  }, [catalog, filters, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, safePage])

  useEffect(() => {
    setPage(1)
  }, [filters, search])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const isOwned = (id: string) => ownedIds.includes(id)
  const isWishlisted = (id: string) => wishlistIds.includes(id)

  const handleAddToCollection = (card: ExplorePhotocard) => {
    if (isOwned(card.id)) return
    setOwnedIds((prev) => [...prev, card.id])
    showToast(`${card.member} adicionado a colecao`)
  }

  const toggleWishlist = (card: ExplorePhotocard) => {
    setWishlistIds((prev) => (prev.includes(card.id) ? prev.filter((id) => id !== card.id) : [...prev, card.id]))
    showToast(prevWishlistMessage(card.member, isWishlisted(card.id)))
  }

  if (isLoading) return <ExploreSkeleton />

  if (hasError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <RefreshCcw className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-base font-semibold text-foreground">Erro ao carregar</h3>
          <p className="text-sm text-muted-foreground px-8">Nao foi possivel carregar o catalogo agora.</p>
        </div>
        <button
          onClick={() => refresh()}
          className="rounded-full bg-[#7B5EA7] px-6 py-2.5 text-sm font-semibold text-white transition-colors active:bg-[#6A4F91]"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Explorar</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Descubra novas photocards</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-muted-foreground" aria-label="Limpar busca">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors active:opacity-70 ${
                filters.group || filters.album || filters.type ? "bg-[#7B5EA7] text-white" : "bg-muted text-muted-foreground"
              }`}
              aria-label="Filtros"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, grupo ou album..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground" aria-label="Limpar busca">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Count */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            {"Resultados: "}{filtered.length}
          </p>
          <p className="text-xs text-muted-foreground">
            Pagina {safePage} de {totalPages}
          </p>
        </div>

        {/* Empty */}
        {filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-base font-semibold text-foreground">Nenhum resultado encontrado</h3>
              <p className="text-sm text-muted-foreground px-8">Tente ajustar sua busca ou filtros.</p>
            </div>
            <button
              onClick={() => {
                setSearch("")
                setFilters({ group: "", album: "", type: "", sort: "recent" })
              }}
              className="rounded-full bg-[#7B5EA7] px-6 py-2.5 text-sm font-semibold text-white transition-colors active:bg-[#6A4F91]"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {pageItems.map((card) => {
                const owned = isOwned(card.id)
                const wishlisted = isWishlisted(card.id)

                return (
                  <div
                    key={card.id}
                    className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-[5/7] w-full">
                      <Image
                        src={card.image}
                        alt={`${card.member} - ${card.group}`}
                        fill
                        className="object-cover"
                        crossOrigin="anonymous"
                      />

                      <button
                        onClick={() => toggleWishlist(card)}
                        className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
                        aria-label={wishlisted ? "Remover da wishlist" : "Adicionar a wishlist"}
                      >
                        <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-[#9B2D7B] text-[#9B2D7B]" : ""}`} />
                      </button>

                      <div
                        className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold backdrop-blur-sm ${
                          card.type === "Regular" ? "bg-[#7B5EA7]/80 text-white" : "bg-[#9B2D7B]/80 text-white"
                        }`}
                      >
                        {card.type}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 p-2.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-card-foreground truncate">{card.member}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{card.group}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{card.album}</span>
                      </div>

                      <button
                        onClick={() => handleAddToCollection(card)}
                        disabled={owned}
                        className={`w-full rounded-xl py-2 text-xs font-semibold transition-colors ${
                          owned
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-[#7B5EA7] text-white active:bg-[#6A4F91]"
                        }`}
                      >
                        {owned ? "Na sua colecao" : "Adicionar a colecao"}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground active:bg-muted/50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="flex-1 rounded-xl bg-[#7B5EA7] py-2.5 text-sm font-semibold text-white active:bg-[#6A4F91] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Proximo
              </button>
            </div>
          </>
        )}
      </div>

      {showFilters && (
        <FilterPanel
          onClose={() => setShowFilters(false)}
          filters={filters}
          onApply={setFilters}
          groups={groups}
          albums={albums}
          catalog={catalog}
        />
      )}

      {toast && <ToastBar message={toast} onClose={() => setToast(null)} />}
    </>
  )
}

function prevWishlistMessage(member: string, currentlyWishlisted: boolean) {
  return currentlyWishlisted ? `${member} removido da wishlist` : `${member} adicionado a wishlist`
}

