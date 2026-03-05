"use client"

import { useEffect, useState } from "react"
import { LayoutGrid, Heart } from "lucide-react"
import { AppShell } from "./app-shell"
import { NewsSection } from "./news-section"
import { FriendsActivity } from "./friends-activity"
import { TrendingPhotocards } from "./trending-photocards"
import { CollectionPage } from "./collection-page"
import { WishlistPage } from "./wishlist-page"
import { ProfilePage } from "./profile-page"
import { SettingsPage } from "./settings-page"
import { ExplorePage } from "./explore-page"

interface HomeScreenProps {
  onLogout: () => void
  initialPage?: string
}

function HomeContent() {
  return (
    <>
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#7B5EA7] to-[#9B2D7B] p-4 shadow-lg">
        <p className="text-xs text-white/70 mb-0.5">Ola, Collector!</p>
        <h1 className="text-lg font-bold text-white mb-2 text-balance">
          Sua vitrine esta esperando por novos photocards
        </h1>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5">
            <LayoutGrid className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-medium text-white">42 cards</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5">
            <Heart className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-medium text-white">15 wishes</span>
          </div>
        </div>
      </div>

      {/* Trending Photocards */}
      <TrendingPhotocards />

      {/* News */}
      <NewsSection />

      {/* Friends Activity */}
      <FriendsActivity />
    </>
  )
}

export function HomeScreen({ onLogout, initialPage }: HomeScreenProps) {
  const [activePage, setActivePage] = useState("home")

  useEffect(() => {
    if (initialPage) setActivePage(initialPage)
  }, [initialPage])

  const renderContent = () => {
    switch (activePage) {
      case "collection":
        return <CollectionPage />
      case "wishlist":
        return <WishlistPage />
      case "profile":
        return <ProfilePage />
      case "settings":
        return <SettingsPage onLogout={onLogout} />
      case "explore":
        return <ExplorePage />
      case "notifications":
        return (
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">Notificacoes</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Fique por dentro de tudo</p>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { title: "Nova troca disponivel!", desc: "Mina quer trocar um photocard com voce", time: "2 min", unread: true },
                { title: "Colecao atualizada", desc: "Voce adicionou 3 novos photocards", time: "1h", unread: true },
                { title: "Novidade no app", desc: "Agora voce pode decorar sua vitrine", time: "3h", unread: false },
                { title: "Bem-vindo ao Kpop! HALL", desc: "Comece montando sua colecao", time: "1 dia", unread: false },
              ].map((notif, i) => (
                <div key={i} className={`flex gap-3 rounded-2xl border border-border p-4 ${notif.unread ? "bg-[#7B5EA7]/5" : "bg-card"}`}>
                  {notif.unread && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#7B5EA7]" />}
                  <div className={`flex flex-1 flex-col gap-0.5 ${!notif.unread ? "pl-5" : ""}`}>
                    <span className="text-sm font-semibold text-card-foreground">{notif.title}</span>
                    <span className="text-xs text-muted-foreground">{notif.desc}</span>
                    <span className="text-[10px] text-muted-foreground mt-1">{"ha "}{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return <HomeContent />
    }
  }

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage} onLogout={onLogout}>
      {renderContent()}
    </AppShell>
  )
}
