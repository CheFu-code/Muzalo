import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Disc, ExternalLink } from "lucide-react";
import { formatArtistUrl, getSongByName } from "../data/musicData";
import { SpotifyEmbed } from "./SpotifyEmbed";

type SongPageProps = {
  artistName: string;
  songName: string;
};

export async function SongPage({ artistName, songName }: SongPageProps) {
  const result = await getSongByName(artistName, songName);

  if (!result) {
    notFound();
  }

  const { artist, song } = result;

  return (
    <div className="min-h-screen">
      <section className="border-b border-white/10 bg-gray-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-300">
              Spotify Track
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-7xl">
              {song.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-300">
              <Link
                href={`/${formatArtistUrl(artist.name)}`}
                className="font-semibold text-white transition hover:text-purple-300"
              >
                {artist.name}
              </Link>
              <span aria-hidden="true">&bull;</span>
              <span>{song.album}</span>
              <span aria-hidden="true">&bull;</span>
              <span>{song.year}</span>
            </div>
            <a
              href={song.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-purple-100"
            >
              Open full track
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gray-800/40 p-3 shadow-2xl shadow-black/30">
            <SpotifyEmbed compact title={song.title} src={song.embedUrl} kind="track" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-gray-800/40 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Track information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-400">
                  <Disc className="h-4 w-4" />
                  Collection
                </span>
                <span className="font-medium text-white">{song.album}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  Release Year
                </span>
                <span className="font-medium text-white">{song.year}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gray-800/40 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Artist</h3>
            <Link
              href={`/${formatArtistUrl(artist.name)}`}
              className="flex items-center gap-4 rounded-xl p-2 transition hover:bg-white/5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-400/10 text-lg font-bold text-purple-100">
                {artist.name.slice(0, 1)}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{artist.name}</p>
                <p className="text-sm text-gray-400">{artist.genre}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
