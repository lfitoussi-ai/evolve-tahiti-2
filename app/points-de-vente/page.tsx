import { getStores } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos points de ventes | Evolve Tahiti',
  description: 'Trouvez le point de vente Evolve Tahiti le plus proche de chez vous.',
};

export default async function StoresPage() {
  const stores = await getStores();

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest text-brand-black">Nos points de ventes</h1>
        <div className="w-12 h-0.5 bg-brand-sage mx-auto"></div>
        <p className="text-brand-grey-primary font-light tracking-wide">Venez découvrir nos collections dans nos POINTS DE VENTES.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {stores.map((store, index) => (
          <div key={index} className="rounded-sm border border-brand-grey-light/50 bg-brand-cream p-8 space-y-6 shadow-sm">
            <h2 className="text-2xl font-light tracking-wide text-brand-black">{store.name}</h2>
            <div className="space-y-3 text-sm font-light tracking-wide text-brand-grey-primary">
              <p><strong>Horaires :</strong> {store.hours}</p>
              {store.phone && <p><strong>Téléphone :</strong> {store.phone}</p>}
              {store.email && <p><strong>Email :</strong> <a href={`mailto:${store.email}`} className="text-brand-sage hover:underline">{store.email}</a></p>}
              {store.notes && <p className="text-brand-grey-primary italic">{store.notes}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {store.google_maps_url && (
                <a href={store.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-sm bg-brand-sage px-6 text-xs uppercase tracking-widest font-medium text-white transition-all hover:bg-brand-sage/90">
                  Voir sur la carte
                </a>
              )}
              {store.messenger_url && (
                <a href={store.messenger_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-sm border border-brand-grey-light bg-white px-6 text-xs uppercase tracking-widest transition-all hover:border-brand-sage hover:text-brand-sage">
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
