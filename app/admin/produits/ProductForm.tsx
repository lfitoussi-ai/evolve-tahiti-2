'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/data';
import Image from 'next/image';
import { revalidateAll } from '@/app/actions';

interface ProductFormProps {
  id?: string;
}

export default function ProductForm({ id }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(id && id !== 'nouveau' ? true : false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    slug: '',
    type: 'charmes',
    price_xpf: 0,
    description: '',
    is_active: true,
    photos_png: [],
  });
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    if (id && id !== 'nouveau') {
      async function fetchProduct() {
        try {
          const docRef = doc(db, 'products', id!);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data() as Product);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      if (id && id !== 'nouveau') {
        await updateDoc(doc(db, 'products', id), data);
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
      await revalidateAll();
      router.push('/admin/produits');
      router.refresh();
    } catch (error) {
      console.error("Error saving product", error);
    } finally {
      setSaving(false);
    }
  };

  const addPhoto = () => {
    if (newPhotoUrl && !formData.photos_png?.includes(newPhotoUrl)) {
      setFormData((prev) => ({
        ...prev,
        photos_png: [...(prev.photos_png || []), newPhotoUrl],
      }));
      setNewPhotoUrl('');
    }
  };

  const removePhoto = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      photos_png: prev.photos_png?.filter((p) => p !== url),
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm uppercase tracking-widest animate-pulse">Chargement du produit...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-light uppercase tracking-widest">
          {id && id !== 'nouveau' ? 'Modifier le produit' : 'Nouveau produit'}
        </h1>
        <div className="w-12 h-0.5 bg-primary"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Basic Info */}
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Titre</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-12 px-4 rounded-sm border border-border bg-background focus:border-primary focus:ring-0 transition-all outline-none text-sm"
              placeholder="Ex: Bracelet Perle de Tahiti"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Slug (URL)</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full h-12 px-4 rounded-sm border border-border bg-background focus:border-primary focus:ring-0 transition-all outline-none text-sm font-mono"
              placeholder="ex: bracelet-perle-tahiti"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Catégorie</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full h-12 px-4 rounded-sm border border-border bg-background focus:border-primary focus:ring-0 transition-all outline-none text-sm uppercase tracking-widest"
              >
                <option value="charmes">Charmes</option>
                <option value="bracelets">Bracelets</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Prix (XPF)</label>
              <input
                type="number"
                required
                value={formData.price_xpf}
                onChange={(e) => setFormData({ ...formData, price_xpf: parseInt(e.target.value) || 0 })}
                className="w-full h-12 px-4 rounded-sm border border-border bg-background focus:border-primary focus:ring-0 transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Description</label>
            <textarea
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 rounded-sm border border-border bg-background focus:border-primary focus:ring-0 transition-all outline-none text-sm leading-relaxed"
              placeholder="Description du bijou..."
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded-sm border-border text-primary focus:ring-primary h-5 w-5"
            />
            <label htmlFor="is_active" className="text-xs uppercase tracking-widest font-medium cursor-pointer">
              Produit Actif (visible sur le site)
            </label>
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Photos (URLs)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="flex-1 h-10 px-4 rounded-sm border border-border bg-background focus:border-primary focus:ring-0 transition-all outline-none text-xs"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={addPhoto}
                className="h-10 px-4 rounded-sm bg-muted text-xs uppercase tracking-widest font-medium hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {formData.photos_png?.map((url, index) => (
              <div key={index} className="group relative aspect-square rounded-sm overflow-hidden bg-muted border border-border">
                <Image
                  src={url}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute top-2 right-2 h-6 w-6 rounded-sm bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  ×
                </button>
              </div>
            ))}
            {(!formData.photos_png || formData.photos_png.length === 0) && (
              <div className="aspect-square rounded-sm border border-dashed border-border flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground text-center p-4">
                Aucune photo ajoutée
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-border flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs uppercase tracking-widest font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-12 px-10 rounded-sm bg-primary text-primary-foreground text-xs uppercase tracking-widest font-medium transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer le produit'}
        </button>
      </div>
    </form>
  );
}
