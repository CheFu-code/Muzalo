import Link from "next/link";
import { ExternalLink, Music2, Play, Radio, Search, Sparkles } from "lucide-react";
import { formatArtistUrl, formatSongUrl, getFeaturedEmbeds, getMusicLibrary } from "../data/musicData";
import { SpotifyEmbed } from "./SpotifyEmbed";

export async function LibraryHome() {
  const musicLibrary = await getMusicLibrary();
  const artist = musicLibrary[0];
  const featuredEmbeds = await getFeaturedEmbeds();
  const trackEmbeds = featuredEmbeds.filter((item) => item.kind === "track");
  const collectionEmbeds = featuredEmbeds.filter((item) => item.kind !== "track");

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-6 py-10">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gray-900/80 shadow-2xl shadow-black/30">
        <div className="grid gap-8 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
                <Radio className="h-3.5 w-3.5" />
                Muzalo
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
                {artist.name}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-gray-300">
                Stream the official Spotify profile directly inside Muzalo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={artist.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-purple-100"
              >
                Open on Spotify
                <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Search Muzalo
                <Search className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <SpotifyEmbed title={`${artist.name} Spotify profile`} src={artist.embedUrl} />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
              <Sparkles className="h-6 w-6 text-purple-300" />
              Featured on Spotify
            </h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {collectionEmbeds.map((embed) => (
            <article
              key={embed.id}
              className="rounded-2xl border border-white/10 bg-gray-800/40 p-3 shadow-xl shadow-black/10"
            >
              <SpotifyEmbed title={embed.title} src={embed.embedUrl} kind={embed.kind} />
              <div className="flex items-center justify-between px-2 pb-1 pt-3">
                <div>
                  <h3 className="font-semibold text-white">{embed.title}</h3>
                  <p className="text-sm text-gray-400">{embed.subtitle}</p>
                </div>
                <a
                  href={embed.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:bg-white/10"
                >
                  Open
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
              <Music2 className="h-6 w-6 text-purple-300" />
              Featured Tracks
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Optional track embeds become playable rows when configured.
            </p>
          </div>
        </div>

        {trackEmbeds.length ? (
          <div className="space-y-4">
            {trackEmbeds.map((embed) => (
              <div key={embed.id} className="rounded-2xl border border-white/10 bg-gray-800/40 p-3">
                <SpotifyEmbed compact title={embed.title} src={embed.embedUrl} kind={embed.kind} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-gray-800/30 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-400/10 text-purple-200">
              <Play className="h-5 w-5" fill="currentColor" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">No featured track IDs yet</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
              Add comma-separated Spotify track IDs to SPOTIFY_CHEFU_TRACK_IDS to show playable
              track embeds here and generate track pages.
            </p>
          </div>
        )}
      </section>

      {artist.songs.length ? (
        <section>
          <h2 className="mb-5 text-2xl font-semibold text-white">Track Pages</h2>
          <div className="grid gap-3">
            {artist.songs.map((song) => (
              <Link
                key={song.id}
                href={`/${formatArtistUrl(artist.name)}/${formatSongUrl(song.title)}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-gray-800/40 px-5 py-4 transition hover:bg-gray-800/70"
              >
                <span className="font-medium text-white">{song.title}</span>
                <span className="text-sm text-gray-400">{song.album}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
