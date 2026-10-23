import React from 'react';
import { Shield } from 'lucide-react';
import { PageRoute } from '../types/watch';

interface HeritagePageProps {
  onNavigate: (page: PageRoute) => void;
}

const MILESTONES = [
  {
    year: '1892',
    title: 'Founding of the Atelier in Le Brassus',
    description: 'Master horologist Émile Aurelia establishes his watchmaking workshop in the secluded winter snows of Vallée de Joux, hand-crafting pocket calibres for European royalty.',
  },
  {
    year: '1927',
    title: 'Geneva Observatory Chronometer Prize',
    description: 'Calibre 19-B claims first prize at the Geneva Cantonal Observatory trials, recording an unprecedented daily variance of less than 0.4 seconds across 45 test days.',
  },
  {
    year: '1968',
    title: 'The High-Beat Column Wheel Chronograph',
    description: 'Aurelia introduces the AH-400 Rallye movement, operating at 36,000 vibrations per hour to measure split-second intervals during Alpine car races.',
  },
  {
    year: '2001',
    title: 'Historical Calibre Restoration Department',
    description: 'Establishment of the Maison’s dedicated restoration department, maintaining original 19th-century tooling and archives for every serial number ever produced.',
  },
  {
    year: '2026',
    title: 'Silicon Escapements & Modern Haute Horlogerie',
    description: 'Unveiling of the Manufacture Horizon flying tourbillon calibres, pairing hand-anglage chamfering with cutting-edge anti-magnetic silicon hairsprings.',
  },
];

export const HeritagePage: React.FC<HeritagePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-screen bg-white text-slate-900 px-4 sm:px-8 lg:px-12 xl:px-16 py-12 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs uppercase tracking-[0.25em] text-[#9A7B38] font-bold">
          Vallée de Joux Heritage · Est. 1892
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          A Century of Unbroken Horological Lineage
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
          For more than 130 years, our family of watchmakers has guarded the esoteric arts of mechanical chronometry amidst the pine forests and limestone cliffs of the Swiss Jura.
        </p>
      </div>

      {/* Terroir & Origin Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-12 shadow-sm">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#9A7B38] font-mono font-bold">
            The Cradle of Complications
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            Why Vallée de Joux?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            Isolated during brutal alpine winters when snow cut off mountain passes, Jura farmers turned their meticulous winter hours into horological genius. It was in these farmhouse workshops that complications were invented: perpetual calendars, minute repeaters, and split-second chronographs.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            Aurelia remains rooted in this sacred soil. Every prototype is conceived, machined, hand-finished, and cased within 500 meters of the original 1892 atelier bench.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#9A7B38] font-semibold">
            <span>Latitude: 46.58° N</span>
            <span>·</span>
            <span>Altitude: 1,004m above sea level</span>
          </div>
        </div>

        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
          <img
            src="/assets/images/craftsmanship_watchmaker_1791612587562.jpg"
            alt="Historical watchmaking bench in Le Brassus"
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Chronological Milestones Timeline */}
      <div className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-900">
            Milestones of Innovation
          </h3>
          <p className="text-xs text-slate-500 font-light">
            Defining chapters in the chronicle of Aurelia Haute Horlogerie
          </p>
        </div>

        <div className="relative border-l border-slate-200 ml-4 sm:ml-32 space-y-12">
          {MILESTONES.map((m, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-12 group">
              {/* Year marker */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#9A7B38] group-hover:bg-[#9A7B38] transition-colors shadow-2xs" />

              <div className="space-y-1">
                <span className="font-mono text-sm sm:text-base font-bold text-[#9A7B38] tabular-nums">
                  {m.year}
                </span>
                <h4 className="font-cinzel text-lg font-bold text-slate-900 group-hover:text-[#9A7B38] transition-colors">
                  {m.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-light">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainable Haute Horlogerie Manifesto */}
      <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-black border border-[#C5A059]/40 text-white space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#C5A059]" />
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
            Ethical Metallurgy & Preservation Manifesto
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-2 p-4 bg-white/[0.05] border border-white/[0.1] rounded-xl">
            <h5 className="font-cinzel font-semibold text-white">100% Traced Gold</h5>
            <p className="font-light">
              Every ounce of 18k rose and yellow gold originates from verified artisanal mines adhering to Fairmined standards and ecological chemical handling.
            </p>
          </div>
          <div className="space-y-2 p-4 bg-white/[0.05] border border-white/[0.1] rounded-xl">
            <h5 className="font-cinzel font-semibold text-white">Perpetual Service Guarantee</h5>
            <p className="font-light">
              Our historical restoration atelier maintains the capability to reproduce any component for any watch made since 1892, ensuring your timepiece lives forever.
            </p>
          </div>
          <div className="space-y-2 p-4 bg-white/[0.05] border border-white/[0.1] rounded-xl">
            <h5 className="font-cinzel font-semibold text-white">Solar-Powered Manufacture</h5>
            <p className="font-light">
              Our Le Brassus facility generates 100% of its electricity from roof-integrated photovoltaic solar panels, respecting the pristine alpine environment.
            </p>
          </div>
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={() => onNavigate('collections')}
            className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] transition-all rounded-full shadow-lg active:scale-95 cursor-pointer"
          >
            Discover Historical Collections
          </button>
        </div>
      </div>
    </div>
  );
};
