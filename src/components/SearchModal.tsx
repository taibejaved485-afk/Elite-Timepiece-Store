import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Watch, PageRoute } from '../types/watch';
import { WATCHES } from '../data/watches';
import { handleImageFallback } from '../utils/imageFallback';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageRoute) => void;
}

const SEARCH_ARTICLES = [
  {
    id: 'art-1',
    title: 'The Evolution of Free-Sprung Balance Wheels',
    category: 'Horological Engineering',
    date: 'October 2026',
    image: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
  },
  {
    id: 'art-2',
    title: 'Architecture of Le Brassus: Glass & Titanium',
    category: 'Manufacture Architecture',
    date: 'September 2026',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: '/assets/images/hero_luxury_chronograph_1791612522214.jpg',
  },
  {
    id: 'art-3',
    title: 'The Mastery of Internal Anglage Chamfering',
    category: 'Métiers d’Art Finishing',
    date: 'August 2026',
    image: '/assets/images/craftsmanship_watchmaker_1791612587562.jpg',
  },
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('aurelia_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const addToRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('aurelia_recent_searches', JSON.stringify(updated));
  };

  const filteredItems = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return WATCHES.filter(
      (w) =>
        w.name.toLowerCase().includes(lowerQuery) ||
        w.collection.toLowerCase().includes(lowerQuery) ||
        w.reference.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const filteredArticles = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return SEARCH_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const hasResults = filteredItems.length > 0 || filteredArticles.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-lg bg-[#0A0D14] border border-gold/30 rounded-3xl shadow-2xl p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-6">
              <Search className="w-5 h-5 text-gold absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search timepieces, collections, and journal notes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query) addToRecent(query);
                }}
                className="w-full pl-12 pr-10 py-4 bg-[#161922] border border-gold/20 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-all shadow-inner text-sm"
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                aria-label="Close search modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {query ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
                {/* Watches Results */}
                {filteredItems.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">
                      Timepieces ({filteredItems.length})
                    </p>
                    <div className="space-y-2">
                      {filteredItems.map((watch) => (
                        <button
                          key={watch.id}
                          onClick={() => {
                            addToRecent(watch.name);
                            onNavigate(`product-${watch.id}` as PageRoute);
                            onClose();
                          }}
                          className="w-full p-3 flex items-center gap-4 bg-[#161922] hover:bg-gold/10 border border-transparent hover:border-gold/30 rounded-2xl transition-all text-left group"
                        >
                          <img
                            src={watch.image}
                            alt={watch.name}
                            onError={handleImageFallback}
                            className="w-12 h-12 object-cover rounded-xl shadow-lg shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white group-hover:text-gold transition-colors truncate">
                              {watch.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                              {watch.collection} · Ref {watch.reference}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gold/40 group-hover:text-gold transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Journal Articles Results */}
                {filteredArticles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">
                      Journal Articles ({filteredArticles.length})
                    </p>
                    <div className="space-y-2">
                      {filteredArticles.map((art) => (
                        <button
                          key={art.id}
                          onClick={() => {
                            addToRecent(art.title);
                            onNavigate(`article-${art.id}` as PageRoute);
                            onClose();
                          }}
                          className="w-full p-3 flex items-center gap-4 bg-[#161922] hover:bg-gold/10 border border-transparent hover:border-gold/30 rounded-2xl transition-all text-left group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 text-[#C5A059]">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white group-hover:text-gold transition-colors truncate">
                              {art.title}
                            </h4>
                            <p className="text-[10px] text-[#C5A059] uppercase tracking-wider">
                              {art.category} · {art.date}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gold/40 group-hover:text-gold transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!hasResults && (
                  <p className="text-center text-slate-400 text-xs py-8">
                    No matching timepieces or journal articles found.
                  </p>
                )}
              </div>
            ) : (
              recentSearches.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-gold/60 font-semibold">
                    Recent Searches
                  </p>
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(term)}
                      className="w-full flex items-center gap-3 text-slate-300 hover:text-gold transition-colors text-sm py-2 group text-left"
                    >
                      <Clock className="w-4 h-4 text-slate-500 group-hover:text-gold transition-colors shrink-0" />
                      <span className="truncate">{term}</span>
                    </button>
                  ))}
                </div>
              )
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
