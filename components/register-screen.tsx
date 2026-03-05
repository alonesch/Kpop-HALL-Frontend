"use client"

import { useState } from "react"
import { Mail, Lock, User, AtSign } from "lucide-react"
import { KpopBackground } from "./kpop-background"
import { KpopLogo } from "./kpop-logo"

interface RegisterScreenProps {
  onRegisterSuccess: () => void
  onBackToLogin?: () => void
}

interface FormErrors {
  nome?: string
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export function RegisterScreen({ onRegisterSuccess, onBackToLogin }: RegisterScreenProps) {
  const [nome, setNome] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!nome.trim()) nextErrors.nome = "Nome obrigatorio"
    if (!username.trim()) nextErrors.username = "Username obrigatorio"
    if (!email.trim()) {
      nextErrors.email = "Email obrigatorio"
    } else if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) {
      nextErrors.email = "Formato de email invalido"
    }
    if (!password) {
      nextErrors.password = "Senha obrigatoria"
    } else if (password.length < 6) {
      nextErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirmacao obrigatoria"
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "As senhas nao coincidem"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setErrors((prev) => ({ ...prev, general: undefined }))

    try {
      // Futuro: integrar com API real
      // Simula um pequeno atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Exemplo de estado de erro de credenciais ja existentes
      if (username.toLowerCase() === "kpopcollector" || email.toLowerCase() === "collector@kpophall.com") {
        setErrors({
          general: "Ja existe uma conta com esses dados. Tente outro email ou username.",
        })
        return
      }

      onRegisterSuccess()
    } catch {
      setErrors({
        general: "Nao foi possivel criar sua conta. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center overflow-hidden">
      <KpopBackground />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-6 pt-12 pb-8">
        <KpopLogo className="mb-4" />
        <h1 className="mb-8 text-xl font-semibold text-card text-balance">
          Crie sua conta no Kpop! HALL
        </h1>

        <div className="w-full max-w-[380px] rounded-3xl bg-card p-6 shadow-xl">
          <h2 className="mb-4 text-center text-lg font-bold text-primary">
            Comece sua colecao
          </h2>
          <p className="mb-6 text-center text-xs text-muted-foreground">
            Preencha os campos abaixo para criar seu perfil de colecionador.
          </p>

          {errors.general && (
            <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Nome */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nome" className="text-xs font-medium text-card-foreground">
                Nome
              </label>
              <div className={`flex items-center gap-2 rounded-xl border bg-muted/50 px-3 py-2.5 ${errors.nome ? "border-destructive" : "border-border"}`}>
                <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  id="nome"
                  type="text"
                  placeholder="Como gostaria de ser chamado"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              {errors.nome && (
                <span className="text-[10px] text-destructive">{errors.nome}</span>
              )}
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-medium text-card-foreground">
                Username
              </label>
              <div className={`flex items-center gap-2 rounded-xl border bg-muted/50 px-3 py-2.5 ${errors.username ? "border-destructive" : "border-border"}`}>
                <AtSign className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  placeholder="seu.usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              {errors.username && (
                <span className="text-[10px] text-destructive">{errors.username}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-card-foreground">
                Email
              </label>
              <div className={`flex items-center gap-2 rounded-xl border bg-muted/50 px-3 py-2.5 ${errors.email ? "border-destructive" : "border-border"}`}>
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              {errors.email && (
                <span className="text-[10px] text-destructive">{errors.email}</span>
              )}
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium text-card-foreground">
                Senha
              </label>
              <div className={`flex items-center gap-2 rounded-xl border bg-muted/50 px-3 py-2.5 ${errors.password ? "border-destructive" : "border-border"}`}>
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  placeholder="Minimo de 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              {errors.password && (
                <span className="text-[10px] text-destructive">{errors.password}</span>
              )}
            </div>

            {/* Confirmar senha */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-medium text-card-foreground">
                Confirmar senha
              </label>
              <div className={`flex items-center gap-2 rounded-xl border bg-muted/50 px-3 py-2.5 ${errors.confirmPassword ? "border-destructive" : "border-border"}`}>
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita a sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-[10px] text-destructive">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-primary py-3 text-base font-semibold text-primary-foreground shadow-lg transition-transform active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          {/* Social login placeholder */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou cadastre-se com</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-sm">
              <span className="text-[10px] text-muted-foreground">G</span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <span className="text-[10px] font-semibold"></span>
            </div>
          </div>

          {/* Voltar para login */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ja tem conta?{" "}
            <button
              type="button"
              onClick={onBackToLogin}
              className="font-semibold text-primary underline underline-offset-2"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

