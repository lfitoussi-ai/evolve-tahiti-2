'use client';

import { useState, useMemo, useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/data';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGridProps {
  initialProducts: Product[];
}

const CATEGORY_LABELS: Record<string, string> = {
  'all': 'Tous',
  'charmes': 'Charmes',
  'bracelets': 'Bracelets',
  'boucles-d-oreilles': 'Boucles d\'oreilles',
  'bagues': 'Bagues',
  'colliers': 'Colliers',
  'pendentifs': 'Pendentifs',
};

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const types = Array.from(new Set(initialProducts.map(p => p.type).filter(Boolean)));
    
    const order = ['charmes', 'bracelets', 'colliers', 'boucles-d-oreilles'];
    
    const sortedTypes = types.sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    return ['all', ...sortedTypes];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = initialProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.type === selectedCategory);
    }

    // Filter by search query
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return filtered;
    
    const queryWords = trimmedQuery.split(/\s+/);
    
    return filtered.filter((product) => {
      const searchableText = [
        product.title,
        product.description,
        product.materiaux,
        product.ref,
        product.type
      ].filter(Boolean).join(' ').toLowerCase();

      return queryWords.every(word => {
        if (word.length <= 2) {
          const regex = new RegExp(`(^|[^a-zA-Z0-9À-ÿ])${word}([^a-zA-Z0-9À-ÿ]|$)`, 'i');
          return regex.test(searchableText);
        }
        return searchableText.includes(word);
      });
    });
  }, [searchQuery, selectedCategory, initialProducts]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="space-y-6">
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

        {/* Categories Tags */}
        <div className="relative max-w-4xl mx-auto px-4">
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-4 px-4 md:justify-center"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  whitespace-nowrap px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 border
                  ${selectedCategory === category 
                    ? 'bg-brand-black text-white border-brand-black shadow-sm' 
                    : 'bg-white text-brand-grey-primary border-brand-grey-light hover:border-brand-sage hover:text-brand-sage'
                  }
                `}
              >
                {CATEGORY_LABELS[category] || category}
              </button>
            ))}
          </div>
          
          {/* Optional: Gradient indicators for scroll */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
        </div>
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory !== 'all') && (
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-300">
          {filteredProducts.length} {filteredProducts.length > 1 ? 'résultats' : 'résultat'} 
          {selectedCategory !== 'all' && ` dans ${CATEGORY_LABELS[selectedCategory] || selectedCategory}`}
          {searchQuery && ` pour "${searchQuery}"`}
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
          <p className="text-muted-foreground font-light tracking-wide">Aucun produit ne correspond à vos critères.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs uppercase tracking-widest font-medium text-primary hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
