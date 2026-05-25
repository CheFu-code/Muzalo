export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export function apiUrl(path: string) {
  return `${API_BASE_URL.replace(/\/$/, '')}${
    path.startsWith('/') ? path : `/${path}`
  }`;
}

export const MUSIC_APP_HEADER = {
  'x-chefu-app': 'music',
} as const;
