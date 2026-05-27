export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.chefuinc.com';

export function apiUrl(path: string) {
  return `${API_BASE_URL.replace(/\/$/, '')}${
    path.startsWith('/') ? path : `/${path}`
  }`;
}

export const MUSIC_APP_HEADER = {
  'x-chefu-app': 'muzalo',
} as const;
