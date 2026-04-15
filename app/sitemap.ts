import { MetadataRoute } from 'next';
import { getActiveProducts } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.APP_URL || 'https://www.evolve.pf').replace(/\/$/, '');
  const products = await getActiveProducts();

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/produit/${encodeURIComponent(product.slug)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const routes = [
    '',
    '/produits',
    '/produits/charms',
    '/produits/bracelets',
    '/produits/boucles-d-oreilles',
    '/produits/colliers',
    '/points-de-vente',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : (route.startsWith('/produits') ? 'weekly' : 'monthly')) as any,
    priority: route === '' ? 1 : (route.startsWith('/produits') ? 0.9 : 0.7),
  }));

  return [...routes, ...productUrls];
}
