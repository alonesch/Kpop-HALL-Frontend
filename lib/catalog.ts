import {
  AlbumDto,
  ArtistDto,
  MemberDto,
  PhotocardDto,
  listAlbumsByArtist,
  listArtists,
  listMembers,
  listPhotocardsByAlbum,
} from "./api"

export type CatalogPhotocard = {
  id: string
  memberId: string
  albumId: string
  artistId: string
  member: string
  group: string
  album: string
  type: "Regular" | "Irregular"
  image: string
  version: string
}

export type CatalogData = {
  artists: ArtistDto[]
  albums: (AlbumDto & { artistId: string })[]
  members: MemberDto[]
  photocards: CatalogPhotocard[]
}

function buildImageUrl(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/240/336`
}

export async function buildCatalog(): Promise<CatalogData> {
  const artists = await listArtists()

  const albumsByArtist = await Promise.all(
    artists.map(async (artist) => {
      const albums = await listAlbumsByArtist(artist.id)
      return albums.map((album) => ({ ...album, artistId: artist.id }))
    })
  )
  const albums = albumsByArtist.flat()

  const members = await listMembers()

  const albumsWithPhotocards = await Promise.all(
    albums.map(async (album) => {
      const photocards = await listPhotocardsByAlbum(album.id)
      return { album, photocards }
    })
  )

  const artistById = new Map<string, ArtistDto>(artists.map((a) => [a.id, a]))
  const memberById = new Map<string, MemberDto>(members.map((m) => [m.id, m]))

  const photocards = albumsWithPhotocards.flatMap(({ album, photocards }) => {
    return photocards.map((card) => mapPhotocard(card, album, artistById, memberById))
  })

  return {
    artists,
    albums,
    members,
    photocards,
  }
}

function mapPhotocard(
  card: PhotocardDto,
  album: AlbumDto & { artistId: string },
  artistById: Map<string, ArtistDto>,
  memberById: Map<string, MemberDto>,
): CatalogPhotocard {
  const member = memberById.get(card.memberId)
  const artist = artistById.get(member?.artistId ?? album.artistId)

  const memberName = member?.name ?? "Membro desconhecido"
  const artistName = artist?.name ?? "Artista desconhecido"

  const seed = `${card.id}-${card.memberId}-${album.id}`

  return {
    id: card.id,
    memberId: card.memberId,
    albumId: album.id,
    artistId: album.artistId,
    member: memberName,
    group: artistName,
    album: album.title,
    type: card.isIrregular ? "Irregular" : "Regular",
    image: buildImageUrl(seed),
    version: card.version,
  }
}
