"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, X, Trash2, Plus, Search, Check } from "lucide-react"

interface WishlistCard {
  id: number
  member: string
  group: string
  album: string
  image: string
  priority: "Alta" | "Media" | "Baixa"
}

const mockWishlist: WishlistCard[] = [
  { id: 1, member: "Jimin", group: "BTS", album: "FACE", image: "https://picsum.photos/seed/jimin-face/200/280", priority: "Alta" },
  { id: 2, member: "Lisa", group: "BLACKPINK", album: "LALISA", image: "https://picsum.photos/seed/lisa-ll/200/280", priority: "Alta" },
  { id: 3, member: "Ningning", group: "aespa", album: "MY WORLD", image: "https://picsum.photos/seed/nn-mw/200/280", priority: "Media" },
  { id: 4, member: "Bangchan", group: "Stray Kids", album: "MAXIDENT", image: "https://picsum.photos/seed/bc-max/200/280", priority: "Baixa" },
  { id: 5, member: "Kazuha", group: "LE SSERAFIM", album: "UNFORGIVEN", image: "https://picsum.photos/seed/kz-unfg/200/280", priority: "Media" },
]

const priorityColors: Record<string, string> = {
  Alta: "bg-red-100 text-red-700",
  Media: "bg-amber-100 text-amber-700",
  Baixa: "bg-green-100 text-green-700",
}

export function WishlistPage() {
  const [cards, setCards] = useState(mockWishlist)
  const [confirmRemove, setConfirmRemove] = useState<WishlistCard | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleRemove = () => {
    if (confirmRemove) {
      setCards((prev) => prev.filter((c) => c.id !== confirmRemove.id))
      showToast(`${confirmRemove.member} removido da wishlist`)
      setConfirmRemove(null)
    }
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
                  <Image src={card.image} alt={card.member} fill className="object-cover" crossOrigin="anonymous" />
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
