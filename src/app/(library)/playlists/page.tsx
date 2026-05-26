import type { Metadata } from 'next';
import { PlaylistsPage } from '../../components/PlaylistsPage';

export const metadata: Metadata = {
  title: 'Playlists',
  description: 'Curated Muzalo playlists for every mood.',
};

export default function PlaylistsRoute() {
  return <PlaylistsPage />;
}
