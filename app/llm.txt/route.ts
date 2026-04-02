import { NextResponse } from 'next/server';
import { getActiveProducts, getStores, getFaqs } from '@/lib/data';

export async function GET() {
  const products = await getActiveProducts();
  const stores = await getStores();
  const faqs = await getFaqs();

  let text = `# Evolve Tahiti - Catalogue Structuré pour IA\n\n`;
  text += `Description : Bijouterie d'exception à Tahiti spécialisée dans les charmes, bracelets, boucles d'oreilles et colliers uniques. Collection zen, luxueuse et intemporelle.\n\n`;
  
  text += `## Produits\n\n`;
  products.forEach((p) => {
    text += `### ${p.title}\n`;
    text += `- Catégorie : ${p.type}\n`;
    text += `- Prix : ${p.price_xpf} XPF\n`;
    if (p.materiaux) text += `- Matériaux : ${p.materiaux}\n`;
    if (p.ref) text += `- Référence : ${p.ref}\n`;
    text += `- Description : ${p.description}\n`;
    text += `- Lien : ${process.env.APP_URL || 'https://www.evolve.pf'}/produit/${p.slug}\n\n`;
  });

  text += `## Points de ventes\n\n`;
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
