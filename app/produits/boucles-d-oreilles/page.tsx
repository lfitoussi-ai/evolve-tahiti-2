import { getProductsByType } from '@/lib/data';
import { ProductGrid } from '@/components/ProductGrid';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Boucles d'oreilles | Evolve Tahiti",
  description: "Découvrez notre collection de boucles d'oreilles.",
};

export default async function BouclesOreillesPage() {
  const products = await getProductsByType('boucles-d-oreilles');

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 space-y-8 md:space-y-12">
      <Breadcrumb items={[{ label: 'Catalogue', href: '/produits' }, { label: "Boucles d'oreilles" }]} />
      
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest">Boucles d&apos;oreilles</h1>
        <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        <p className="text-muted-foreground font-light tracking-wide">Élégance et raffinement pour sublimer votre visage.</p>
      </div>
      <ProductGrid initialProducts={products} />
    </div>
  );
}
