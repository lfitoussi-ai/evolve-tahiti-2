import { NextResponse } from 'next/server';
import { getActiveProducts, getStores, getFaqs } from '@/lib/data';

export async function GET() {
  const products = await getActiveProducts();
  const stores = await getStores();
  const faqs = await getFaqs();

  const data = {
    site: 'Evolve Tahiti',
    description: 'Catalogue de charmes et bracelets en Polynésie',
    products: products.map((p) => ({
      id: p.slug,
      name: p.title,
      category: p.type,
      price_xpf: p.price_xpf,
      description: p.description,
      url: `${process.env.APP_URL || ''}/produit/${p.slug}`,
    })),
    stores: stores.map((s) => ({
      name: s.name,
      hours: s.hours,
      phone: s.phone,
      address: s.google_maps_url,
    })),
    faq: faqs.map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
  };

  return NextResponse.json(data);
}
