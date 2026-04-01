import { getStores } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos Boutiques | Evolve Tahiti',
  description: 'Trouvez la boutique Evolve Tahiti la plus proche de chez vous.',
};

export default async function StoresPage() {
  const stores = await getStores();

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest">Nos Boutiques</h1>
        <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        <p className="text-muted-foreground font-light tracking-wide">Venez découvrir nos collections en magasin.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {stores.map((store, index) => (
          <div key={index} className="rounded-sm border border-border/50 bg-background p-8 space-y-6 shadow-sm">
            <h2 className="text-2xl font-light tracking-wide">{store.name}</h2>
            <div className="space-y-3 text-sm font-light tracking-wide text-muted-foreground">
              <p><strong>Horaires :</strong> {store.hours}</p>
              {store.phone && <p><strong>Téléphone :</strong> {store.phone}</p>}
              {store.email && <p><strong>Email :</strong> <a href={`mailto:${store.email}`} className="text-primary hover:underline">{store.email}</a></p>}
              {store.notes && <p className="text-muted-foreground italic">{store.notes}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {store.google_maps_url && (
                <a href={store.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-sm bg-primary px-6 text-xs uppercase tracking-widest font-medium text-primary-foreground transition-all hover:bg-primary/90">
                  Voir sur la carte
                </a>
              )}
              {store.messenger_url && (
                <a href={store.messenger_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-sm border border-border bg-transparent px-6 text-xs uppercase tracking-widest transition-all hover:border-primary hover:text-primary">
                  Nous contacter
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
