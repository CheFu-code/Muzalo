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

export function SidebarNav() {
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
