import type { SpotifyEmbedKind } from "../data/musicData";

type SpotifyEmbedProps = {
  title: string;
  src: string;
  kind?: SpotifyEmbedKind;
  compact?: boolean;
};

export function SpotifyEmbed({ title, src, kind = "artist", compact = false }: SpotifyEmbedProps) {
  const height = compact || kind === "track" ? 152 : 352;

  return (
    <iframe
      title={title}
      src={src}
      width="100%"
      height={height}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="block rounded-xl border-0"
    />
  );
}
