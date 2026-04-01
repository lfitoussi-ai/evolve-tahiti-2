'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '@/lib/data';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'motion/react';

interface ProductGridProps {
  initialProducts: Product[];
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return initialProducts;
    
    const query = searchQuery.toLowerCase().trim();
    return initialProducts.filter((product) => {
      return (
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.materiaux && product.materiaux.toLowerCase().includes(query)) ||
        (product.ref && product.ref.toLowerCase().includes(query)) ||
        product.type.toLowerCase().includes(query)
      );
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
          className="block w-full pl-11 pr-11 py-3 bg-secondary/30 border border-border/50 rounded-full text-sm font-light tracking-wide focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all placeholder:text-muted-foreground/60"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
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
