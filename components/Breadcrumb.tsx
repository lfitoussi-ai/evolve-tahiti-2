import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex mb-8 overflow-x-auto no-scrollbar" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Home size={12} />
            <span className="hidden sm:inline">Accueil</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight size={12} className="mx-1 text-muted-foreground/40" />
            {item.href ? (
              <Link 
                href={item.href} 
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
