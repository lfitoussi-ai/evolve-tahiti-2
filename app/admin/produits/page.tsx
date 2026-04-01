'use client';

import { useEffect, useState } from 'react';
import { getProducts, Product } from '@/lib/data';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { revalidateAll } from '@/app/actions';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id!).filter(Boolean));
    }
  };

  const handleToggleActive = async (product: Product) => {
    if (!product.id) return;
    try {
      const docRef = doc(db, 'products', product.id);
      await updateDoc(docRef, { is_active: !product.is_active });
      await revalidateAll();
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      );
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  const handleBulkToggleActive = async (active: boolean) => {
    if (selectedIds.length === 0) return;
    setIsBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach((id) => {
        const docRef = doc(db, 'products', id);
        batch.update(docRef, { is_active: active });
      });
      await batch.commit();
      await revalidateAll();
      setProducts((prev) =>
        prev.map((p) => (selectedIds.includes(p.id!) ? { ...p, is_active: active } : p))
      );
      setSelectedIds([]);
    } catch (error) {
      console.error("Error bulk updating products", error);
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Supprimer ${selectedIds.length} produits ? Cette action est irréversible.`)) return;
    setIsBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach((id) => {
        const docRef = doc(db, 'products', id);
        batch.delete(docRef);
      });
      await batch.commit();
      await revalidateAll();
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id!)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Error bulk deleting products", error);
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm uppercase tracking-widest animate-pulse">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-light uppercase tracking-widest">Produits</h1>
          <div className="w-12 h-0.5 bg-primary"></div>
          <p className="text-muted-foreground font-light tracking-wide">Gérez votre catalogue de bijoux.</p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex h-10 items-center justify-center rounded-sm bg-primary px-6 text-xs uppercase tracking-widest font-medium text-primary-foreground transition-all hover:bg-primary/90"
        >
          Ajouter un produit
        </Link>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="sticky top-0 z-10 bg-primary text-primary-foreground p-4 rounded-sm flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="text-xs uppercase tracking-widest font-medium">
            {selectedIds.length} sélectionné(s)
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleBulkToggleActive(true)}
              disabled={isBulkActionLoading}
              className="text-xs uppercase tracking-widest hover:underline disabled:opacity-50"
            >
              Activer
            </button>
            <button
              onClick={() => handleBulkToggleActive(false)}
              disabled={isBulkActionLoading}
              className="text-xs uppercase tracking-widest hover:underline disabled:opacity-50"
            >
              Désactiver
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isBulkActionLoading}
              className="text-xs uppercase tracking-widest hover:underline text-red-200 disabled:opacity-50"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="rounded-sm border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded-sm border-border text-primary focus:ring-primary"
                  />
                </th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Image</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Produit</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Catégorie</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Prix</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Statut</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id!)}
                      onChange={() => toggleSelect(product.id!)}
                      className="rounded-sm border-border text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="p-4">
                    <div className="h-12 w-12 relative rounded-sm overflow-hidden bg-muted">
                      {product.photos_png[0] ? (
                        <Image
                          src={product.photos_png[0]}
                          alt={product.title}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[8px] uppercase text-muted-foreground">N/A</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{product.title}</div>
                      <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-tight">{product.slug}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-muted rounded-sm">{product.type}</span>
                  </td>
                  <td className="p-4 text-sm font-medium text-primary">
                    {product.price_xpf.toLocaleString('fr-FR')} XPF
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(product)}
                      className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm transition-colors ${
                        product.is_active
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {product.is_active ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/produits/${product.id}`}
                      className="text-[10px] uppercase tracking-widest font-medium text-primary hover:underline"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="p-12 text-center space-y-4">
            <p className="text-muted-foreground font-light tracking-wide">Aucun produit trouvé dans le catalogue.</p>
            <Link
              href="/admin/produits/nouveau"
              className="text-xs uppercase tracking-widest font-medium text-primary hover:underline"
            >
              Ajouter votre premier produit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
