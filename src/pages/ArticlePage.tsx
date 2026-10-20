import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Share2, Printer, X, Sparkles, ChevronRight } from 'lucide-react';
import { PageRoute } from '../types/watch';

interface ArticlePageProps {
  articleId: string;
  onNavigate: (page: PageRoute) => void;
}

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  read: string;
  author: string;
  image: string;
  fallbackImage?: string;
  content: string[];
}

const ARTICLES_DATA: Record<string, Article> = {
  'art-1': {
    id: 'art-1',
    title: 'The Evolution of Free-Sprung Balance Wheels',
    category: 'Horological Engineering',
    date: 'October 2026',
    read: '4 min read',
    author: 'Jean-Luc Favre, Head of R&D Le Brassus',
    image: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
    content: [
      'Traditional regulator index pins restrict the active length of the balance spring, introducing positional error and chronometric drift over time. Aurelia’s proprietary free-sprung variable inertia balance wheel utilizes aerodynamic platinum micro-weights poised directly on the rim.',
      'Combined with our anti-magnetic silicon hairspring, this architecture maintains rate stability within ±1 second across all five testing positions. The geometry of the balance bridge has been recalculated to eliminate torsional vibration under high G-forces.',
      'In rigorous COSC testing and internal 1,000-hour thermocycling trials, our free-sprung calibres demonstrated an unprecedented constancy of amplitude, cementing our commitment to absolute mechanical accuracy.'
    ]
  },
  'art-2': {
    id: 'art-2',
    title: 'Architecture of Le Brassus: Glass & Titanium',
    category: 'Manufacture Architecture',
    date: 'September 2026',
    read: '6 min read',
    author: 'Atelier Design Bureau',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: '/assets/images/hero_luxury_chronograph_1791612522214.jpg',
    content: [
      'Perched 1,004 meters above sea level in the Vallée de Joux, the Aurelia manufacture is an exercise in structural lightness. Floor-to-ceiling electrochromic triple-glazed glass walls curve along the contours of the Jura topography.',
      'Bathing master watchmakers in diffuse northern light, the building maintains an optimal working environment while ground-source geothermal loops maintain 0.1°C temperature stability across all cleanrooms.',
      'Titanium structural columns echo the lightweight rigidity of our Grade 5 cases, uniting architectural mastery with the soul of Swiss horology.'
    ]
  },
  'art-3': {
    id: 'art-3',
    title: 'The Mastery of Internal Anglage Chamfering',
    category: 'Métiers d’Art Finishing',
    date: 'August 2026',
    read: '5 min read',
    author: 'Master Angleur Yvan Doret',
    image: '/assets/images/craftsmanship_watchmaker_1791612587562.jpg',
    content: [
      'While 5-axis CNC mills can shape bridge blanks to micron tolerances, the acute internal angles of haute horlogerie remain strictly impassable for machines.',
      'Each interior corner of an Aurelia bridge is finished by hand using files and polished with pegwood stems harvested from local Jura gentian plants, impregnated with diamond paste to achieve a flawless speculaire black-polish reflection.',
      'This painstaking manual labor requires up to 40 hours per movement bridge, ensuring that every timepiece leaving our workshop is a singular work of art.'
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

  return (
    <div className="min-h-screen bg-white text-slate-900 py-8 sm:py-16 px-4 sm:px-8 lg:px-16 xl:px-24">
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9A7B38] hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Atelier Home</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-[#9A7B38] hover:border-[#9A7B38] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
          </button>
        </div>
      </div>

      {/* Article Container */}
      <article className="max-w-4xl mx-auto space-y-8">
        {/* Header Metadata */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B38] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-semibold">
              {article.category}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-mono text-slate-500">{article.date}</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#9A7B38]" />
              <span>{article.read}</span>
            </span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="text-xs font-mono text-slate-600 pt-2 flex items-center justify-center sm:justify-start gap-2">
            <span>Author:</span>
            <strong className="text-slate-900 font-semibold">{article.author}</strong>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xl">
          <img
            src={article.image}
            alt={article.title}
            onError={(e) => {
              if (article.fallbackImage) {
                (e.target as HTMLImageElement).src = article.fallbackImage;
              }
            }}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Body Content */}
        <div className="space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed font-light max-w-3xl">
          {article.content.map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? 'text-lg sm:text-xl font-normal text-slate-900 italic border-l-2 border-[#9A7B38] pl-4 py-2 bg-amber-50/40 rounded-r' : ''}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="pt-12 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => onNavigate('heritage')}
            className="text-xs font-semibold uppercase tracking-widest text-[#9A7B38] hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Heritage Archives</span>
          </button>

          <button
            onClick={() => onNavigate('collections')}
            className="rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] transition-all shadow-md"
          >
            Explore Timepieces
          </button>
        </div>
      </article>
    </div>
  );
};
