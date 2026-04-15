'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '@/lib/data';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGridProps {
  initialProducts: Product[];
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return initialProducts;
    
    const queryWords = trimmedQuery.split(/\s+/);
    
    return initialProducts.filter((product) => {
      const searchableText = [
        product.title,
        product.description,
        product.materiaux,
        product.ref,
        product.type
      ].filter(Boolean).join(' ').toLowerCase();

      // Chaque mot de la recherche doit être présent dans le texte du produit
      return queryWords.every(word => {
        if (word.length <= 2) {
          // Pour les mots très courts (comme "or"), on cherche le mot entier
          // pour éviter de matcher "d'oreilles", "doré", "force", etc.
          const regex = new RegExp(`(^|[^a-zA-Z0-9À-ÿ])${word}([^a-zA-Z0-9À-ÿ]|$)`, 'i');
          return regex.test(searchableText);
        }
        return searchableText.includes(word);
      });
    });
  }, [searchQuery, initialProducts]);

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="max-w-md mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        </div>
        <input
          type="text"
          placeholder="Rechercher un produit, une matière, une ref..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-11 py-3 bg-muted border border-brand-grey-light rounded-full text-sm font-light tracking-wide focus:outline-none focus:ring-1 focus:ring-brand-sage/30 focus:border-brand-sage/30 transition-all placeholder:text-brand-grey-primary/60"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-300">
          {filteredProducts.length} {filteredProducts.length > 1 ? 'résultats' : 'résultat'} pour &quot;{searchQuery}&quot;
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-12">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 space-y-4 animate-in fade-in zoom-in duration-500">
          <p className="text-muted-foreground font-light tracking-wide">Aucun produit ne correspond à votre recherche.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs uppercase tracking-widest font-medium text-primary hover:underline"
          >
            Effacer la recherche
          </button>
        </div>
      )}
    </div>
  );
}
