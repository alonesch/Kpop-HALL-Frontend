"use client"

import { X, LayoutGrid, Heart, User, Settings, LogOut, Home, Bell, Search } from "lucide-react"
import { KpopLogo } from "./kpop-logo"
import { useMe } from "@/hooks/use-me"
import { getInitials } from "@/lib/storage"

interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  activePage: string
  onNavigate: (page: string) => void
}

export function SidebarMenu({ isOpen, onClose, onLogout, activePage, onNavigate }: SidebarMenuProps) {
  const { me } = useMe()
  const name = me?.username ?? "Usuario"
  const avatar = getInitials(name)
  const username = me?.username ? `@${me.username.replace("@", "")}` : "@usuario"

  const menuItems = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "collection", label: "Minha Colecao", icon: LayoutGrid },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "explore", label: "Explorar", icon: Search },
    { id: "notifications", label: "Notificacoes", icon: Bell },
    { id: "profile", label: "Meu Perfil", icon: User },
    { id: "settings", label: "Configuracoes", icon: Settings },
  ]

  return (
    <div className="max-lg:contents lg:flex lg:h-dvh lg:min-h-0 lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-border">
      {/* Overlay — mobile only */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar: drawer on mobile, docked rail on lg+ */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-out lg:relative lg:left-auto lg:top-auto lg:z-auto lg:h-auto lg:min-h-0 lg:w-full lg:flex-1 lg:translate-x-0 lg:border-r-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu principal"
        role="navigation"
      >
        {/* Header — mesma altura do header da área principal no desktop (h-14) */}
        <div className="flex shrink-0 items-center justify-between bg-[#7B5EA7] px-5 pt-12 pb-6 lg:h-14 lg:py-0 lg:pt-0 lg:pb-0">
          <KpopLogo size="sm" />
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors active:bg-white/30 lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7B5EA7] text-white font-semibold text-sm">
            {avatar}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-card-foreground">{name}</span>
            <span className="text-xs text-muted-foreground">{username}</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  onClose()
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#7B5EA7]/10 text-[#7B5EA7]"
                    : "text-card-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-[#7B5EA7]" : "text-muted-foreground"}`} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-3">
          <button
            onClick={() => {
              onLogout()
              onClose()
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            Sair da conta
          </button>
        </div>
      </aside>
    </div>
  )
}
