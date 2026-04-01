import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

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

function readCSV<T>(filename: string): T[] {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const results = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
    return results.data as T[];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  const data = readCSV<any>('products.csv');
  return data.map((item, index) => ({
    id: String(index),
    slug: String(item.slug).trim(),
    type: String(item.type).trim().toLowerCase() as 'charmes' | 'bracelets',
    title: item.title,
    price_xpf: parseInt(item.price_xpf) || 0,
    photos_png: item.photos_png ? item.photos_png.split('|').map((url: string) => url.trim()) : [],
    description: item.description,
    is_active: String(item.is_active).trim().toLowerCase() === 'true' || String(item.is_active).trim() === '1',
  })).sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getActiveProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.is_active);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getActiveProducts();
  return products.find(p => p.slug === slug);
}

export async function getProductsByType(type: 'charmes' | 'bracelets'): Promise<Product[]> {
  const products = await getActiveProducts();
  return products.filter(p => p.type === type);
}

export async function getStores(): Promise<Store[]> {
  const data = readCSV<any>('stores.csv');
  return data.map((item, index) => ({
    id: String(index),
    name: item.name,
    hours: item.hours,
    google_maps_url: item.google_maps_url,
    phone: item.phone,
    email: item.email,
    messenger_url: item.messenger_url,
    notes: item.notes,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getFaqs(): Promise<FAQ[]> {
  const data = readCSV<any>('faqs.csv');
  return data.map((item, index) => ({
    id: String(index),
    order: parseInt(item.order) || 0,
    question: item.question,
    answer: item.answer,
  })).sort((a, b) => a.order - b.order);
}
