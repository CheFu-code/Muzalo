import type { ReactNode } from 'react';
import type { AuthUser } from '@/lib/server-session';
import { buildChefuAccountManageUrl } from '@/lib/chefu-account';
import { MusicShellClient } from './MusicShellClient';

type MusicShellProps = {
  children: ReactNode;
  user: AuthUser;
};

export function MusicShell({ children, user }: MusicShellProps) {
  return (
    <MusicShellClient user={user} manageAccountUrl={buildChefuAccountManageUrl('/')}>
      {children}
    </MusicShellClient>
  );
}
