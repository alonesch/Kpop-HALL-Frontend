import { PhotocardDto, listPhotocards } from "./api"

export type CatalogPhotocard = {
  id: string
  memberId: string
  artistId: string
  member: string
  group: string
  album: string
  type: "Regular" | "Irregular"
  image: string | null
  version: string
}

export type CatalogData = {
  artists: { id: string; name: string }[]
  albums: { title: string; artistId: string }[]
  members: { id: string; name: string; artistId: string }[]
  photocards: CatalogPhotocard[]
}

export async function buildCatalog(): Promise<CatalogData> {
  const photocards = await listPhotocards()

  const artistsMap = new Map<string, { id: string; name: string }>()
  const albumsMap = new Map<string, { title: string; artistId: string }>()
  const membersMap = new Map<string, { id: string; name: string; artistId: string }>()

  const mappedPhotocards = photocards.map((card) => {
    artistsMap.set(card.artistId, { id: card.artistId, name: card.artistName })
    albumsMap.set(`${card.artistId}:${card.albumTitle}`, { title: card.albumTitle, artistId: card.artistId })
    membersMap.set(card.memberId, { id: card.memberId, name: card.memberName, artistId: card.artistId })
    return mapPhotocard(card)
  })

  return {
    artists: Array.from(artistsMap.values()),
    albums: Array.from(albumsMap.values()),
    members: Array.from(membersMap.values()),
    photocards: mappedPhotocards,
  }
}

function mapPhotocard(card: PhotocardDto): CatalogPhotocard {
  return {
    id: card.id,
    memberId: card.memberId,
    artistId: card.artistId,
    member: card.memberName,
    group: card.artistName,
    album: card.albumTitle,
    type: card.isIrregular ? "Irregular" : "Regular",
    image: card.frontsideImageUrl ?? null,
    version: card.version,
  }
}
