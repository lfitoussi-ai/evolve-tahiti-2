'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Empêcher le défilement de la page quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { href: '/produits', label: 'Catalogue' },
    { href: '/produits/charmes', label: 'Charmes' },
    { href: '/produits/bracelets', label: 'Bracelets' },
    { href: '/boutiques', label: 'Boutiques' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${isOpen ? 'border-transparent bg-transparent' : 'border-border/50 bg-background/80 backdrop-blur-md'}`}>
        <div className="container mx-auto flex h-20 items-center justify-end px-4 md:px-8 relative">
          
          {/* Logo parfaitement centré */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <Link href="/" className="flex items-center">
              <Image 
                src="https://evolve-jewellery.co.nz/cdn/shop/t/31/assets/logo.svg?v=8794358632039462281754538610" 
                alt="Evolve Tahiti" 
                width={100} 
                height={30} 
                className="h-4 md:h-5 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation Desktop & Burger Mobile (Alignés à droite) */}
          <div className="z-50 flex items-center">
            <nav className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest font-medium">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`transition-colors hover:text-primary ${
                    pathname === link.href ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Bouton Menu Mobile */}
            <button 
              className="md:hidden p-2 -mr-2 text-foreground focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay Menu Mobile (Sorti du <header> pour corriger le bug de superposition lié au backdrop-blur) */}
      <div 
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center space-y-8 text-lg uppercase tracking-widest font-light">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className={`transition-colors hover:text-primary ${
                pathname === link.href ? 'text-primary font-medium' : 'text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
