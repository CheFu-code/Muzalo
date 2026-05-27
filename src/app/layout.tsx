import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Muzalo',
    template: '%s | Muzalo',
  },
  description: 'A private music library for artists, playlists, and songs.',
  icons: {
    icon: '/muzalo-logo.svg',
    shortcut: '/muzalo-logo.svg',
    apple: '/muzalo-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
