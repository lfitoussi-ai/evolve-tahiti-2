const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'products.json');

function sanitizeSlug(slug) {
  return String(slug)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-+/g, "-") // Remove double hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Initial count: ${data.length}`);

  const seenSlugs = new Set();
  const uniqueProducts = [];
  const duplicates = [];

  for (const product of data) {
    const sanitized = sanitizeSlug(product.slug);
    if (!seenSlugs.has(sanitized)) {
      seenSlugs.add(sanitized);
      uniqueProducts.push(product);
    } else {
      duplicates.push(product.slug);
    }
  }

  console.log(`Unique count: ${uniqueProducts.length}`);
  console.log(`Duplicates removed: ${duplicates.length}`);
  if (duplicates.length > 0) {
    console.log('Sample duplicates:', duplicates.slice(0, 10));
  }

  fs.writeFileSync(filePath, JSON.stringify(uniqueProducts, null, 2));
  console.log('Successfully updated products.json');

} catch (error) {
  console.error('Error cleaning products:', error);
}
