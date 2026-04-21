import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Vérifier le mot de passe de revalidation
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Secret invalide' }, { status: 401 });
  }

  try {
    // Purger le cache interne
    const { clearCache } = await import('@/lib/data');
    clearCache();

    // Purger le cache Next.js des différentes routes impactées
    revalidatePath('/'); // Page d'accueil
    revalidatePath('/catalogue'); // Page catalogue
    revalidatePath('/faq'); // Page FAQ
    revalidatePath('/produit/[slug]', 'page'); // Pages produits
    
    // Purger le layout complet par sécurité
    revalidatePath('/', 'layout');

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: "Le site a bien été actualisé avec les dernières données Notion !"
    });
  } catch (err) {
    console.error('Erreur de revalidation :', err);
    return NextResponse.json({ message: 'Erreur lors de la revalidation' }, { status: 500 });
  }
}
