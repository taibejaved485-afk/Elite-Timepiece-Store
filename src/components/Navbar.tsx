import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Menu, X, ChevronDown, Clock, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { PageRoute, CurrencyCode } from '../types/watch';
import { CURRENCY_CONFIG } from '../utils/currency';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  currentCurrency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
}

const NAV_LINKS: { label: string; page: PageRoute }[] = [
  { label: 'Atelier', page: 'home' },
  { label: 'Collections', page: 'collections' },
  { label: 'Craftsmanship', page: 'craftsmanship' },
  { label: 'Heritage', page: 'heritage' },
  { label: 'Contact Us', page: 'concierge' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  currentCurrency,
  onSelectCurrency,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Main Luxury Header */}
      <div
        className={`w-full transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-[#030408]/95 backdrop-blur-2xl border-gold/40 shadow-[0_15px_45px_rgba(0,0,0,0.95)] py-2 sm:py-2.5'
            : 'bg-[#030408]/90 backdrop-blur-xl border-gold/25 py-2 sm:py-3'
        }`}
      >
        <div className="w-full px-3 sm:px-6 lg:px-16 xl:px-24 flex items-center justify-between gap-1.5 sm:gap-4 lg:gap-8">
          {/* Zone 1: Brand Emblem & Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-2 sm:gap-3.5 text-left focus:outline-none shrink-0"
            aria-label="Aurelia Horology Home"
          >
            {/* Custom SVG Luxury Horology Crest / Escapement Wheel */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gold/40 via-gold/15 to-transparent border border-gold/60 flex items-center justify-center p-1 sm:p-1.5 shadow-[0_0_20px_rgba(197,160,89,0.35)] group-hover:border-gold group-hover:shadow-[0_0_25px_rgba(197,160,89,0.7)] transition-all duration-500 shrink-0">
              <svg
                viewBox="0 0 40 40"
                className="w-full h-full text-gold transition-transform duration-700 group-hover:rotate-45"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="20" cy="20" r="16" strokeWidth="1" strokeDasharray="1.5 2" opacity="0.6" />
                <circle cx="20" cy="20" r="13" strokeWidth="1.2" />
                <circle cx="20" cy="20" r="4.5" fill="currentColor" fillOpacity="0.25" strokeWidth="1" />
                <path d="M20 4V8M20 32V36M4 20H8M32 20H36" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M8.7 8.7L11.5 11.5M28.5 28.5L31.3 31.3M8.7 31.3L11.5 28.5M28.5 11.5L31.3 8.7" strokeWidth="0.8" opacity="0.7" />
                <polygon points="17,14 20,10 23,14 26,12 25,18 15,18 14,12" fill="currentColor" opacity="0.9" />
              </svg>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <span className="font-cinzel text-base sm:text-xl tracking-[0.25em] sm:tracking-[0.35em] font-bold text-white group-hover:text-gold transition-colors duration-300">
                AURELIA
              </span>
              <span className="hidden sm:block text-[8px] tracking-[0.45em] uppercase text-gold font-semibold -mt-0.5">
                HAUTE HORLOGERIE · 1892
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[11px] tracking-[0.25em] uppercase font-semibold">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`relative py-1.5 transition-all duration-300 whitespace-nowrap focus:outline-none group ${
                    isActive
                      ? 'text-gold font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="group-hover:tracking-[0.28em] transition-all duration-300">
                    {link.label}
                  </span>

                  {/* Hover Underline */}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-gold group-hover:w-4 transition-all duration-300" />
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Currency, Wishlist, Allocation Bag, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Currency Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-gold/40 bg-black/70 hover:border-gold hover:bg-gold/15 text-[10px] sm:text-xs font-mono tracking-wider text-white transition-all shadow-[0_0_12px_rgba(197,160,89,0.15)]"
                title="Select Valuation Currency"
              >
                <Globe className="w-3 h-3 text-gold" />
                <span className="text-gold font-bold">{currentCurrency}</span>
                <ChevronDown className="w-3 h-3 text-gold/80 transition-transform duration-300" />
              </button>

              {currencyDropdownOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-48 bg-[#0A0D14]/95 backdrop-blur-2xl border border-gold/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] py-2 z-50 animate-in fade-in zoom-in-95 duration-200"
                  onMouseLeave={() => setCurrencyDropdownOpen(false)}
                >
                  <div className="px-3.5 py-1.5 border-b border-gold/20 text-[9px] uppercase font-mono tracking-[0.2em] text-gold font-semibold">
                    Valuation Currency
                  </div>
                  {(['USD', 'EUR', 'CHF', 'GBP', 'AED', 'SGD'] as CurrencyCode[]).map((curr) => {
                    const isSelected = currentCurrency === curr;
                    return (
                      <button
                        key={curr}
                        onClick={() => {
                          onSelectCurrency(curr);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-gold/25 text-gold font-bold border-l-2 border-gold'
                            : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <span>{curr}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rotate-45 bg-gold" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-full border border-gold/30 bg-black/70 hover:border-gold hover:bg-gold/15 text-gold transition-all shadow-[0_0_12px_rgba(197,160,89,0.15)] active:scale-95"
              aria-label="View Wishlist"
            >
              <Heart className="w-4 h-4 fill-gold/20 text-gold" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 font-mono text-[9px] font-bold bg-gold text-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag / Allocation Button */}
            <button
              onClick={onOpenCart}
              className="group relative overflow-hidden rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold tracking-[0.16em] uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:shadow-[0_0_30px_rgba(197,160,89,0.75)] transition-all duration-300 flex items-center gap-1.5 active:scale-95"
              aria-label="View Allocation Bag"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <ShoppingBag className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span className="hidden xs:inline">Bag</span>
              <span className="font-mono text-[9px] sm:text-[10px] font-bold bg-black text-gold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-inner">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gold/40 hover:border-gold flex items-center justify-center text-gold bg-black/60 focus:outline-none active:scale-95 shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[52px] sm:top-[68px] z-50 lg:hidden flex flex-col justify-start">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative z-10 bg-[#05070C]/98 backdrop-blur-2xl border-b border-gold/40 px-5 py-6 shadow-[0_30px_70px_rgba(0,0,0,0.95)] max-h-[calc(100vh-90px)] overflow-y-auto space-y-5 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-gold/20">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Atelier Bag</span>
                </div>
                <span className="font-mono bg-gold text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWishlist();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-gold/30 text-white text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gold" />
                  <span>Wishlist</span>
                </div>
                <span className="font-mono bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount}
                </span>
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className={`text-left text-xs tracking-[0.25em] uppercase py-3.5 px-4 rounded-xl transition-all flex items-center justify-between font-semibold ${
                      isActive
                        ? 'text-gold bg-gold/20 border border-gold/50 shadow-sm'
                        : 'text-slate-300 hover:text-gold hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive ? (
                      <span className="w-2 h-2 rotate-45 bg-gold shadow-[0_0_10px_rgba(197,160,89,1)]" />
                    ) : (
                      <span className="text-white/30 text-xs">→</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-gold/20">
              <div className="text-[10px] uppercase font-mono tracking-wider text-gold mb-2.5">
                Valuation Currency
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['USD', 'EUR', 'CHF', 'GBP', 'AED', 'SGD'] as CurrencyCode[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      onSelectCurrency(curr);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs font-mono transition-colors text-center font-semibold ${
                      currentCurrency === curr
                        ? 'bg-gold/30 text-gold border border-gold/60 shadow-sm'
                        : 'bg-black/60 text-slate-300 hover:text-white border border-gold/20'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
