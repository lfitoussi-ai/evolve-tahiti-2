'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const catalogueLinks = [
    { href: '/produits', label: 'Tout voir' },
    { href: '/produits/charmes', label: 'Charmes' },
    { href: '/produits/bracelets', label: 'Bracelets' },
    { href: '/produits/boucles-d-oreilles', label: "Boucles d'oreilles" },
    { href: '/produits/colliers', label: 'Colliers' },
  ];

  const navLinks = [
    { href: '/boutiques', label: 'Boutiques' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${isOpen ? 'border-transparent bg-transparent' : 'border-border/50 bg-background/80 backdrop-blur-md'}`}>
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          
          {/* Logo */}
          <div className="z-50 flex items-center w-[50%] md:w-[180px]">
            <Link href="/" className="w-full flex items-center">
              <Image 
                src="https://evolve-jewellery.co.nz/cdn/shop/t/31/assets/logo.svg?v=8794358632039462281754538610" 
                alt="Evolve Tahiti" 
                width={180} 
                height={40} 
                className="w-full h-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation Desktop & Burger Mobile (Alignés à droite) */}
          <div className="z-50 flex items-center">
            <nav className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest font-medium">
              {/* Dropdown Catalogue */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button 
                  className={`flex items-center gap-1 transition-colors hover:text-primary ${
                    pathname.startsWith('/produits') ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  Catalogue <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 pt-4 w-48"
                    >
                      <div className="bg-background border border-border/50 shadow-xl rounded-sm overflow-hidden p-2">
                        {catalogueLinks.map((link) => (
                          <Link 
                            key={link.href} 
                            href={link.href}
                            className={`block px-4 py-2 text-[11px] transition-colors hover:bg-secondary/50 hover:text-primary ${
                              pathname === link.href ? 'text-primary bg-secondary/30' : 'text-foreground/80'
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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

      {/* Overlay Menu Mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center space-y-6 text-lg uppercase tracking-widest font-light max-h-[80vh] overflow-y-auto w-full px-8">
          <p className="text-[10px] text-muted-foreground tracking-[0.3em] font-medium mb-2">Catalogue</p>
          {catalogueLinks.map((link) => (
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
          
          <div className="w-8 h-px bg-border/50 my-4"></div>
          
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
