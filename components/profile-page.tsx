"use client"

import { useMemo, useState, useEffect } from "react"
import { Edit3, Share2, LayoutGrid, Heart, ArrowRightLeft, X, Camera } from "lucide-react"
import { useMe } from "@/hooks/use-me"
import { readStringArray, STORAGE_OWNED, STORAGE_WISHLIST, getInitials } from "@/lib/storage"

// --- Types ---
interface UserProfile {
  name: string
  username: string
  email: string
  avatar: string
  role: "Admin" | "Collector" | "Trader"
  totalCards: number
  wishlistCount: number
  tradesCount: number
}

function RoleBadge({ role }: { role: string }) {
  const colorMap: Record<string, string> = {
    Admin: "bg-red-100 text-red-700",
    Collector: "bg-[#7B5EA7]/10 text-[#7B5EA7]",
    Trader: "bg-amber-100 text-amber-700",
  }
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${colorMap[role] || "bg-muted text-muted-foreground"}`}>
      {role}
    </span>
  )
}

function EditProfileModal({ profile, onClose, onSave }: { profile: UserProfile; onClose: () => void; onSave: (p: UserProfile) => void }) {
  const [form, setForm] = useState({
    name: profile.name,
    username: profile.username.replace("@", ""),
    email: profile.email,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "Nome obrigatorio"
    if (!form.username.trim()) errs.username = "Username obrigatorio"
    if (!form.email.includes("@")) errs.email = "Email invalido"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      onSave({
        ...profile,
        name: form.name,
        username: `@${form.username.replace("@", "")}`,
        email: form.email,
      })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-card-foreground">Editar Perfil</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-label="Fechar">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#7B5EA7] to-[#9B2D7B] text-2xl font-bold text-white">
              {profile.avatar}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#7B5EA7] text-white shadow-md" aria-label="Alterar foto">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-card-foreground">Nome</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={`rounded-xl border bg-muted px-3 py-2.5 text-sm text-foreground outline-none ${errors.name ? "border-destructive" : "border-transparent"}`}
            />
            {errors.name && <span className="text-[10px] text-destructive">{errors.name}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-card-foreground">Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              className={`rounded-xl border bg-muted px-3 py-2.5 text-sm text-foreground outline-none ${errors.username ? "border-destructive" : "border-transparent"}`}
            />
            {errors.username && <span className="text-[10px] text-destructive">{errors.username}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-card-foreground">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={`rounded-xl border bg-muted px-3 py-2.5 text-sm text-foreground outline-none ${errors.email ? "border-destructive" : "border-transparent"}`}
            />
            {errors.email && <span className="text-[10px] text-destructive">{errors.email}</span>}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-5 w-full rounded-xl bg-[#7B5EA7] py-3 text-sm font-bold text-white active:bg-[#6A4F91]"
        >
          Salvar alteracoes
        </button>
      </div>
    </div>
  )
}

// --- Main Component ---
export function ProfilePage() {
  const { me } = useMe()
  const [showEdit, setShowEdit] = useState(false)
  const [ownedCount, setOwnedCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    setOwnedCount(readStringArray(STORAGE_OWNED).length)
    setWishlistCount(readStringArray(STORAGE_WISHLIST).length)
  }, [])

  const profile = useMemo<UserProfile>(() => {
    const username = me?.username ? `@${me.username.replace("@", "")}` : "@usuario"
    const name = me?.username ? me.username : "Usuario"
    return {
      name,
      username,
      email: me?.email ?? "-",
      avatar: getInitials(name),
      role: (me?.role as UserProfile["role"]) ?? "Collector",
      totalCards: ownedCount,
      wishlistCount,
      tradesCount: 0,
    }
  }, [me, ownedCount, wishlistCount])

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-[#7B5EA7] to-[#9B2D7B] p-6 shadow-lg">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-3xl font-bold text-white">
            {profile.avatar}
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-lg font-bold text-white">{profile.name}</h2>
            <p className="text-sm text-white/70">{profile.username}</p>
            <p className="text-xs text-white/50">{profile.email}</p>
          </div>
          <RoleBadge role={profile.role} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
            <LayoutGrid className="h-5 w-5 text-[#7B5EA7]" />
            <span className="text-lg font-bold text-card-foreground">{profile.totalCards}</span>
            <span className="text-[10px] text-muted-foreground">Total de cards</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
            <Heart className="h-5 w-5 text-[#9B2D7B]" />
            <span className="text-lg font-bold text-card-foreground">{profile.wishlistCount}</span>
            <span className="text-[10px] text-muted-foreground">Wishlist</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
            <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-bold text-card-foreground">{profile.tradesCount}</span>
            <span className="text-[10px] text-muted-foreground">Trocas</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowEdit(true)}
            disabled
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-muted py-3 text-sm font-semibold text-muted-foreground opacity-60 cursor-not-allowed"
          >
            <Edit3 className="h-4 w-4" /> Editar perfil
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-muted-foreground opacity-60 cursor-not-allowed">
            <Share2 className="h-4 w-4" /> Compartilhar
          </button>
        </div>

        {/* Recent collection preview */}
        <div>
          <h3 className="text-base font-bold text-foreground mb-3">Vitrine Recente</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { img: "https://picsum.photos/seed/pf1/200/280", name: "Jungkook" },
              { img: "https://picsum.photos/seed/pf2/200/280", name: "Karina" },
              { img: "https://picsum.photos/seed/pf3/200/280", name: "Hyunjin" },
              { img: "https://picsum.photos/seed/pf4/200/280", name: "Wonyoung" },
              { img: "https://picsum.photos/seed/pf5/200/280", name: "Jennie" },
              { img: "https://picsum.photos/seed/pf6/200/280", name: "Felix" },
            ].map((card, i) => (
              <div key={i} className="relative aspect-[5/7] rounded-xl overflow-hidden border border-border">
                <img src={card.img} alt={card.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                  <span className="text-[10px] font-semibold text-white">{card.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSave={() => setShowEdit(false)}
        />
      )}
    </>
  )
}
