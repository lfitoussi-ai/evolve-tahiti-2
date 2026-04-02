import { getProductsByType } from '@/lib/data';
import { ProductGrid } from '@/components/ProductGrid';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Colliers | Evolve Tahiti',
  description: 'Découvrez notre collection de colliers.',
};

export default async function ColliersPage() {
  const products = await getProductsByType('colliers');

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 space-y-8 md:space-y-12">
      <Breadcrumb items={[{ label: 'Catalogue', href: '/produits' }, { label: 'Colliers' }]} />
      
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest">Colliers</h1>
        <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        <p className="text-muted-foreground font-light tracking-wide">Des pièces uniques pour habiller votre décolleté.</p>
      </div>
      <ProductGrid initialProducts={products} />
    </div>
  );
}
