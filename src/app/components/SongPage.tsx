import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Disc } from 'lucide-react';
import { formatArtistUrl, getSongByName } from '../data/musicData';
import { SongPlayerControls } from './SongPlayerControls';

type SongPageProps = {
  artistName: string;
  songName: string;
};

export function SongPage({ artistName, songName }: SongPageProps) {
  const result = getSongByName(artistName, songName);

  if (!result) {
    notFound();
  }

  const { artist, song } = result;

  return (
    <div className="min-h-screen">
      <div className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
          style={{ backgroundImage: `url(${artist.image})` }}
        >
          <div className="absolute inset-0 bg-gray-900/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <div className="flex items-end gap-8">
            <div className="w-64 h-64 rounded-lg overflow-hidden shadow-2xl flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <img
                src={artist.image}
                alt={song.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pb-4 flex-1">
              <p className="text-sm text-purple-400 font-medium mb-3">SONG</p>
              <h1 className="text-7xl font-bold text-white mb-6 leading-tight">{song.title}</h1>
              <div className="flex items-center gap-3">
                <Link
                  href={`/${formatArtistUrl(artist.name)}`}
                  className="text-xl text-white hover:text-purple-400 transition-colors font-medium"
                >
                  {artist.name}
                </Link>
                <span className="text-gray-400" aria-hidden="true">&bull;</span>
                <span className="text-gray-300">{song.album}</span>
                <span className="text-gray-400" aria-hidden="true">&bull;</span>
                <span className="text-gray-300">{song.year}</span>
                <span className="text-gray-400" aria-hidden="true">&bull;</span>
                <span className="text-gray-300">{song.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <SongPlayerControls duration={song.duration} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Song Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Disc className="w-4 h-4" />
                  Album
                </span>
                <span className="text-white font-medium">{song.album}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Release Year
                </span>
                <span className="text-white font-medium">{song.year}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="text-white font-medium">{song.duration}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Artist</h3>
            <Link
              href={`/${formatArtistUrl(artist.name)}`}
              className="flex items-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div>
                <p className="text-white font-semibold text-lg group-hover:text-purple-400 transition-colors">
                  {artist.name}
                </p>
                <p className="text-gray-400 text-sm">{artist.genre}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
