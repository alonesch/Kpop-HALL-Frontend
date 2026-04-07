"use client"

import Image from "next/image"
import { TrendingUp } from "lucide-react"
import { useCatalog } from "@/hooks/use-catalog"

export function TrendingPhotocards() {
  const { data, isLoading } = useCatalog()
  const cards = data?.photocards.slice(0, 5) ?? []

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-[#7B5EA7]" />
          <h2 className="text-base font-bold text-card-foreground">Photocards em Alta</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-[#7B5EA7]" />
        <h2 className="text-base font-bold text-card-foreground">Photocards em Alta</h2>
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 scrollbar-none lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex w-32 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:w-auto lg:min-w-0"
          >
            <div className="relative h-44 w-full">
              <Image
                src={card.image}
                alt={`${card.member} - ${card.group}`}
                fill
                className="object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex flex-col gap-0.5 p-2.5">
              <span className="text-xs font-bold text-card-foreground truncate">{card.member}</span>
              <span className="text-[10px] text-muted-foreground truncate">
                {card.group} | {card.album}
              </span>
              <span className={`mt-1 inline-flex self-start rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                card.type === "Regular" ? "bg-[#7B5EA7]/10 text-[#7B5EA7]" : "bg-[#9B2D7B]/10 text-[#9B2D7B]"
              }`}>
                {card.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
