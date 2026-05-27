import { formatArtistUrl, formatRouteValue, formatSongUrl } from "./format";

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
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  spotifyUrl: string;
  followers: number;
  popularity: number;
  songs: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  songIds: string[];
}

type SpotifyImage = {
  height: number | null;
  url: string;
  width: number | null;
};

type SpotifyArtist = {
  id: string;
  name: string;
  genres?: string[];
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
  followers?: { total?: number };
  popularity?: number;
};

type SpotifyAlbum = {
  id: string;
  name: string;
  release_date?: string;
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
  tracks?: { items?: SpotifyTrack[] };
};

type SpotifyTrack = {
  id: string;
  name: string;
  duration_ms: number;
  preview_url?: string | null;
  external_urls?: { spotify?: string };
  album?: SpotifyAlbum;
};

let tokenCache: { accessToken: string; expiresAt: number } | null = null;

export async function getMusicLibrary(): Promise<Artist[]> {
  const artist = await getCheFuArtist();
  if (!artist) return [];

  const albums = await getArtistAlbums(artist.id);
  const songs = await getAlbumSongs(albums);

  return [
    {
      id: artist.id,
      name: artist.name,
      genre: artist.genres?.[0] || "Music",
      image: bestImage(artist.images),
      spotifyUrl: artist.external_urls?.spotify || "",
      followers: artist.followers?.total || 0,
      popularity: artist.popularity || 0,
      songs,
    },
  ];
}

export async function getPlaylists(): Promise<Playlist[]> {
  const library = await getMusicLibrary();
  const artist = library[0];
  const songs = artist?.songs || [];

  return [
    {
      id: "chefu-popular",
      name: "CheFu Essentials",
      description: "A focused collection of CheFu tracks from Spotify.",
      image: songs[0]?.image || artist?.image || "",
      songIds: songs.slice(0, 8).map((song) => song.id),
    },
    {
      id: "chefu-latest",
      name: "Latest Releases",
      description: "Recent CheFu releases and singles.",
      image: songs[4]?.image || artist?.image || "",
      songIds: [...songs].sort((a, b) => b.year - a.year).slice(0, 8).map((song) => song.id),
    },
  ].filter((playlist) => playlist.songIds.length > 0);
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
}> {
  const lowerQuery = query.trim().toLowerCase();
  const library = await getMusicLibrary();
  if (!lowerQuery) return { artists: [], songs: [] };

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

  return { artists, songs };
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

async function getCheFuArtist() {
  const artistId = process.env.SPOTIFY_CHEFU_ARTIST_ID;
  const artistName = process.env.SPOTIFY_CHEFU_ARTIST_NAME || "CheFu";

  if (artistId) {
    return spotifyFetch<SpotifyArtist>(`/artists/${artistId}`);
  }

  const data = await spotifyFetch<{ artists?: { items?: SpotifyArtist[] } }>(
    `/search?${new URLSearchParams({
      q: artistName,
      type: "artist",
      limit: "5",
      market: spotifyMarket(),
    })}`,
  );
  const artists = data.artists?.items || [];

  return (
    artists.find((artist) => artist.name.toLowerCase() === artistName.toLowerCase()) ||
    artists[0] ||
    null
  );
}

async function getArtistAlbums(artistId: string) {
  const data = await spotifyFetch<{ items?: SpotifyAlbum[] }>(
    `/artists/${artistId}/albums?${new URLSearchParams({
      include_groups: "album,single,compilation",
      limit: "20",
      market: spotifyMarket(),
    })}`,
  );

  const seen = new Set<string>();
  return (data.items || []).filter((album) => {
    const key = album.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function getAlbumSongs(albums: SpotifyAlbum[]) {
  const detailedAlbums = await Promise.all(
    albums.slice(0, 12).map((album) =>
      spotifyFetch<SpotifyAlbum>(
        `/albums/${album.id}?${new URLSearchParams({ market: spotifyMarket() })}`,
      ).catch(() => null),
    ),
  );

  return detailedAlbums
    .filter((album): album is SpotifyAlbum => Boolean(album))
    .flatMap((album) =>
      (album.tracks?.items || []).map((track) => ({
        id: track.id,
        title: track.name,
        duration: formatDuration(track.duration_ms),
        durationMs: track.duration_ms,
        album: album.name,
        year: Number((album.release_date || "").slice(0, 4)) || new Date().getFullYear(),
        image: bestImage(album.images),
        previewUrl: track.preview_url || null,
        spotifyUrl: track.external_urls?.spotify || album.external_urls?.spotify || "",
      })),
    )
    .filter((song) => song.id)
    .slice(0, 60);
}

async function spotifyFetch<T>(path: string): Promise<T> {
  const token = await getSpotifyAccessToken();
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`Spotify request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

async function getSpotifyAccessToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials.");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to authenticate with Spotify.");
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

function spotifyMarket() {
  return process.env.SPOTIFY_MARKET || "ZA";
}

function bestImage(images?: SpotifyImage[]) {
  return images?.[0]?.url || "";
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
