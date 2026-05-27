import Link from 'next/link';
import { Music, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { SignOutButton } from './auth/SignOutButton';
import type { AuthUser } from '@/lib/server-session';
import { buildChefuAccountManageUrl } from '@/lib/chefu-account';

type MusicShellProps = {
  children: ReactNode;
  user: AuthUser;
};

export function MusicShell({ children, user }: MusicShellProps) {
  const userLabel = user.name || user.email || 'Listener';

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <aside className="w-64 bg-gray-950/50 backdrop-blur-lg border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Muzalo</h1>
          </Link>
        </div>

        <SidebarNav />

        <div className="p-6 border-t border-gray-800 space-y-4">
          <div>
            <p className="text-sm font-medium text-white truncate">{userLabel}</p>
            {user.email ? (
              <p className="mt-1 text-xs text-gray-500 truncate">{user.email}</p>
            ) : null}
          </div>
          <a
            href={buildChefuAccountManageUrl('/')}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-800 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:border-purple-500/60 hover:bg-purple-500/10 hover:text-white"
          >
            <UserRound className="h-4 w-4" />
            Manage account
          </a>
          <SignOutButton />
          <div className="text-xs text-gray-500">
            <p>(c) 2026 Muzalo</p>
            <p className="mt-1">Your personal music library</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
