import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Music2, Play } from "lucide-react";
import { formatArtistUrl, formatSongUrl, getArtistByName } from "../data/musicData";
import { SpotifyEmbed } from "./SpotifyEmbed";

type ArtistPageProps = {
  artistName: string;
};

export async function ArtistPage({ artistName }: ArtistPageProps) {
  const artist = await getArtistByName(artistName);

  if (!artist) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10 bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.2),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-300">Artist</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-7xl">
              {artist.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              Explore {artist.name} through Spotify embeds hosted inside Muzalo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
                {artist.genre}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
                {artist.featuredEmbeds.length} embeds
              </span>
            </div>
            <a
              href={artist.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-gray-950 transition hover:bg-purple-100 sm:mt-8 sm:px-5 sm:py-3 sm:text-sm"
            >
              Open on Spotify
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-3 shadow-2xl shadow-black/30 sm:rounded-3xl">
            <SpotifyEmbed title={`${artist.name} Spotify profile`} src={artist.embedUrl} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-12">
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white sm:text-2xl">
            <Music2 className="h-5 w-5 text-purple-300 sm:h-6 sm:w-6" />
            Spotify embeds
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {artist.featuredEmbeds.map((embed) => (
              <article
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
                  <h3 className="font-semibold text-white">{embed.title}</h3>
                  <p className="text-sm text-gray-400">{embed.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {artist.songs.length ? (
          <section className="rounded-2xl border border-white/10 bg-gray-800/40">
            <div className="border-b border-white/10 p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-white sm:text-2xl">Track pages</h2>
            </div>
            <div className="divide-y divide-white/10">
              {artist.songs.map((song, index) => (
                <Link
                  key={song.id}
                  href={`/${formatArtistUrl(artist.name)}/${formatSongUrl(song.title)}`}
                  className="group flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-white/5 sm:gap-4 sm:px-6 sm:py-4 sm:text-base"
                >
                  <span className="w-8 text-center font-medium text-gray-500">{index + 1}</span>
                  <Play className="h-5 w-5 text-purple-300" fill="currentColor" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-white group-hover:text-purple-300">
                      {song.title}
                    </h3>
                    <p className="truncate text-sm text-gray-400">{song.album}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
