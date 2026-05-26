import type { Metadata } from 'next';
import { ArtistPage } from '../../components/ArtistPage';
import { formatArtistUrl, getArtistByName, musicLibrary } from '../../data/musicData';

type ArtistRouteProps = {
  params: Promise<{
    artistName: string;
  }>;
};

export function generateStaticParams() {
  return musicLibrary.map(artist => ({
    artistName: formatArtistUrl(artist.name),
  }));
}

export async function generateMetadata({
  params,
}: ArtistRouteProps): Promise<Metadata> {
  const { artistName } = await params;
  const artist = getArtistByName(artistName);

  if (!artist) {
    return {
      title: 'Artist not found',
    };
  }

  return {
    title: artist.name,
    description: `${artist.name} songs and albums in Muzalo.`,
  };
}

export default async function ArtistRoute({ params }: ArtistRouteProps) {
  const { artistName } = await params;
  return <ArtistPage artistName={artistName} />;
}
