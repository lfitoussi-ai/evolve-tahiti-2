'use client';

import { useEffect, useState } from 'react';
import { getActiveProducts, getStores, getFaqs } from '@/lib/data';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    stores: 0,
    faqs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [products, stores, faqs] = await Promise.all([
        getActiveProducts(),
        getStores(),
        getFaqs(),
      ]);
      setStats({
        products: products.length,
        stores: stores.length,
        faqs: faqs.length,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm uppercase tracking-widest animate-pulse">Chargement...</div>
      </div>
    );
  }

  const cards = [
    { name: 'Produits Actifs', value: stats.products, href: '/admin/produits', color: 'bg-primary/10 text-primary' },
    { name: 'Boutiques', value: stats.stores, href: '/admin/boutiques', color: 'bg-blue-500/10 text-blue-500' },
    { name: 'FAQ', value: stats.faqs, href: '/admin/faq', color: 'bg-orange-500/10 text-orange-500' },
  ];

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-light uppercase tracking-widest">Dashboard</h1>
        <div className="w-12 h-0.5 bg-primary"></div>
        <p className="text-muted-foreground font-light tracking-wide">Bienvenue dans votre interface de gestion.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="group rounded-sm border border-border bg-background p-8 space-y-4 transition-all hover:border-primary hover:shadow-sm"
          >
            <div className={`inline-flex items-center justify-center h-10 w-10 rounded-sm ${card.color}`}>
              <span className="text-lg font-medium">{card.value}</span>
            </div>
            <h2 className="text-xl font-light tracking-wide">{card.name}</h2>
            <p className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              Gérer <span className="ml-2">→</span>
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-sm border border-border bg-background p-8 space-y-6">
        <h2 className="text-2xl font-light tracking-wide">Actions Rapides</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/produits/nouveau"
            className="inline-flex h-10 items-center justify-center rounded-sm bg-primary px-6 text-xs uppercase tracking-widest font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            Ajouter un produit
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex h-10 items-center justify-center rounded-sm border border-border bg-transparent px-6 text-xs uppercase tracking-widest transition-all hover:border-primary hover:text-primary"
          >
            Voir le site
          </Link>
        </div>
      </div>
    </div>
  );
}
