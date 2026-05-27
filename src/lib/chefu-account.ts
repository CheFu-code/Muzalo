const CHEFU_ACCOUNT_URL =
  process.env.NEXT_PUBLIC_CHEFU_ACCOUNT_URL || 'https://chefuinc.com';

export function buildChefuAccountLoginUrl({
  app,
  returnTo,
}: {
  app: 'muzalo';
  returnTo: string;
}) {
  const url = new URL('/login', CHEFU_ACCOUNT_URL);
  url.searchParams.set('app', app);
  url.searchParams.set('returnTo', returnTo);
  return url.toString();
}

export function buildChefuAccountLogoutUrl(returnTo: string) {
  const url = new URL('/logout', CHEFU_ACCOUNT_URL);
  url.searchParams.set('returnTo', returnTo);
  return url.toString();
}

export function buildChefuAccountManageUrl(returnTo: string) {
  const url = new URL('/account', CHEFU_ACCOUNT_URL);
  url.searchParams.set('app', 'muzalo');
  url.searchParams.set('returnTo', returnTo);
  return url.toString();
}

export async function currentRequestOrigin() {
  const { headers } = await import('next/headers');
  const headerStore = await headers();
  const host =
    headerStore.get('x-forwarded-host') ||
    headerStore.get('host') ||
    'muzalo.chefuinc.com';
  const protocol =
    headerStore.get('x-forwarded-proto') ||
    (host.startsWith('localhost') || host.startsWith('127.0.0.1')
      ? 'http'
      : 'https');

  return `${protocol}://${host}`;
}

export function safeNextPath(value?: string) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/';
}
