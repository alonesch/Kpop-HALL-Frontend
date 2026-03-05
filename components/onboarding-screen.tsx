"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { KpopBackground } from "./kpop-background"
import { KpopLogo } from "./kpop-logo"

interface OnboardingSlide {
  image: string
  title: string
  description: string
}

const slides: OnboardingSlide[] = [
  {
    image: "/images/onboarding-1.jpg",
    title: "Sua Vitrine de Photocards",
    description:
      "Organize sua cole\u00e7\u00e3o de photocards em uma vitrine bonita e exiba para outros collectors.",
  },
  {
    image: "/images/onboarding-2.jpg",
    title: "Wishlist e Cole\u00e7\u00f5es",
    description:
      "Crie wishlists dos photocards que voc\u00ea deseja e organize suas cole\u00e7\u00f5es por grupo, era ou bias.",
  },
  {
    image: "/images/onboarding-3.jpg",
    title: "Personalize seu Perfil",
    description:
      "Decore sua vitrine do seu jeito e mostre seu estilo para a comunidade de collectors.",
  },
]

interface OnboardingScreenProps {
  onComplete: () => void
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const goToNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1)
    } else {
      onComplete()
    }
  }, [currentSlide, onComplete])

  const goToPrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
    }
  }, [currentSlide])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext()
      else goToPrev()
    }
    setTouchStart(null)
  }

  const slide = slides[currentSlide]
  const isLast = currentSlide === slides.length - 1

  return (
    <div
      className="relative flex min-h-dvh flex-col items-center justify-between overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <KpopBackground />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-6 pt-12 pb-8">
        {/* Logo */}
        <KpopLogo className="mb-8" />

        {/* Image area */}
        <div className="relative mb-8 flex w-full max-w-[280px] items-center justify-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-2 border-card/20 bg-card/10 shadow-xl backdrop-blur-sm">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Text content */}
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="mb-3 text-2xl font-bold text-card text-balance">
            {slide.title}
          </h2>
          <p className="max-w-[300px] text-sm leading-relaxed text-card/80 text-pretty">
            {slide.description}
          </p>
        </div>

        {/* Dot indicators */}
        <div className="mb-8 flex items-center gap-2.5" role="tablist" aria-label="Telas de boas-vindas">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              role="tab"
              aria-selected={i === currentSlide}
              aria-label={`Ir para tela ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "h-2.5 w-8 bg-card"
                  : "h-2.5 w-2.5 bg-card/40"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex w-full max-w-[320px] flex-col items-center gap-3">
          <button
            onClick={goToNext}
            className="w-full rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-transform active:scale-[0.97]"
          >
            {isLast ? "Vamos Comecar!" : "Proximo"}
          </button>
          {!isLast && (
            <button
              onClick={onComplete}
              className="text-sm font-medium text-card/70 underline underline-offset-2 transition-colors hover:text-card"
            >
              Pular
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
