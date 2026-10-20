import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Award, Shield, Compass, ChevronRight, Eye, Clock, Calendar, Bookmark, Heart, MapPin, Users, Building, History, BookOpen, X } from 'lucide-react';
import { Watch, PageRoute, CurrencyCode } from '../types/watch';
import { formatPrice } from '../utils/currency';
import { BrandStory } from '../components/BrandStory';
import { CollectorMarqueeSection } from '../components/CollectorMarqueeSection';

interface JournalArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  read: string;
  excerpt: string;
  image: string;
  fallbackImage?: string;
  fullText: string;
}

const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'art-1',
    title: 'The Evolution of Free-Sprung Balance Wheels',
    category: 'Horological Engineering',
    date: 'October 2026',
    read: '4 min read',
    excerpt: 'Examining thermal compensation alloys and inertia block regulation in high-beat calibres.',
    image: './assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
    fullText: 'Traditional regulator index pins restrict the active length of the balance spring, introducing positional error and chronometric drift over time. Aurelia’s proprietary free-sprung variable inertia balance wheel utilizes aerodynamic platinum micro-weights poised directly on the rim. Combined with our anti-magnetic silicon hairspring, this architecture maintains rate stability within ±1 second across all five testing positions.'
  },
  {
    id: 'art-2',
    title: 'Architecture of Le Brassus: Glass & Titanium',
    category: 'Manufacture Architecture',
    date: 'September 2026',
    read: '6 min read',
    excerpt: 'How our zero-carbon manufacture integrates natural alpine light into watchmaking benches.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: './assets/images/hero_luxury_chronograph_1791612522214.jpg',
    fullText: 'Perched 1,004 meters above sea level in the Vallée de Joux, the Aurelia manufacture is an exercise in structural lightness. Floor-to-ceiling electrochromic triple-glazed glass walls curve along the contours of the Jura topography, bathing master watchmakers in diffuse northern light while ground-source geothermal loops maintain 0.1°C temperature stability.'
  },
  {
    id: 'art-3',
    title: 'The Mastery of Internal Anglage Chamfering',
    category: 'Métiers d’Art Finishing',
    date: 'August 2026',
    read: '5 min read',
    excerpt: 'Why machine-cut bevels can never replicate the mirror polish achieved by gentian wood.',
    image: './assets/images/craftsmanship_watchmaker_1791612587562.jpg',
    fullText: 'While 5-axis CNC mills can shape bridge blanks to micron tolerances, the acute internal angles of haute horlogerie remain strictly impassable for machines. Each interior corner of an Aurelia bridge is finished by hand using files and polished with pegwood stems harvested from local Jura gentian plants, impregnated with diamond paste to achieve a flawless speculaire black-polish reflection.'
  }
];

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  featuredWatches: Watch[];
  currency: CurrencyCode;
  onOpenQuickView: (watch: Watch) => void;
  onAddToCart: (watch: Watch) => void;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.1, 0.25, 1.0] 
    } 
  }
};

const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    }
  }
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.9, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
};

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  featuredWatches,
  currency,
  onOpenQuickView,
  onAddToCart,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);

  return (
    <div className="space-y-0 pb-20 bg-white text-slate-900">
      {/* 1. Hero Section (Immersive Dark Cinematic) */}
      <motion.section 
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative h-[calc(100vh-70px)] min-h-[520px] flex items-center justify-center border-b border-gold/20 overflow-hidden bg-black text-white"
      >
        {/* Hero Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center z-0 filter brightness-[0.75] contrast-[1.05]"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-[#050505]/85 z-10" />

        <div className="w-full px-4 sm:px-8 lg:px-16 py-12 sm:py-20 relative z-20 flex flex-col items-center text-center pb-20 sm:pb-24">
          {/* Content Container */}
          <motion.div variants={heroContainerVariants} className="max-w-3xl space-y-5 sm:space-y-6 w-full">
            {/* Top Minimalist Typography Kicker */}
            <motion.div variants={heroItemVariants} className="flex items-center justify-center gap-2 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gold/90 font-light">
              <span className="w-6 h-[1px] bg-gold/50" />
              <span>Haute Horlogerie · Est. 1892</span>
              <span className="w-6 h-[1px] bg-gold/50" />
            </motion.div>

            {/* Main Title - Compact & Refined */}
            <motion.h1 variants={heroItemVariants} className="font-watch-hero text-3xl xs:text-4xl sm:text-6xl font-semibold tracking-[0.04em] text-white leading-[1.15]">
              Masterpieces of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E2B3] via-[#C5A059] to-[#A38139]">Swiss Chronometry</span>
            </motion.h1>

            {/* Subtitle / Description */}
            <motion.p variants={heroItemVariants} className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
              Uncompromising mechanical precision and avant-garde horological artistry from the Vallée de Joux.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={heroItemVariants} className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto">
              <button
                onClick={() => onNavigate('collections')}
                className="w-full sm:w-auto group relative overflow-hidden rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.35)] transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95"
              >
                <span>Explore Masterpieces</span>
                <ArrowRight className="w-3.5 h-3.5 text-black transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigate('bespoke')}
                className="w-full sm:w-auto rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white border border-gold/40 hover:border-gold hover:bg-gold/15 bg-black/40 backdrop-blur-md transition-all duration-300 active:scale-95 text-center"
              >
                Bespoke Studio
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Absolute Bottom Provenance Markers */}
        <motion.div 
          variants={heroItemVariants}
          className="absolute bottom-5 left-0 right-0 z-30 px-4 sm:px-8 lg:px-16"
        >
          <div className="max-w-xl mx-auto grid grid-cols-3 gap-2 text-center text-xs text-stone-300">
            <div>
              <span className="font-cinzel text-white text-sm sm:text-base font-bold block tracking-widest">1892</span>
              <span className="text-[9px] sm:text-[10px] text-gold uppercase tracking-[0.25em]">Heritage</span>
            </div>
            <div className="border-x border-gold/20">
              <span className="font-cinzel text-white text-sm sm:text-base font-bold block tracking-widest">100%</span>
              <span className="text-[9px] sm:text-[10px] text-gold uppercase tracking-[0.25em]">In-House</span>
            </div>
            <div>
              <span className="font-cinzel text-white text-sm sm:text-base font-bold block tracking-widest">COSC</span>
              <span className="text-[9px] sm:text-[10px] text-gold uppercase tracking-[0.25em]">Certified</span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* 2. New Arrivals Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-24 bg-white text-slate-900"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#9A7B38] font-semibold">
              Freshly Unveiled · 2026 Editions
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('collections')}
            className="text-xs font-semibold uppercase tracking-widest text-[#9A7B38] hover:text-slate-900 transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Browse Entire Catalogue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWatches.slice(0, 3).map((watch) => (
            <div
              key={`new-${watch.id}`}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:border-[#9A7B38]/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md"
            >
              <div 
                className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
                onClick={() => onOpenQuickView(watch)}
              >
                <img
                  src={watch.image}
                  alt={watch.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#9A7B38] text-white text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-md">
                  New Arrival
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="font-mono text-[#9A7B38] font-semibold">{watch.reference}</span>
                    <span>{watch.specs.calibre}</span>
                  </div>
                  <h3
                    onClick={() => onOpenQuickView(watch)}
                    className="font-cinzel text-base sm:text-lg font-bold text-slate-900 mt-1 group-hover:text-[#9A7B38] transition-colors cursor-pointer"
                  >
                    {watch.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-light">
                    {watch.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                    {formatPrice(watch.priceUSD, currency)}
                  </span>
                  <button
                    onClick={() => onAddToCart(watch)}
                    className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#1A1A1A] hover:bg-[#9A7B38] transition-all active:scale-95 shrink-0"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 3. Our Watches Categories */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 bg-[#FAFAFA] py-16 border-y border-slate-200"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#9A7B38] font-semibold">
            Horological Classification
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
            Our Watches Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-light">
            Explore timepieces engineered for elite diving, high-frequency chronography, gravitational tourbillon regulation, and ultra-thin evening wear.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { id: 'Chronograph', name: 'Chronographs', desc: 'Precision Flyback Timing', count: '4 Models' },
            { id: 'Tourbillon', name: 'Tourbillons', desc: 'Gravitational Compensation', count: '3 Models' },
            { id: 'Diver', name: 'Diver 300M', desc: 'Helium Escape & Luminescence', count: '3 Models' },
            { id: 'Dress', name: 'Ultra-Thin Dress', desc: 'Sub-8mm Elegance', count: '3 Models' },
            { id: 'Heritage', name: 'Heritage Classics', desc: 'Revival of 1892 Pockets', count: '3 Models' },
          ].map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('collections')}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#9A7B38] transition-all cursor-pointer group text-center space-y-2 flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-[10px] font-mono text-[#9A7B38] uppercase tracking-wider font-bold">{cat.count}</span>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-slate-900 mt-1 group-hover:text-[#9A7B38] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 font-light">{cat.desc}</p>
              </div>
              <div className="pt-3 text-xs text-[#9A7B38] font-semibold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 4. Limited Sale Event */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 py-16 bg-white"
      >
        <div className="p-8 sm:p-14 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white border border-[#C5A059]/40 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] text-[10px] font-mono tracking-widest uppercase font-semibold">
              Annual Allocation Reserve Event
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white">
              Limited Sale Event · 2026 Vault Release
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Secure priority private acquisition rights for vault-stored limited series timepieces. Complimentary bespoke engraving and 5-year international master warranty included.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="text-center bg-black/50 px-6 py-4 rounded-xl border border-gold/30">
              <span className="font-mono text-xl sm:text-2xl font-bold text-gold block">14 : 08 : 42</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Allocation Closes In</span>
            </div>
            <button
              onClick={() => onNavigate('collections')}
              className="rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95"
            >
              Enter Reserve Vault
            </button>
          </div>
        </div>
      </motion.section>

      {/* 5. Featured Products & Masterpieces */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 py-16 bg-[#FAFAFA] border-t border-slate-200"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#9A7B38] font-semibold">
              Grand Complication Masterpieces
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
              Featured Products & Masterpieces
            </h2>
          </div>
          <button
            onClick={() => onNavigate('collections')}
            className="text-xs font-semibold uppercase tracking-widest text-[#9A7B38] hover:text-slate-900 transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>View All Masterpieces</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWatches.slice(3, 6).map((watch) => (
            <div
              key={`masterpiece-${watch.id}`}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:border-[#9A7B38]/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md"
            >
              <div 
                className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
                onClick={() => onOpenQuickView(watch)}
              >
                <img
                  src={watch.image}
                  alt={watch.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                  Masterpiece
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="font-mono text-[#9A7B38] font-semibold">{watch.reference}</span>
                    <span>{watch.specs.caseDiameter}</span>
                  </div>
                  <h3
                    onClick={() => onOpenQuickView(watch)}
                    className="font-cinzel text-base sm:text-lg font-bold text-slate-900 mt-1 group-hover:text-[#9A7B38] transition-colors cursor-pointer"
                  >
                    {watch.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-light">
                    {watch.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                    {formatPrice(watch.priceUSD, currency)}
                  </span>
                  <button
                    onClick={() => onAddToCart(watch)}
                    className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#1A1A1A] hover:bg-[#9A7B38] transition-all active:scale-95 shrink-0"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 6. Featured Collection & Photo Gallery */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 py-16 bg-white"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#9A7B38] font-semibold">
            Visual Atelier Showcase
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
            Featured Collection & Photo Gallery
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-light">
            A visual journey through sapphire crystals, hand-chamfered bridges, and guilloché dials crafted in Le Brassus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Tourbillon Escapement', desc: 'Gravitational Error Compensation', img: featuredWatches[0]?.image || './assets/images/craftsmanship_watchmaker_1791612587562.jpg' },
            { title: 'Hand-Chamfered Bridges', desc: 'Internal Angle Mirror Polishing', img: featuredWatches[1]?.image || './assets/images/craftsmanship_watchmaker_1791612587562.jpg' },
            { title: 'Guilloché Sunburst Dial', desc: 'Engine-Turned Cotes de Geneve', img: featuredWatches[2]?.image || './assets/images/craftsmanship_watchmaker_1791612587562.jpg' },
            { title: 'Solid 22k Gold Rotor', desc: 'High-Inertia Oscillating Weight', img: featuredWatches[3]?.image || './assets/images/craftsmanship_watchmaker_1791612587562.jpg' },
          ].map((item, idx) => (
            <div key={`gallery-${idx}`} className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest">Atelier Series</span>
                <h3 className="font-cinzel text-base font-bold text-white mt-1">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5 font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Brand Story Component */}
      <BrandStory onNavigate={onNavigate} />

      {/* 7. Global Collector Community (3-line marquee: Left, Right, Left) */}
      <CollectorMarqueeSection />

      {/* 8. Founder Club */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 py-16 bg-white"
      >
        <div className="p-8 sm:p-14 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white border border-gold/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Exclusive Collector Membership
            </span>
            <h2 className="font-cinzel text-xl sm:text-3xl font-bold text-white">
              The Founder Club & Private Salons
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Join an elite circle of 500 global patrons. Enjoy private vault viewings in Le Brassus, bespoke annual horological retreats, and first-access rights to ultra-limited grand complications.
            </p>
          </div>

          <button
            onClick={() => onNavigate('concierge')}
            className="rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.35)] transition-all active:scale-95 shrink-0"
          >
            Apply for Founder Membership
          </button>
        </div>
      </motion.section>

      {/* 9. Latest Insights & Architectural Notes */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 py-16 bg-[#FAFAFA] border-t border-slate-200"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#9A7B38] font-semibold">
              Horological Journal
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
              Latest Insights & Architectural Notes
            </h2>
          </div>
          <button
            onClick={() => onNavigate('heritage')}
            className="text-xs font-semibold uppercase tracking-widest text-[#9A7B38] hover:text-slate-900 transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Read All Archives</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {JOURNAL_ARTICLES.map((article) => (
            <div 
              key={article.id} 
              onClick={() => setSelectedArticle(article)}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between group hover:border-[#9A7B38] hover:shadow-[0_12px_32px_rgba(197,160,89,0.18)] transition-all duration-300 cursor-pointer shadow-sm"
            >
              {/* Article Picture */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  onError={(e) => {
                    if (article.fallbackImage) {
                      (e.target as HTMLImageElement).src = article.fallbackImage;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                
                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/20 text-[#C5A059] text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold shadow-sm">
                  {article.category}
                </div>

                {/* Reading Time Pill */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                  <Clock className="w-2.5 h-2.5 text-[#C5A059]" />
                  <span>{article.read}</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span className="text-[#9A7B38] font-semibold">{article.date}</span>
                    <span className="text-slate-400 font-light flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#9A7B38]" />
                      <span>Archive Note</span>
                    </span>
                  </div>
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#9A7B38] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-[#9A7B38] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Journal Note</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#9A7B38] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 10. Your History */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 py-12 bg-white"
      >
        <div className="p-6 sm:p-10 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">Collector Session History</div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">Your Horological Timeline & Viewed Masterpieces</h3>
              <p className="text-xs text-slate-300 mt-0.5">Track your explored calibres, wishlist saves, and recent atelier sessions in real-time.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('collections')}
            className="rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] transition-all active:scale-95 shrink-0"
          >
            Review Session History
          </button>
        </div>
      </motion.section>

      {/* Interactive Journal Reader Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gold/40 shadow-2xl relative text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-md"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hero Image in Modal */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (selectedArticle.fallbackImage) {
                    (e.target as HTMLImageElement).src = selectedArticle.fallbackImage;
                  }
                }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] bg-black/60 px-2.5 py-0.5 rounded border border-gold/30">
                  {selectedArticle.category}
                </span>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-2 leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-100 pb-3">
                <span className="text-[#9A7B38] font-semibold">{selectedArticle.date}</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedArticle.read}</span>
                </span>
              </div>

              <p className="text-sm text-slate-800 leading-relaxed font-normal italic border-l-2 border-[#9A7B38] pl-3 bg-amber-50/50 py-2 rounded-r">
                &quot;{selectedArticle.excerpt}&quot;
              </p>

              <p className="text-sm text-slate-700 leading-relaxed font-light">
                {selectedArticle.fullText}
              </p>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-500 font-mono">Aurelia Horological Archives</span>
                <button 
                  onClick={() => {
                    setSelectedArticle(null);
                    onNavigate('heritage');
                  }}
                  className="text-xs font-semibold uppercase tracking-wider text-[#9A7B38] hover:text-slate-900 transition-colors flex items-center gap-1"
                >
                  <span>Explore Heritage Archives</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
