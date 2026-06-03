'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { apiUrl } from '@/lib/api';
import { buildChefuAccountLogoutUrl } from '@/lib/chefu-account';
import { getFirebaseAuth } from '@/lib/firebase';

export function SignOutButton() {
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    setPending(true);

    try {
      await fetch(apiUrl('/auth/session?global=true'), {
        method: 'DELETE',
        credentials: 'include',
      });

      try {
        await signOut(getFirebaseAuth());
      } catch {
        // The backend session is the source of truth for protected SSR routes.
      }

      window.location.assign(
        buildChefuAccountLogoutUrl(`${window.location.origin}/login`),
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-purple-500/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="w-4 h-4" />
      {pending ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
