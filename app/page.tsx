import Link from 'next/link';
import Image from 'next/image';
import { getActiveProducts } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { ProductExplainer } from '@/components/ProductExplainer';

export default async function Home() {
  const activeProducts = await getActiveProducts();
  const products = activeProducts.slice(0, 4);
  const baseUrl = process.env.APP_URL || 'https://www.evolve.pf';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        'name': 'Evolve Tahiti',
        'url': baseUrl,
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/logo.png`
        },
        'description': 'Bijouterie d\'exception à Tahiti proposant des charms, bracelets, boucles d\'oreilles et colliers uniques.',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Papeete',
          'addressRegion': 'Tahiti',
          'addressCountry': 'PF'
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        'url': baseUrl,
        'name': 'Evolve Tahiti',
        'publisher': { '@id': `${baseUrl}/#organization` },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${baseUrl}/produits?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-0 pt-24 pb-0 md:py-32 overflow-hidden flex items-end md:items-center justify-center text-center px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-banner-evolve-tahiti.webp"
            alt="Evolve Tahiti Hero Banner"
            fill
            className="object-cover opacity-90 md:opacity-60"
            priority
            referrerPolicy="no-referrer"
          />
          {/* Mobile gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent md:hidden" />
          {/* Desktop white overlay */}
          <div className="absolute inset-0 bg-white/30 hidden md:block" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-2 md:space-y-4 pb-12 md:pb-0">
          <h1 className="text-2xl sm:text-4xl md:text-7xl font-light tracking-widest uppercase text-white md:text-brand-black whitespace-nowrap">
            Evolve <span className="text-brand-sage font-medium">Tahiti</span>
          </h1>
          <p className="text-sm md:text-xl text-white/90 md:text-brand-grey-primary font-light tracking-wide leading-relaxed max-w-xs md:max-w-none mx-auto">
            L&apos;essence de la nature polynésienne capturée dans des bijoux d&apos;exception.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-2 md:pt-4">
            <Link href="/produits" className="inline-flex h-12 items-center justify-center rounded-sm bg-brand-sage px-10 text-sm uppercase tracking-widest text-white transition-all hover:bg-brand-sage/90 hover:shadow-lg">
              Découvrir la collection
            </Link>
          </div>
        </div>
      </section>

      {/* Product Explainer Section */}
      <ProductExplainer />

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-24 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-widest">Créations Récentes</h2>
          <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="text-center pt-8">
          <Link href="/produits" className="inline-flex items-center text-sm uppercase tracking-widest font-medium text-primary hover:text-primary/80 transition-colors">
            Voir tout le catalogue <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
