import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PageRoute } from '../types/watch';

interface BrandStoryProps {
  onNavigate: (page: PageRoute) => void;
}

export const BrandStory: React.FC<BrandStoryProps> = ({ onNavigate }) => {
  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-24 bg-white text-slate-900 border-y border-slate-200 relative overflow-hidden">
      {/* Background soft luxury radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Full-width container */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Column 1: Gold-Bordered Luxury Image Frame (Matches height of content) */}
          <div className="lg:col-span-5 relative flex flex-col min-h-[460px] lg:min-h-0 h-full">
            {/* Outer Decorative Gold Rim */}
            <div className="absolute -inset-2.5 sm:-inset-3 rounded-2xl border border-[#D5C09B]/70 pointer-events-none" />
            <div className="absolute -inset-5 sm:-inset-6 rounded-3xl border border-[#D5C09B]/30 pointer-events-none hidden sm:block" />

            {/* Corner Luxury Finials */}
            <div className="absolute -top-3 -left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-[#C5A059] z-20" />
            <div className="absolute -top-3 -right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-[#C5A059] z-20" />
            <div className="absolute -bottom-3 -left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-[#C5A059] z-20" />
            <div className="absolute -bottom-3 -right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-[#C5A059] z-20" />

            {/* Main Image Container stretched to 100% height */}
            <div className="relative rounded-xl overflow-hidden border-2 border-[#C5A059]/80 shadow-[0_20px_45px_rgba(15,18,28,0.12)] bg-slate-900 group flex-1 h-full w-full flex flex-col justify-end">
              <img
                src="./assets/images/craftsmanship_watchmaker_1791612587562.jpg"
                alt="Aurelia Horology Master Watchmaker assembling hand-chamfered calibre in Le Brassus"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Gold seal overlay at bottom of image */}
              <div className="relative z-10 m-4 p-4 rounded-xl bg-[#0F121C]/90 backdrop-blur-md border border-[#C5A059]/50 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#C5A059] font-mono block">
                    Manufacture Provenance
                  </span>
                  <span className="text-xs sm:text-sm font-cinzel font-bold text-white block mt-0.5">
                    Le Brassus, Vallée de Joux
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059] font-cinzel font-bold text-xs shadow-[0_0_12px_rgba(197,160,89,0.3)]">
                  1892
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Brand Story Narrative (Equal height flex container) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6 lg:space-y-0">
            {/* Top Header & Paragraph */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] border border-[#D5C09B] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#9A7B38] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>The Maison Chronicles · Since 1892</span>
              </div>

              <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#0F121C] tracking-wide leading-tight">
                An Unbroken Legacy of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9A7B38] via-[#C5A059] to-[#7A5B20]">
                  Swiss Chronometry
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Founded in the snowbound heights of the Vallée de Joux by master horologist Philippe Aurelia, our maison has spent over thirteen decades perfecting mechanical timekeeping without compromise. While others embraced mass automated assembly, Aurelia remained devoted to the sanctity of hand chamfering, gentian wood polishing, and free-sprung balance regulation.
              </p>
            </div>

            {/* Historic Milestones Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E9DEC6] hover:border-[#C5A059] transition-colors space-y-1 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <span className="font-mono text-[#9A7B38] text-lg font-bold block">1892</span>
                <h4 className="text-xs font-semibold text-slate-900 font-cinzel">The First Calibre</h4>
                <p className="text-[11px] text-slate-600 font-light leading-normal">
                  Founding workshop established in Le Brassus, manufacturing perpetual pocket chronometers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E9DEC6] hover:border-[#C5A059] transition-colors space-y-1 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <span className="font-mono text-[#9A7B38] text-lg font-bold block">1954</span>
                <h4 className="text-xs font-semibold text-slate-900 font-cinzel">Abyssal Diver 300M</h4>
                <p className="text-[11px] text-slate-600 font-light leading-normal">
                  Patented hermetic helium release valves for extreme underwater exploration.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E9DEC6] hover:border-[#C5A059] transition-colors space-y-1 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <span className="font-mono text-[#9A7B38] text-lg font-bold block">2026</span>
                <h4 className="text-xs font-semibold text-slate-900 font-cinzel">Gravity Tourbillon</h4>
                <p className="text-[11px] text-slate-600 font-light leading-normal">
                  Flying multi-axis cage compensating for Earth’s gravitational deviation in real-time.
                </p>
              </div>
            </div>

            {/* Signature & CTAs */}
            <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F0] border border-[#D5C09B] flex items-center justify-center text-[#9A7B38] shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-[#9A7B38]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">100% Manufacture In-House</span>
                  <span className="text-[10px] text-[#9A7B38] font-mono uppercase tracking-wider font-semibold">
                    Poinçon de Genève Certified
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('heritage')}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_4px_16px_rgba(197,160,89,0.3)] transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Read Full Heritage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
