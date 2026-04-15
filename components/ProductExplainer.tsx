'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CircleDot, Plus, Sparkles } from 'lucide-react';
import presentationImage from '../public/presentation-evolve-tahiti.webp';

const steps = [
  {
    id: 1,
    title: 'Étape 1 — Choisissez votre bracelet',
    description: 'Sélectionnez votre base parmi nos finitions en argent, or ou or rose.',
    icon: CircleDot,
  },
  {
    id: 2,
    title: 'Étape 2 — Ajoutez vos charms',
    description: 'Chaque charm est unique et raconte une partie de votre histoire.',
    icon: Plus,
  },
  {
    id: 3,
    title: 'Étape 3 — Faites-le évoluer',
    description: 'Ajoutez de nouveaux charms à tout moment pour marquer vos souvenirs précieux.',
    icon: Sparkles,
  },
];

export function ProductExplainer() {
  return (
    <section className="bg-brand-cream/30 py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-12 order-1 lg:order-1">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-light uppercase tracking-widest text-brand-black">
                Le Concept <span className="text-brand-sage font-medium">Evolve</span>
              </h2>
              <p className="text-brand-grey-primary font-light max-w-lg leading-relaxed">
                Créez un bijou qui vous ressemble. Notre système modulaire vous permet de composer un bracelet unique qui évolue au fil de votre vie.
              </p>
            </div>

            <div className="space-y-10">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="flex gap-6 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-brand-sage/20 flex items-center justify-center text-brand-sage group-hover:bg-brand-sage group-hover:text-white transition-all duration-500 shadow-sm">
                    <step.icon size={20} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium tracking-wide text-brand-black">
                      {step.title}
                    </h3>
                    <p className="text-brand-grey-primary font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-sm overflow-hidden shadow-2xl order-2 lg:order-2"
          >
            <Image
              src={presentationImage}
              alt="Evolve Jewellery Bracelet Concept"
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
