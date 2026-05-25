import Link from "next/link";
import { playlists, getPlaylistSongs, formatArtistUrl, formatSongUrl } from "../data/musicData";
import { Play, Music2, Clock } from "lucide-react";

export function PlaylistsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="text-4xl font-semibold text-white mb-3">Your Playlists</h2>
        <p className="text-gray-400">Curated collections for every mood</p>
      </div>

      <div className="space-y-8">
        {playlists.map((playlist) => {
          const songs = getPlaylistSongs(playlist);
          const totalDuration = songs.reduce((acc, { song }) => {
            const [min, sec] = song.duration.split(":").map(Number);
            return acc + min * 60 + sec;
          }, 0);
          const minutes = Math.floor(totalDuration / 60);

          return (
            <div
              key={playlist.id}
              className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-start gap-6">
                  <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 relative group">
                    <img
                      src={playlist.image}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-purple-400 font-medium mb-2">PLAYLIST</p>
                    <h3 className="text-3xl font-bold text-white mb-3">{playlist.name}</h3>
                    <p className="text-gray-400 mb-4">{playlist.description}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Music2 className="w-4 h-4" />
                        {songs.length} songs
                      </span>
                      <span aria-hidden="true">&bull;</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {minutes} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-700/50">
                {songs.map(({ artist, song }, index) => (
                  <Link
                    key={`${playlist.id}-${song.id}`}
                    href={`/${formatArtistUrl(artist.name)}/${formatSongUrl(song.title)}`}
                    className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-700/30 transition-colors"
                  >
                    <span className="text-gray-500 font-medium w-8 text-center group-hover:hidden">
                      {index + 1}
                    </span>
                    <div className="w-8 flex items-center justify-center hidden group-hover:flex">
                      <Play className="w-5 h-5 text-purple-400" fill="currentColor" />
                    </div>

                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium mb-1 group-hover:text-purple-400 transition-colors truncate">
                        {song.title}
                      </h4>
                      <span className="text-sm text-gray-400 truncate block">
                        {artist.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-8 text-sm text-gray-400">
                      <span>{song.album}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {song.duration}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
