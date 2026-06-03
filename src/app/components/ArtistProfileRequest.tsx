'use client';

import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  Mic2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  type ArtistProfile,
  type ArtistProfileResponse,
  hasArtistRole,
  responseJson,
} from '@/lib/artist-profile';
import { apiUrl, MUSIC_APP_HEADER } from '@/lib/api';

type ArtistProfileRequestProps = {
  collapsed?: boolean;
  roles: string[];
};

const requestHref = '/artist-profile/request';

export function ArtistProfileRequest({
  collapsed = false,
  roles,
}: ArtistProfileRequestProps) {
  const [artistProfile, setArtistProfile] = useState<ArtistProfile>({
    status: hasArtistRole(roles) ? 'approved' : 'none',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const statusTone = useMemo(
    () => statusUi(artistProfile.status),
    [artistProfile.status],
  );

  useEffect(() => {
    let active = true;

    fetch(apiUrl('/muzalo/profile'), {
      credentials: 'include',
      headers: MUSIC_APP_HEADER,
    })
      .then(response => responseJson<ArtistProfileResponse>(response))
      .then(data => {
        if (!active || !data.artistProfile) return;
        setArtistProfile(data.artistProfile);
      })
      .catch(nextError => {
        if (!active) return;
        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Artist profile status could not be loaded.',
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (collapsed) {
    return (
      <Link
        aria-label={statusTone.actionLabel}
        className={`flex h-11 w-full items-center justify-center rounded-xl border transition ${
          statusTone.collapsedClassName
        }`}
        href={requestHref}
        title={statusTone.title}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : statusTone.icon}
      </Link>
    );
  }

  return (
    <section className={`rounded-2xl border p-3 sm:p-4 ${statusTone.cardClassName}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${statusTone.iconClassName}`}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : statusTone.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-semibold text-white sm:text-sm">
              {statusTone.title}
            </h2>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusTone.badgeClassName}`}
            >
              {statusTone.badge}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-5 text-gray-400 sm:text-xs">
            {artistProfile.artistName || statusTone.description}
          </p>
          {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
          <Link
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-950 transition hover:bg-purple-100 sm:text-xs"
            href={requestHref}
          >
            {statusTone.actionLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

function statusUi(status: ArtistProfile['status']) {
  if (status === 'approved') {
    return {
      actionLabel: 'View profile',
      badge: 'Active',
      badgeClassName: 'bg-emerald-300/15 text-emerald-200',
      cardClassName: 'border-emerald-300/20 bg-emerald-300/5',
      collapsedClassName:
        'border-emerald-300/20 bg-emerald-300/10 text-emerald-200 hover:bg-emerald-300/20',
      description: 'Your account can use artist tools.',
      icon: <CheckCircle2 className="h-5 w-5" />,
      iconClassName: 'bg-emerald-300/15 text-emerald-200',
      title: 'Artist profile active',
    };
  }

  if (status === 'pending') {
    return {
      actionLabel: 'View request',
      badge: 'Pending',
      badgeClassName: 'bg-amber-300/15 text-amber-200',
      cardClassName: 'border-amber-300/20 bg-amber-300/5',
      collapsedClassName:
        'border-amber-300/20 bg-amber-300/10 text-amber-200 hover:bg-amber-300/20',
      description: 'Your artist request is waiting for review.',
      icon: <Clock3 className="h-5 w-5" />,
      iconClassName: 'bg-amber-300/15 text-amber-200',
      title: 'Artist request pending',
    };
  }

  if (status === 'rejected') {
    return {
      actionLabel: 'Update request',
      badge: 'Review',
      badgeClassName: 'bg-red-300/15 text-red-200',
      cardClassName: 'border-red-300/20 bg-red-300/5',
      collapsedClassName:
        'border-red-300/20 bg-red-300/10 text-red-200 hover:bg-red-300/20',
      description: 'Update your details and send it again.',
      icon: <AlertCircle className="h-5 w-5" />,
      iconClassName: 'bg-red-300/15 text-red-200',
      title: 'Request needs updates',
    };
  }

  return {
    actionLabel: 'Request profile',
    badge: 'User',
    badgeClassName: 'bg-sky-300/15 text-sky-200',
    cardClassName: 'border-sky-300/20 bg-sky-300/5',
    collapsedClassName:
      'border-sky-300/20 bg-sky-300/10 text-sky-200 hover:bg-sky-300/20',
    description: 'Open a request to become an artist account.',
    icon: <Mic2 className="h-5 w-5" />,
    iconClassName: 'bg-sky-300/15 text-sky-200',
    title: 'Artist profile',
  };
}
