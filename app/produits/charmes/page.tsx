import { getProductsByType } from '@/lib/data';
import { ProductGrid } from '@/components/ProductGrid';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Charmes | Evolve Tahiti',
  description: 'Découvrez notre collection de charmes.',
};

export default async function CharmesPage() {
  const products = await getProductsByType('charms');

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 space-y-8 md:space-y-12">
      <Breadcrumb items={[{ label: 'Catalogue', href: '/produits' }, { label: 'Charmes' }]} />
      
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest">Charmes</h1>
        <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        <p className="text-muted-foreground font-light tracking-wide">Personnalisez votre histoire avec nos charmes uniques.</p>
      </div>
      <ProductGrid initialProducts={products} />
    </div>
  );
}
