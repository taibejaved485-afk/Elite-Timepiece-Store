import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Lock, FileText, CheckCircle2, Printer } from 'lucide-react';
import { PageRoute } from '../types/watch';

interface LegalPageProps {
  route: 'privacy' | 'terms' | 'provenance';
  onNavigate: (page: PageRoute) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ route, onNavigate }) => {
  const handlePrint = () => {
    window.print();
  };

  const contentConfig = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Swiss Banking-Grade Data Protection & Confidentiality',
      icon: Lock,
      content: [
        {
          heading: '1. Commitment to Client Confidentiality',
          text: 'Aurelia Horology operates in strict accordance with Swiss federal data protection legislation and international luxury client confidentiality standards. All collector credentials, ownership archives, private salon bookings, and bespoke commission communications are protected by 256-bit AES encryption across our secure Swiss servers.',
        },
        {
          heading: '2. Collection and Use of Information',
          text: 'We collect only necessary information required to fulfill armored delivery, warranty registration, and private salon appointments. No patron data, financial records, or acquisition history is ever sold, leased, or transferred to third-party marketing entities or advertising syndicates.',
        },
        {
          heading: '3. Secure Vault Storage',
          text: 'Digital records of warranty cards and Geneva Seal certificates are stored in offline air-gapped cryptographic vaults located in the Vallée de Joux, Switzerland, accessible exclusively by the registered patron or verified legal estate.',
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Manufacture Guarantees & Acquisition Protocols',
      icon: FileText,
      content: [
        {
          heading: '1. Lifetime Authenticity Guarantee',
          text: 'Every mechanical timepiece forged in our Le Brassus atelier is guaranteed authentic for life. Each piece is accompanied by a physical and digital Geneva Seal certificate signed by the master watchmaker responsible for assembling the escapement.',
        },
        {
          heading: '2. 5-Year International Warranty',
          text: 'All timepieces carry a comprehensive 5-year international mechanical warranty covering manufacturing defects, escapement regulation, and water resistance seals. Accidental damage or unauthorized third-party modifications void the manufacturer warranty.',
        },
        {
          heading: '3. Armored Courier Delivery',
          text: 'Acquisitions are shipped globally via specialized armored logistics carriers with full valuation insurance, requiring direct signature and government-issued identity verification upon receipt.',
        },
      ],
    },
    provenance: {
      title: 'Digital Provenance Registry',
      subtitle: 'Immutable Ledger & Geneva Seal Certification',
      icon: ShieldCheck,
      content: [
        {
          heading: '1. Immutable Passport Architecture',
          text: 'Every Aurelia timepiece possesses a secure digital passport registered on our private horological ledger. This ledger records the exact manufacturing date, alloy purity ratios, balance wheel inertia testing, and servicing history.',
        },
        {
          heading: '2. COSC & Chronofiable Certification',
          text: 'Before leaving the workshop, movements undergo 15 days of rigorous chronometric testing across 5 positions under extreme temperature variations, certified by the Official Swiss Chronometer Testing Institute (COSC).',
        },
        {
          heading: '3. Transfer of Ownership',
          text: 'When a timepiece changes ownership among collectors, the digital provenance record can be formally transferred via our secure concierge portal, updating the registry in the Geneva Central Archive.',
        },
      ],
    },
  };

  const config = contentConfig[route];
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 sm:py-20 px-4 sm:px-8 lg:px-16 xl:px-24">
      <div className="w-full max-w-5xl mx-auto space-y-12">
        {/* Top Navigation & Print */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9A7B38] hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Atelier Home</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-[#9A7B38] hover:border-[#9A7B38] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Document</span>
          </button>
        </div>

        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] border border-[#C5A059]/40 mx-auto flex items-center justify-center text-[#9A7B38] shadow-sm">
            <IconComponent className="w-7 h-7" />
          </div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#9A7B38] font-semibold font-mono">
            Aurelia Central Archives · Legal & Compliance
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            {config.title}
          </h1>
          <p className="text-sm text-slate-600 font-light">
            {config.subtitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 space-y-8 shadow-sm">
          {config.content.map((item, idx) => (
            <div key={idx} className="space-y-3 pb-6 border-b border-slate-200 last:border-none last:pb-0">
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#9A7B38] shrink-0" />
                <span>{item.heading}</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-light pl-7">
                {item.text}
              </p>
            </div>
          ))}

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
            <span>Official Register ID: SUI-ARCHIVE-1892-LE-BRASSUS</span>
            <span>Authentication Seal: Valid & Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
