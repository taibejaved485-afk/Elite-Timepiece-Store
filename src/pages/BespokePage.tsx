import React, { useState } from 'react';
import { Sparkles, Check, ShoppingBag, ShieldCheck, RefreshCw, PenTool } from 'lucide-react';
import { BespokeConfiguration, CurrencyCode, CartItem, Watch, PageRoute } from '../types/watch';
import { formatPrice } from '../utils/currency';

interface BespokePageProps {
  currency: CurrencyCode;
  onAddBespokeToCart: (bespokeItem: CartItem) => void;
  onNavigate?: (page: PageRoute) => void;
}

export const BespokePage: React.FC<BespokePageProps> = ({ currency, onAddBespokeToCart, onNavigate }) => {
  const [config, setConfig] = useState<BespokeConfiguration>({
    caseMaterial: '18k-rose-gold',
    dialColor: 'midnight-blue',
    movementType: 'automatic-date',
    strapType: 'alligator-leather',
    engravingText: 'AURELIA · LE BRASSUS · 2026',
  });

  const [activeSide, setActiveSide] = useState<'front' | 'caseback'>('front');
  const [orderedSuccess, setOrderedSuccess] = useState(false);

  // Pricing calculation
  const casePrices: Record<string, number> = {
    '18k-rose-gold': 24500,
    'obsidian-ceramic': 18800,
    'titanium-grade-5': 15600,
    'oystersteel-904l': 12200,
  };

  const movementPrices: Record<string, number> = {
    'automatic-date': 0,
    'skeleton-tourbillon': 28000,
  };

  const strapPrices: Record<string, number> = {
    'alligator-leather': 0,
    'oyster-steel': 2400,
    'milanese-mesh': 1200,
    'tuscan-suede': 400,
  };

  const totalPriceUSD =
    casePrices[config.caseMaterial] +
    movementPrices[config.movementType] +
    strapPrices[config.strapType];

  const handleCommission = () => {
    const bespokeWatch: Watch = {
      id: `bespoke-${Date.now()}`,
      reference: `BESPOKE-AH-${config.caseMaterial.slice(0, 3).toUpperCase()}`,
      name: `Aurelia Bespoke Commission (${config.caseMaterial.replace('-', ' ')})`,
      collection: config.movementType === 'skeleton-tourbillon' ? 'Tourbillon' : 'Dress',
      tagline: `Bespoke crafted with ${config.dialColor.replace('-', ' ')} dial & ${config.strapType.replace('-', ' ')}`,
      description: `Bespoke commissioned timepiece with hand-engraved caseback: "${config.engravingText}".`,
      priceUSD: totalPriceUSD,
      image:
        config.movementType === 'skeleton-tourbillon'
          ? '/src/assets/images/watch_skeleton_tourbillon_1791612558576.jpg'
          : config.caseMaterial === '18k-rose-gold'
          ? '/src/assets/images/hero_luxury_chronograph_1791612522214.jpg'
          : config.caseMaterial === 'titanium-grade-5'
          ? '/src/assets/images/watch_diver_submariner_1791612540699.jpg'
          : '/src/assets/images/watch_dress_minimalist_1791612572332.jpg',
      gallery: [],
      specs: {
        caseDiameter: '40.5 mm',
        caseThickness: config.movementType === 'skeleton-tourbillon' ? '10.2 mm' : '8.8 mm',
        caseMaterial: config.caseMaterial.replace('-', ' ').toUpperCase(),
        bezelMaterial: config.caseMaterial.replace('-', ' ').toUpperCase(),
        dialColor: config.dialColor.replace('-', ' ').toUpperCase(),
        crystal: 'Double Curved Sapphire Crystal with AR',
        waterResistance: '50 meters / 5 bar',
        movement:
          config.movementType === 'skeleton-tourbillon'
            ? 'Hand-Finished Flying Tourbillon Manufacture'
            : 'Manufacture Self-Winding In-House Calibre',
        calibre: config.movementType === 'skeleton-tourbillon' ? 'Calibre AH-900 Bespoke' : 'Calibre AH-101 Bespoke',
        powerReserve: config.movementType === 'skeleton-tourbillon' ? '72 hours' : '60 hours',
        frequency: '28,800 vph (4 Hz)',
        jewels: 32,
        strap: config.strapType.replace('-', ' ').toUpperCase(),
      },
      inStock: true,
      stockCount: 1,
    };

    onAddBespokeToCart({
      watch: bespokeWatch,
      quantity: 1,
      selectedStrap: config.strapType,
      customEngraving: config.engravingText,
      bespokeCase: config.caseMaterial,
      bespokeDial: config.dialColor,
      bespokePrice: totalPriceUSD,
    });

    setOrderedSuccess(true);
    setTimeout(() => setOrderedSuccess(false), 2500);
  };

  // Dial color visual styling helper
  const dialBackgrounds: Record<string, string> = {
    'midnight-blue': 'radial-gradient(circle at center, #1E3A8A 0%, #0F172A 70%, #030712 100%)',
    'obsidian-black': 'radial-gradient(circle at center, #27272A 0%, #18181B 65%, #09090B 100%)',
    'champagne-opaline': 'radial-gradient(circle at center, #FEF3C7 0%, #E2D9C5 60%, #B8A992 100%)',
    'racing-emerald': 'radial-gradient(circle at center, #065F46 0%, #043828 65%, #021C14 100%)',
  };

  const caseBorders: Record<string, { border: string; bg: string }> = {
    '18k-rose-gold': { border: '#D4AF37', bg: 'linear-gradient(135deg, #ECC880, #C5A059, #8C6A2E)' },
    'obsidian-ceramic': { border: '#3F3F46', bg: 'linear-gradient(135deg, #27272A, #18181B, #09090B)' },
    'titanium-grade-5': { border: '#94A3B8', bg: 'linear-gradient(135deg, #CBD5E1, #94A3B8, #475569)' },
    'oystersteel-904l': { border: '#E2E8F0', bg: 'linear-gradient(135deg, #F8FAFC, #CBD5E1, #64748B)' },
  };

  return (
    <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-14 space-y-8 sm:space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium font-mono">
          Sur-Mesure Haute Horlogerie
        </div>
        <h1 className="font-cinzel text-2xl sm:text-5xl font-bold text-white tracking-tight">
          The Bespoke Atelier Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light px-2">
          Commission a singular mechanical masterpiece built specifically to your taste. Select noble metallurgy, dial enameling, movement complications, and personal caseback engravings.
        </p>
      </div>

      {/* Main Configurator Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
        {/* Left 6 cols: Interactive Visual Preview Canvas */}
        <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-4">
          <div className="bg-[#12151D] border border-white/[0.08] rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px] relative overflow-hidden shadow-2xl">
            {/* View toggle (Front / Caseback) */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex gap-1 p-1 rounded-full bg-black/70 border border-white/[0.1] backdrop-blur-sm">
              <button
                onClick={() => setActiveSide('front')}
                className={`px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full uppercase tracking-wider transition-colors ${
                  activeSide === 'front' ? 'bg-[#C5A059] text-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dial View
              </button>
              <button
                onClick={() => setActiveSide('caseback')}
                className={`px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full uppercase tracking-wider transition-colors ${
                  activeSide === 'caseback' ? 'bg-[#C5A059] text-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Exhibition Caseback
              </button>
            </div>

            {/* Simulated Watch Rendering Container */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center my-6">
              {/* Strap upper segment */}
              <div
                className="absolute -top-10 w-28 h-16 rounded-t-md opacity-90 shadow-lg"
                style={{
                  backgroundColor:
                    config.strapType === 'alligator-leather'
                      ? '#3E2723'
                      : config.strapType === 'tuscan-suede'
                      ? '#8D6E63'
                      : config.strapType === 'milanese-mesh'
                      ? '#78909C'
                      : '#37474F',
                }}
              />
              {/* Strap lower segment */}
              <div
                className="absolute -bottom-10 w-28 h-16 rounded-b-md opacity-90 shadow-lg"
                style={{
                  backgroundColor:
                    config.strapType === 'alligator-leather'
                      ? '#3E2723'
                      : config.strapType === 'tuscan-suede'
                      ? '#8D6E63'
                      : config.strapType === 'milanese-mesh'
                      ? '#78909C'
                      : '#37474F',
                }}
              />

              {/* Watch Case (Bezel + Body) */}
              <div
                className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-3 shadow-2xl flex items-center justify-center z-10 transition-all duration-500"
                style={{
                  background: caseBorders[config.caseMaterial].bg,
                  boxShadow: `0 0 40px rgba(0,0,0,0.8), inset 0 0 15px rgba(255,255,255,0.2)`,
                }}
              >
                {/* Dial Center or Caseback Center */}
                {activeSide === 'front' ? (
                  <div
                    className="w-full h-full rounded-full relative flex items-center justify-center border border-white/20 transition-all duration-500 overflow-hidden"
                    style={{
                      background: dialBackgrounds[config.dialColor],
                    }}
                  >
                    {/* Dial hour indices */}
                    <div className="absolute top-2 font-cinzel text-[11px] font-bold text-white/90">XII</div>
                    <div className="absolute bottom-2 font-cinzel text-[11px] font-bold text-white/90">VI</div>
                    <div className="absolute left-2.5 font-cinzel text-[11px] font-bold text-white/90">IX</div>
                    <div className="absolute right-2.5 font-cinzel text-[11px] font-bold text-white/90">III</div>

                    {/* Brand print */}
                    <div className="absolute top-12 text-center">
                      <span className="font-cinzel text-[9px] tracking-[0.2em] font-bold text-white block">
                        AURELIA
                      </span>
                      <span className="text-[6px] tracking-[0.3em] text-[#C5A059] uppercase block">
                        LE BRASSUS
                      </span>
                    </div>

                    {/* Complication indicator (Tourbillon cage or date) */}
                    {config.movementType === 'skeleton-tourbillon' ? (
                      <div className="absolute bottom-9 w-12 h-12 rounded-full border border-[#D4AF37] bg-black/60 flex items-center justify-center animate-spin duration-1000">
                        <div className="w-8 h-8 rounded-full border border-[#C5A059] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#E53E3E]" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute bottom-11 text-[7px] tracking-widest uppercase font-mono text-white/70">
                        AUTOMATIQUE
                      </div>
                    )}

                    {/* Watch hands */}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] z-20" />
                    {/* Hour Hand */}
                    <div className="absolute w-[2px] h-14 bg-white origin-bottom -translate-y-7 rotate-45 rounded-full" />
                    {/* Minute Hand */}
                    <div className="absolute w-[1.5px] h-20 bg-[#C5A059] origin-bottom -translate-y-10 -rotate-30 rounded-full" />
                  </div>
                ) : (
                  /* Caseback view with engraving */
                  <div className="w-full h-full rounded-full relative flex items-center justify-center border-4 border-dashed border-[#D4AF37]/50 bg-[#0A0D13] p-4 text-center">
                    <div className="space-y-2">
                      <div className="text-[9px] font-mono tracking-widest text-[#C5A059] uppercase">
                        SAPPHIRE CASEBACK · 50M
                      </div>
                      <div className="w-12 h-12 rounded-full border border-white/20 mx-auto flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#D4AF37]/30 border border-[#D4AF37]" />
                      </div>
                      <div className="text-[10px] font-cinzel text-white px-2 italic font-semibold border-y border-white/10 py-1">
                        &quot;{config.engravingText || 'No Engraving Specified'}&quot;
                      </div>
                      <div className="text-[8px] font-mono text-slate-400">
                        CALIBRE MANUFACTURE SUISSE
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom summary on canvas */}
            <div className="mt-8 text-center">
              <span className="text-[10px] uppercase font-mono text-[#C5A059] tracking-widest block">
                Estimated Configuration Total
              </span>
              <span className="font-mono text-2xl font-bold text-white tabular-nums">
                {formatPrice(totalPriceUSD, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Right 6 cols: Selection Controls */}
        <div className="lg:col-span-6 space-y-8 bg-[#12151D] p-6 sm:p-8 rounded-xl border border-white/[0.08]">
          {/* 1. Case Metallurgy */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] font-cinzel block">
              1. Case Metallurgy
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: '18k-rose-gold', name: '18k 5N Rose Gold', price: 24500, desc: 'Mirror & satin beveled' },
                { id: 'obsidian-ceramic', name: 'Obsidian Ceramic', price: 18800, desc: 'Scratch-proof monolithic' },
                { id: 'titanium-grade-5', name: 'Grade 5 Titanium', price: 15600, desc: 'Featherlight aerospace' },
                { id: 'oystersteel-904l', name: 'Oystersteel 904L', price: 12200, desc: 'Super-alloy polished' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setConfig({ ...config, caseMaterial: item.id as any })}
                  className={`p-3 rounded border text-left transition-all ${
                    config.caseMaterial === item.id
                      ? 'bg-[#C5A059]/15 border-[#C5A059] text-white shadow'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                  <div className="text-xs font-mono text-[#C5A059] mt-1 tabular-nums">
                    {formatPrice(item.price, currency)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Dial Finish */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] font-cinzel block">
              2. Dial Lacquer & Enamel Finish
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'midnight-blue', name: 'Midnight Sunburst Blue' },
                { id: 'obsidian-black', name: 'Obsidian Jet Black' },
                { id: 'champagne-opaline', name: 'Champagne Opaline' },
                { id: 'racing-emerald', name: 'Racing Forest Emerald' },
              ].map((dial) => (
                <button
                  key={dial.id}
                  onClick={() => setConfig({ ...config, dialColor: dial.id as any })}
                  className={`p-3 rounded border text-left transition-all ${
                    config.dialColor === dial.id
                      ? 'bg-[#C5A059]/15 border-[#C5A059] text-white shadow'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">{dial.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Hand-Applied Guilloché</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. In-House Movement */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] font-cinzel block">
              3. Manufacture Calibre
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setConfig({ ...config, movementType: 'automatic-date' })}
                className={`p-3 rounded border text-left transition-all ${
                  config.movementType === 'automatic-date'
                    ? 'bg-[#C5A059]/15 border-[#C5A059] text-white shadow'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-semibold text-white">Calibre AH-101 Automatique</div>
                <div className="text-[10px] text-slate-400">22k Gold rotor · 60h reserve</div>
                <div className="text-xs font-mono text-[#C5A059] mt-1">Included</div>
              </button>

              <button
                onClick={() => setConfig({ ...config, movementType: 'skeleton-tourbillon' })}
                className={`p-3 rounded border text-left transition-all ${
                  config.movementType === 'skeleton-tourbillon'
                    ? 'bg-[#C5A059]/15 border-[#C5A059] text-white shadow'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-semibold text-white">Calibre AH-900 Flying Tourbillon</div>
                <div className="text-[10px] text-slate-400">Skeleton cage · 72h reserve</div>
                <div className="text-xs font-mono text-[#C5A059] mt-1">
                  +{formatPrice(28000, currency)}
                </div>
              </button>
            </div>
          </div>

          {/* 4. Strap Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] font-cinzel block">
              4. Strap / Bracelet Selection
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'alligator-leather', name: 'Mississippi Alligator', price: 0 },
                { id: 'oyster-steel', name: 'Solid Matching Bracelet', price: 2400 },
                { id: 'milanese-mesh', name: 'Milanese Mesh Weave', price: 1200 },
                { id: 'tuscan-suede', name: 'Tuscan Suede Calfskin', price: 400 },
              ].map((strap) => (
                <button
                  key={strap.id}
                  onClick={() => setConfig({ ...config, strapType: strap.id as any })}
                  className={`p-3 rounded border text-left transition-all ${
                    config.strapType === strap.id
                      ? 'bg-[#C5A059]/15 border-[#C5A059] text-white shadow'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">{strap.name}</div>
                  <div className="text-xs font-mono text-[#C5A059] mt-0.5">
                    {strap.price === 0 ? 'Standard' : `+${formatPrice(strap.price, currency)}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Custom Laser Engraving */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] font-cinzel">
                5. Exhibition Caseback Engraving (Complimentary)
              </label>
              <button
                onClick={() => setActiveSide('caseback')}
                className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1"
              >
                <PenTool className="w-3 h-3" /> Preview on Caseback
              </button>
            </div>
            <input
              type="text"
              maxLength={36}
              value={config.engravingText}
              onChange={(e) => setConfig({ ...config, engravingText: e.target.value })}
              placeholder="e.g. AURELIA · LE BRASSUS · 2026"
              className="w-full px-3.5 py-2.5 text-xs bg-white/[0.03] border border-white/[0.1] rounded text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
            />
            <span className="text-[10px] text-slate-400 block text-right font-mono">
              {config.engravingText.length} / 36 characters
            </span>
          </div>

          {/* Commission CTA */}
          <div className="pt-4 border-t border-white/[0.08] space-y-3">
            <button
              onClick={handleCommission}
              className="w-full py-4 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.35)] hover:shadow-[0_0_30px_rgba(197,160,89,0.6)] transition-all rounded-full flex items-center justify-center gap-2 active:scale-95"
            >
              {orderedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Bespoke Piece Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-black stroke-[2.2]" />
                  <span>Commission Timepiece ({formatPrice(totalPriceUSD, currency)})</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Includes Certificate of Uniqueness & 5-Year Global Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery CTA */}
      {onNavigate && (
        <div className="p-6 sm:p-8 rounded-xl bg-white/[0.02] border border-gold/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-cinzel text-base font-bold text-white">Need Personal Horological Consultation?</h4>
            <p className="text-xs text-slate-400 mt-0.5">Meet with our master watchmaker in private salons in Geneva, London, or Zurich.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('concierge')}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#C5A059] to-[#E2C775] hover:to-[#C5A059] transition-all"
            >
              Book Salon Session
            </button>
            <button
              onClick={() => onNavigate('collections')}
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/20 transition-all"
            >
              Catalog Watches
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
