"use client";

import { useState } from "react";
import Link from "next/link";
import { formatArtistUrl, formatSongUrl } from "../data/format";
import { AlertTriangle, Search, Music2, User } from "lucide-react";
import { SpotifyEmbed } from "./SpotifyEmbed";

type SearchResults = {
  artists: Array<{ id: string; name: string; genre: string; image: string }>;
  songs: Array<{
    artist: { id: string; name: string; image: string };
    song: { id: string; title: string; duration: string };
  }>;
  embeds?: Array<{
    id: string;
    kind: "artist" | "album" | "playlist" | "track";
    title: string;
    subtitle: string;
    embedUrl: string;
    spotifyUrl: string;
  }>;
  catalogIssue?: {
    title: string;
    description: string;
  };
};

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults(null);
      return;
    }

    setIsSearching(true);
    const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
    setResults((await response.json()) as SearchResults);
    setIsSearching(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <h2 className="mb-4 text-3xl font-semibold text-white sm:mb-6 sm:text-4xl">Search</h2>
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for artists, songs, or albums..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800/60 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-400 transition-colors focus:border-purple-500 focus:outline-none sm:py-4 sm:pl-12 sm:text-base"
            autoFocus
          />
        </div>
      </div>

      {isSearching ? (
        <p className="text-gray-400">Searching Muzalo...</p>
      ) : null}

      {results && !isSearching && (
        <div className="space-y-8">
          {results.catalogIssue ? (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-amber-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-300" />
                <div>
                  <h3 className="font-semibold">{results.catalogIssue.title}</h3>
                  <p className="mt-1 text-sm text-amber-100/80">
                    {results.catalogIssue.description}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {results.artists.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white sm:text-2xl">
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
                Artists
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {results.artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/${formatArtistUrl(artist.name)}`}
                    className="group rounded-lg bg-gray-800/40 p-3 transition-all hover:bg-gray-800/60 sm:p-4"
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

          {results.embeds && results.embeds.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white sm:text-2xl">
                <Music2 className="h-5 w-5 sm:h-6 sm:w-6" />
                Spotify Embeds
              </h3>
              <div className="grid gap-4 lg:grid-cols-2">
                {results.embeds.map((embed) => (
                  <div
                    key={embed.id}
                    className="rounded-2xl border border-white/10 bg-gray-800/40 p-3"
                  >
                    <SpotifyEmbed
                      compact={embed.kind === "track"}
                      title={embed.title}
                      src={embed.embedUrl}
                      kind={embed.kind}
                    />
                    <div className="px-2 pt-3">
                      <h4 className="font-semibold text-white">{embed.title}</h4>
                      <p className="text-sm text-gray-400">{embed.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.songs.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white sm:text-2xl">
                <Music2 className="h-5 w-5 sm:h-6 sm:w-6" />
                Songs
              </h3>
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden">
                {results.songs.map(({ artist, song }, index) => (
                  <Link
                    key={`${artist.id}-${song.id}`}
                    href={`/${formatArtistUrl(artist.name)}/${formatSongUrl(song.title)}`}
                    className="flex items-center gap-3 border-b border-gray-700/50 px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-gray-700/30 sm:gap-4 sm:px-6 sm:py-4 sm:text-base"
                  >
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded sm:h-12 sm:w-12">
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

          {results.artists.length === 0 &&
            results.songs.length === 0 &&
            (!results.embeds || results.embeds.length === 0) && (
            <div className="py-8 text-center sm:py-12">
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
        <div className="py-8 text-center sm:py-12">
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
