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
  inStock?: boolean;
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
let lastFetchTime: number = 0;
const CACHE_TTL = 1000 * 60; // 1 minute
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
  const now = Date.now();
  if (process.env.NOTION_API_KEY && process.env.NOTION_CATALOG_DATABASE_ID) {
    if (productsCache && (now - lastFetchTime < CACHE_TTL)) {
      return productsCache;
    }
    
    try {
      const { getNotionProducts } = await import('./notion');
      const notionProducts = await getNotionProducts(process.env.NOTION_CATALOG_DATABASE_ID);
      if (notionProducts.length > 0) {
        // Enforce uniqueness by slug to prevent React key collision errors
        const uniqueProductsMap = new Map<string, Product>();
        notionProducts.forEach(p => {
          if (!uniqueProductsMap.has(p.slug)) {
            uniqueProductsMap.set(p.slug, p);
          }
        });
        
        productsCache = Array.from(uniqueProductsMap.values()).sort((a, b) => a.slug.localeCompare(b.slug));
        lastFetchTime = now;
        return productsCache;
      }
    } catch (e) {
      console.error("Notion fetch failing", e);
      if (productsCache) return productsCache;
    }
  }

  if (productsCache && !process.env.NOTION_API_KEY) return productsCache;

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

let lastStoresFetchTime: number = 0;
let lastFaqsFetchTime: number = 0;

export async function getStores(): Promise<Store[]> {
  const now = Date.now();
  if (process.env.NOTION_API_KEY && process.env.NOTION_STORE_DATABASE_ID) {
    if (storesCache && (now - lastStoresFetchTime < CACHE_TTL)) {
      return storesCache;
    }
    try {
      const { getNotionStores } = await import('./notion');
      const notionStores = await getNotionStores(process.env.NOTION_STORE_DATABASE_ID);
      if (notionStores.length > 0) {
        storesCache = notionStores.sort((a, b) => a.name.localeCompare(b.name));
        lastStoresFetchTime = now;
        return storesCache;
      }
    } catch (e) {
      console.error("Notion stores fetch failing", e);
      if (storesCache) return storesCache;
    }
  }

  if (storesCache && !process.env.NOTION_API_KEY) return storesCache;

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
  const now = Date.now();
  if (process.env.NOTION_API_KEY && process.env.NOTION_FAQ_DATABASE_ID) {
    if (faqsCache && (now - lastFaqsFetchTime < CACHE_TTL)) {
      return faqsCache;
    }
    try {
      const { getNotionFaqs } = await import('./notion');
      const notionFaqs = await getNotionFaqs(process.env.NOTION_FAQ_DATABASE_ID);
      if (notionFaqs.length > 0) {
        faqsCache = notionFaqs.map((faq, index) => ({
          ...faq,
          id: faq.id || String(index),
          order: faq.order || index + 1
        })).sort((a, b) => a.order - b.order);
        lastFaqsFetchTime = now;
        return faqsCache;
      }
    } catch (e) {
      console.error("Notion faqs fetch failing", e);
      if (faqsCache) return faqsCache;
    }
  }

  if (faqsCache && !process.env.NOTION_API_KEY) return faqsCache;

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

export function clearCache() {
  productsCache = null;
  storesCache = null;
  faqsCache = null;
  lastFetchTime = 0;
  lastStoresFetchTime = 0;
  lastFaqsFetchTime = 0;
}
