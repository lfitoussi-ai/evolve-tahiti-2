import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { SiteLayout } from '@/components/SiteLayout';

export const metadata: Metadata = {
  title: 'Evolve Tahiti - Catalogue',
  description: 'Découvrez notre catalogue de charmes et bracelets.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col" suppressHydrationWarning>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
