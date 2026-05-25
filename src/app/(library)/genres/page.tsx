import type { Metadata } from 'next';
import { GenresPage } from '../../components/GenresPage';

export const metadata: Metadata = {
  title: 'Genres',
  description: 'Browse SoundWave music by genre.',
};

export default function GenresRoute() {
  return <GenresPage />;
}
