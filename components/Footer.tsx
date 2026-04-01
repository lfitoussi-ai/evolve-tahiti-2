import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 mt-12">
      <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-center text-sm tracking-widest uppercase text-muted-foreground">
          © {new Date().getFullYear()} Evolve Tahiti. Tous droits réservés.
        </p>
        <Link href="/admin" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          Administration
        </Link>
      </div>
    </footer>
  );
}
