import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LoginClient } from '../components/auth/LoginClient';
import { getCurrentUser } from '@/lib/server-session';

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to SoundWave.',
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  const { next } = await searchParams;

  if (user) {
    redirect(next?.startsWith('/') ? next : '/');
  }

  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
