import { getActiveProducts } from '@/lib/data';
import { ProductGrid } from '@/components/ProductGrid';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tous les produits | Evolve Tahiti',
  description: 'Découvrez notre catalogue complet de charmes et bracelets.',
};

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 space-y-8 md:space-y-12">
      <Breadcrumb items={[{ label: 'Catalogue' }]} />
      
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest">Notre Catalogue</h1>
        <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        <p className="text-muted-foreground font-light tracking-wide">L&apos;intégralité de nos collections.</p>
      </div>
      <ProductGrid initialProducts={products} />
    </div>
  );
}
