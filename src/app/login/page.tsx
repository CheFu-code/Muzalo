import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  buildChefuAccountLoginUrl,
  currentRequestOrigin,
  safeNextPath,
} from '@/lib/chefu-account';
import { getCurrentUser } from '@/lib/server-session';

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to Muzalo with your CheFu Account.',
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);
  const user = await getCurrentUser();

  if (user) {
    redirect(nextPath);
  }

  const origin = await currentRequestOrigin();
  redirect(
    buildChefuAccountLoginUrl({
      app: 'muzalo',
      returnTo: new URL(nextPath, origin).toString(),
    }),
  );
}
