import { getProductBySlug, getActiveProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Produit non trouvé' };
  
  return {
    title: `${product.title} | Evolve Tahiti`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="aspect-[4/5] relative overflow-hidden rounded-sm bg-muted shadow-sm">
          {product.photos_png[0] ? (
            <Image
              src={product.photos_png[0]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              referrerPolicy="no-referrer"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground font-light">
              Image indisponible
            </div>
          )}
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.type}</p>
            <h1 className="text-4xl md:text-5xl font-light tracking-wide">{product.title}</h1>
            <p className="text-2xl font-medium text-primary">{product.price_xpf.toLocaleString('fr-FR')} XPF</p>
          </div>
          <div className="w-12 h-px bg-border"></div>
          <div className="prose prose-sm md:prose-base dark:prose-invert font-light tracking-wide leading-relaxed text-muted-foreground">
            <p>{product.description}</p>
          </div>

          <div className="space-y-2 pt-4">
            {product.materiaux && (
              <p className="text-sm font-light tracking-wide">
                <span className="font-medium text-foreground uppercase text-[10px] tracking-widest mr-2">Matériaux:</span>
                {product.materiaux}
              </p>
            )}
            {product.ref && (
              <p className="text-sm font-light tracking-wide">
                <span className="font-medium text-foreground uppercase text-[10px] tracking-widest mr-2">Ref:</span>
                {product.ref}
              </p>
            )}
          </div>

          <div className="pt-8 space-y-6">
            <a href="/boutiques" className="inline-flex h-12 items-center justify-center rounded-sm bg-primary px-10 text-sm uppercase tracking-widest font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg">
              Voir nos boutiques
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
