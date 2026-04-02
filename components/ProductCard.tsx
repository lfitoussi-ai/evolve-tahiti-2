import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/data';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col">
      <Link href={`/produit/${product.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Voir {product.title}</span>
      </Link>
      <div className="aspect-[4/5] relative overflow-hidden bg-muted mb-3 sm:mb-6 rounded-sm">
        {product.photos_png[0] ? (
          <Image
            src={product.photos_png[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground font-light text-xs">
            Image indisponible
          </div>
        )}
      </div>
      <div className="space-y-1 sm:space-y-2 text-center">
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">{product.type}</p>
        <h3 className="font-medium text-sm sm:text-lg tracking-wide line-clamp-2 min-h-[2.5rem] sm:min-h-0">{product.title}</h3>
        <p className="text-primary font-medium text-sm sm:text-base">{product.price_xpf.toLocaleString('fr-FR')} XPF</p>
      </div>
    </article>
  );
}
