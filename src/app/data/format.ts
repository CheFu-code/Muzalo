export function formatArtistUrl(artistName: string): string {
  return formatRouteValue(artistName);
}

export function formatSongUrl(songName: string): string {
  return formatRouteValue(songName);
}

export function formatRouteValue(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
