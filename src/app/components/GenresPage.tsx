import Link from "next/link";
import { getAllGenres, getArtistsByGenre, formatArtistUrl } from "../data/musicData";
import { Music } from "lucide-react";

const genreColors: Record<string, string> = {
  "Synthwave": "from-purple-600 to-pink-600",
  "Electronic": "from-blue-600 to-cyan-600",
  "Psychedelic Rock": "from-orange-600 to-red-600",
  "Psychedelic Pop": "from-pink-600 to-rose-600",
  "Indie Pop": "from-green-600 to-teal-600",
  "Indie Folk": "from-amber-600 to-yellow-600",
  "Rock": "from-red-600 to-orange-600",
  "Indie Rock": "from-teal-600 to-green-600",
  "Pop": "from-fuchsia-600 to-purple-600",
  "Hip Hop": "from-yellow-600 to-orange-600",
  "R&B": "from-indigo-600 to-blue-600",
  "Alternative Rock": "from-gray-600 to-slate-600",
};

export async function GenresPage() {
  const genres = await getAllGenres().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <h2 className="mb-3 text-3xl font-semibold text-white sm:text-4xl">Browse by Genre</h2>
        <p className="text-sm text-gray-400 sm:text-base">Explore music by your favorite genres</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {await Promise.all(genres.map(async (genre) => {
          const artists = await getArtistsByGenre(genre);
          const gradient = genreColors[genre] || "from-gray-600 to-gray-700";

          return (
            <div
              key={genre}
              className="group overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/40 transition-all hover:border-purple-500/50 hover:bg-gray-800/60"
            >
              <div className={`relative h-24 bg-gradient-to-br sm:h-32 ${gradient}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="h-12 w-12 text-white/30 sm:h-16 sm:w-16" />
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="mb-3 text-lg font-semibold text-white sm:text-xl">{genre}</h3>
                <div className="space-y-2">
                  {artists.slice(0, 3).map((artist) => (
                    <Link
                      key={artist.id}
                      href={`/${formatArtistUrl(artist.name)}`}
                      className="flex items-center gap-3 group/artist"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-300 group-hover/artist:text-purple-400 transition-colors truncate">
                        {artist.name}
                      </span>
                    </Link>
                  ))}
                  {artists.length > 3 && (
                    <p className="text-xs text-gray-500 pl-13">
                      +{artists.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
}
