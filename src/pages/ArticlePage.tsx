import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Share2, Printer, Sparkles, ChevronRight, Check, Award, Cpu, ShieldCheck } from 'lucide-react';
import { PageRoute } from '../types/watch';

interface ArticlePageProps {
  articleId: string;
  onNavigate: (page: PageRoute) => void;
}

interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  read: string;
  author: string;
  authorRole: string;
  image: string;
  fallbackImage?: string;
  pullQuote: string;
  content: string[];
  specs: { label: string; value: string }[];
}

const ARTICLES_DATA: Record<string, Article> = {
  'art-1': {
    id: 'art-1',
    title: 'The Evolution of Free-Sprung Balance Wheels',
    subtitle: 'High-Beat Variable Inertia Regulation in Contemporary Swiss Horology',
    category: 'Horological Engineering',
    date: 'October 2026',
    read: '4 min read',
    author: 'Jean-Luc Favre',
    authorRole: 'Head of Chronometric R&D, Le Brassus Atelier',
    image: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
    pullQuote: 'A free-sprung variable inertia balance eliminates regulator index friction, yielding absolute rate constancy under real-world gravitational shifts.',
    content: [
      'Traditional horological regulation has long depended on index curb pins that adjust the active working length of the balance spring. While practical for standard assembly, index pins inherently introduce friction, localized wear, and subtle chronometric drift as seasonal temperatures or wrist inertia fluctuate over time.',
      'Aurelia’s proprietary Calibre AH-900 series departs radically from conventional architecture by employing a free-sprung variable inertia balance wheel. Poised directly on the aerodynamic beryllium-copper rim are four micro-threaded platinum inertia screws, adjustable to within 0.002 grams of rotational poise.',
      'Paired with an anti-magnetic silicon (Silicium Nivachron) hairspring with a hand-curved Breguet overcoil, this architecture preserves an unperturbed concentric expansion. Across all five static positions and ISO 3159 chronometer testing environments, rate stability consistently measures within ±1 second per 24-hour cycle.',
      'To validate long-term resilience against kinetic shock, each newly cased balance assembly undergoes 1,000 hours of simulated g-force acceleration within our Le Brassus subterranean testing laboratory before receiving the Poinçon de Genève seal.'
    ],
    specs: [
      { label: 'Escapement Type', value: 'Free-Sprung Variable Inertia' },
      { label: 'Poise Micro-Weights', value: '4 Aerodynamic Platinum Screws' },
      { label: 'Hairspring', value: 'Silicon Nivachron w/ Terminal Curve' },
      { label: 'Vibrations', value: '28,800 vph (4 Hz)' },
      { label: 'Chronometer Tolerance', value: 'Within ±1 sec/day (5 positions)' },
      { label: 'Certification', value: 'COSC & Poinçon de Genève' }
    ]
  },
  'art-2': {
    id: 'art-2',
    title: 'Architecture of Le Brassus: Glass & Titanium',
    subtitle: 'Zero-Carbon Sustainable Manufacture Integrated with Alpine Topography',
    category: 'Manufacture Architecture',
    date: 'September 2026',
    read: '6 min read',
    author: 'Elena Moretti',
    authorRole: 'Chief Sustainable Architect, Aurelia Bureau',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: '/assets/images/hero_luxury_chronograph_1791612522214.jpg',
    pullQuote: 'Natural alpine northern light is the purest luminary tool for a master watchmaker polishing microscopic anglage angles.',
    content: [
      'Perched 1,004 meters above sea level in the craggy pine forests of the Vallée de Joux, the Aurelia Manufacture stands as an exercise in structural lightness and architectural humility. Rather than imposing monolithic stone upon the alpine hillside, the facility gently traces the natural contours of the Jura bedrock.',
      'Floor-to-ceiling electrochromic triple-laminated glass facade panels dynamically modulate light transmission based on sun azimuth. This bathes master watchmakers and micro-mechanical engineers in calm, shadow-free northern light—the identical ambient environment favored by 19th-century horological pioneers.',
      'Beneath the workshop floorboards lies a closed-loop geothermal array comprising 32 boreholes sunk 150 meters into the subalpine limestone. This zero-emission system stabilizes internal ambient temperature to within ±0.1°C throughout the year, an indispensable prerequisite for machining titanium components to micron tolerances.',
      'The superstructure itself echoes our horological ethos: Grade 5 brushed titanium columns, sustainably harvested Swiss spruce timbers, and a living sedum moss green roof that naturally insulates the cleanroom complexes against winter blizzards.'
    ],
    specs: [
      { label: 'Manufacture Elevation', value: '1,004 m (Vallée de Joux)' },
      { label: 'Energy Charter', value: '100% On-Site Solar & Geothermal' },
      { label: 'Cleanroom Thermal Precision', value: '±0.1°C Continuous Regulation' },
      { label: 'Structural Framework', value: 'Grade 5 Titanium & Swiss Alpine Spruce' },
      { label: 'Glazing Technology', value: 'Dynamic Electrochromic Triple-Glazed' },
      { label: 'Carbon Status', value: 'Net-Negative Alpine Facility' }
    ]
  },
  'art-3': {
    id: 'art-3',
    title: 'The Mastery of Internal Anglage Chamfering',
    subtitle: 'Why Hand-Polished Gentian Wood Bevels Can Never Be Replicated by CNC Mills',
    category: 'Métiers d’Art Finishing',
    date: 'August 2026',
    read: '5 min read',
    author: 'Yvan Doret',
    authorRole: 'Dean of Métiers d’Art & Master Finisher',
    image: '/assets/images/craftsmanship_watchmaker_1791612587562.jpg',
    pullQuote: 'No five-axis mill can ever carve an internal acute angle; only human patience and local gentian wood achieve true black polish.',
    content: [
      'Modern 5-axis CNC machines and spark-erosion wire EDM equipment have unquestionably elevated base machining accuracy across Swiss horology. Yet in haute finishing, machines encounter an insurmountable physical limitation: rotating cutters cannot produce an acute internal corner without leaving a microscopic radial curve.',
      'At Maison Aurelia, every movement bridge, cock, and tourbillon cage undergoes traditional hand-beveling (anglage). Using custom steel files ground to specific 45-degree profiles, our angleurs painstakingly carve uniform, sparkling chamfers along every perimeter edge.',
      'The defining step of this craft is the final polish. We harvest dry stems of wild yellow gentian (Gentiana lutea) directly from the meadows surrounding Le Brassus. Sliced into soft wooden pegwood stems and dressed with graduated diamond pastilles, the gentian wood compresses against the metal without altering the razor-sharp border.',
      'The result is a speculaire black-polish reflection—an optical phenomenon where the chamfer appears either blindingly brilliant or pitch black depending on the angle of incoming light. Achieving this level of excellence on a single skeletonized tourbillon bridge requires between 35 and 45 hours of relentless manual labor.'
    ],
    specs: [
      { label: 'Finishing Technique', value: 'Hand-Executed 45° Anglage' },
      { label: 'Polishing Medium', value: 'Natural Jura Gentian Wood Stems' },
      { label: 'Optical Reflection', value: 'Miroir Noir (Black Specular Polish)' },
      { label: 'Manual Labor per Calibre', value: '35 to 45 Hours' },
      { label: 'Corner Geometry', value: 'Sharp Internal Points (Angles Rentrants)' },
      { label: 'Standard Compliance', value: 'Hallmark of Geneva Article 12' }
    ]
  }
};

export const ArticlePage: React.FC<ArticlePageProps> = ({ articleId, onNavigate }) => {
  const article = ARTICLES_DATA[articleId] || ARTICLES_DATA['art-1'];
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Other articles for recommendations
  const otherArticles = Object.values(ARTICLES_DATA).filter((a) => a.id !== article.id);

  return (
    <div className="min-h-screen bg-white text-slate-900 py-8 sm:py-16 px-4 sm:px-8 lg:px-16 xl:px-24">
      {/* Top Navigation & Action Bar */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9A7B38] hover:text-slate-900 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Atelier Home</span>
        </button>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:text-[#9A7B38] hover:border-[#9A7B38] transition-colors bg-white shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Note</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:text-[#9A7B38] hover:border-[#9A7B38] transition-colors bg-white shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Monograph</span>
          </button>
        </div>
      </div>

      {/* Main Editorial Article */}
      <article className="max-w-4xl mx-auto space-y-10">
        {/* Header Metadata */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B38] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-semibold">
              {article.category}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">{article.date}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#9A7B38]" />
              <span>{article.read}</span>
            </span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            {article.subtitle}
          </p>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-[#C5A059] flex items-center justify-center font-cinzel font-bold text-sm shrink-0 border border-gold/30">
              {article.author.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{article.author}</div>
              <div className="text-xs font-mono text-slate-500">{article.authorRole}</div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xl group">
          <img
            src={article.image}
            alt={article.title}
            onError={(e) => {
              if (article.fallbackImage) {
                (e.target as HTMLImageElement).src = article.fallbackImage;
              }
            }}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-white/90 text-xs font-mono flex items-center justify-between">
            <span>Aurelia Manufacture Photographic Archives · Le Brassus</span>
            <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-[#C5A059]">Official Monograph</span>
          </div>
        </div>

        {/* Highlight Pullquote */}
        <div className="p-6 sm:p-8 bg-amber-50/60 rounded-2xl border-l-4 border-[#9A7B38] space-y-2">
          <p className="font-cinzel text-lg sm:text-xl text-slate-900 font-semibold italic leading-relaxed">
            &ldquo;{article.pullQuote}&rdquo;
          </p>
          <span className="text-xs font-mono text-[#9A7B38] font-medium tracking-wide block uppercase">
            — {article.author}, Aurelia Haute Horlogerie
          </span>
        </div>

        {/* Editorial Body Content */}
        <div className="space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed font-light">
          {article.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Technical Specifications Box */}
        <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-5">
          <div className="flex items-center gap-2.5 text-[#9A7B38]">
            <Award className="w-5 h-5" />
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-900">
              Horological Technical Dossier
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {article.specs.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  {item.label}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-900">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation & Call to Action Footer */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              onNavigate('heritage');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold uppercase tracking-widest text-[#9A7B38] hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discover Full Heritage Archives</span>
          </button>

          <button
            onClick={() => {
              onNavigate('collections');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] transition-all shadow-md active:scale-95"
          >
            Explore Master Timepieces
          </button>
        </div>

        {/* More Articles from Horological Journal */}
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900">
              Continue Reading · Horological Journal
            </h3>
            <span className="text-xs font-mono text-slate-400">Archival Series</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherArticles.map((other) => (
              <div
                key={other.id}
                onClick={() => {
                  onNavigate(`article-${other.id}` as PageRoute);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group rounded-2xl border border-slate-200 overflow-hidden bg-white hover:border-[#9A7B38] hover:shadow-[0_12px_28px_rgba(197,160,89,0.15)] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                  <img
                    src={other.image}
                    alt={other.title}
                    onError={(e) => {
                      if (other.fallbackImage) {
                        (e.target as HTMLImageElement).src = other.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[#C5A059] text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold">
                    {other.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 mb-1">{other.date} · {other.read}</div>
                    <h4 className="font-cinzel text-base font-bold text-slate-900 group-hover:text-[#9A7B38] transition-colors leading-snug">
                      {other.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-light">
                      {other.pullQuote}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#9A7B38] font-semibold">
                    <span>Read Archival Note</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};
