import { getFaqs } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Evolve Tahiti',
  description: 'Foire aux questions.',
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest text-brand-black">Foire aux questions</h1>
        <div className="w-12 h-0.5 bg-brand-sage mx-auto"></div>
        <p className="text-brand-grey-primary font-light tracking-wide">Trouvez les réponses à vos questions.</p>
      </div>
      <div className="space-y-8">
        {faqs.map((faq) => (
          <div key={faq.order} className="border-b border-brand-grey-light/50 pb-8">
            <h3 className="text-xl font-light tracking-wide mb-4 text-brand-black">{faq.question}</h3>
            <p className="text-brand-grey-primary font-light leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
