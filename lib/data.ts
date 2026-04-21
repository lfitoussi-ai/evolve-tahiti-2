import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export interface Product {
  id?: string;
  slug: string;
  type: 'charms' | 'charmes' | 'bracelets' | 'boucles-d-oreilles' | 'colliers';
  title: string;
  price_xpf: number;
  photos_png: string[];
  description: string;
  materiaux?: string;
  ref?: string;
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

let productsCache: Product[] | null = null;
let storesCache: Store[] | null = null;
let faqsCache: FAQ[] | null = null;

function sanitizeSlug(slug: string): string {
  return String(slug)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-+/g, "-") // Remove double hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

function readJSON<T>(filename: string): T[] {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as T[];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

function readDelimited<T>(filename: string): T[] {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const isTsv = filename.endsWith('.tsv') || filename.endsWith('.txt');
    const { data, errors } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      delimiter: isTsv ? '\t' : undefined,
    });
    if (errors.length > 0) {
      console.warn(`PapaParse errors in ${filename}:`, errors);
    }
    return data as T[];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  if (productsCache) return productsCache;

  const data = readJSON<any>('products.json');
  productsCache = data
    .filter((item: any) => item.slug) // Must have a slug
    .map((item, index) => ({
      id: String(index),
      slug: sanitizeSlug(item.slug),
      type: (String(item.type || 'charms').trim().toLowerCase() as 'charms' | 'charmes' | 'bracelets' | 'boucles-d-oreilles' | 'colliers') || 'charms',
      title: item.title || 'Produit sans titre',
      price_xpf: typeof item.price_xpf === 'number' ? item.price_xpf : (typeof item.price_xpf === 'string' ? parseInt(item.price_xpf.replace(/\s/g, '')) : 0) || 0,
      photos_png: Array.isArray(item.photos_png) ? item.photos_png : (item.photos_png ? item.photos_png.split('|').map((url: string) => url.trim()) : []),
      description: item.description || '',
      materiaux: item.materiaux,
      ref: item.ref,
    })).sort((a, b) => a.slug.localeCompare(b.slug));

  return productsCache;
}

export async function getActiveProducts(): Promise<Product[]> {
  return getProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getActiveProducts();
  const searchSlug = sanitizeSlug(slug);
  return products.find(p => p.slug === searchSlug);
}

export async function getProductsByType(type: 'charms' | 'charmes' | 'bracelets' | 'boucles-d-oreilles' | 'colliers'): Promise<Product[]> {
  const products = await getActiveProducts();
  return products.filter(p => p.type === type);
}

export async function getStores(): Promise<Store[]> {
  if (storesCache) return storesCache;

  const data = readDelimited<any>('stores.tsv');
  storesCache = data
    .filter((item: any) => item.name)
    .map((item, index) => ({
      id: String(index),
      name: item.name,
      hours: item.hours,
      google_maps_url: item.google_maps_url,
      phone: item.phone,
      email: item.email,
      messenger_url: item.messenger_url,
      notes: item.notes,
    })).sort((a, b) => a.name.localeCompare(b.name));

  return storesCache;
}

export async function getFaqs(): Promise<FAQ[]> {
  if (faqsCache) return faqsCache;

  const data = readDelimited<any>('faqs.tsv');
  faqsCache = data
    .filter((item: any) => item.question && item.answer)
    .map((item, index) => ({
      id: String(index),
      order: parseInt(item.order) || (index + 1),
      question: item.question,
      answer: item.answer,
    })).sort((a, b) => a.order - b.order);

  return faqsCache;
}
