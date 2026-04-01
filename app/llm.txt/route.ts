import { NextResponse } from 'next/server';
import { getActiveProducts, getStores, getFaqs } from '@/lib/data';

export async function GET() {
  const products = await getActiveProducts();
  const stores = await getStores();
  const faqs = await getFaqs();

  let text = `# Evolve Tahiti - Catalogue Structuré\n\n`;
  
  text += `## Produits\n\n`;
  products.forEach((p) => {
    text += `### ${p.title}\n`;
    text += `- Catégorie : ${p.type}\n`;
    text += `- Prix : ${p.price_xpf} XPF\n`;
    text += `- Description : ${p.description}\n`;
    text += `- Lien : ${process.env.APP_URL || ''}/produit/${p.slug}\n\n`;
  });

  text += `## Boutiques\n\n`;
  stores.forEach((s) => {
    text += `### ${s.name}\n`;
    text += `- Horaires : ${s.hours}\n`;
    if (s.phone) text += `- Téléphone : ${s.phone}\n`;
    if (s.email) text += `- Email : ${s.email}\n`;
    if (s.notes) text += `- Notes : ${s.notes}\n`;
    text += `- Carte : ${s.google_maps_url}\n\n`;
  });

  text += `## FAQ\n\n`;
  faqs.forEach((f) => {
    text += `Q: ${f.question}\n`;
    text += `R: ${f.answer}\n\n`;
  });

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
