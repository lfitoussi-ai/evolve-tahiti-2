import { Product, Store, FAQ } from './data';

// Helper pour faire une requête Fetch à l'API Notion avec pagination pour tout récupérer
async function fetchFromNotion(databaseId: string) {
  const notionApiKey = process.env.NOTION_API_KEY;
  if (!notionApiKey) throw new Error('NOTION_API_KEY is not defined');

  let results: any[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const endpoint = `https://api.notion.com/v1/databases/${databaseId}/query`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_cursor: startCursor,
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Notion API Fetch Error:', res.status, errText);
      throw new Error(`Failed to fetch from Notion: ${res.statusText}`);
    }

    const data: any = await res.json();
    results = [...results, ...data.results];
    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }

  return { results };
}

const getStringOrRichText = (prop: any) => {
  if (!prop) return undefined;
  if (prop.type === 'title') return prop.title?.[0]?.plain_text;
  if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text;
  if (prop.type === 'url') return prop.url;
  if (prop.type === 'email') return prop.email;
  if (prop.type === 'phone_number') return prop.phone_number;
  if (prop.type === 'select') return prop.select?.name;
  if (prop.type === 'formula') {
    return prop.formula?.string || prop.formula?.number?.toString();
  }
  return undefined;
};

const getNumber = (prop: any) => {
  if (!prop) return undefined;
  if (prop.type === 'number') return prop.number;
  return undefined;
};

const getMultiSelect = (prop: any) => {
  if (!prop || prop.type !== 'multi_select') return [];
  return prop.multi_select.map((m: any) => m.name);
};

const getCheckbox = (prop: any) => {
  if (!prop || prop.type !== 'checkbox') return false;
  return prop.checkbox;
};

export const getNotionProducts = async (databaseId: string): Promise<Product[]> => {
  try {
    const response = await fetchFromNotion(databaseId);

    const products: Product[] = response.results.map((page: any) => {
      const p = page.properties;
      
      // Extraction résiliente (accepte les noms de colonnes exacts ou approchants)
      const title = getStringOrRichText(p['Nom']) || getStringOrRichText(p['Title']) || 'Sans titre';
      const slug = getStringOrRichText(p['Slug']);
      const price_xpf = getNumber(p['Prix (XPF)']) || getNumber(p['Prix']) || 0;
      
      const typeStr = getStringOrRichText(p['Catégorie']) || getStringOrRichText(p['Type']) || (getMultiSelect(p['Catégorie'])[0]) || 'charms';
      const formattedType = (typeStr.toLowerCase().replace(/[^a-z0-9-]/g, '-') as any);

      const imageUrl = getStringOrRichText(p['Image (Cloudinary)']) || getStringOrRichText(p['Image']) || getStringOrRichText(p['Image URL']);
      const inStock = p['En Stock'] ? getCheckbox(p['En Stock']) : true; // Par défaut en stock si la colonne/valeur manque
      
      const description = getStringOrRichText(p['Description']) || '';
      const materiaux = getStringOrRichText(p['Matériaux']) || getStringOrRichText(p['Materiaux']);
      const ref = getStringOrRichText(p['Ref']) || getStringOrRichText(p['Référence']) || getStringOrRichText(p['Ref BH']);

      return {
        id: page.id,
        slug,
        type: formattedType,
        title,
        price_xpf,
        photos_png: imageUrl ? [imageUrl] : [],
        description,
        materiaux,
        ref,
        inStock,
      } as Product;
    });

    // Optionnel: filtrer les produits sans slug (qui sont probablement des lignes brouillons)
    return products.filter((p) => p.slug && p.slug.trim() !== '');
  } catch (error) {
    console.error('Erreur lors de la récupération des produits depuis Notion:', error);
    return [];
  }
};

export const getNotionFaqs = async (databaseId: string): Promise<FAQ[]> => {
  try {
    const response = await fetchFromNotion(databaseId);
    
    return response.results.map((page: any) => {
      const p = page.properties;
      return {
        id: page.id,
        question: getStringOrRichText(p['Question']) || 'Question introuvable',
        answer: getStringOrRichText(p['Réponse']) || getStringOrRichText(p['Answer']) || '',
        order: getNumber(p['Order']) || getNumber(p['Ordre']) || 0,
      } as FAQ;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des FAQs depuis Notion:', error);
    return [];
  }
};

export const getNotionStores = async (databaseId: string): Promise<Store[]> => {
  try {
    const response = await fetchFromNotion(databaseId);
    
    return response.results.map((page: any) => {
      const p = page.properties;
      return {
        id: page.id,
        name: getStringOrRichText(p['Name']) || getStringOrRichText(p['Nom']) || 'Boutique',
        hours: getStringOrRichText(p['Hours']) || getStringOrRichText(p['Horaires']) || '',
        google_maps_url: getStringOrRichText(p['Google Maps URL']) || getStringOrRichText(p['Lien Google Maps']) || getStringOrRichText(p['Lien Maps']) || getStringOrRichText(p['Map URL']) || '',
        phone: getStringOrRichText(p['Phone']) || getStringOrRichText(p['Téléphone']) || getStringOrRichText(p['Telephone']) || '',
        email: getStringOrRichText(p['Email']) || getStringOrRichText(p['Mail']) || '',
        notes: getStringOrRichText(p['Notes']) || getStringOrRichText(p['Description']) || getStringOrRichText(p['Lieu']) || '',
        messenger_url: getStringOrRichText(p['Messenger URL']) || getStringOrRichText(p['Messenger']) || getStringOrRichText(p['Contact']) || '',
      } as Store;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des magasins depuis Notion:', error);
    return [];
  }
};
