import React from 'react';
import { MapPin, Star, ShieldCheck, Sparkles, Watch as WatchIcon, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  residence: string;
  watchModel: string;
  quote: string;
  year: string;
  initials: string;
}

const ROW_ONE: Testimonial[] = [
  {
    id: 't-1',
    name: 'François de Vaud',
    residence: 'Mayfair Penthouse · London',
    watchModel: 'Royal Chronograph 41',
    quote: 'Combines the engineering rigor of high-beat chronometry with finishing standards that rival independent Geneva masters.',
    year: '2018',
    initials: 'FV'
  },
  {
    id: 't-2',
    name: 'Julian Davenport',
    residence: 'Palm Jumeirah · Dubai',
    watchModel: 'Perpetual Calendar Flyback',
    quote: 'The column-wheel flyback mechanism has a tactile click of sheer perfection. Armored delivery was flawless.',
    year: '2021',
    initials: 'JD'
  },
  {
    id: 't-3',
    name: 'Dr. Tariq Al-Mansoor',
    residence: 'Gold Coast Villa · Zurich',
    watchModel: 'Symphonie Skeleton',
    quote: 'Wearing the Symphonie Skeleton Tourbillon is like wearing a mechanical cathedral on the wrist. Breathtaking transparency.',
    year: '2019',
    initials: 'TA'
  },
  {
    id: 't-4',
    name: 'Lord Harrison Vance',
    residence: 'Highlands Estate · Scotland',
    watchModel: 'Heritage 1892 Chronomètre',
    quote: 'The gentian wood anglage on the bridges is noticeably superior to venerable historic museum pieces.',
    year: '2017',
    initials: 'HV'
  },
  {
    id: 't-13',
    name: 'Marcus Sterling',
    residence: 'The Peak · Hong Kong',
    watchModel: 'Symphonie Rose Gold',
    quote: 'The mirror polish on the bevelled bridges catches light with hypnotic brilliance in sunlight.',
    year: '2023',
    initials: 'MS'
  }
];

const ROW_TWO: Testimonial[] = [
  {
    id: 't-5',
    name: 'Kenjiro Takahashi',
    residence: 'Minami-Aoyama · Tokyo',
    watchModel: 'Diver 300M Titanium',
    quote: 'Grade 5 titanium case is silky smooth, and the lacquered dial possesses hypnotic depth in natural sunlight.',
    year: '2022',
    initials: 'KT'
  },
  {
    id: 't-6',
    name: 'Charles Montgomery',
    residence: 'Upper East Side · New York',
    watchModel: 'Celestial Tourbillon',
    quote: 'Acquired through private vault allocation. Concierge white-glove handoff was an unforgettable experience.',
    year: '2020',
    initials: 'CM'
  },
  {
    id: 't-7',
    name: 'Contessa Beatrice Visconti',
    residence: 'Villa Olmo · Lake Como',
    watchModel: 'Ultra-Thin Calibre 880',
    quote: 'The 6.8mm profile sits like second skin beneath evening cuffs. Finishing is peerless and quiet luxury.',
    year: '2023',
    initials: 'BV'
  },
  {
    id: 't-8',
    name: 'Sheikh Hamdan Al-Zubair',
    residence: 'Waterfront · Abu Dhabi',
    watchModel: 'Bespoke Tourbillon 01/01',
    quote: 'The bespoke gold alloy and hand-guilloché dial exceeded every benchmark. A true heirloom for my children.',
    year: '2022',
    initials: 'HZ'
  },
  {
    id: 't-14',
    name: 'Elena Rostova',
    residence: 'Old Town · Prague',
    watchModel: 'Ultra-Thin Moonphase',
    quote: 'Discreet opulence at its highest level. The tactile feedback of the hand-wound winding stem is pure silk.',
    year: '2021',
    initials: 'ER'
  }
];

const ROW_THREE: Testimonial[] = [
  {
    id: 't-9',
    name: 'Maximilian von Berg',
    residence: 'Maximilianstraße · Munich',
    watchModel: 'Royal Chronograph Silver',
    quote: 'Observed variance is +0.8 seconds over thirty days of daily rotation. Chronometric precision at its pinnacle.',
    year: '2020',
    initials: 'MB'
  },
  {
    id: 't-10',
    name: 'Pierre-Alain Laurent',
    residence: 'Quai du Mont-Blanc · Geneva',
    watchModel: 'Flying Tourbillon Regulator',
    quote: 'Aurelia’s commitment to 100% in-house escapements is what independent Swiss watchmaking desperately needed.',
    year: '2016',
    initials: 'PL'
  },
  {
    id: 't-11',
    name: 'David Sterling',
    residence: 'Repulse Bay · Hong Kong',
    watchModel: 'Meteorite Chronograph',
    quote: 'The 72-hour power reserve and tactile column-wheel tactile response put this calibre in a league of its own.',
    year: '2022',
    initials: 'DS'
  },
  {
    id: 't-12',
    name: 'Alexander Romanov',
    residence: 'Cap d’Antibes · French Riviera',
    watchModel: 'Diver 300M Ceramic',
    quote: 'Armored courier delivery arrived directly with wax-sealed provenance papers. Exemplary discretion.',
    year: '2021',
    initials: 'AR'
  },
  {
    id: 't-15',
    name: 'Victor Vance-Croft',
    residence: 'Palace Gardens · London',
    watchModel: 'Grand Chronomètre 1892',
    quote: 'Delivered in a handcrafted walnut humidor box. An enduring horological triumph that commands admiration.',
    year: '2023',
    initials: 'VV'
  }
];

const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => {
  return (
    <div className="w-[340px] sm:w-[420px] shrink-0 p-3.5 sm:p-4 rounded-xl bg-gradient-to-b from-[#0F1420] to-[#0A0D15] border border-[#C5A059]/25 hover:border-[#C5A059] shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_30px_rgba(197,160,89,0.2)] transition-all duration-300 flex flex-col justify-between mx-2.5 text-left group">
      {/* Top Header: Monogram Avatar, Patron Info, Model & Stars */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Gold Monogram Crest */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A059] via-[#E2C775] to-[#9A7B38] p-[1px] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-[#0B0E17] flex items-center justify-center text-[#C5A059] font-cinzel font-bold text-[10px]">
              {item.initials}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#C5A059] transition-colors font-cinzel truncate leading-tight">
                {item.name}
              </h4>
              <span className="text-[7.5px] font-mono text-[#C5A059] uppercase tracking-wider font-semibold flex items-center gap-0.5 bg-[#C5A059]/10 px-1 py-0.2 rounded border border-[#C5A059]/30 shrink-0">
                <ShieldCheck className="w-2.5 h-2.5 text-[#C5A059]" />
                <span>Verified</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9.5px] text-slate-400 font-light truncate mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#C5A059]/80 shrink-0" />
              <span className="truncate">{item.residence}</span>
            </div>
          </div>
        </div>

        {/* Right side: 5 Gold Stars & Model Badge */}
        <div className="flex flex-col items-end shrink-0 pl-1">
          <div className="flex items-center gap-0.5 text-[#C5A059]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-[#C5A059] text-[#C5A059]" />
            ))}
          </div>
          <div className="flex items-center gap-1 text-[9px] text-[#E2C775] bg-[#C5A059]/10 border border-[#C5A059]/30 px-1.5 py-0.5 rounded mt-1 max-w-[130px] sm:max-w-[160px] truncate">
            <WatchIcon className="w-2.5 h-2.5 text-[#C5A059] shrink-0" />
            <span className="truncate font-mono font-medium">{item.watchModel}</span>
          </div>
        </div>
      </div>

      {/* Quote: 2 readable lines with gold quote bar */}
      <p className="mt-2 text-[11px] sm:text-[11.5px] text-slate-300 font-light leading-relaxed italic pl-2.5 border-l-2 border-[#C5A059]/40 group-hover:border-[#C5A059] transition-colors line-clamp-2">
        &quot;{item.quote}&quot;
      </p>

      {/* Card Micro Footer */}
      <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[8.5px] text-slate-500 font-mono">
        <span className="text-[#C5A059]/80 flex items-center gap-1">
          <Sparkles className="w-2 h-2" />
          <span>Independent Calibre Provenance</span>
        </span>
        <span>Patron since {item.year}</span>
      </div>
    </div>
  );
};

export const CollectorMarqueeSection: React.FC = () => {
  return (
    <section className="w-full bg-[#06080E] py-6 sm:py-8 border-y border-[#C5A059]/25 relative overflow-hidden text-white">
      {/* Background subtle radial luminescence */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Elegant Header */}
      <div className="text-center max-w-2xl mx-auto px-4 mb-3 sm:mb-4 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/35 text-[9.5px] uppercase tracking-[0.22em] text-[#C5A059] font-semibold mb-1 shadow-sm">
          <Sparkles className="w-2.5 h-2.5 text-[#C5A059]" />
          <span>Global Collector Community · 14,000+ Patrons</span>
        </div>
        <h2 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
          Client Reflections &amp; Verified Provenance
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-400 font-light mt-0.5">
          Authentic words from distinguished collectors across Geneva, London, Tokyo, and New York.
        </p>
      </div>

      {/* Marquee Wrapper with soft edge shadow masks */}
      <div className="relative w-full space-y-2 sm:space-y-2.5 overflow-hidden z-10">
        {/* Left & Right gradient masks for smooth cinematic fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-[#06080E] via-[#06080E]/85 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-[#06080E] via-[#06080E]/85 to-transparent z-20" />

        {/* LINE 1: Moves LEFT */}
        <div className="flex overflow-hidden select-none">
          <div className="animate-marquee-left">
            {ROW_ONE.map((item) => (
              <TestimonialCard key={`row1-a-${item.id}`} item={item} />
            ))}
            {ROW_ONE.map((item) => (
              <TestimonialCard key={`row1-b-${item.id}`} item={item} />
            ))}
          </div>
        </div>

        {/* LINE 2: Moves RIGHT */}
        <div className="flex overflow-hidden select-none">
          <div className="animate-marquee-right">
            {ROW_TWO.map((item) => (
              <TestimonialCard key={`row2-a-${item.id}`} item={item} />
            ))}
            {ROW_TWO.map((item) => (
              <TestimonialCard key={`row2-b-${item.id}`} item={item} />
            ))}
          </div>
        </div>

        {/* LINE 3: Moves LEFT */}
        <div className="flex overflow-hidden select-none">
          <div className="animate-marquee-left">
            {ROW_THREE.map((item) => (
              <TestimonialCard key={`row3-a-${item.id}`} item={item} />
            ))}
            {ROW_THREE.map((item) => (
              <TestimonialCard key={`row3-b-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
