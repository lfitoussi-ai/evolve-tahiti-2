import Link from 'next/link';
import { getActiveProducts } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';

export default async function Home() {
  const activeProducts = await getActiveProducts();
  const products = activeProducts.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tahitinature/1920/1080?blur=2')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-light tracking-widest uppercase text-foreground">
            Evolve <span className="text-primary font-medium">Tahiti</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide leading-relaxed">
            L&apos;essence de la nature polynésienne capturée dans des bijoux d&apos;exception. Une collection zen, luxueuse et intemporelle.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
            <Link href="/produits" className="inline-flex h-12 items-center justify-center rounded-sm bg-primary px-10 text-sm uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg">
              Découvrir la collection
            </Link>
            <Link href="/boutiques" className="inline-flex h-12 items-center justify-center rounded-sm border border-border bg-transparent px-10 text-sm uppercase tracking-widest transition-all hover:border-primary hover:text-primary">
              Nos Écrins
            </Link>
          </div>
        </div>
      </section>

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
