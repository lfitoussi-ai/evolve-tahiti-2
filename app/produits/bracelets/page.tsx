import { getProductsByType } from '@/lib/data';
import { ProductGrid } from '@/components/ProductGrid';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bracelets | Evolve Tahiti',
  description: 'Découvrez notre collection de bracelets.',
};

export default async function BraceletsPage() {
  const products = await getProductsByType('bracelets');

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest">Bracelets</h1>
        <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        <p className="text-muted-foreground font-light tracking-wide">La base parfaite pour votre collection.</p>
      </div>
      <ProductGrid initialProducts={products} />
    </div>
  );
}
