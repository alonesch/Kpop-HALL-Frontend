import { getToken, getRefreshToken, setRefreshToken } from "./auth"

// const DEFAULT_BASE_URL = "http://localhost:5155"
const DEFAULT_BASE_URL = "https://kpop-hall-api-672938213176.us-west1.run.app"
const API_PREFIX = "/api/v1"

function getBaseUrl() {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL
  }
  return DEFAULT_BASE_URL
}

function withPrefix(path: string) {
  if (path.startsWith("http")) return path
  const base = getBaseUrl().replace(/\/$/, "")
  const prefix = API_PREFIX.startsWith("/") ? API_PREFIX : `/${API_PREFIX}`
  const safePath = path.startsWith("/") ? path : `/${path}`
  return `${base}${prefix}${safePath}`
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const headers = new Headers(init?.headers)
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const response = await fetch(withPrefix(path), {
    ...init,
    headers,
  })

  if (!response.ok) {
    const text = await response.text()
    const error = new Error(text || `Erro ${response.status}`)
    ;(error as Error & { status?: number }).status = response.status
    throw error
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export type RegisterUserRequest = { username: string; email: string; password: string }
export type RegisterUserResponse = { id: string; username: string; email: string }

export type LoginRequest = { email: string; password: string }
export type LoginResponse = { token: string }

export type RefreshUserRequest = { refreshToken: string }
export type RefreshUserResponse = { accessToken: string; refreshToken: string }

export type GetMeResponse = {
  id: string
  username: string
  email: string
  role: string
  hasSeenTour: boolean
}

export type ArtistDto = { id: string; name: string }
export type AlbumDto = { id: string; title: string; year: number }
export type MemberDto = { id: string; name: string; artistId: string }
export type PhotocardDto = { id: string; version: string; memberId: string; isIrregular: boolean }
export type PhotocardDetailDto = {
  id: string
  version: string
  albumId: string
  memberId: string
  isIrregular: boolean
  store?: string | null
  region?: string | null
  event?: string | null
  printQuantity?: number | null
}

export async function registerUser(body: RegisterUserRequest) {
  return apiRequest<RegisterUserResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function loginUser(body: LoginRequest) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function refreshSession() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error("Refresh token ausente")
  const response = await apiRequest<RefreshUserResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  })
  if (response.refreshToken) setRefreshToken(response.refreshToken)
  return response
}

export async function getMe() {
  return apiRequest<GetMeResponse>("/users/me")
}

export async function listArtists() {
  return apiRequest<ArtistDto[]>("/artists")
}

export async function listAlbumsByArtist(artistId: string) {
  return apiRequest<AlbumDto[]>(`/artists/${artistId}/albums`)
}

export async function listMembersByArtist(artistId: string) {
  return apiRequest<MemberDto[]>(`/artists/${artistId}/members`)
}

export async function listMembers() {
  return apiRequest<MemberDto[]>("/members")
}

export async function listPhotocards() {
  return apiRequest<PhotocardDto[]>("/photocards")
}

export async function listPhotocardsByAlbum(albumId: string) {
  return apiRequest<PhotocardDto[]>(`/albums/${albumId}/photocards`)
}

export async function listPhotocardsByArtist(artistId: string) {
  return apiRequest<PhotocardDto[]>(`/artists/${artistId}/photocards`)
}

export async function listPhotocardsByMember(memberId: string) {
  return apiRequest<PhotocardDto[]>(`/members/${memberId}/photocards`)
}

export async function getPhotocardById(photocardId: string) {
  return apiRequest<PhotocardDetailDto>(`/photocards/${photocardId}`)
}
