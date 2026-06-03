'use client';

import Link from 'next/link';
import { Disc, Home, ListMusic, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/genres', label: 'Genres', icon: Disc },
  { path: '/playlists', label: 'Playlists', icon: ListMusic },
];

export function SidebarNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3">
      <div className="space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive =
            path === '/' ? pathname === path : pathname.startsWith(path);

          return (
            <Link
              key={path}
              href={path}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all sm:px-4 sm:py-3 sm:text-base ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              } ${collapsed ? 'justify-center px-3' : ''}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span className="font-medium">{label}</span> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
