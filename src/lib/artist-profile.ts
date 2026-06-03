export type ArtistProfileStatus = 'approved' | 'none' | 'pending' | 'rejected';

export type ArtistProfile = {
  artistName?: string;
  message?: string;
  primaryGenre?: string;
  requestedAt?: string | null;
  requestId?: string;
  reviewedAt?: string | null;
  reviewedBy?: string;
  spotifyUrl?: string;
  status: ArtistProfileStatus;
  updatedAt?: string | null;
  websiteUrl?: string;
};

export type ArtistProfileResponse = {
  artistProfile?: ArtistProfile;
  error?: string;
  message?: string;
};

export type ArtistProfileFormFields = {
  artistName: string;
  message: string;
  primaryGenre: string;
  spotifyUrl: string;
  websiteUrl: string;
};

export const emptyArtistProfileFields: ArtistProfileFormFields = {
  artistName: '',
  message: '',
  primaryGenre: '',
  spotifyUrl: '',
  websiteUrl: '',
};

export function fieldsFromArtistProfile(
  profile: ArtistProfile,
): ArtistProfileFormFields {
  return {
    artistName: profile.artistName || '',
    message: profile.message || '',
    primaryGenre: profile.primaryGenre || '',
    spotifyUrl: profile.spotifyUrl || '',
    websiteUrl: profile.websiteUrl || '',
  };
}

export function hasArtistRole(roles: string[]) {
  return roles.some(role => role.trim().toLowerCase() === 'artist');
}

export async function responseJson<T extends { error?: string; message?: string }>(
  response: Response,
) {
  const data = (await response.json().catch(() => ({}))) as T;

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Muzalo request failed.');
  }

  return data;
}
