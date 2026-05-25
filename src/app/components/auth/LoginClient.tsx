'use client';

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  type Auth,
} from 'firebase/auth';
import { AlertCircle, CheckCircle2, Loader2, Music } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { syncSessionCookie } from '@/lib/client-session';
import { getFirebaseAuth } from '@/lib/firebase';
import { friendlyAuthError } from './auth-errors';

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => {
    const next = searchParams.get('next') || '/';
    return next.startsWith('/') ? next : '/';
  }, [searchParams]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [emailPending, startEmailTransition] = useTransition();
  const [googlePending, startGoogleTransition] = useTransition();
  const [resetPending, startResetTransition] = useTransition();

  useEffect(() => {
    let currentAuth: Auth;

    try {
      currentAuth = getFirebaseAuth();
    } catch (nextError) {
      queueMicrotask(() => {
        setError(friendlyAuthError(nextError));
        setCheckingSession(false);
      });
      return undefined;
    }

    return onAuthStateChanged(currentAuth, nextUser => {
      if (!nextUser) {
        setCheckingSession(false);
        return;
      }

      syncSessionCookie()
        .then(() => {
          router.replace(nextPath);
          router.refresh();
        })
        .catch(nextError => {
          setError(friendlyAuthError(nextError));
          setCheckingSession(false);
        });
    });
  }, [nextPath, router]);

  const completeSignIn = async () => {
    await syncSessionCookie();
    router.replace(nextPath);
    router.refresh();
  };

  const handleEmailSignIn = () => {
    setError(null);
    setResetSent(false);

    startEmailTransition(async () => {
      try {
        const currentAuth = getFirebaseAuth();
        await signInWithEmailAndPassword(currentAuth, email.trim(), password);
        await completeSignIn();
      } catch (nextError) {
        setError(friendlyAuthError(nextError));
      }
    });
  };

  const handleGoogleSignIn = () => {
    setError(null);
    setResetSent(false);

    startGoogleTransition(async () => {
      try {
        const currentAuth = getFirebaseAuth();
        await signInWithPopup(currentAuth, new GoogleAuthProvider());
        await completeSignIn();
      } catch (nextError) {
        setError(friendlyAuthError(nextError));
      }
    });
  };

  const handlePasswordReset = () => {
    const resetEmail = email.trim();
    setError(null);
    setResetSent(false);

    if (!resetEmail) {
      setError('Enter your email address first.');
      return;
    }

    startResetTransition(async () => {
      try {
        const currentAuth = getFirebaseAuth();
        await sendPasswordResetEmail(currentAuth, resetEmail);
        setResetSent(true);
      } catch (nextError) {
        setError(friendlyAuthError(nextError));
      }
    });
  };

  const anyPending =
    checkingSession || emailPending || googlePending || resetPending;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center gap-12">
        <div className="hidden max-w-xl lg:block">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
              <Music className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">
              SoundWave
            </p>
          </div>
          <h1 className="text-5xl font-semibold leading-tight">
            Your private music library, ready when you are.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-gray-300">
            Sign in with your CheFu account to open your artists, playlists, and
            listening workspace.
          </p>
        </div>

        <div className="w-full max-w-md rounded-xl border border-gray-700/70 bg-gray-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-400">
              Continue to SoundWave with your CheFu account.
            </p>
          </div>

          {checkingSession ? (
            <AuthNotice>
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking your current session...
            </AuthNotice>
          ) : null}

          {error ? (
            <AuthNotice variant="error">
              <AlertCircle className="h-4 w-4" />
              {error}
            </AuthNotice>
          ) : null}

          {resetSent ? (
            <AuthNotice>
              <CheckCircle2 className="h-4 w-4" />
              Password reset link sent. Check your inbox.
            </AuthNotice>
          ) : null}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={anyPending}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-3 font-medium text-gray-100 transition-colors hover:border-purple-500 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googlePending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-gray-500">
            <div className="h-px flex-1 bg-gray-800" />
            <span>Email</span>
            <div className="h-px flex-1 bg-gray-800" />
          </div>

          <form
            className="space-y-4"
            onSubmit={event => {
              event.preventDefault();
              handleEmailSignIn();
            }}
          >
            <div>
              <label
                htmlFor="music-auth-email"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Email
              </label>
              <input
                id="music-auth-email"
                type="email"
                value={email}
                onChange={event => setEmail(event.currentTarget.value)}
                autoComplete="email"
                placeholder="you@chefuinc.com"
                className="w-full rounded-lg border border-gray-700 bg-gray-950/70 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="music-auth-password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <button
                  type="button"
                  disabled={resetPending || !email.trim()}
                  onClick={handlePasswordReset}
                  className="text-sm text-purple-300 transition-colors hover:text-purple-200 disabled:cursor-not-allowed disabled:text-gray-600"
                >
                  {resetPending ? 'Sending...' : 'Forgot password?'}
                </button>
              </div>
              <input
                id="music-auth-password"
                type="password"
                value={password}
                onChange={event => setPassword(event.currentTarget.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-700 bg-gray-950/70 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={anyPending || !email.trim() || !password}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {emailPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign in
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function AuthNotice({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'error';
}) {
  return (
    <div
      className={`mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
        variant === 'error'
          ? 'border-red-500/30 bg-red-500/10 text-red-100'
          : 'border-purple-500/30 bg-purple-500/10 text-purple-100'
      }`}
    >
      {children}
    </div>
  );
}
