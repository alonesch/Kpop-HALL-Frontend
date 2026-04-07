"use client"

import { useState } from "react"
import { X, ChevronRight, Clock } from "lucide-react"
import Image from "next/image"

interface NewsItem {
  id: number
  title: string
  summary: string
  image: string
  date: string
  source: string
}

const allNews: NewsItem[] = [
  {
    id: 1,
    title: "BLACKPINK confirma comeback para 2026",
    summary: "O grupo mais esperado do K-pop anuncia retorno com album completo e turne mundial.",
    image: "https://picsum.photos/seed/bp2026/400/250",
    date: "25 Fev 2026",
    source: "Soompi",
  },
  {
    id: 2,
    title: "Stray Kids bate recorde de vendas com novo album",
    summary: "O grupo ultrapassa 5 milhoes de copias vendidas na primeira semana de lancamento.",
    image: "https://picsum.photos/seed/skz2026/400/250",
    date: "24 Fev 2026",
    source: "AllKPop",
  },
  {
    id: 3,
    title: "NewJeans anuncia colaboracao especial com marca de luxo",
    summary: "Parceria inedita com grife francesa traz colecao de photocards exclusivos.",
    image: "https://picsum.photos/seed/nj2026/400/250",
    date: "23 Fev 2026",
    source: "Koreaboo",
  },
  {
    id: 4,
    title: "BTS: Jin lanca primeiro album solo completo",
    summary: "Apos retorno do servico militar, Jin surpreende fas com producao incrivel.",
    image: "https://picsum.photos/seed/bts2026/400/250",
    date: "22 Fev 2026",
    source: "Soompi",
  },
  {
    id: 5,
    title: "aespa revela concept do novo comeback",
    summary: "MY do mundo inteiro reage ao concept futurista do proximo lancamento.",
    image: "https://picsum.photos/seed/aespa26/400/250",
    date: "21 Fev 2026",
    source: "AllKPop",
  },
  {
    id: 6,
    title: "SEVENTEEN abre pre-venda de photobook especial",
    summary: "Edicao limitada com photocards holograficos esgota em minutos.",
    image: "https://picsum.photos/seed/svt2026/400/250",
    date: "20 Fev 2026",
    source: "Koreaboo",
  },
  {
    id: 7,
    title: "LE SSERAFIM conquista #1 no Billboard Global",
    summary: "Grupo de 5a geracao faz historia com single digital.",
    image: "https://picsum.photos/seed/lsfm26/400/250",
    date: "19 Fev 2026",
    source: "Soompi",
  },
  {
    id: 8,
    title: "IVE faz show lotado no Brasil",
    summary: "Grupo coreano esgota ingressos de show em Sao Paulo em tempo recorde.",
    image: "https://picsum.photos/seed/ive2026/400/250",
    date: "18 Fev 2026",
    source: "AllKPop",
  },
  {
    id: 9,
    title: "ATEEZ anuncia residencia em Las Vegas",
    summary: "Primeira residencia de um grupo K-pop em Las Vegas inclui 10 shows.",
    image: "https://picsum.photos/seed/atz2026/400/250",
    date: "17 Fev 2026",
    source: "Koreaboo",
  },
  {
    id: 10,
    title: "TXT revela teaser misterioso para novo era",
    summary: "MOAs especulam sobre conceito apos imagens enigmaticas nas redes sociais.",
    image: "https://picsum.photos/seed/txt2026/400/250",
    date: "16 Fev 2026",
    source: "Soompi",
  },
]

function NewsCard({ item, compact = false }: { item: NewsItem; compact?: boolean }) {
  return (
    <div
      className={`flex overflow-hidden rounded-2xl border border-border bg-card ${
        compact ? "gap-3 lg:flex-col lg:gap-0" : "flex-col gap-2"
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-2xl ${
          compact ? "h-20 w-20 lg:h-36 lg:w-full lg:rounded-b-none lg:rounded-t-2xl" : "h-36 w-full"
        }`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          crossOrigin="anonymous"
        />
      </div>
      <div
        className={`flex flex-col gap-1 ${compact ? "py-2 pr-3 lg:p-3" : "px-3 pb-3"}`}
      >
        <h4
          className={`line-clamp-2 font-semibold leading-snug text-card-foreground ${
            compact ? "text-xs lg:text-sm" : "text-sm line-clamp-2"
          }`}
        >
          {item.title}
        </h4>
        {!compact ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.summary}</p>
        ) : (
          <p className="hidden line-clamp-2 text-xs leading-relaxed text-muted-foreground lg:block">
            {item.summary}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-auto">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">{item.date}</span>
          <span className="text-[10px] text-muted-foreground">{"  "}|{"  "}{item.source}</span>
        </div>
      </div>
    </div>
  )
}

export function NewsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10)

  const previewNews = allNews.slice(0, 3)
  const modalNews = allNews.slice(0, visibleCount)

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setVisibleCount(10)
  }

  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-card-foreground">Novidades</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-0.5 text-xs font-medium text-[#7B5EA7] active:opacity-70"
          >
            Ver todas
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-4">
          {previewNews.map((item) => (
            <NewsCard key={item.id} item={item} compact />
          ))}
        </div>
      </section>

      {/* News Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-6">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
            aria-hidden="true"
          />
          <div className="relative z-10 flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-3xl bg-background shadow-2xl animate-in slide-in-from-bottom duration-300 lg:max-h-[min(90dvh,44rem)] lg:rounded-3xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-lg font-bold text-foreground">Novidades K-pop</h3>
              <button
                onClick={handleCloseModal}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors active:bg-muted/70"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-4">
                {modalNews.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
