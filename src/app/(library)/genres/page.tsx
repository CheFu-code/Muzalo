import type { Metadata } from 'next';
import { GenresPage } from '../../components/GenresPage';

export const metadata: Metadata = {
  title: 'Genres',
  description: 'Browse Muzalo music by genre.',
};

export default function GenresRoute() {
  return <GenresPage />;
}
