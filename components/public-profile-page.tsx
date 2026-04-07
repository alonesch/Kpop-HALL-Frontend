"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { LayoutGrid, Heart, ArrowRightLeft, UserX } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMe } from "@/hooks/use-me"
import { useCatalog } from "@/hooks/use-catalog"
import { readStringArray, STORAGE_OWNED, STORAGE_WISHLIST, getInitials } from "@/lib/storage"

type PhotocardType = "Regular" | "Irregular"

interface PublicPhotocard {
  id: number
  member: string
  group: string
  album: string
  type: PhotocardType
  image: string
}

interface PublicUserProfile {
  name: string
  username: string
  avatar: string
  role: "Admin" | "Collector" | "Trader"
  wishlistPublic: boolean
  collection: PublicPhotocard[]
  wishlist: PublicPhotocard[]
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

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-gradient-to-br from-[#7B5EA7] to-[#9B2D7B] p-6 shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-24 w-24 rounded-full bg-white/20" />
          <Skeleton className="h-4 w-40 bg-white/20" />
          <Skeleton className="h-3 w-28 bg-white/15" />
          <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
      <Skeleton className="h-10 w-48 rounded-lg" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[5/7] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

function EmptyGrid({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-14">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <LayoutGrid className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground px-8">{description}</p>
      </div>
    </div>
  )
}

function Grid({ cards }: { cards: PublicPhotocard[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card) => (
        <div key={card.id} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md">
          <div className="relative aspect-[5/7] w-full">
            <Image src={card.image} alt={`${card.member} - ${card.group}`} fill className="object-cover" crossOrigin="anonymous" />
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
  )
}

export function PublicProfilePage({ username }: { username: string }) {
  const { me } = useMe()
  const { data, isLoading: isCatalogLoading } = useCatalog()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<PublicUserProfile | null>(null)

  const normalized = useMemo(() => username.replace("@", "").trim().toLowerCase(), [username])

  useEffect(() => {
    setIsLoading(true)
    const ownedIds = readStringArray(STORAGE_OWNED)
    const wishlistIds = readStringArray(STORAGE_WISHLIST)
    const catalog = data?.photocards ?? []

    const matchesSelf = me?.username?.replace("@", "").toLowerCase() === normalized
    if (!matchesSelf || !me) {
      setUser(null)
      setIsLoading(false)
      return
    }

    const collection = catalog.filter((card) => ownedIds.includes(card.id))
    const wishlist = catalog.filter((card) => wishlistIds.includes(card.id))

    setUser({
      name: me.username,
      username: me.username,
      avatar: getInitials(me.username),
      role: (me.role as PublicUserProfile["role"]) ?? "Collector",
      wishlistPublic: true,
      collection,
      wishlist,
    })
    setIsLoading(false)
  }, [normalized, me, data])

  if (isLoading || isCatalogLoading) return <ProfileSkeleton />

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <UserX className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-base font-semibold text-foreground">Usuario nao encontrado</h3>
          <p className="text-sm text-muted-foreground px-8">Nao encontramos esse perfil publico.</p>
        </div>
      </div>
    )
  }

  const totalCards = user.collection.length
  const wishlistCount = user.wishlistPublic ? user.wishlist.length : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-[#7B5EA7] to-[#9B2D7B] p-6 shadow-lg">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-3xl font-bold text-white">
          {user.avatar}
        </div>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-lg font-bold text-white">{user.name}</h2>
          <p className="text-sm text-white/70">@{user.username}</p>
        </div>
        <RoleBadge role={user.role} />
      </div>

      {/* Stats */}
      <div className={`grid gap-3 ${user.wishlistPublic ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
          <LayoutGrid className="h-5 w-5 text-[#7B5EA7]" />
          <span className="text-lg font-bold text-card-foreground">{totalCards}</span>
          <span className="text-[10px] text-muted-foreground">Total de cards</span>
        </div>
        {user.wishlistPublic && (
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
            <Heart className="h-5 w-5 text-[#9B2D7B]" />
            <span className="text-lg font-bold text-card-foreground">{wishlistCount}</span>
            <span className="text-[10px] text-muted-foreground">Wishlist</span>
          </div>
        )}
      </div>

      {/* Action */}
      <button
        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-muted-foreground opacity-60 cursor-not-allowed"
        aria-disabled="true"
      >
        <ArrowRightLeft className="h-4 w-4" /> Solicitar troca
      </button>

      {/* Tabs */}
      <Tabs defaultValue="collection" className="flex flex-col gap-4">
        <TabsList className="w-full">
          <TabsTrigger value="collection" className="w-full">
            Colecao
          </TabsTrigger>
          {user.wishlistPublic && (
            <TabsTrigger value="wishlist" className="w-full">
              Wishlist
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="collection">
          {user.collection.length === 0 ? (
            <EmptyGrid title="Colecao vazia" description="Esse usuario ainda nao adicionou nenhuma photocard." />
          ) : (
            <Grid cards={user.collection} />
          )}
        </TabsContent>

        {user.wishlistPublic && (
          <TabsContent value="wishlist">
            {user.wishlist.length === 0 ? (
              <EmptyGrid title="Wishlist vazia" description="Nenhuma photocard na wishlist por enquanto." />
            ) : (
              <Grid cards={user.wishlist} />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

