import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, Wrench, Shield, Droplets, Truck } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  icon: React.ReactNode;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'overhaul-interval',
    category: 'Maintenance & Service',
    icon: <Wrench className="w-4 h-4 text-gold" />,
    question: 'How often should an Aurelia mechanical calibre undergo a complete manufacture overhaul?',
    answer: 'We recommend a comprehensive manufacture service every 3 to 5 years. In our Le Brassus atelier, our master watchmakers completely disassemble the calibre down to every individual pinion and jewel, ultrasonically clean each component, replace fatigued parts with genuine manufacture components, apply specialized synthetic micro-lubricants, and recalibrate the balance wheel to strict COSC chronometer tolerances (-4/+6 seconds per day).'
  },
  {
    id: 'warranty-coverage',
    category: 'Provenance & Warranty',
    icon: <Shield className="w-4 h-4 text-gold" />,
    question: 'What is covered under the 5-Year International Atelier Warranty?',
    answer: 'Every Aurelia timepiece is protected by an international 5-year guarantee against any mechanical defects in materials and craftsmanship. This includes complimentary rate adjustment, gasket replacement, magnetic field degaussing, and insured armored courier transportation to and from our Vallée de Joux manufacture.'
  },
  {
    id: 'water-resistance',
    category: 'Care & Preservation',
    icon: <Droplets className="w-4 h-4 text-gold" />,
    question: 'How should I preserve the water resistance and seals of my watch?',
    answer: 'Always verify that the winding crown is completely screwed down or pushed flush against the case before any water exposure. Never operate chronograph pushers underwater. For diving models rated to 300M, we recommend an annual pressure test at an authorized Aurelia boutique. Always rinse your timepiece with lukewarm fresh water after exposure to ocean saltwater or thermal springs.'
  },
  {
    id: 'bespoke-engraving',
    category: 'Bespoke Atelier',
    icon: <Sparkles className="w-4 h-4 text-gold" />,
    question: 'Can personalized engraving or bespoke adjustments be commissioned post-purchase?',
    answer: 'Yes. Our Bespoke Atelier offers bespoke hand-engraving on solid casebacks, customized oscillating weight skeletionization, and custom strap allocations in French alligator, calfskin, or fluorocarbon rubber. Contact our private concierge to arrange a salon consultation.'
  },
  {
    id: 'armored-transit',
    category: 'Security & Delivery',
    icon: <Truck className="w-4 h-4 text-gold" />,
    question: 'How does Aurelia ensure the security of armored courier deliveries?',
    answer: 'All outbound timepieces from Switzerland travel via dedicated armored courier with full Lloyd’s of London insurance coverage up to the moment of white-glove signature delivery. Shipments require cryptographic photo ID verification upon handoff, ensuring discrete and confidential arrival.'
  }
];

export const ConciergeFAQ: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(['overhaul-interval']);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 sm:p-12 rounded-2xl bg-gradient-to-b from-[#141824] to-[#0A0D14] border border-gold/30 shadow-[0_15px_40px_rgba(0,0,0,0.85)] space-y-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2 text-center sm:text-left border-b border-gold/15 pb-6">
        <div className="inline-flex items-center gap-2 text-gold text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em]">
          <HelpCircle className="w-3.5 h-3.5 text-gold" />
          <span>Atelier Client Advisory</span>
        </div>
        <h3 className="font-cinzel text-xl sm:text-3xl font-bold text-white tracking-wide">
          Concierge & Service Inquiries
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
          Authoritative guidance regarding our mechanical movements, international warranty protections, water resistance standards, and private salon protocols.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {FAQ_DATA.map((item) => {
          const isOpen = openIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-black/60 border-gold/50 shadow-[0_4px_20px_rgba(197,160,89,0.15)]'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-gold/30 hover:bg-white/[0.04]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(item.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2 rounded-lg border transition-colors ${
                    isOpen ? 'bg-gold/20 border-gold/50 text-gold' : 'bg-black/40 border-white/10 text-slate-400'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-gold/80 block mb-0.5">
                      {item.category}
                    </span>
                    <span className={`text-xs sm:text-sm font-semibold tracking-wide transition-colors ${
                      isOpen ? 'text-white' : 'text-slate-200'
                    }`}>
                      {item.question}
                    </span>
                  </div>
                </div>

                <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen ? 'bg-gold border-gold text-black rotate-180' : 'border-white/15 text-slate-400'
                }`}>
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 font-light leading-relaxed border-t border-gold/15 bg-black/40">
                  <p className="pl-11 pr-2 pt-2">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
