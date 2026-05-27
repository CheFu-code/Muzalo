'use client';

import { ChevronDown, ExternalLink, LogOut, UserRound } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export type UserDropdownProps = {
  email?: string | null;
  manageAccountUrl: string;
  name?: string | null;
  onSignOut: () => void | Promise<void>;
  pendingSignOut?: boolean;
  triggerClassName?: string;
};

export function UserDropdown({
  email,
  manageAccountUrl,
  name,
  onSignOut,
  pendingSignOut = false,
  triggerClassName = '',
}: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const label = name || email || 'Listener';
  const initials = getInitials(label);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/60 p-2 text-left transition hover:border-purple-500/60 hover:bg-purple-500/10 ${triggerClassName}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500 text-sm font-bold text-white">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">{label}</span>
          {email ? <span className="block truncate text-xs text-gray-500">{email}</span> : null}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          className="absolute bottom-[calc(100%+0.75rem)] left-0 z-30 w-72 overflow-hidden rounded-2xl border border-gray-800 bg-gray-950/95 shadow-2xl shadow-black/40 backdrop-blur"
          role="menu"
        >
          <div className="border-b border-gray-800 p-4">
            <p className="truncate text-sm font-semibold text-white">{label}</p>
            {email ? <p className="mt-1 truncate text-xs text-gray-500">{email}</p> : null}
          </div>
          <MenuLink href={manageAccountUrl}>
            <UserRound className="h-4 w-4" />
            Manage account
            <ExternalLink className="ml-auto h-3.5 w-3.5 text-gray-500" />
          </MenuLink>
          <button
            type="button"
            onClick={async () => {
              await onSignOut();
              setOpen(false);
            }}
            disabled={pendingSignOut}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-200 transition hover:bg-red-500/10 disabled:opacity-60"
            role="menuitem"
          >
            <LogOut className="h-4 w-4" />
            {pendingSignOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/5 hover:text-white"
      role="menuitem"
    >
      {children}
    </a>
  );
}

function getInitials(label: string) {
  const parts = label
    .replace(/@.*/, '')
    .split(/\s+/)
    .filter(Boolean);

  return (parts[0]?.[0] || 'M').toUpperCase();
}
