import { formatArtistUrl, formatRouteValue, formatSongUrl } from "./format";

export type SpotifyEmbedKind = "artist" | "album" | "playlist" | "track";

export interface SpotifyEmbedItem {
  id: string;
  kind: SpotifyEmbedKind;
  title: string;
  subtitle: string;
  description: string;
  spotifyId: string;
  spotifyUrl: string;
  embedUrl: string;
  image: string;
}

export interface Song {
  id: string;
  title: string;
  duration: string;
  durationMs: number;
  album: string;
  year: number;
  image: string;
  previewUrl: string | null;
  spotifyUrl: string;
  embedUrl: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  spotifyId: string;
  spotifyUrl: string;
  embedUrl: string;
  followers: number;
  popularity: number;
  songs: Song[];
  featuredEmbeds: SpotifyEmbedItem[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  songIds: string[];
  spotifyId?: string;
  spotifyUrl?: string;
  embedUrl?: string;
  kind: SpotifyEmbedKind;
}

const FALLBACK_ARTIST_ID = "07fFH9mxSS0g69Wbz8PXNn";
const FALLBACK_ARTIST_NAME = "CheFu";
const MUZALO_LOGO = "/muzalo-logo.svg";

export function spotifyEmbedUrl(kind: SpotifyEmbedKind, spotifyId: string) {
  return `https://open.spotify.com/embed/${kind}/${spotifyId}?utm_source=generator`;
}

export function spotifyOpenUrl(kind: SpotifyEmbedKind, spotifyId: string) {
  return `https://open.spotify.com/${kind}/${spotifyId}`;
}

export async function getMusicLibrary(): Promise<Artist[]> {
  const artistId = getEnvValue("SPOTIFY_CHEFU_ARTIST_ID") || FALLBACK_ARTIST_ID;
  const artistName = getEnvValue("SPOTIFY_CHEFU_ARTIST_NAME") || FALLBACK_ARTIST_NAME;
  const artistImage = getEnvValue("SPOTIFY_CHEFU_ARTIST_IMAGE") || MUZALO_LOGO;
  const artistGenre = getEnvValue("SPOTIFY_CHEFU_ARTIST_GENRE") || "Hip Hop / R&B";
  const tracks = getConfiguredTracks(artistName, artistImage);
  const configuredEmbeds = getConfiguredEmbeds(artistName, artistImage);
  const artistEmbed: SpotifyEmbedItem = {
    id: `artist-${artistId}`,
    kind: "artist",
    title: `${artistName} on Spotify`,
    subtitle: "Artist profile",
    description: "Stream releases, top songs, and artist radio directly from Spotify.",
    spotifyId: artistId,
    spotifyUrl: spotifyOpenUrl("artist", artistId),
    embedUrl: spotifyEmbedUrl("artist", artistId),
    image: artistImage,
  };

  return [
    {
      id: artistId,
      name: artistName,
      genre: artistGenre,
      image: artistImage,
      spotifyId: artistId,
      spotifyUrl: spotifyOpenUrl("artist", artistId),
      embedUrl: spotifyEmbedUrl("artist", artistId),
      followers: 0,
      popularity: 0,
      songs: tracks,
      featuredEmbeds: [artistEmbed, ...configuredEmbeds],
    },
  ];
}

export async function getFeaturedEmbeds() {
  const library = await getMusicLibrary();
  return library.flatMap((artist) => artist.featuredEmbeds);
}

export async function getPlaylists(): Promise<Playlist[]> {
  const library = await getMusicLibrary();
  const artist = library[0];
  const embeds = artist.featuredEmbeds.filter((item) => item.kind !== "track");

  return embeds.map((item) => ({
    id: item.id,
    name: item.title,
    description: item.description,
    image: item.image,
    spotifyId: item.spotifyId,
    spotifyUrl: item.spotifyUrl,
    embedUrl: item.embedUrl,
    kind: item.kind,
    songIds: artist.songs.slice(0, 8).map((song) => song.id),
  }));
}

export async function getArtistByName(name: string): Promise<Artist | undefined> {
  const urlName = formatRouteValue(name);
  const library = await getMusicLibrary();
  return library.find((artist) => formatArtistUrl(artist.name) === urlName);
}

export async function getSongByName(
  artistName: string,
  songName: string,
): Promise<{ artist: Artist; song: Song } | undefined> {
  const artist = await getArtistByName(artistName);
  if (!artist) return undefined;

  const urlSongName = formatRouteValue(songName);
  const song = artist.songs.find((item) => formatSongUrl(item.title) === urlSongName);

  if (!song) return undefined;
  return { artist, song };
}

export { formatArtistUrl, formatSongUrl };

export async function getAllGenres(): Promise<string[]> {
  const library = await getMusicLibrary();
  const genres = new Set(library.map((artist) => artist.genre));
  return Array.from(genres).sort();
}

export async function getArtistsByGenre(genre: string): Promise<Artist[]> {
  const library = await getMusicLibrary();
  return library.filter((artist) => artist.genre === genre);
}

export async function searchMusic(query: string): Promise<{
  artists: Artist[];
  songs: Array<{ artist: Artist; song: Song }>;
  embeds: SpotifyEmbedItem[];
}> {
  const lowerQuery = query.trim().toLowerCase();
  const library = await getMusicLibrary();
  if (!lowerQuery) return { artists: [], songs: [], embeds: [] };

  const artists = library.filter(
    (artist) =>
      artist.name.toLowerCase().includes(lowerQuery) ||
      artist.genre.toLowerCase().includes(lowerQuery),
  );

  const songs = library.flatMap((artist) =>
    artist.songs
      .filter(
        (song) =>
          song.title.toLowerCase().includes(lowerQuery) ||
          song.album.toLowerCase().includes(lowerQuery),
      )
      .map((song) => ({ artist, song })),
  );

  const embeds = library
    .flatMap((artist) => artist.featuredEmbeds)
    .filter((embed) =>
      [embed.title, embed.subtitle, embed.description, embed.kind]
        .join(" ")
        .toLowerCase()
        .includes(lowerQuery),
    );

  return { artists, songs, embeds };
}

export async function getSongById(
  songId: string,
): Promise<{ artist: Artist; song: Song } | undefined> {
  const library = await getMusicLibrary();

  for (const artist of library) {
    const song = artist.songs.find((item) => item.id === songId);
    if (song) return { artist, song };
  }

  return undefined;
}

export async function getPlaylistSongs(
  playlist: Playlist,
): Promise<Array<{ artist: Artist; song: Song }>> {
  const songs = await Promise.all(playlist.songIds.map((id) => getSongById(id)));
  return songs.filter((item): item is { artist: Artist; song: Song } => Boolean(item));
}

function getConfiguredEmbeds(artistName: string, fallbackImage: string) {
  return [
    ...getEmbedItemsFromEnv("SPOTIFY_CHEFU_ALBUM_IDS", "album", artistName, fallbackImage),
    ...getEmbedItemsFromEnv("SPOTIFY_CHEFU_PLAYLIST_IDS", "playlist", artistName, fallbackImage),
    ...getEmbedItemsFromEnv("SPOTIFY_CHEFU_TRACK_IDS", "track", artistName, fallbackImage),
  ];
}

function getConfiguredTracks(artistName: string, fallbackImage: string): Song[] {
  const rawTracks = parseList(getEnvValue("SPOTIFY_CHEFU_TRACK_IDS"));

  return rawTracks.map((spotifyId, index) => ({
    id: spotifyId,
    title: `Featured track ${index + 1}`,
    duration: "--:--",
    durationMs: 0,
    album: artistName,
    year: new Date().getFullYear(),
    image: fallbackImage,
    previewUrl: null,
    spotifyUrl: spotifyOpenUrl("track", spotifyId),
    embedUrl: spotifyEmbedUrl("track", spotifyId),
  }));
}

function getEmbedItemsFromEnv(
  envName: string,
  kind: SpotifyEmbedKind,
  artistName: string,
  fallbackImage: string,
): SpotifyEmbedItem[] {
  return parseList(getEnvValue(envName)).map((spotifyId, index) => ({
    id: `${kind}-${spotifyId}`,
    kind,
    title: `${artistName} ${labelForKind(kind)} ${index + 1}`,
    subtitle: `${labelForKind(kind)} embed`,
    description: `Listen to this ${labelForKind(kind).toLowerCase()} without using the Spotify Web API.`,
    spotifyId,
    spotifyUrl: spotifyOpenUrl(kind, spotifyId),
    embedUrl: spotifyEmbedUrl(kind, spotifyId),
    image: fallbackImage,
  }));
}

function labelForKind(kind: SpotifyEmbedKind) {
  if (kind === "artist") return "Artist";
  if (kind === "album") return "Album";
  if (kind === "playlist") return "Playlist";
  return "Track";
}

function parseList(value?: string) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getEnvValue(name: string) {
  return process.env[name]?.trim();
}
