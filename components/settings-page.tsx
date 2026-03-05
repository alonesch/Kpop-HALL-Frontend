"use client"

import { useState } from "react"
import {
  Lock,
  LogOut,
  Trash2,
  Shield,
  Palette,
  ChevronRight,
  X,
  Eye,
  EyeOff,
} from "lucide-react"

function ConfirmModal({
  title,
  description,
  confirmLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: {
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 mx-6 w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-base font-bold text-card-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-5">{description}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground active:bg-muted/50">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white active:opacity-80 ${destructive ? "bg-destructive" : "bg-[#7B5EA7]"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSave = () => {
    const errs: Record<string, string> = {}
    if (!form.oldPassword) errs.oldPassword = "Senha atual obrigatoria"
    if (form.newPassword.length < 6) errs.newPassword = "Minimo de 6 caracteres"
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = "As senhas nao coincidem"
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-card-foreground">Alterar Senha</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-label="Fechar">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-card-foreground">Senha atual</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={form.oldPassword}
                onChange={(e) => setForm((f) => ({ ...f, oldPassword: e.target.value }))}
                className={`w-full rounded-xl border bg-muted px-3 py-2.5 pr-10 text-sm text-foreground outline-none ${errors.oldPassword ? "border-destructive" : "border-transparent"}`}
              />
              <button onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" type="button">
                {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.oldPassword && <span className="text-[10px] text-destructive">{errors.oldPassword}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-card-foreground">Nova senha</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                className={`w-full rounded-xl border bg-muted px-3 py-2.5 pr-10 text-sm text-foreground outline-none ${errors.newPassword ? "border-destructive" : "border-transparent"}`}
              />
              <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" type="button">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && <span className="text-[10px] text-destructive">{errors.newPassword}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-card-foreground">Confirmar nova senha</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              className={`w-full rounded-xl border bg-muted px-3 py-2.5 text-sm text-foreground outline-none ${errors.confirmPassword ? "border-destructive" : "border-transparent"}`}
            />
            {errors.confirmPassword && <span className="text-[10px] text-destructive">{errors.confirmPassword}</span>}
          </div>
        </div>
        <button
          onClick={handleSave}
          className="mt-5 w-full rounded-xl bg-[#7B5EA7] py-3 text-sm font-bold text-white active:bg-[#6A4F91]"
        >
          Salvar nova senha
        </button>
      </div>
    </div>
  )
}

interface SettingsPageProps {
  onLogout: () => void
}

export function SettingsPage({ onLogout }: SettingsPageProps) {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const settingSections = [
    {
      title: "Conta",
      items: [
        {
          icon: Lock,
          label: "Alterar senha",
          onClick: () => setShowChangePassword(true),
        },
        {
          icon: LogOut,
          label: "Sair da conta",
          onClick: () => setShowLogoutConfirm(true),
          variant: "default" as const,
        },
        {
          icon: Trash2,
          label: "Deletar conta",
          onClick: () => setShowDeleteConfirm(true),
          variant: "destructive" as const,
        },
      ],
    },
    {
      title: "Seguranca",
      items: [
        {
          icon: Shield,
          label: "Sessoes ativas",
          disabled: true,
          badge: "Em breve",
        },
        {
          icon: Shield,
          label: "Revogar tokens",
          disabled: true,
          badge: "Em breve",
        },
      ],
    },
    {
      title: "Aparencia",
      items: [
        {
          icon: Palette,
          label: "Tema",
          disabled: true,
          badge: "Em breve",
        },
      ],
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Configuracoes</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Gerencie sua conta e preferencias</p>
        </div>

        {settingSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
              {section.title}
            </h3>
            <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
              {section.items.map((item, i) => {
                const Icon = item.icon
                const isDestructive = "variant" in item && item.variant === "destructive"
                const isDisabled = "disabled" in item && item.disabled
                return (
                  <button
                    key={item.label}
                    onClick={"onClick" in item ? item.onClick : undefined}
                    disabled={isDisabled}
                    className={`flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                      i < section.items.length - 1 ? "border-b border-border" : ""
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : "active:bg-muted/50"}`}
                  >
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isDestructive ? "text-destructive" : "text-muted-foreground"}`} />
                    <span className={`flex-1 text-sm font-medium ${isDestructive ? "text-destructive" : "text-card-foreground"}`}>
                      {item.label}
                    </span>
                    {"badge" in item && item.badge && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.badge}
                      </span>
                    )}
                    {!isDisabled && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <p className="text-center text-[10px] text-muted-foreground pt-4 pb-2">
          {"Kpop! HALL v1.0.0"}
        </p>
      </div>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
      {showLogoutConfirm && (
        <ConfirmModal
          title="Sair da conta?"
          description="Voce sera desconectado e precisara fazer login novamente."
          confirmLabel="Sair"
          onConfirm={() => {
            setShowLogoutConfirm(false)
            onLogout()
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Deletar conta?"
          description="Esta acao e irreversivel. Todos os seus dados, colecoes e wishlists serao apagados permanentemente."
          confirmLabel="Deletar"
          destructive
          onConfirm={() => {
            setShowDeleteConfirm(false)
            onLogout()
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  )
}
