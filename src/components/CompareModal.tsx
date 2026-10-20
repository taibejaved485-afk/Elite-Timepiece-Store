import React from 'react';
import { X, Check } from 'lucide-react';
import { Watch, CurrencyCode } from '../types/watch';
import { formatPrice } from '../utils/currency';

interface CompareModalProps {
  watches: Watch[];
  currency: CurrencyCode;
  onClose: () => void;
  onToggleCompare: (watch: Watch) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  watches,
  currency,
  onClose,
  onToggleCompare,
}) => {
  if (watches.length === 0) return null;

  const specFields: { label: string; key: keyof Watch['specs'] }[] = [
    { label: 'Movement', key: 'movement' },
    { label: 'Calibre', key: 'calibre' },
    { label: 'Case Material', key: 'caseMaterial' },
    { label: 'Case Diameter', key: 'caseDiameter' },
    { label: 'Case Thickness', key: 'caseThickness' },
    { label: 'Power Reserve', key: 'powerReserve' },
    { label: 'Frequency', key: 'frequency' },
    { label: 'Water Resistance', key: 'waterResistance' },
    { label: 'Crystal', key: 'crystal' },
    { label: 'Strap', key: 'strap' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-bg-primary/95 backdrop-blur-xl border border-border-primary/50 text-text-primary w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl p-3.5 sm:p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h2 className="text-lg sm:text-2xl font-cinzel text-white mb-4 sm:mb-6">Compare Timepieces</h2>

        <div className={`grid gap-3 sm:gap-6 ${watches.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {watches.map((watch) => (
            <div key={watch.id} className="space-y-2 sm:space-y-3">
              <div className="bg-white/[0.03] p-3 sm:p-4 rounded-xl border border-white/5">
                <img
                  src={watch.image}
                  alt={watch.name}
                  className="w-full h-28 sm:h-48 object-contain mb-2 sm:mb-3"
                />
                <h3 className="text-xs sm:text-base font-semibold text-white truncate">{watch.name}</h3>
                <p className="text-[10px] sm:text-[11px] text-[#C5A059] font-mono">{watch.reference}</p>
                <p className="text-sm sm:text-lg text-white mt-1 font-mono font-bold">{formatPrice(watch.priceUSD, currency)}</p>
                <button
                  onClick={() => onToggleCompare(watch)}
                  className="mt-2 text-[11px] text-red-400/80 hover:text-red-400 flex items-center gap-1 font-mono"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Swipe indicator for mobile */}
        <div className="sm:hidden text-center text-[10px] text-gold/80 font-mono mt-4">
          ← Swipe table horizontally to compare →
        </div>

        <div className="mt-4 sm:mt-8 overflow-x-auto pb-4 -mx-1 px-1">
          <div className="min-w-[440px] space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#C5A059] mb-2">
              Side-by-Side Mechanical Audit
            </div>
            {specFields.map((field) => (
              <div key={field.key} className="grid grid-cols-3 gap-4 items-center border-b border-white/[0.06] py-2 text-xs">
                <span className="text-slate-400 font-medium">{field.label}</span>
                {watches.map((watch) => (
                  <span key={watch.id} className="text-white font-mono text-[11px]">
                    {watch.specs[field.key]}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
