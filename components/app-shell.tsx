"use client"

import { useState } from "react"
import { Menu, Bell } from "lucide-react"
import { KpopLogo } from "./kpop-logo"
import { SidebarMenu } from "./sidebar-menu"

const pageTitles: Record<string, string> = {
  home: "",
  collection: "Colecao",
  wishlist: "Wishlist",
  profile: "Perfil",
  settings: "Configuracoes",
  explore: "Explorar",
  notifications: "Notificacoes",
}

export function AppShell({
  children,
  activePage,
  onNavigate,
  onLogout,
  titleOverride,
  notificationsBadgeCount = 2,
}: {
  children: React.ReactNode
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
  titleOverride?: string
  notificationsBadgeCount?: number
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const headerTitle = titleOverride ?? pageTitles[activePage] ?? ""

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#7B5EA7] px-4 py-3 shadow-md">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white transition-colors active:bg-white/25"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {activePage === "home" && !titleOverride ? (
          <KpopLogo size="sm" />
        ) : (
          <h2 className="text-base font-bold text-white">{headerTitle}</h2>
        )}

        <button
          onClick={() => onNavigate("notifications")}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white transition-colors active:bg-white/25"
          aria-label="Notificacoes"
        >
          <Bell className="h-5 w-5" />
          {notificationsBadgeCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#9B2D7B] text-[9px] font-bold text-white">
              {notificationsBadgeCount}
            </span>
          )}
        </button>
      </header>

      {/* Sidebar */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={onLogout}
        activePage={activePage}
        onNavigate={onNavigate}
      />

      {/* Main content */}
      <main className="flex flex-1 flex-col gap-6 px-4 pt-5 pb-24">{children}</main>

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
        aria-label="Navegacao principal"
      >
        {[
          { id: "home", label: "Inicio", icon: <HomeIcon active={activePage === "home"} /> },
          { id: "collection", label: "Colecao", icon: <CollectionIcon active={activePage === "collection"} /> },
          { id: "wishlist", label: "Wishlist", icon: <WishlistIcon active={activePage === "wishlist"} /> },
          { id: "profile", label: "Perfil", icon: <ProfileIcon active={activePage === "profile"} /> },
        ].map((tab) => {
          const isActive = activePage === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
                isActive ? "text-[#7B5EA7]" : "text-muted-foreground"
              }`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.icon}
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "#7B5EA7" : "none"}
      stroke={active ? "#7B5EA7" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function CollectionIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "#7B5EA7" : "none"}
      stroke={active ? "#7B5EA7" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function WishlistIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "#7B5EA7" : "none"}
      stroke={active ? "#7B5EA7" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "#7B5EA7" : "none"}
      stroke={active ? "#7B5EA7" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

