import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { SiteLayout } from '@/components/SiteLayout';

const baseUrl = process.env.APP_URL || 'https://evolve-tahiti.com';

export const metadata: Metadata = {
  title: {
    default: 'Evolve Tahiti - Catalogue de Charmes & Bracelets',
    template: '%s | Evolve Tahiti'
  },
  description: 'Découvrez notre collection unique de charmes, bracelets, boucles d\'oreilles et colliers à Tahiti. Personnalisez votre histoire.',
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: 'website',
    locale: 'fr_PF',
    url: baseUrl,
    siteName: 'Evolve Tahiti',
    title: 'Evolve Tahiti - Catalogue de Charmes & Bracelets',
    description: 'Découvrez notre collection unique de charmes, bracelets, boucles d\'oreilles et colliers à Tahiti.',
    images: [
      {
        url: '/og-image.png', // Assume this exists or will be added
        width: 1200,
        height: 630,
        alt: 'Evolve Tahiti'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evolve Tahiti - Catalogue de Charmes & Bracelets',
    description: 'Découvrez notre collection unique de charmes, bracelets, boucles d\'oreilles et colliers à Tahiti.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col" suppressHydrationWarning>
        <SiteLayout>{children}</SiteLayout>
        {/* 100% privacy-first analytics */}
        <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
      </body>
    </html>
  );
}
