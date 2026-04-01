'use client';

import { useState } from 'react';

export default function AdminProducts() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'products');

    try {
      const res = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('Fichier products.csv mis à jour avec succès !');
      } else {
        setMessage('Erreur lors de la mise à jour.');
      }
    } catch (error) {
      setMessage('Erreur de connexion.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-light uppercase tracking-widest">Produits</h1>
        <div className="w-12 h-0.5 bg-primary"></div>
        <p className="text-muted-foreground font-light tracking-wide">
          Mettez à jour votre catalogue en uploadant un fichier CSV.
        </p>
      </div>

      <div className="rounded-sm border border-border bg-background p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-light tracking-wide">Upload products.csv</h2>
          <p className="text-sm text-muted-foreground">
            Format attendu : <code className="bg-muted px-1 py-0.5 rounded">slug,type,title,price_xpf,photos_png,description,is_active</code>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-3 rounded-sm text-xs uppercase tracking-widest font-medium">
            {uploading ? 'Upload en cours...' : 'Choisir un fichier CSV'}
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {message && (
          <p className={`text-sm ${message.includes('Erreur') ? 'text-destructive' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
