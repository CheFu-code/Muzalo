'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  Mic2,
  Send,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { apiUrl, MUSIC_APP_HEADER } from '@/lib/api';

type ArtistProfileStatus = 'none' | 'pending' | 'approved' | 'rejected';

type ArtistProfile = {
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

type ArtistProfileResponse = {
  artistProfile?: ArtistProfile;
  error?: string;
  message?: string;
};

type ArtistProfileRequestProps = {
  collapsed?: boolean;
  roles: string[];
};

type FormFields = {
  artistName: string;
  message: string;
  primaryGenre: string;
  spotifyUrl: string;
  websiteUrl: string;
};

const emptyFields: FormFields = {
  artistName: '',
  message: '',
  primaryGenre: '',
  spotifyUrl: '',
  websiteUrl: '',
};

export function ArtistProfileRequest({
  collapsed = false,
  roles,
}: ArtistProfileRequestProps) {
  const hasArtistRole = roles.some(role => role.trim().toLowerCase() === 'artist');
  const [artistProfile, setArtistProfile] = useState<ArtistProfile>({
    status: hasArtistRole ? 'approved' : 'none',
  });
  const [error, setError] = useState('');
  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const statusTone = useMemo(() => statusUi(artistProfile.status), [artistProfile.status]);

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
        setFields(fieldsFromProfile(data.artistProfile));
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
    (field: keyof FormFields) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields(current => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!fields.artistName.trim()) {
      setError('Enter your artist or stage name.');
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
        setFields(fieldsFromProfile(data.artistProfile));
      }

      setOpen(false);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : 'Artist profile request failed.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (collapsed) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`flex h-11 w-full items-center justify-center rounded-xl border transition ${
            statusTone.collapsedClassName
          }`}
          aria-label={statusTone.actionLabel}
          title={statusTone.title}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : statusTone.icon}
        </button>
        {open ? renderDialog() : null}
      </>
    );
  }

  return (
    <>
      <section className={`rounded-2xl border p-3 sm:p-4 ${statusTone.cardClassName}`}>
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${statusTone.iconClassName}`}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : statusTone.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs font-semibold text-white sm:text-sm">{statusTone.title}</h2>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusTone.badgeClassName}`}>
                {statusTone.badge}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-gray-400 sm:text-xs">
              {artistProfile.artistName
                ? artistProfile.artistName
                : statusTone.description}
            </p>
            {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-950 transition hover:bg-purple-100 sm:text-xs"
            >
              {statusTone.actionLabel}
            </button>
          </div>
        </div>
      </section>
      {open ? renderDialog() : null}
    </>
  );

  function renderDialog() {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Request artist profile"
      >
        <form
          onSubmit={submitRequest}
          className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-gray-950 p-4 shadow-2xl shadow-black/50 sm:rounded-3xl sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                Muzalo artist profile
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                Request artist access
              </h2>
              <p className="mt-2 text-xs leading-5 text-gray-400 sm:text-sm sm:leading-6">
                Send your artist details for review. Your account stays a normal listener
                account until the request is approved.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-gray-200">
              Artist or stage name
              <input
                value={fields.artistName}
                onChange={updateField('artistName')}
                className="rounded-2xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-gray-600 focus:border-purple-300 sm:py-3"
                placeholder="e.g. Muzalo Artist"
                maxLength={80}
                disabled={saving}
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-gray-200">
              Primary genre
              <input
                value={fields.primaryGenre}
                onChange={updateField('primaryGenre')}
                className="rounded-2xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-gray-600 focus:border-purple-300 sm:py-3"
                placeholder="Amapiano, Hip Hop, R&B..."
                maxLength={60}
                disabled={saving}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-gray-200">
                Spotify artist link
                <input
                  value={fields.spotifyUrl}
                  onChange={updateField('spotifyUrl')}
                  className="rounded-2xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-gray-600 focus:border-purple-300 sm:py-3"
                  placeholder="https://open.spotify.com/artist/..."
                  disabled={saving}
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-gray-200">
                Website or social link
                <input
                  value={fields.websiteUrl}
                  onChange={updateField('websiteUrl')}
                  className="rounded-2xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-gray-600 focus:border-purple-300 sm:py-3"
                  placeholder="https://..."
                  disabled={saving}
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-gray-200">
              Notes for review
              <textarea
                value={fields.message}
                onChange={updateField('message')}
                className="min-h-24 resize-y rounded-2xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-gray-600 focus:border-purple-300 sm:min-h-28 sm:py-3"
                placeholder="Tell us what you want to manage or publish on Muzalo."
                maxLength={700}
                disabled={saving}
              />
            </label>
          </div>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-gray-200 transition hover:bg-white/10 sm:px-5 sm:py-2.5 sm:text-sm"
              disabled={saving}
            >
              Cancel
            </button>
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
          </div>
        </form>
      </div>
    );
  }
}

function fieldsFromProfile(profile: ArtistProfile): FormFields {
  return {
    artistName: profile.artistName || '',
    message: profile.message || '',
    primaryGenre: profile.primaryGenre || '',
    spotifyUrl: profile.spotifyUrl || '',
    websiteUrl: profile.websiteUrl || '',
  };
}

async function responseJson<T extends { error?: string; message?: string }>(
  response: Response,
) {
  const data = (await response.json().catch(() => ({}))) as T;

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Muzalo request failed.');
  }

  return data;
}

function statusUi(status: ArtistProfileStatus) {
  if (status === 'approved') {
    return {
      actionLabel: 'View details',
      badge: 'Active',
      badgeClassName: 'bg-emerald-300/15 text-emerald-200',
      cardClassName: 'border-emerald-300/20 bg-emerald-300/5',
      collapsedClassName: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200 hover:bg-emerald-300/20',
      description: 'Your account can use artist tools.',
      icon: <CheckCircle2 className="h-5 w-5" />,
      iconClassName: 'bg-emerald-300/15 text-emerald-200',
      title: 'Artist profile active',
    };
  }

  if (status === 'pending') {
    return {
      actionLabel: 'Edit request',
      badge: 'Pending',
      badgeClassName: 'bg-amber-300/15 text-amber-200',
      cardClassName: 'border-amber-300/20 bg-amber-300/5',
      collapsedClassName: 'border-amber-300/20 bg-amber-300/10 text-amber-200 hover:bg-amber-300/20',
      description: 'Your artist request is waiting for review.',
      icon: <Clock3 className="h-5 w-5" />,
      iconClassName: 'bg-amber-300/15 text-amber-200',
      title: 'Artist request pending',
    };
  }

  if (status === 'rejected') {
    return {
      actionLabel: 'Resubmit',
      badge: 'Review',
      badgeClassName: 'bg-red-300/15 text-red-200',
      cardClassName: 'border-red-300/20 bg-red-300/5',
      collapsedClassName: 'border-red-300/20 bg-red-300/10 text-red-200 hover:bg-red-300/20',
      description: 'Update your details and send it again.',
      icon: <AlertCircle className="h-5 w-5" />,
      iconClassName: 'bg-red-300/15 text-red-200',
      title: 'Request needs updates',
    };
  }

  return {
    actionLabel: 'Request',
    badge: 'User',
    badgeClassName: 'bg-sky-300/15 text-sky-200',
    cardClassName: 'border-sky-300/20 bg-sky-300/5',
    collapsedClassName: 'border-sky-300/20 bg-sky-300/10 text-sky-200 hover:bg-sky-300/20',
    description: 'Open a request to become an artist account.',
    icon: <Mic2 className="h-5 w-5" />,
    iconClassName: 'bg-sky-300/15 text-sky-200',
    title: 'Artist profile',
  };
}
