'use client';

import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Mic2,
  Send,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import {
  emptyArtistProfileFields,
  fieldsFromArtistProfile,
  hasArtistRole,
  responseJson,
  type ArtistProfile,
  type ArtistProfileFormFields,
  type ArtistProfileResponse,
} from '@/lib/artist-profile';
import { apiUrl, MUSIC_APP_HEADER } from '@/lib/api';

type ArtistProfileRequestFormProps = {
  roles: string[];
};

export function ArtistProfileRequestForm({
  roles,
}: ArtistProfileRequestFormProps) {
  const userIsArtist = hasArtistRole(roles);
  const [artistProfile, setArtistProfile] = useState<ArtistProfile>({
    status: userIsArtist ? 'approved' : 'none',
  });
  const [fields, setFields] = useState<ArtistProfileFormFields>(
    emptyArtistProfileFields,
  );
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const statusTone = useMemo(
    () => statusUi(artistProfile.status),
    [artistProfile.status],
  );
  const canEdit = artistProfile.status !== 'approved' && !userIsArtist;

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
        setFields(fieldsFromArtistProfile(data.artistProfile));
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

  const updateField =
    (field: keyof ArtistProfileFormFields) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields(current => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!fields.artistName.trim()) {
      setError('Enter your artist or stage name.');
      return;
    }

    if (!fields.spotifyUrl.trim()) {
      setError('Enter your Spotify artist link.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(apiUrl('/muzalo/artist-profile-request'), {
        body: JSON.stringify(fields),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...MUSIC_APP_HEADER,
        },
        method: 'POST',
      });
      const data = await responseJson<ArtistProfileResponse>(response);

      if (data.artistProfile) {
        setArtistProfile(data.artistProfile);
        setFields(fieldsFromArtistProfile(data.artistProfile));
      }

      setNotice('Artist profile request sent.');
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Artist profile request failed.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-200 transition hover:text-white"
            href="/"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to library
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Artist profile request
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            Request artist access for releases, profile ownership, and creator tools.
          </p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <aside
          className={`rounded-2xl border p-4 sm:p-5 ${statusTone.cardClassName}`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${statusTone.iconClassName}`}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                statusTone.icon
              )}
            </div>
            <div className="min-w-0">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusTone.badgeClassName}`}
              >
                {statusTone.badge}
              </span>
              <h2 className="mt-3 text-xl font-semibold text-white">
                {statusTone.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                {statusTone.description}
              </p>
              {artistProfile.requestedAt ? (
                <p className="mt-4 text-xs text-gray-500">
                  Requested {formatDate(artistProfile.requestedAt)}
                </p>
              ) : null}
              {artistProfile.reviewedAt ? (
                <p className="mt-1 text-xs text-gray-500">
                  Reviewed {formatDate(artistProfile.reviewedAt)}
                </p>
              ) : null}
            </div>
          </div>
        </aside>

        <form
          className="rounded-2xl border border-white/10 bg-gray-900/70 p-4 shadow-2xl shadow-black/20 sm:p-6"
          onSubmit={submitRequest}
        >
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-gray-200">
              Artist or stage name
              <input
                value={fields.artistName}
                onChange={updateField('artistName')}
                className="rounded-2xl border border-white/10 bg-gray-950/80 px-4 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-gray-600 focus:border-purple-300 sm:py-3"
                placeholder="e.g. Muzalo Artist"
                maxLength={80}
                disabled={!canEdit || saving}
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-gray-200">
              Primary genre
              <input
                value={fields.primaryGenre}
                onChange={updateField('primaryGenre')}
                className="rounded-2xl border border-white/10 bg-gray-950/80 px-4 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-gray-600 focus:border-purple-300 sm:py-3"
                placeholder="Amapiano, Hip Hop, R&B..."
                maxLength={60}
                disabled={!canEdit || saving}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-gray-200">
                Spotify artist link
                <input
                  value={fields.spotifyUrl}
                  onChange={updateField('spotifyUrl')}
                  className="rounded-2xl border border-white/10 bg-gray-950/80 px-4 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-gray-600 focus:border-purple-300 sm:py-3"
                  placeholder="https://open.spotify.com/artist/..."
                  required
                  disabled={!canEdit || saving}
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-gray-200">
                Website or social link
                <input
                  value={fields.websiteUrl}
                  onChange={updateField('websiteUrl')}
                  className="rounded-2xl border border-white/10 bg-gray-950/80 px-4 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-gray-600 focus:border-purple-300 sm:py-3"
                  placeholder="https://..."
                  disabled={!canEdit || saving}
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-gray-200">
              Notes for review
              <textarea
                value={fields.message}
                onChange={updateField('message')}
                className="min-h-32 resize-y rounded-2xl border border-white/10 bg-gray-950/80 px-4 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-gray-600 focus:border-purple-300 sm:min-h-40 sm:py-3"
                placeholder="Tell us what you want to manage or publish on Muzalo."
                maxLength={700}
                disabled={!canEdit || saving}
              />
            </label>
          </div>

          {error ? (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-100">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {notice ? (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{notice}</span>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Link
              className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-gray-200 transition hover:bg-white/10 sm:px-5 sm:py-2.5 sm:text-sm"
              href="/"
            >
              Cancel
            </Link>
            {canEdit ? (
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-purple-400 px-4 py-2 text-xs font-bold text-gray-950 transition hover:bg-purple-300 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-2.5 sm:text-sm"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit request
                  </>
                )}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

function statusUi(status: ArtistProfile['status']) {
  if (status === 'approved') {
    return {
      badge: 'Active',
      badgeClassName: 'bg-emerald-300/15 text-emerald-200',
      cardClassName: 'border-emerald-300/20 bg-emerald-300/5',
      description: 'This account has artist access.',
      icon: <CheckCircle2 className="h-5 w-5" />,
      iconClassName: 'bg-emerald-300/15 text-emerald-200',
      title: 'Artist profile active',
    };
  }

  if (status === 'pending') {
    return {
      badge: 'Pending',
      badgeClassName: 'bg-amber-300/15 text-amber-200',
      cardClassName: 'border-amber-300/20 bg-amber-300/5',
      description: 'Your request is waiting for admin review.',
      icon: <Clock3 className="h-5 w-5" />,
      iconClassName: 'bg-amber-300/15 text-amber-200',
      title: 'Request pending',
    };
  }

  if (status === 'rejected') {
    return {
      badge: 'Review',
      badgeClassName: 'bg-red-300/15 text-red-200',
      cardClassName: 'border-red-300/20 bg-red-300/5',
      description: 'Update the request details and submit again.',
      icon: <AlertCircle className="h-5 w-5" />,
      iconClassName: 'bg-red-300/15 text-red-200',
      title: 'Request needs updates',
    };
  }

  return {
    badge: 'User',
    badgeClassName: 'bg-sky-300/15 text-sky-200',
    cardClassName: 'border-sky-300/20 bg-sky-300/5',
    description: 'This account is currently a listener account.',
    icon: <Mic2 className="h-5 w-5" />,
    iconClassName: 'bg-sky-300/15 text-sky-200',
    title: 'Artist profile',
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
