'use client';

import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useState, type ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { UserDropdown } from './UserDropdown';
import type { AuthUser } from '@/lib/server-session';
import { apiUrl } from '@/lib/api';
import { buildChefuAccountLogoutUrl } from '@/lib/chefu-account';
import { getFirebaseAuth } from '@/lib/firebase';

type MusicShellClientProps = {
  children: ReactNode;
  manageAccountUrl: string;
  user: AuthUser;
};

export function MusicShellClient({ children, manageAccountUrl, user }: MusicShellClientProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [pendingSignOut, setPendingSignOut] = useState(false);

  async function handleSignOut() {
    setPendingSignOut(true);

    try {
      await fetch(apiUrl('/auth/session'), {
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
      setPendingSignOut(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <aside
        className={`flex h-screen shrink-0 flex-col border-r border-gray-800 bg-gray-950/70 backdrop-blur-lg transition-[width] duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`flex items-center gap-3 p-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <img
              src="/muzalo-logo.svg"
              alt=""
              className="h-10 w-10 shrink-0 rounded-lg transition-transform group-hover:scale-110"
            />
            {!collapsed ? <h1 className="truncate text-2xl font-semibold text-white">Muzalo</h1> : null}
          </Link>
          {!collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-800 hover:text-white"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        {collapsed ? (
          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="flex h-10 w-full items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-800 hover:text-white"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          </div>
        ) : null}

        <SidebarNav collapsed={collapsed} />

        <div className={`border-t border-gray-800 p-4 ${collapsed ? 'space-y-3' : 'space-y-4'}`}>
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-purple-500 text-sm font-bold text-white"
              aria-label="Open account menu"
              title={user.name || user.email || 'Listener'}
            >
              {(user.name || user.email || 'M').slice(0, 1).toUpperCase()}
            </button>
          ) : (
            <UserDropdown
              email={user.email}
              manageAccountUrl={manageAccountUrl}
              name={user.name}
              onSignOut={handleSignOut}
              pendingSignOut={pendingSignOut}
            />
          )}
          {!collapsed ? (
            <div className="text-xs text-gray-500">
              <p>(c) 2026 Muzalo. All rights reserved.</p>
            </div>
          ) : null}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
