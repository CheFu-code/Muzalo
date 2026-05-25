import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Disc, Play } from 'lucide-react';
import { formatArtistUrl, formatSongUrl, getArtistByName } from '../data/musicData';

type ArtistPageProps = {
  artistName: string;
};

export function ArtistPage({ artistName }: ArtistPageProps) {
  const artist = getArtistByName(artistName);

  if (!artist) {
    notFound();
  }

  const totalDuration = artist.songs.reduce((acc, song) => {
    const [min, sec] = song.duration.split(':').map(Number);
    return acc + min * 60 + sec;
  }, 0);

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${artist.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/80 to-gray-900" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-8">
          <div className="flex items-end gap-6">
            <div className="w-52 h-52 rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
              <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
            </div>
            <div className="pb-2">
              <p className="text-sm text-purple-400 font-medium mb-2">ARTIST</p>
              <h1 className="text-6xl font-bold text-white mb-4">{artist.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Disc className="w-4 h-4" />
                  {artist.genre}
                </span>
                <span aria-hidden="true">&bull;</span>
                <span>{artist.songs.length} songs</span>
                <span aria-hidden="true">&bull;</span>
                <span>{formatTotalTime(totalDuration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-semibold text-white">Popular Songs</h2>
          </div>

          <div className="divide-y divide-gray-700/50">
            {artist.songs.map((song, index) => (
              <Link
                key={song.id}
                href={`/${formatArtistUrl(artist.name)}/${formatSongUrl(song.title)}`}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-700/30 transition-colors"
              >
                <span className="text-gray-500 font-medium w-8 text-center group-hover:hidden">
                  {index + 1}
                </span>
                <div className="w-8 items-center justify-center hidden group-hover:flex">
                  <Play className="w-5 h-5 text-purple-400" fill="currentColor" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-1 group-hover:text-purple-400 transition-colors truncate">
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{song.album}</p>
                </div>

                <div className="flex items-center gap-8 text-sm text-gray-400">
                  <span>{song.year}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {song.duration}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
