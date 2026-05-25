import type { ReactNode } from 'react';
import { MusicShell } from '../components/MusicShell';
import { requireUser } from '@/lib/server-session';

export default async function LibraryLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await requireUser();

  return <MusicShell user={user}>{children}</MusicShell>;
}
