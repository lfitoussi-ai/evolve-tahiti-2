'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateAll() {
  revalidatePath('/');
  revalidatePath('/produits');
  revalidatePath('/produits/bracelets');
  revalidatePath('/produits/charmes');
  revalidatePath('/boutiques');
  revalidatePath('/faq');
  revalidatePath('/produit/[slug]', 'page');
}
