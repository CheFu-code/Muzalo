import { ExternalLink, Music2 } from "lucide-react";
import { getPlaylists } from "../data/musicData";
import { SpotifyEmbed } from "./SpotifyEmbed";

export async function PlaylistsPage() {
  const playlists = await getPlaylists();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-300">
          Muzalo
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Collections</h2>

      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {playlists.map((playlist) => (
          <article
            id={playlist.id}
            key={playlist.id}
            className="rounded-2xl border border-white/10 bg-gray-800/40 p-3 shadow-xl shadow-black/10 sm:rounded-3xl sm:p-4"
          >
            {playlist.embedUrl ? (
              <SpotifyEmbed
                title={playlist.name}
                src={playlist.embedUrl}
                kind={playlist.kind}
                compact={playlist.kind === "track"}
              />
            ) : null}

            <div className="flex flex-col gap-4 px-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-400/10 px-3 py-1 text-xs font-semibold text-purple-200">
                  <Music2 className="h-3.5 w-3.5" />
                  {playlist.kind}
                </div>
                <h3 className="text-lg font-semibold text-white sm:text-xl">{playlist.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{playlist.description}</p>
              </div>
              {playlist.spotifyUrl ? (
                <a
                  href={playlist.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4 sm:py-2 sm:text-sm"
                >
                  Open
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
