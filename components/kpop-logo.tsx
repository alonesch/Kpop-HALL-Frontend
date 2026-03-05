interface KpopLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  dark?: boolean
}

export function KpopLogo({ className = "", size = "md", dark = false }: KpopLogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
  }

  const hallSizeClasses = {
    sm: "text-[0.5rem] tracking-[0.35em]",
    md: "text-[0.65rem] tracking-[0.4em]",
    lg: "text-xs tracking-[0.45em]",
  }

  const textColor = dark ? "text-foreground" : "text-white"

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span
        className={`font-[family-name:var(--font-brush)] ${sizeClasses[size]} leading-none ${textColor} drop-shadow-lg`}
        style={{ transform: "rotate(-2deg)" }}
      >
        {"Kpop!"}
      </span>
      <span
        className={`${hallSizeClasses[size]} font-bold ${textColor} opacity-90 mt-0.5`}
        style={{ letterSpacing: "0.35em" }}
      >
        HALL
      </span>
    </div>
  )
}
