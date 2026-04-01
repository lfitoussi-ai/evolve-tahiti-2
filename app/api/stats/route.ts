import { NextResponse } from 'next/server';
import { getActiveProducts, getStores, getFaqs } from '@/lib/data';

export async function GET() {
  try {
    const [products, stores, faqs] = await Promise.all([
      getActiveProducts(),
      getStores(),
      getFaqs(),
    ]);

    return NextResponse.json({
      products: products.length,
      stores: stores.length,
      faqs: faqs.length,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
