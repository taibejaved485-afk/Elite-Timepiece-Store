import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Share2, Printer, Sparkles, ChevronRight, Check, Award, Cpu, ShieldCheck } from 'lucide-react';
import { PageRoute } from '../types/watch';
import { ARTICLES_DATA, Article } from '../data/articles';

export { ARTICLES_DATA, type Article };

interface ArticlePageProps {
  articleId: string;
  onNavigate: (page: PageRoute) => void;
}

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
    <div className="min-h-screen bg-white text-slate-900 py-6 sm:py-16 px-3 sm:px-8 lg:px-16 xl:px-24">
      {/* Top Navigation & Action Bar */}
      <div className="w-full mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
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
      <article className="w-full space-y-8 sm:space-y-10">
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
