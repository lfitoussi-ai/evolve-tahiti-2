import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/data';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col">
      <Link href={`/produit/${product.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Voir {product.title}</span>
      </Link>
      <div className="aspect-[4/5] relative overflow-hidden bg-muted mb-6 rounded-sm">
        {product.photos_png[0] ? (
          <Image
            src={product.photos_png[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground font-light">
            Image indisponible
          </div>
        )}
      </div>
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.type}</p>
        <h3 className="font-medium text-lg tracking-wide">{product.title}</h3>
        <p className="text-primary font-medium">{product.price_xpf.toLocaleString('fr-FR')} XPF</p>
      </div>
    </article>
  );
}
