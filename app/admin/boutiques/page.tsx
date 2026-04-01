'use client';

import { useEffect, useState } from 'react';
import { getStores, Store } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { revalidateAll } from '@/app/actions';

export default function AdminStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Store>>({
    name: '',
    hours: '',
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      const data = await getStores();
      if (mounted) {
        setStores(data);
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function fetchStores() {
    const data = await getStores();
    setStores(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'stores', editingId), formData);
      } else {
        await addDoc(collection(db, 'stores'), formData);
      }
      await revalidateAll();
      setEditingId(null);
      setFormData({ name: '', hours: '' });
      fetchStores();
    } catch (error) {
      console.error("Error saving store", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette boutique ?")) return;
    try {
      await deleteDoc(doc(db, 'stores', id));
      await revalidateAll();
      fetchStores();
    } catch (error) {
      console.error("Error deleting store", error);
    }
  };

  if (loading) return <div className="text-sm uppercase tracking-widest animate-pulse">Chargement...</div>;

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-light uppercase tracking-widest">Boutiques</h1>
        <div className="w-12 h-0.5 bg-primary"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="rounded-sm border border-border bg-background p-6 space-y-6">
            <h2 className="text-xl font-light tracking-wide">{editingId ? 'Modifier' : 'Ajouter'} une boutique</h2>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Nom</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-10 px-3 rounded-sm border border-border bg-background text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Horaires</label>
              <input
                type="text"
                required
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="w-full h-10 px-3 rounded-sm border border-border bg-background text-sm"
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="flex-1 h-10 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-medium rounded-sm">
                Enregistrer
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', hours: '' }); }} className="h-10 px-4 border border-border text-xs uppercase tracking-widest">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {stores.map((store) => (
            <div key={store.id} className="rounded-sm border border-border bg-background p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-light tracking-wide">{store.name}</h3>
                <p className="text-xs text-muted-foreground">{store.hours}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => { setEditingId(store.id!); setFormData(store); }} className="text-[10px] uppercase tracking-widest text-primary hover:underline">Modifier</button>
                <button onClick={() => handleDelete(store.id!)} className="text-[10px] uppercase tracking-widest text-destructive hover:underline">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
