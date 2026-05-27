import { ExternalLink, Music2 } from "lucide-react";
import { getPlaylists } from "../data/musicData";
import { SpotifyEmbed } from "./SpotifyEmbed";

export async function PlaylistsPage() {
  const playlists = await getPlaylists();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-300">
          Spotify embeds
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-white">Collections</h2>
        <p className="mt-3 max-w-2xl text-gray-400">
          Artist, album, and playlist embeds load directly from Spotify without calling the Premium
          gated Web API.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {playlists.map((playlist) => (
          <article
            id={playlist.id}
            key={playlist.id}
            className="rounded-3xl border border-white/10 bg-gray-800/40 p-4 shadow-xl shadow-black/10"
          >
            {playlist.embedUrl ? (
              <SpotifyEmbed
                title={playlist.name}
                src={playlist.embedUrl}
                kind={playlist.kind}
                compact={playlist.kind === "track"}
              />
            ) : null}

            <div className="flex items-center justify-between gap-4 px-2 pt-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-400/10 px-3 py-1 text-xs font-semibold text-purple-200">
                  <Music2 className="h-3.5 w-3.5" />
                  {playlist.kind}
                </div>
                <h3 className="text-xl font-semibold text-white">{playlist.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{playlist.description}</p>
              </div>
              {playlist.spotifyUrl ? (
                <a
                  href={playlist.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
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
