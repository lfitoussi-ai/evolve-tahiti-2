'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInAnonymously, signOut, User } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "1234";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (pin === ADMIN_SECRET) {
      try {
        await signInAnonymously(auth);
      } catch (err: any) {
        console.error("Login failed", err);
        if (err.code === 'auth/admin-restricted-operation') {
          setError("L'authentification anonyme n'est pas activée dans la console Firebase.");
        } else {
          setError("Erreur d'authentification : " + err.message);
        }
      }
    } else {
      setError("Code incorrect");
      setPin('');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm uppercase tracking-widest animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-light uppercase tracking-widest">Administration</h1>
            <p className="text-muted-foreground text-sm font-light">Entrez le code secret pour accéder au back-office.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Code Secret"
              className="w-full h-12 px-4 rounded-sm border border-border bg-background text-center text-xl tracking-[1em] focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            {error && <p className="text-destructive text-[10px] uppercase tracking-widest">{error}</p>}
            <button
              type="submit"
              className="w-full h-12 flex items-center justify-center rounded-sm bg-primary text-primary-foreground text-xs uppercase tracking-widest font-medium transition-all hover:bg-primary/90"
            >
              Valider
            </button>
          </form>
          
          <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
            Accès restreint
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Produits', href: '/admin/produits' },
    { name: 'Boutiques', href: '/admin/boutiques' },
    { name: 'FAQ', href: '/admin/faq' },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="text-xl font-light uppercase tracking-widest">
            Evolve <span className="text-primary font-medium">Tahiti</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-xs uppercase tracking-widest transition-colors rounded-sm ${
                pathname === item.href
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-xs uppercase tracking-widest text-destructive hover:bg-destructive/10 rounded-sm transition-colors text-left"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-8 md:hidden">
          <Link href="/" className="text-lg font-light uppercase tracking-widest">
            Evolve <span className="text-primary font-medium">Tahiti</span>
          </Link>
          <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-destructive">
            Sortir
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
