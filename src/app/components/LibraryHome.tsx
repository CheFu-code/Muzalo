import Link from "next/link";
import {
  getMusicLibrary,
  formatArtistUrl,
  getPlaylists,
  getSongById,
  formatSongUrl,
  getSpotifyCatalogIssue,
  type Artist,
} from "../data/musicData";
import { AlertTriangle, Clock, Music2, Play, TrendingUp } from "lucide-react";

export async function LibraryHome() {
  let catalogIssue: ReturnType<typeof getSpotifyCatalogIssue> | null = null;
  let musicLibrary: Artist[] = [];

  try {
    musicLibrary = await getMusicLibrary();
  } catch (error) {
    catalogIssue = getSpotifyCatalogIssue(error);
  }

  const playlists = catalogIssue ? [] : await getPlaylists().catch(() => []);
  const recentlyPlayed = (
    await Promise.all(musicLibrary.flatMap((artist) => artist.songs.slice(0, 5).map((song) => getSongById(song.id))))
  ).filter(Boolean) as Array<{ artist: any; song: any }>;

  const recommended = musicLibrary.slice(0, 6);

  if (!musicLibrary.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8 text-center shadow-2xl shadow-black/20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-amber-950">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-3xl font-semibold text-white">
            {catalogIssue?.title || "Spotify catalog unavailable"}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-300">
            {catalogIssue?.description ||
              "Muzalo could not load the Spotify catalog. Check the Spotify settings on the Muzalo deployment."}
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-left text-sm text-gray-300">
            <p className="font-medium text-white">Expected production values</p>
            <pre className="mt-3 overflow-x-auto text-xs leading-6 text-gray-300">
{`SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_CHEFU_ARTIST_ID=07fFH9mxSS0g69Wbz8PXNn
SPOTIFY_CHEFU_ARTIST_NAME=CheFu
SPOTIFY_MARKET=ZA`}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Recently Played */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Recently Played
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {recentlyPlayed.map(({ artist, song }) => (
            <Link
              key={song.id}
              href={`/${formatArtistUrl(artist.name)}/${formatSongUrl(song.title)}`}
              className="group bg-gray-800/40 rounded-lg p-4 hover:bg-gray-800/60 transition-all"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-3 relative">
                <img
                  src={artist.image}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
              <h4 className="text-white font-medium truncate mb-1 group-hover:text-purple-400 transition-colors">
                {song.title}
              </h4>
              <p className="text-sm text-gray-400 truncate">{artist.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Playlists */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Your Playlists</h2>
          <Link href="/playlists" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlists#${playlist.id}`}
              className="group bg-gray-800/40 rounded-lg p-4 hover:bg-gray-800/60 transition-all"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-3 relative">
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
              <h4 className="text-white font-medium truncate mb-1 group-hover:text-purple-400 transition-colors">
                {playlist.name}
              </h4>
              <p className="text-sm text-gray-400 truncate">{playlist.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Artists */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Recommended for You
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {recommended.map((artist) => (
            <Link
              key={artist.id}
              href={`/${formatArtistUrl(artist.name)}`}
              className="group text-center"
            >
              <div className="aspect-square rounded-full overflow-hidden mb-3 relative mx-auto">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
              <h4 className="text-white font-medium truncate mb-1 group-hover:text-purple-400 transition-colors">
                {artist.name}
              </h4>
              <p className="text-sm text-gray-400 truncate">{artist.genre}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* All Artists */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">All Artists</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {musicLibrary.map((artist) => (
          <Link
            key={artist.id}
            href={`/${formatArtistUrl(artist.name)}`}
            className="group relative bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-800/60 transition-all duration-300 border border-gray-700/50 hover:border-purple-500/50 hover:scale-105"
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>

              {/* Song count badge */}
              <div className="absolute top-4 right-4 bg-gray-950/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Music2 className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-white font-medium">{artist.songs.length} songs</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {artist.name}
              </h3>
              <p className="text-sm text-gray-400">{artist.genre}</p>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
}
