import { getProductsByType } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charmes | Evolve Tahiti',
  description: 'Découvrez notre collection de charmes.',
};

export default async function CharmesPage() {
  const products = await getProductsByType('charmes');

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest">Charmes</h1>
        <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        <p className="text-muted-foreground font-light tracking-wide">Personnalisez votre histoire avec nos charmes uniques.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
