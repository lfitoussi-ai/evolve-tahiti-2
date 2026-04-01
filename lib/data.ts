import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export interface Product {
  id?: string;
  slug: string;
  type: 'charmes' | 'bracelets';
  title: string;
  price_xpf: number;
  photos_png: string[];
  description: string;
  is_active: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Store {
  id?: string;
  name: string;
  hours: string;
  google_maps_url: string;
  phone?: string;
  email?: string;
  messenger_url?: string;
  notes?: string;
}

export interface FAQ {
  id?: string;
  order: number;
  question: string;
  answer: string;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, orderBy('slug', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return [];
  }
}

export async function getActiveProducts(): Promise<Product[]> {
  try {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, where('is_active', '==', true), orderBy('slug', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error('Error fetching active products from Firestore:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, where('slug', '==', slug), where('is_active', '==', true));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Product;
  } catch (error) {
    console.error('Error fetching product by slug from Firestore:', error);
    return undefined;
  }
}

export async function getProductsByType(type: 'charmes' | 'bracelets'): Promise<Product[]> {
  try {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, where('type', '==', type), where('is_active', '==', true), orderBy('slug', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error('Error fetching products by type from Firestore:', error);
    return [];
  }
}

export async function getStores(): Promise<Store[]> {
  try {
    const storesCol = collection(db, 'stores');
    const q = query(storesCol, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Store));
  } catch (error) {
    console.error('Error fetching stores from Firestore:', error);
    return [];
  }
}

export async function getFaqs(): Promise<FAQ[]> {
  try {
    const faqsCol = collection(db, 'faqs');
    const q = query(faqsCol, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ));
  } catch (error) {
    console.error('Error fetching FAQs from Firestore:', error);
    return [];
  }
}
