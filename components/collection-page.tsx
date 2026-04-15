"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  X,
  Eye,
  Trash2,
  ArrowRightLeft,
  Heart,
  Check,
  RefreshCcw,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useCatalog } from "@/hooks/use-catalog"
import { CatalogPhotocard } from "@/lib/catalog"
import { readStringArray, writeStringArray, STORAGE_OWNED, STORAGE_WISHLIST } from "@/lib/storage"

// --- Types ---
type Photocard = CatalogPhotocard & { inWishlist: boolean }

// --- Sub Components ---

function CollectionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-24" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-[5/7] w-full rounded-2xl" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 px-6">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-base font-semibold text-foreground">Sua colecao ainda esta vazia</h3>
        <p className="text-sm text-muted-foreground">Adicione suas primeiras photocards</p>
      </div>
      <button
        onClick={onExplore}
        className="rounded-full bg-[#7B5EA7] px-6 py-2.5 text-sm font-semibold text-white transition-colors active:bg-[#6A4F91]"
      >
        Explorar Photocards
      </button>
    </div>
  )
}

function CardContextMenu({
  card,
  onClose,
  onViewDetails,
  onRemove,
  onToggleWishlist,
}: {
  card: Photocard
  onClose: () => void
  onViewDetails: () => void
  onRemove: () => void
  onToggleWishlist: () => void
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 z-10 rounded-t-3xl bg-card p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <div className="relative h-12 w-9 rounded-lg overflow-hidden">
            <Image src={card.image ?? "https://picsum.photos/seed/kpop-fallback/240/336"} alt={card.member} fill className="object-cover" crossOrigin="anonymous" />
          </div>
          <div>
            <p className="text-sm font-semibold text-card-foreground">{card.member}</p>
            <p className="text-xs text-muted-foreground">{card.group} | {card.album}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={onViewDetails} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-card-foreground active:bg-muted/50">
            <Eye className="h-4.5 w-4.5 text-muted-foreground" /> Ver detalhes
          </button>
          <button onClick={onRemove} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-destructive active:bg-destructive/10">
            <Trash2 className="h-4.5 w-4.5" /> Remover da colecao
          </button>
          <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground opacity-60 cursor-not-allowed">
            <ArrowRightLeft className="h-4.5 w-4.5" /> Marcar como disponivel para troca
          </button>
          <button onClick={onToggleWishlist} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-card-foreground active:bg-muted/50">
            <Heart className={`h-4.5 w-4.5 ${card.inWishlist ? "fill-[#9B2D7B] text-[#9B2D7B]" : "text-muted-foreground"}`} />
            {card.inWishlist ? "Remover da wishlist" : "Mover para wishlist"}
          </button>
        </div>
      </div>
    </div>
  )
}

function PhotocardDetail({ card, onClose, onRemove }: { card: Photocard; onClose: () => void; onRemove: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative flex w-full max-w-sm flex-col rounded-3xl bg-card mx-4 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative aspect-[5/7] w-full">
          <Image src={card.image ?? "https://picsum.photos/seed/kpop-fallback/240/336"} alt={`${card.member} - ${card.group}`} fill className="object-cover" crossOrigin="anonymous" />
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div>
            <h3 className="text-lg font-bold text-card-foreground">{card.member}</h3>
            <p className="text-sm text-muted-foreground">{card.group}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Album</span>
              <span className="text-xs font-medium text-card-foreground">{card.album}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tipo</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${card.type === "Regular" ? "bg-[#7B5EA7]/10 text-[#7B5EA7]" : "bg-[#9B2D7B]/10 text-[#9B2D7B]"}`}>
                {card.type}
              </span>
            </div>
            {card.type === "Irregular" && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Distribuicao</span>
                <span className="text-xs font-medium text-card-foreground">Evento Exclusivo</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onRemove}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-destructive/30 py-2.5 text-sm font-semibold text-destructive active:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" /> Remover
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-muted py-2.5 text-sm font-semibold text-muted-foreground opacity-60 cursor-not-allowed">
              <ArrowRightLeft className="h-4 w-4" /> Troca
            </button>
          </div>
        </div>
      </div>
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
  filters: { group: string; album: string; type: string; sort: string }
  onApply: (f: { group: string; album: string; type: string; sort: string }) => void
  groups: string[]
  albums: string[]
  catalog: CatalogPhotocard[]
}) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [albumSearch, setAlbumSearch] = useState("")

  const visibleAlbums = useMemo(() => {
    if (!localFilters.group) return albums
    return albums.filter((a) => catalog.some((c) => c.group === localFilters.group && c.album === a))
  }, [albums, catalog, localFilters.group])

  const filteredAlbums = useMemo(() => {
    const term = albumSearch.trim().toLowerCase()
    if (!term) return visibleAlbums
    return visibleAlbums.filter((album) => album.toLowerCase().includes(term))
  }, [albumSearch, visibleAlbums])

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
          {/* Group filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-foreground">Artista / Grupo</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLocalFilters((f) => ({ ...f, group: "" }))}
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
          {/* Album filter */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs font-semibold text-foreground">Album</label>
              <span className="text-[11px] font-medium text-muted-foreground">
                {filteredAlbums.length} de {visibleAlbums.length}
              </span>
            </div>

            {localFilters.album && (
              <div className="rounded-2xl border border-[#7B5EA7]/15 bg-[#7B5EA7]/6 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7B5EA7]">
                  Selecionado
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{localFilters.album}</p>
                  <button
                    onClick={() => setLocalFilters((f) => ({ ...f, album: "" }))}
                    className="shrink-0 text-xs font-semibold text-[#7B5EA7]"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            )}

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={albumSearch}
                onChange={(e) => setAlbumSearch(e.target.value)}
                placeholder="Buscar album..."
                className="h-10 w-full rounded-2xl border border-border bg-muted/40 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-2">
              <div className="max-h-56 overflow-y-auto pr-1">
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setLocalFilters((f) => ({ ...f, album: "" }))}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${!localFilters.album ? "bg-[#7B5EA7] text-white" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    <span>Todos os albuns</span>
                    {!localFilters.album && <Check className="h-4 w-4 shrink-0" />}
                  </button>

                  {filteredAlbums.length === 0 ? (
                    <div className="rounded-xl px-3 py-5 text-center text-sm text-muted-foreground">
                      Nenhum album encontrado.
                    </div>
                  ) : (
                    filteredAlbums.map((a) => (
                      <button
                        key={a}
                        onClick={() => setLocalFilters((f) => ({ ...f, album: a }))}
                        className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${localFilters.album === a ? "bg-[#7B5EA7] text-white" : "text-foreground hover:bg-muted"}`}
                      >
                        <span className="truncate">{a}</span>
                        {localFilters.album === a && <Check className="h-4 w-4 shrink-0" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Type filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-foreground">Tipo</label>
            <div className="flex gap-2">
              {["", "Regular", "Irregular"].map((t) => (
                <button
                  key={t}
                  onClick={() => setLocalFilters((f) => ({ ...f, type: t }))}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${localFilters.type === t ? "bg-[#7B5EA7] text-white" : "bg-muted text-muted-foreground"}`}
                >
                  {t || "Todos"}
                </button>
              ))}
            </div>
          </div>
          {/* Sort */}
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
                  onClick={() => setLocalFilters((f) => ({ ...f, sort: s.value }))}
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
            onClick={() => {
              setLocalFilters({ group: "", album: "", type: "", sort: "recent" })
            }}
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

function AddPhotocardModal({
  onClose,
  onAdd,
  catalog,
  ownedIds,
}: {
  onClose: () => void
  onAdd: (card: CatalogPhotocard) => void
  catalog: CatalogPhotocard[]
  ownedIds: string[]
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [addedIds, setAddedIds] = useState<string[]>(ownedIds)

  const filtered = catalog.filter(
    (c) =>
      c.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.group.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-lg flex-col rounded-t-3xl bg-background shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85dvh]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-lg font-bold text-foreground">Adicionar Photocard</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-label="Fechar">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por membro ou grupo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-3">
            {filtered.map((card) => {
              const wasAdded = addedIds.includes(card.id)
              return (
                <div key={card.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                  <div className="relative h-16 w-12 shrink-0 rounded-xl overflow-hidden">
                    <Image src={card.image ?? "https://picsum.photos/seed/kpop-fallback/240/336"} alt={card.member} fill className="object-cover" crossOrigin="anonymous" />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold text-card-foreground truncate">{card.member}</span>
                    <span className="text-xs text-muted-foreground truncate">{card.group} | {card.album}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!wasAdded) {
                        setAddedIds((prev) => [...prev, card.id])
                        onAdd(card)
                      }
                    }}
                    disabled={wasAdded}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${wasAdded ? "bg-green-100 text-green-700" : "bg-[#7B5EA7] text-white active:bg-[#6A4F91]"}`}
                  >
                    {wasAdded ? <><Check className="h-3 w-3" /> Adicionado</> : <><Plus className="h-3 w-3" /> Adicionar</>}
                  </button>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">Nenhum resultado encontrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfirmRemoveModal({ cardName, onConfirm, onCancel }: { cardName: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 mx-6 w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-base font-bold text-card-foreground mb-2">Remover photocard?</h3>
        <p className="text-sm text-muted-foreground mb-5">
          {"Tem certeza que deseja remover "}<span className="font-semibold text-card-foreground">{cardName}</span>{" da sua colecao?"}
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground active:bg-muted/50">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-white active:opacity-80">
            Remover
          </button>
        </div>
      </div>
    </div>
  )
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-20 left-4 right-4 z-[70] flex items-center gap-3 rounded-2xl bg-[#2D1B3D] px-4 py-3 shadow-lg animate-in slide-in-from-bottom duration-300">
      <Check className="h-4.5 w-4.5 text-green-400 shrink-0" />
      <span className="flex-1 text-sm font-medium text-white">{message}</span>
      <button onClick={onClose} className="text-white/60 active:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// --- Main Component ---
export function CollectionPage() {
  const { data, isLoading, error, refresh } = useCatalog()
  const [ownedIds, setOwnedIds] = useState<string[]>([])
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filters, setFilters] = useState({ group: "", album: "", type: "", sort: "recent" })
  const [contextCard, setContextCard] = useState<Photocard | null>(null)
  const [detailCard, setDetailCard] = useState<Photocard | null>(null)
  const [confirmRemoveCard, setConfirmRemoveCard] = useState<Photocard | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const hasError = Boolean(error)

  const catalog = data?.photocards ?? []

  useEffect(() => {
    setOwnedIds(readStringArray(STORAGE_OWNED))
    setWishlistIds(readStringArray(STORAGE_WISHLIST))
  }, [])

  useEffect(() => {
    writeStringArray(STORAGE_OWNED, ownedIds)
  }, [ownedIds])

  useEffect(() => {
    writeStringArray(STORAGE_WISHLIST, wishlistIds)
  }, [wishlistIds])

  const groups = useMemo(() => [...new Set(catalog.map((c) => c.group))].sort(), [catalog])
  const albums = useMemo(() => [...new Set(catalog.map((c) => c.album))].sort(), [catalog])

  const cards = useMemo<Photocard[]>(() => {
    const ownedSet = new Set(ownedIds)
    const wishlistSet = new Set(wishlistIds)
    return catalog
      .filter((card) => ownedSet.has(card.id))
      .map((card) => ({ ...card, inWishlist: wishlistSet.has(card.id) }))
  }, [catalog, ownedIds, wishlistIds])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const activeFilterTags = useMemo(() => {
    const tags: { key: string; label: string }[] = []
    if (filters.group) tags.push({ key: "group", label: filters.group })
    if (filters.album) tags.push({ key: "album", label: filters.album })
    if (filters.type) tags.push({ key: "type", label: filters.type })
    return tags
  }, [filters])

  const filteredCards = useMemo(() => {
    let result = [...cards]
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (c) =>
          c.member.toLowerCase().includes(term) ||
          c.group.toLowerCase().includes(term) ||
          c.album.toLowerCase().includes(term)
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
  }, [cards, searchTerm, filters])

  const handleRemove = (card: Photocard) => {
    setContextCard(null)
    setDetailCard(null)
    setConfirmRemoveCard(card)
  }

  const confirmRemove = () => {
    if (confirmRemoveCard) {
      setOwnedIds((prev) => prev.filter((id) => id !== confirmRemoveCard.id))
      showToast(`${confirmRemoveCard.member} removido da colecao`)
      setConfirmRemoveCard(null)
    }
  }

  const toggleWishlist = (card: Photocard) => {
    setWishlistIds((prev) => (prev.includes(card.id) ? prev.filter((id) => id !== card.id) : [...prev, card.id]))
    setContextCard(null)
    showToast(card.inWishlist ? `${card.member} removido da wishlist` : `${card.member} adicionado a wishlist`)
  }

  if (isLoading) return <CollectionSkeleton />

  if (hasError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <RefreshCcw className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-base font-semibold text-foreground">Erro ao carregar</h3>
          <p className="text-sm text-muted-foreground px-8">Nao foi possivel carregar sua colecao.</p>
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

  if (cards.length === 0) return <EmptyState onExplore={() => setShowAddModal(true)} />

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Minha Colecao</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Organize e gerencie suas photocards</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground active:bg-muted/70"
              aria-label="Buscar"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setShowFilters(true)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors active:opacity-70 ${activeFilterTags.length > 0 ? "bg-[#7B5EA7] text-white" : "bg-muted text-muted-foreground"}`}
              aria-label="Filtros"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7B5EA7] text-white active:bg-[#6A4F91]"
              aria-label="Adicionar"
            >
              <Plus className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 animate-in slide-in-from-top-2 duration-200">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por membro, grupo ou album..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Active filter tags */}
        {activeFilterTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilterTags.map((tag) => (
              <button
                key={tag.key}
                onClick={() => setFilters((f) => ({ ...f, [tag.key]: "" }))}
                className="flex items-center gap-1 rounded-full bg-[#7B5EA7]/10 px-3 py-1 text-xs font-medium text-[#7B5EA7]"
              >
                {tag.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

        {/* Count */}
        <p className="text-xs font-medium text-muted-foreground">
          {"Total: "}{filteredCards.length}{" cards"}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredCards.map((card) => (
            <div key={card.id} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              <div className="relative aspect-[5/7] w-full">
                <Image src={card.image ?? "https://picsum.photos/seed/kpop-fallback/240/336"} alt={`${card.member} - ${card.group}`} fill className="object-cover" crossOrigin="anonymous" />
                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(card)}
                  className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
                  aria-label={card.inWishlist ? "Remover da wishlist" : "Adicionar a wishlist"}
                >
                  <Heart className={`h-3.5 w-3.5 ${card.inWishlist ? "fill-[#9B2D7B] text-[#9B2D7B]" : ""}`} />
                </button>
                {/* Context menu button */}
                <button
                  onClick={() => setContextCard(card)}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
                  aria-label="Mais opcoes"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
                {/* Type badge */}
                <div className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold backdrop-blur-sm ${card.type === "Regular" ? "bg-[#7B5EA7]/80 text-white" : "bg-[#9B2D7B]/80 text-white"}`}>
                  {card.type}
                </div>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5">
                <span className="text-xs font-bold text-card-foreground truncate">{card.member}</span>
                <span className="text-[10px] text-muted-foreground truncate">{card.group}</span>
                <span className="text-[10px] text-muted-foreground truncate">{card.album}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && cards.length > 0 && (
          <div className="flex flex-col items-center gap-2 py-12">
            <p className="text-sm text-muted-foreground">Nenhum resultado encontrado</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setFilters({ group: "", album: "", type: "", sort: "recent" })
              }}
              className="text-sm font-medium text-[#7B5EA7]"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {contextCard && (
        <CardContextMenu
          card={contextCard}
          onClose={() => setContextCard(null)}
          onViewDetails={() => {
            setDetailCard(contextCard)
            setContextCard(null)
          }}
          onRemove={() => handleRemove(contextCard)}
          onToggleWishlist={() => toggleWishlist(contextCard)}
        />
      )}
      {detailCard && (
        <PhotocardDetail
          card={detailCard}
          onClose={() => setDetailCard(null)}
          onRemove={() => handleRemove(detailCard)}
        />
      )}
      {confirmRemoveCard && (
        <ConfirmRemoveModal
          cardName={confirmRemoveCard.member}
          onConfirm={confirmRemove}
          onCancel={() => setConfirmRemoveCard(null)}
        />
      )}
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
      {showAddModal && (
        <AddPhotocardModal
          onClose={() => setShowAddModal(false)}
          onAdd={(card) => {
            setOwnedIds((prev) => (prev.includes(card.id) ? prev : [...prev, card.id]))
            showToast(`Photocard ${card.member} adicionada a colecao`)
          }}
          catalog={catalog}
          ownedIds={ownedIds}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
