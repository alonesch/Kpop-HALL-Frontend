const STORAGE_TOKEN = "kpop-hall-token"
const STORAGE_REFRESH = "kpop-hall-refresh"
const STORAGE_LOGGED_IN = "kpop-hall-logged-in"

export function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_TOKEN)
}

export function setToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_TOKEN, token)
  localStorage.setItem(STORAGE_LOGGED_IN, "true")
}

export function setRefreshToken(refreshToken: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_REFRESH, refreshToken)
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_REFRESH)
}

export function clearSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_TOKEN)
  localStorage.removeItem(STORAGE_REFRESH)
  localStorage.removeItem(STORAGE_LOGGED_IN)
}
