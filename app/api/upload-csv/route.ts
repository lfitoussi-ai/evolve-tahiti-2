import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return NextResponse.json({ error: 'Missing file or type' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), 'data', `${type}.csv`);

    // Ensure data directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    // Revalidate paths
    revalidatePath('/');
    revalidatePath(`/${type}`);
    if (type === 'products') {
      revalidatePath('/produits');
      revalidatePath('/produits/bracelets');
      revalidatePath('/produits/charmes');
      revalidatePath('/produit/[slug]', 'page');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading CSV:', error);
    return NextResponse.json({ error: 'Failed to upload CSV' }, { status: 500 });
  }
}
