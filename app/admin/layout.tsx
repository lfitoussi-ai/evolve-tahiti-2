'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "1234";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (pin === ADMIN_SECRET) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError("Code incorrect");
      setPin('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm uppercase tracking-widest animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
    { name: 'Produits (CSV)', href: '/admin/produits' },
    { name: 'Boutiques (CSV)', href: '/admin/boutiques' },
    { name: 'FAQ (CSV)', href: '/admin/faq' },
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
