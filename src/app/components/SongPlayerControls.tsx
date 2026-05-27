'use client';

import { ExternalLink, Heart, Pause, Play, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type SongPlayerControlsProps = {
  duration: string;
  previewUrl: string | null;
  spotifyUrl: string;
};

export function SongPlayerControls({ duration, previewUrl, spotifyUrl }: SongPlayerControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  async function togglePlayback() {
    if (!previewUrl) {
      window.open(spotifyUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    await audio.play();
    setIsPlaying(true);
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
      {previewUrl ? (
        <audio
          ref={audioRef}
          src={previewUrl}
          onEnded={() => setIsPlaying(false)}
          preload="none"
        />
      ) : null}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={togglePlayback}
          className="w-16 h-16 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg"
          aria-label={previewUrl ? (isPlaying ? 'Pause preview' : 'Play preview') : 'Open on Spotify'}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" fill="white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          )}
        </button>
        {spotifyUrl ? (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-700/80 px-4 text-sm font-semibold text-gray-200 transition hover:border-purple-500/70 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Spotify
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => setIsLiked(!isLiked)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
            isLiked
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700/50 text-gray-400 hover:text-white'
          }`}
          aria-label={isLiked ? 'Unlike song' : 'Like song'}
        >
          <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-gray-400 w-12 text-right">0:00</span>
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden group cursor-pointer">
            <div className="h-full w-1/3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full group-hover:from-purple-500 group-hover:to-pink-500 transition-colors relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
            </div>
          </div>
          <span className="text-sm text-gray-400 w-12">{duration}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <p className="text-sm text-gray-400">
            {previewUrl ? 'Preview audio provided by Spotify.' : 'Preview unavailable. Open the full track on Spotify.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={event => setVolume(Number(event.currentTarget.value))}
            className="w-32 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            aria-label="Volume"
          />
          <span className="text-sm text-gray-400 w-8">{volume}%</span>
        </div>
      </div>
    </div>
  );
}
