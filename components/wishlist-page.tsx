"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Heart, X, Trash2, Plus, Check } from "lucide-react"
import { useCatalog } from "@/hooks/use-catalog"
import { CatalogPhotocard } from "@/lib/catalog"
import { readStringArray, writeStringArray, STORAGE_WISHLIST } from "@/lib/storage"
import { Skeleton } from "@/components/ui/skeleton"

interface WishlistCard extends CatalogPhotocard {
  priority: "Alta" | "Media" | "Baixa"
}

const priorityColors: Record<string, string> = {
  Alta: "bg-red-100 text-red-700",
  Media: "bg-amber-100 text-amber-700",
  Baixa: "bg-green-100 text-green-700",
}

function SkeletonHeader() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-36" />
    </div>
  )
}

export function WishlistPage() {
  const { data, isLoading, error, refresh } = useCatalog()
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [confirmRemove, setConfirmRemove] = useState<WishlistCard | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const hasError = Boolean(error)

  const catalog = data?.photocards ?? []

  useEffect(() => {
    setWishlistIds(readStringArray(STORAGE_WISHLIST))
  }, [])

  useEffect(() => {
    writeStringArray(STORAGE_WISHLIST, wishlistIds)
  }, [wishlistIds])

  const cards = useMemo<WishlistCard[]>(() => {
    const wishlistSet = new Set(wishlistIds)
    return catalog
      .filter((card) => wishlistSet.has(card.id))
      .map((card) => ({
        ...card,
        priority: "Media",
      }))
  }, [catalog, wishlistIds])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleRemove = () => {
    if (confirmRemove) {
      setWishlistIds((prev) => prev.filter((id) => id !== confirmRemove.id))
      showToast(`${confirmRemove.member} removido da wishlist`)
      setConfirmRemove(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <SkeletonHeader />
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Heart className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-base font-semibold text-foreground">Erro ao carregar</h3>
          <p className="text-sm text-muted-foreground px-8">Nao foi possivel carregar a wishlist.</p>
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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Minha Wishlist</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Photocards que voce esta procurando</p>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7B5EA7] text-white active:bg-[#6A4F91]" aria-label="Adicionar">
            <Plus className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Count */}
        <p className="text-xs font-medium text-muted-foreground">
          {"Total: "}{cards.length}{" photocards"}
        </p>

        {cards.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-base font-semibold text-foreground">Sua wishlist esta vazia</h3>
              <p className="text-sm text-muted-foreground">Adicione photocards que voce deseja</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cards.map((card) => (
              <div key={card.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
                <div className="relative h-20 w-14 shrink-0 rounded-xl overflow-hidden">
                  <Image src={card.image ?? "https://picsum.photos/seed/kpop-fallback/240/336"} alt={card.member} fill className="object-cover" crossOrigin="anonymous" />
                </div>
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <span className="text-sm font-bold text-card-foreground truncate">{card.member}</span>
                  <span className="text-xs text-muted-foreground truncate">{card.group} | {card.album}</span>
                  <span className={`self-start rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityColors[card.priority]}`}>
                    {card.priority}
                  </span>
                </div>
                <button
                  onClick={() => setConfirmRemove(card)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground active:bg-destructive/10 active:text-destructive"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm remove */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmRemove(null)} />
          <div className="relative z-10 mx-6 w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-card-foreground mb-2">Remover da wishlist?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {"Remover "}<span className="font-semibold text-card-foreground">{confirmRemove.member}</span>{" da sua wishlist?"}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmRemove(null)} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground active:bg-muted/50">
                Cancelar
              </button>
              <button onClick={handleRemove} className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-white active:opacity-80">
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-4 right-4 z-[70] flex items-center gap-3 rounded-2xl bg-[#2D1B3D] px-4 py-3 shadow-lg animate-in slide-in-from-bottom duration-300">
          <Check className="h-4.5 w-4.5 text-green-400 shrink-0" />
          <span className="flex-1 text-sm font-medium text-white">{toast}</span>
          <button onClick={() => setToast(null)} className="text-white/60 active:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  )
}
