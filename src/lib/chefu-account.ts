const CHEFU_ACCOUNT_URL =
  process.env.NEXT_PUBLIC_CHEFU_ACCOUNT_URL || 'https://myaccount.chefuinc.com';

const DEFAULT_MUZALO_ORIGINS = [
  'https://muzalo.chefuinc.com',
  'https://music.chefuinc.com',
  'http://localhost:3002',
  'http://127.0.0.1:3002',
];

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
  url.searchParams.set('app', 'muzalo');
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
  const candidate = normalizeOrigin(`${protocol}://${host}`);

  if (candidate && allowedMuzaloOrigins().has(candidate)) {
    return candidate;
  }

  return DEFAULT_MUZALO_ORIGINS[0];
}

export function safeNextPath(value?: string) {
  return value?.startsWith('/') &&
    !value.startsWith('//') &&
    !value.startsWith('/\\') &&
    !hasUnsafePathCharacters(value)
    ? value
    : '/';
}

function hasUnsafePathCharacters(value: string) {
  return Array.from(value).some(
    character => character === '\\' || character.charCodeAt(0) < 0x20,
  );
}

function allowedMuzaloOrigins() {
  const configuredOrigins =
    process.env.NEXT_PUBLIC_ALLOWED_MUZALO_ORIGINS?.split(',') || [];

  return new Set(
    [...DEFAULT_MUZALO_ORIGINS, ...configuredOrigins]
      .map(origin => normalizeOrigin(origin))
      .filter((origin): origin is string => Boolean(origin)),
  );
}

function normalizeOrigin(value?: string) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}
