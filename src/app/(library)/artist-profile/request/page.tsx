import type { Metadata } from 'next';
import { ArtistProfileRequestForm } from '../../../components/ArtistProfileRequestForm';
import { requireUser } from '@/lib/server-session';

export const metadata: Metadata = {
  title: 'Artist Profile Request',
  description: 'Request Muzalo artist profile access.',
};

export default async function ArtistProfileRequestRoute() {
  const user = await requireUser();

  return <ArtistProfileRequestForm roles={user.roles} />;
}
