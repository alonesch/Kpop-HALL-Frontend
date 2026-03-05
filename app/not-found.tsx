"use client"

import Link from "next/link"
import { Compass } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Compass className="h-9 w-9 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground">Pagina nao encontrada</h1>
            <p className="text-sm text-muted-foreground">
              A rota que voce tentou acessar nao existe.
            </p>
          </div>

          <Link
            href="/"
            className="mt-2 w-full rounded-full bg-[#7B5EA7] py-3 text-center text-base font-semibold text-white shadow-lg transition-transform active:scale-[0.97]"
          >
            Voltar para o inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

