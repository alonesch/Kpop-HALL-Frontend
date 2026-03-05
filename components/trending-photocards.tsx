"use client"

import Image from "next/image"
import { Heart, TrendingUp } from "lucide-react"

const trendingCards = [
  {
    id: 1,
    member: "Jungkook",
    group: "BTS",
    era: "Golden",
    image: "https://picsum.photos/seed/jk-golden/200/280",
    likes: 2340,
  },
  {
    id: 2,
    member: "Karina",
    group: "aespa",
    era: "Whiplash",
    image: "https://picsum.photos/seed/karina-wh/200/280",
    likes: 1890,
  },
  {
    id: 3,
    member: "Hyunjin",
    group: "Stray Kids",
    era: "ATE",
    image: "https://picsum.photos/seed/hjn-ate/200/280",
    likes: 1650,
  },
  {
    id: 4,
    member: "Wonyoung",
    group: "IVE",
    era: "SWITCH",
    image: "https://picsum.photos/seed/wy-switch/200/280",
    likes: 1520,
  },
  {
    id: 5,
    member: "Jennie",
    group: "BLACKPINK",
    era: "SOLO",
    image: "https://picsum.photos/seed/jennie-bp/200/280",
    likes: 1410,
  },
]

export function TrendingPhotocards() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-[#7B5EA7]" />
        <h2 className="text-base font-bold text-card-foreground">Photocards em Alta</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        {trendingCards.map((card) => (
          <div
            key={card.id}
            className="flex shrink-0 w-32 flex-col rounded-2xl bg-card border border-border overflow-hidden shadow-sm"
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
                {card.group} | {card.era}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <Heart className="h-3 w-3 text-[#9B2D7B] fill-[#9B2D7B]" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {card.likes.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
