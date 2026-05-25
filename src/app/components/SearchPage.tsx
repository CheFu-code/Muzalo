"use client";

import { useState } from "react";
import Link from "next/link";
import { searchMusic, formatArtistUrl, formatSongUrl } from "../data/musicData";
import { Search, Music2, User } from "lucide-react";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchMusic> | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setResults(searchMusic(value));
    } else {
      setResults(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="text-4xl font-semibold text-white mb-6">Search</h2>
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for artists, songs, or albums..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            autoFocus
          />
        </div>
      </div>

      {results && (
        <div className="space-y-8">
          {results.artists.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-6 h-6" />
                Artists
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/${formatArtistUrl(artist.name)}`}
                    className="group bg-gray-800/40 rounded-lg p-4 hover:bg-gray-800/60 transition-all"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-3">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h4 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">
                      {artist.name}
                    </h4>
                    <p className="text-sm text-gray-400">{artist.genre}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.songs.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Music2 className="w-6 h-6" />
                Songs
              </h3>
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden">
                {results.songs.map(({ artist, song }, index) => (
                  <Link
                    key={`${artist.id}-${song.id}`}
                    href={`/${formatArtistUrl(artist.name)}/${formatSongUrl(song.title)}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-700/30 transition-colors border-b border-gray-700/50 last:border-b-0"
                  >
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{song.title}</h4>
                      <span className="text-sm text-gray-400 truncate block">
                        {artist.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">{song.duration}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.artists.length === 0 && results.songs.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl text-white mb-2">No results found</h3>
              <p className="text-gray-400">Try searching for something else</p>
            </div>
          )}
        </div>
      )}

      {!results && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-4">
            <Search className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl text-white mb-2">Search your library</h3>
          <p className="text-gray-400">Find your favorite artists, songs, and albums</p>
        </div>
      )}
    </div>
  );
}
