'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    { href: '/produits', label: 'TOUT VOIR' },
    { href: '/produits/charms', label: 'CHARMS' },
    { href: '/produits/bracelets', label: 'BRACELETS' },
    { href: '/produits/boucles-d-oreilles', label: "BOUCLES D'OREILLES" },
    { href: '/produits/colliers', label: 'COLLIERS' },
  ];

  const navLinks = [
    { href: '/points-de-vente', label: 'POINTS DE VENTES' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${isOpen ? 'bg-transparent' : 'bg-brand-cream/60 backdrop-blur-lg border-b border-brand-grey-light/20'}`}>
        <div className="container mx-auto flex h-20 md:h-24 items-center justify-between px-6 md:px-12 transition-all duration-500">
          
          {/* Logo */}
          <div className="z-50 flex items-center w-[45%] md:w-[150px] transition-all duration-500">
            <Link href="/" className="w-full flex items-center hover:opacity-80 transition-opacity">
              <Image 
                src="/logo_evolve-pf_green.svg" 
                alt="Evolve Tahiti" 
                width={150} 
                height={34} 
                className="w-full h-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation Desktop & Burger Mobile (Alignés à droite) */}
          <div className="z-50 flex items-center">
            <nav className="hidden md:flex items-center space-x-10 text-[11px] uppercase tracking-[0.25em] font-medium">
              {/* Dropdown Catalogue */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button 
                  className={`flex items-center gap-1.5 transition-colors hover:text-brand-sage ${
                    pathname.startsWith('/produits') ? 'text-brand-sage' : 'text-brand-grey-primary'
                  }`}
                >
                  CATALOGUE <ChevronDown size={12} strokeWidth={1.5} className={`transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
                      <div className="bg-brand-cream border border-brand-grey-light/50 shadow-xl rounded-sm overflow-hidden p-2">
                        {catalogueLinks.map((link) => (
                          <Link 
                            key={link.href} 
                            href={link.href}
                            className={`block px-4 py-2 text-[11px] transition-colors hover:bg-brand-sage/10 hover:text-brand-sage ${
                              pathname === link.href ? 'text-brand-sage bg-brand-sage/20' : 'text-brand-grey-primary'
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
                  className={`transition-colors hover:text-brand-sage px-2 ${
                    pathname === link.href ? 'text-brand-sage' : 'text-brand-grey-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Bouton Menu Mobile */}
            <button 
              className="md:hidden p-2 -mr-2 text-brand-black focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay Menu Mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-brand-cream/98 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-700 ease-in-out md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center space-y-8 text-sm uppercase tracking-[0.3em] font-light max-h-[80vh] overflow-y-auto w-full px-8">
          <p className="text-[9px] text-brand-sage tracking-[0.4em] font-semibold mb-4 uppercase">Catalogue</p>
          {catalogueLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className={`transition-colors hover:text-brand-sage text-xs ${
                pathname === link.href ? 'text-brand-sage font-medium' : 'text-brand-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="w-6 h-px bg-brand-grey-light/30 my-6"></div>
          
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className={`transition-colors hover:text-brand-sage text-xs ${
                pathname === link.href ? 'text-brand-sage font-medium' : 'text-brand-black'
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
