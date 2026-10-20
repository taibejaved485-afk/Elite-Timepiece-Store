import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Heart, ShoppingBag, Eye, X, Check, RotateCcw, Sparkles } from 'lucide-react';
import { Watch, CurrencyCode } from '../types/watch';
import { formatPrice } from '../utils/currency';
import { handleImageFallback } from '../utils/imageFallback';

interface CatalogPageProps {
  watches: Watch[];
  currency: CurrencyCode;
  onOpenQuickView: (watch: Watch) => void;
  onAddToCart: (watch: Watch) => void;
  wishlistIds: string[];
  onToggleWishlist: (watch: Watch) => void;
  comparisonList: Watch[];
  onToggleCompare: (watch: Watch) => void;
  onOpenCompare: () => void;
  initialCategory?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  watches,
  currency,
  onOpenQuickView,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  comparisonList,
  onToggleCompare,
  onOpenCompare,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => initialCategory || 'all');

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([10000, 100000]);
  const [activeTier, setActiveTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Calibres' },
    { id: 'Chronograph', label: 'Chronographs' },
    { id: 'Tourbillon', label: 'Tourbillons' },
    { id: 'Diver', label: 'Diver 300M' },
    { id: 'Dress', label: 'Ultra-Thin Dress' },
    { id: 'Heritage', label: 'Heritage Classics' },
  ];

  const materials = [
    { id: 'all', label: 'All Metals' },
    { id: 'Rose Gold', label: '18k Rose Gold' },
    { id: 'Titanium', label: 'Grade 5 Titanium' },
    { id: 'Oystersteel', label: 'Oystersteel 904L' },
    { id: 'Ceramic', label: 'High-Tech Ceramic' },
  ];

  const handleMinPriceChange = (val: number) => {
    const safeMin = Math.min(val, priceRange[1] - 2500);
    setPriceRange([safeMin, priceRange[1]]);
    setActiveTier('custom');
  };

  const handleMaxPriceChange = (val: number) => {
    const safeMax = Math.max(val, priceRange[0] + 2500);
    setPriceRange([priceRange[0], safeMax]);
    setActiveTier('custom');
  };

  const handleSelectTier = (tierId: string) => {
    setActiveTier(tierId);
    if (tierId === 'all') {
      setPriceRange([10000, 100000]);
    } else if (tierId === 'under-25k') {
      setPriceRange([10000, 25000]);
    } else if (tierId === '25k-50k') {
      setPriceRange([25000, 50000]);
    } else if (tierId === 'over-50k') {
      setPriceRange([50000, 100000]);
    }
  };

  const handleResetPrice = () => {
    setPriceRange([10000, 100000]);
    setActiveTier('all');
  };

  const filteredWatches = useMemo(() => {
    return watches
      .filter((w) => {
        // Category filter
        if (selectedCategory !== 'all' && w.collection !== selectedCategory) {
          return false;
        }
        // Material filter
        if (selectedMaterial !== 'all') {
          if (!w.specs.caseMaterial.toLowerCase().includes(selectedMaterial.toLowerCase())) {
            return false;
          }
        }
        // Price range filter
        if (w.priceUSD < priceRange[0] || w.priceUSD > priceRange[1]) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = w.name.toLowerCase().includes(q);
          const matchCollection = w.collection.toLowerCase().includes(q);
          const matchRef = w.reference.toLowerCase().includes(q);
          const matchCalibre = w.specs.calibre.toLowerCase().includes(q);
          if (!matchName && !matchCollection && !matchRef && !matchCalibre) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
        if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [watches, selectedCategory, selectedMaterial, priceRange, searchQuery, sortBy]);

  const handleAddToCart = (watch: Watch) => {
    onAddToCart(watch);
    setAddedItemMap((prev) => ({ ...prev, [watch.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [watch.id]: false }));
    }, 1800);
  };

  return (
    <div className="w-full px-3 sm:px-8 lg:px-16 xl:px-24 py-6 sm:py-16 space-y-6 sm:space-y-12">
      {/* Page Title & Editorial Header */}
      <div className="space-y-2 sm:space-y-3 text-center sm:text-left border-b border-white/[0.08] pb-5 sm:pb-8">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
          Manufacture Horizon · 2026 Collections
        </div>
        <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Haute Horlogerie Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed font-light">
          Explore our certified Swiss timepieces, from flying tourbillons with gravity compensation to extreme-depth automatic diving chronometers.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-3 sm:space-y-4">
        {/* Top Control Bar: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
          {/* Category Tabs (Segmented controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium tracking-wider uppercase rounded-full transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] text-black font-bold shadow-[0_0_14px_rgba(197,160,89,0.35)]'
                    : 'bg-[#141824] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 group">
            <Search className="w-4 h-4 text-gold/60 group-hover:text-gold absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, collection, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-xs bg-[#0E1118] border border-gold/30 hover:border-gold/60 focus:border-gold rounded-full text-white placeholder-stone-500 shadow-sm hover:shadow-[0_0_15px_rgba(197,160,89,0.2)] focus:shadow-[0_0_20px_rgba(197,160,89,0.35)] focus:outline-none transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-gold transition-colors p-0.5 rounded-full hover:bg-gold/10"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Sub-filters: Material & Sorting */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-bg-secondary border border-border-primary text-xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
            <span className="text-stone-500 font-medium text-[10px] sm:text-xs">Case Material:</span>
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {materials.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterial(mat.id)}
                  className={`px-2.5 py-1 rounded text-[11px] sm:text-xs transition-colors ${
                    selectedMaterial === mat.id
                      ? 'bg-gold/20 text-gold font-medium border border-gold/30'
                      : 'text-stone-400 hover:text-text-primary bg-white/[0.02]'
                  }`}
                >
                  {mat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t border-white/5 sm:border-0">
            <span className="text-stone-500 text-[11px] sm:text-xs">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-bg-primary border border-border-primary text-text-primary px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-gold"
            >
              <option value="featured">Maison Selection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Interactive Range Slider and Price Tier Refinement */}
        <div className="p-4 sm:p-5 rounded bg-bg-secondary border border-gold/20 text-xs space-y-4">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/20 pb-3">
            <div className="flex items-center gap-2 text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-semibold uppercase tracking-wider text-[11px] font-cinzel text-white">
                Valuation Range
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-[#C5A059] font-medium tabular-nums">
                {formatPrice(priceRange[0], currency)} — {formatPrice(priceRange[1], currency)}
              </span>
            </div>

            {(priceRange[0] !== 10000 || priceRange[1] !== 100000) && (
              <button
                onClick={handleResetPrice}
                className="text-[11px] text-[#C5A059] hover:text-white transition-colors flex items-center gap-1 self-start sm:self-auto"
                title="Reset price range"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Valuation</span>
              </button>
            )}
          </div>

          {/* Dual Range Sliders Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Minimum Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Minimum Valuation</span>
                <span className="font-mono text-white tabular-nums font-medium">
                  {formatPrice(priceRange[0], currency)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={90000}
                step={2500}
                value={priceRange[0]}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                className="w-full h-1.5 bg-[#232733] rounded-lg appearance-none cursor-pointer accent-[#C5A059] focus:outline-none"
                aria-label="Minimum price filter"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{formatPrice(10000, currency)}</span>
                <span>{formatPrice(90000, currency)}</span>
              </div>
            </div>

            {/* Maximum Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Maximum Valuation</span>
                <span className="font-mono text-white tabular-nums font-medium">
                  {formatPrice(priceRange[1], currency)}
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={100000}
                step={2500}
                value={priceRange[1]}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                className="w-full h-1.5 bg-[#232733] rounded-lg appearance-none cursor-pointer accent-[#C5A059] focus:outline-none"
                aria-label="Maximum price filter"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{formatPrice(20000, currency)}</span>
                <span>{formatPrice(100000, currency)}+</span>
              </div>
            </div>
          </div>

          {/* Quick-Select Tier Presets */}
          <div className="pt-2 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 text-[11px] mr-1">Quick Tiers:</span>
              {[
                { id: 'all', label: 'All Valuations' },
                { id: 'under-25k', label: `Under ${formatPrice(25000, currency)}` },
                { id: '25k-50k', label: `${formatPrice(25000, currency)} – ${formatPrice(50000, currency)}` },
                { id: 'over-50k', label: `Over ${formatPrice(50000, currency)}` },
              ].map((tier) => {
                const isSelected = activeTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => handleSelectTier(tier.id)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap font-mono tabular-nums ${
                      isSelected
                        ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white bg-white/[0.02] border border-gold/20'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              <span className="text-[#C5A059] font-semibold">{filteredWatches.length}</span> pieces match
            </div>
          </div>
        </div>
      </div>

      {/* Results Count & Reset Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
        <span>
          Showing <span className="text-white font-mono">{filteredWatches.length}</span> of{' '}
          <span className="text-white font-mono">{watches.length}</span> luxury timepieces
        </span>
        {(selectedCategory !== 'all' || selectedMaterial !== 'all' || priceRange[0] !== 10000 || priceRange[1] !== 100000 || searchQuery || comparisonList.length > 0) && (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {comparisonList.length > 0 && (
              <button
                onClick={onOpenCompare}
                className="text-[#C5A059] hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Compare ({comparisonList.length})</span>
              </button>
            )}
            {(selectedCategory !== 'all' || selectedMaterial !== 'all' || priceRange[0] !== 10000 || priceRange[1] !== 100000 || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedMaterial('all');
                  handleResetPrice();
                  setSearchQuery('');
                }}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid of Product Cards */}
      {filteredWatches.length === 0 ? (
        <div className="p-8 sm:p-16 text-center rounded-2xl bg-[#11141B] border border-white/[0.06] space-y-3">
          <p className="font-cinzel text-lg sm:text-xl text-white">No Matching Timepieces Found</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, metal filter, or valuation range.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredWatches.map((watch, index) => {
              const isWishlisted = wishlistIds.includes(watch.id);
              const isAdded = addedItemMap[watch.id];

              return (
                <motion.div
                  key={watch.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.06, 0.3),
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.25, ease: 'easeOut' },
                  }}
                  className="bg-bg-secondary/80 backdrop-blur-md rounded-xl border border-gold/20 overflow-hidden group hover:border-gold/50 hover:shadow-[0_16px_36px_rgba(0,0,0,0.7)] transition-colors duration-300 flex flex-col shadow-lg will-change-transform"
                >
                {/* Watch Image */}
                <div 
                  className="relative aspect-[4/3] bg-[#161924] overflow-hidden cursor-pointer"
                  onClick={() => onOpenQuickView(watch)}
                >
                  <img
                    src={watch.image}
                    alt={watch.name}
                    onError={handleImageFallback}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                    {watch.isNewRelease && (
                      <span className="bg-gold text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Novelty 2026
                      </span>
                    )}
                    {watch.isLimitedEdition && (
                      <span className="bg-text-primary/85 border border-gold/40 text-gold text-[8px] sm:text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                        Limited {watch.editionLimit} Pcs
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(watch);
                    }}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isWishlisted
                        ? 'bg-gold text-white shadow-[0_0_10px_rgba(197,160,89,0.7)]'
                        : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/80'
                    }`}
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>

                  {/* Compare Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompare(watch);
                    }}
                    className={`absolute top-[48px] right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
                      comparisonList.some((w) => w.id === watch.id)
                        ? 'bg-gold text-white shadow-[0_0_10px_rgba(197,160,89,0.7)]'
                        : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/80'
                    }`}
                    title={comparisonList.some((w) => w.id === watch.id) ? 'Remove from compare' : 'Add to compare'}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>

                  {/* Mobile tap indicator */}
                  <div className="sm:hidden absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-black/80 border border-gold/40 text-gold rounded-full text-[10px] font-mono flex items-center gap-1 backdrop-blur-sm">
                    <Eye className="w-3 h-3 text-gold" />
                    <span>Examine</span>
                  </div>

                  {/* Desktop Quick View & Subtle Quick Shop Hover Tooltip */}
                  <div className="hidden sm:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-col justify-between p-3 pointer-events-auto">
                    {/* Top action badge */}
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQuickView(watch);
                        }}
                        className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-black/80 text-white rounded-full hover:bg-gradient-to-r hover:from-[#C5A059] hover:via-[#E2C775] hover:to-[#B89243] hover:text-black border border-gold/40 hover:border-gold transition-all duration-300 shadow-xl flex items-center gap-1.5 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Examine Timepiece</span>
                      </button>
                    </div>

                    {/* Subtle Luxury 'Quick Shop' Tooltip Box */}
                    <div className="w-full p-2.5 rounded-xl bg-[#070A10]/95 backdrop-blur-md border border-gold/40 shadow-[0_10px_25px_rgba(0,0,0,0.85)] text-left flex flex-col gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-gold">
                        <span className="flex items-center gap-1 font-bold">
                          <Sparkles className="w-2.5 h-2.5 text-gold" />
                          <span>Quick Shop Specifications</span>
                        </span>
                        <span className="text-white/60 font-semibold">{watch.specs.caseDiameter}</span>
                      </div>
                      
                      <div className="text-[11px] text-slate-200 leading-tight">
                        <span className="text-white font-medium block truncate">
                          <span className="text-gold/80 font-mono text-[9px] uppercase mr-1">Movement:</span>
                          {watch.specs.calibre}
                        </span>
                        <span className="text-slate-300 block text-[10px] truncate mt-0.5">
                          <span className="text-gold/80 font-mono text-[9px] uppercase mr-1">Material:</span>
                          {watch.specs.caseMaterial} · {watch.specs.powerReserve}
                        </span>
                      </div>

                      <div className="pt-1.5 flex items-center gap-1.5 border-t border-white/[0.1]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(watch);
                          }}
                          className="flex-1 py-1 px-2.5 rounded-lg bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] text-black text-[10px] font-bold uppercase tracking-wider transition-all text-center active:scale-95 shadow-sm"
                        >
                          Quick Add to Bag
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenQuickView(watch);
                          }}
                          className="py-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium transition-colors"
                          title="Full Specifications"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-text-primary/60">
                      <span className="font-mono text-gold">{watch.reference}</span>
                      <span>{watch.specs.caseDiameter}</span>
                    </div>

                    <h3
                      onClick={() => onOpenQuickView(watch)}
                      className="font-cinzel text-base sm:text-lg font-bold text-text-primary mt-1 group-hover:text-gold transition-colors cursor-pointer"
                    >
                      {watch.name}
                    </h3>

                    <p className="text-xs text-text-primary/60 mt-1 line-clamp-2 leading-relaxed font-light">
                      {watch.tagline}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2 text-[10px] sm:text-[11px] text-text-primary/60 font-mono">
                      <span>{watch.specs.calibre}</span>
                      <span>·</span>
                      <span>{watch.specs.powerReserve}</span>
                    </div>
                  </div>

                  {/* Price and Cart Action */}
                  <div className="pt-3 sm:pt-4 border-t border-border-primary flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[9px] text-text-primary/60 uppercase tracking-wider block">Price</span>
                      <span className="font-mono text-sm sm:text-base font-semibold text-text-primary tabular-nums">
                        {formatPrice(watch.priceUSD, currency)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(watch)}
                      className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(197,160,89,0.25)] hover:shadow-[0_0_18px_rgba(197,160,89,0.5)] active:scale-95 shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] text-black'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Reserved</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-black stroke-[2.2]" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
