export const STORAGE_OWNED = "kpop-hall-owned-ids"
export const STORAGE_WISHLIST = "kpop-hall-wishlist-ids"

export function readStringArray(key: string) {
  if (typeof window === "undefined") return []
  const value = localStorage.getItem(key)
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.map((v) => String(v)).filter((v) => v.length > 0)
  } catch {
    return []
  }
}

export function writeStringArray(key: string, values: string[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(values))
}

export function getInitials(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return "?"
  const parts = trimmed.split(/\\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
