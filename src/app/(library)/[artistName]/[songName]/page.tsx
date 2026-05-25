import type { Metadata } from 'next';
import { SongPage } from '../../../components/SongPage';
import {
  formatArtistUrl,
  formatSongUrl,
  getSongByName,
  musicLibrary,
} from '../../../data/musicData';

type SongRouteProps = {
  params: Promise<{
    artistName: string;
    songName: string;
  }>;
};

export function generateStaticParams() {
  return musicLibrary.flatMap(artist =>
    artist.songs.map(song => ({
      artistName: formatArtistUrl(artist.name),
      songName: formatSongUrl(song.title),
    })),
  );
}

export async function generateMetadata({
  params,
}: SongRouteProps): Promise<Metadata> {
  const { artistName, songName } = await params;
  const result = getSongByName(artistName, songName);

  if (!result) {
    return {
      title: 'Song not found',
    };
  }

  return {
    title: result.song.title,
    description: `${result.song.title} by ${result.artist.name} on SoundWave.`,
  };
}

export default async function SongRoute({ params }: SongRouteProps) {
  const { artistName, songName } = await params;
  return <SongPage artistName={artistName} songName={songName} />;
}
