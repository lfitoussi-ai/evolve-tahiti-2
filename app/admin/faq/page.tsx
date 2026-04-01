'use client';

import { useEffect, useState } from 'react';
import { getFaqs, FAQ } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { revalidateAll } from '@/app/actions';

export default function AdminFaq() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FAQ>>({
    order: 0,
    question: '',
    answer: '',
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      const data = await getFaqs();
      if (mounted) {
        setFaqs(data);
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function fetchFaqs() {
    const data = await getFaqs();
    setFaqs(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'faqs', editingId), formData);
      } else {
        await addDoc(collection(db, 'faqs'), formData);
      }
      await revalidateAll();
      setEditingId(null);
      setFormData({ order: 0, question: '', answer: '' });
      fetchFaqs();
    } catch (error) {
      console.error("Error saving FAQ", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette question ?")) return;
    try {
      await deleteDoc(doc(db, 'faqs', id));
      await revalidateAll();
      fetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ", error);
    }
  };

  if (loading) return <div className="text-sm uppercase tracking-widest animate-pulse">Chargement...</div>;

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-light uppercase tracking-widest">FAQ</h1>
        <div className="w-12 h-0.5 bg-primary"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="rounded-sm border border-border bg-background p-6 space-y-6">
            <h2 className="text-xl font-light tracking-wide">{editingId ? 'Modifier' : 'Ajouter'} une question</h2>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Ordre</label>
              <input
                type="number"
                required
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full h-10 px-3 rounded-sm border border-border bg-background text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Question</label>
              <input
                type="text"
                required
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full h-10 px-3 rounded-sm border border-border bg-background text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Réponse</label>
              <textarea
                rows={4}
                required
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full p-3 rounded-sm border border-border bg-background text-sm"
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="flex-1 h-10 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-medium rounded-sm">
                Enregistrer
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setFormData({ order: 0, question: '', answer: '' }); }} className="h-10 px-4 border border-border text-xs uppercase tracking-widest">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-sm border border-border bg-background p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-light tracking-wide">{faq.question}</h3>
                <p className="text-xs text-muted-foreground">{faq.answer}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => { setEditingId(faq.id!); setFormData(faq); }} className="text-[10px] uppercase tracking-widest text-primary hover:underline">Modifier</button>
                <button onClick={() => handleDelete(faq.id!)} className="text-[10px] uppercase tracking-widest text-destructive hover:underline">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
