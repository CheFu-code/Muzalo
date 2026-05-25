import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl, MUSIC_APP_HEADER } from '@/lib/api';

export type AuthUser = {
  uid: string;
  email: string;
  name?: string;
  roles: string[];
};

type MeResponse = {
  user?: AuthUser;
};

export async function getCurrentUser() {
  const cookieHeader = await getCookieHeader();

  if (!cookieHeader) return null;

  const response = await fetch(apiUrl('/auth/me'), {
    headers: {
      cookie: cookieHeader,
      ...MUSIC_APP_HEADER,
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;

  const data = (await response.json().catch(() => null)) as MeResponse | null;
  return data?.user || null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');
}
