import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Menu, X, ChevronDown, Globe, Search } from 'lucide-react';
import { PageRoute, CurrencyCode } from '../types/watch';
import { CURRENCY_CONFIG } from '../utils/currency';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
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

const SUPPORTED_CURRENCIES: CurrencyCode[] = ['PKR', 'USD', 'EUR', 'GBP', 'AED'];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
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

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Main Luxury Header Bar in Pure White Theme */}
      <div
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-2xl border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-2 sm:py-2.5'
            : 'bg-white/95 backdrop-blur-xl border-slate-200 py-2.5 sm:py-3.5 shadow-2xs'
        }`}
      >
        <div className="w-full px-3 sm:px-6 lg:px-12 xl:px-20 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          
          {/* Zone 1: Brand Logo & Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-2 sm:gap-3 text-left focus:outline-none shrink-0 cursor-pointer"
            aria-label="Aurelia Horology Home"
          >
            {/* Custom SVG Escapement Crest */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#C5A059]/25 via-[#C5A059]/10 to-transparent border border-[#C5A059]/50 flex items-center justify-center p-1 sm:p-1.5 shadow-sm group-hover:border-[#9A7B38] group-hover:shadow-[0_0_15px_rgba(197,160,89,0.35)] transition-all duration-500 shrink-0">
              <svg
                viewBox="0 0 40 40"
                className="w-full h-full text-[#9A7B38] transition-transform duration-700 group-hover:rotate-45"
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
              <span className="font-cinzel text-base sm:text-xl tracking-[0.2em] sm:tracking-[0.25em] font-bold text-slate-900 group-hover:text-[#9A7B38] transition-colors duration-300">
                AURELIA
              </span>
              <span className="hidden md:block text-[7.5px] tracking-[0.4em] uppercase text-[#9A7B38] font-bold -mt-0.5">
                HAUTE HORLOGERIE · 1892
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop only) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs tracking-[0.2em] uppercase font-bold">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`relative py-1.5 transition-all duration-200 whitespace-nowrap focus:outline-none group cursor-pointer font-bold ${
                    isActive
                      ? 'text-[#9A7B38] font-extrabold'
                      : 'text-slate-800 hover:text-black'
                  }`}
                >
                  <span className="group-hover:tracking-[0.23em] transition-all duration-200">
                    {link.label}
                  </span>

                  {/* Clean Hover Underline */}
                  <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2.5px] bg-[#9A7B38] rounded-full transition-all duration-300 ${
                    isActive ? 'w-6' : 'w-0 group-hover:w-4'
                  }`} />
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Search, Currency, Wishlist, Allocation Bag, Mobile Toggle) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 hover:border-[#9A7B38] text-slate-700 hover:text-[#9A7B38] flex items-center justify-center transition-all bg-slate-50 hover:bg-[#9A7B38]/10 active:scale-95 shadow-2xs cursor-pointer"
              aria-label="Search Collection"
              title="Search Collection"
            >
              <Search className="w-4 h-4 text-[#9A7B38]" />
            </button>

            {/* Currency Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:border-[#9A7B38] hover:bg-slate-100 text-[10px] sm:text-xs font-mono tracking-wider text-slate-800 transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Select Valuation Currency"
              >
                <Globe className="hidden xs:block w-3 h-3 text-[#9A7B38]" />
                <span className="text-[#9A7B38] font-bold">{currentCurrency}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 transition-transform duration-300" />
              </button>

              {currencyDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200"
                  onMouseLeave={() => setCurrencyDropdownOpen(false)}
                >
                  <div className="px-3.5 py-1.5 border-b border-slate-100 text-[9px] uppercase font-mono tracking-[0.2em] text-[#9A7B38] font-bold">
                    Valuation Currency
                  </div>
                  {SUPPORTED_CURRENCIES.map((curr) => {
                    const isSelected = currentCurrency === curr;
                    const meta = CURRENCY_CONFIG[curr];
                    return (
                      <button
                        key={curr}
                        onClick={() => {
                          onSelectCurrency(curr);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#9A7B38]/10 text-[#9A7B38] font-bold border-l-2 border-[#9A7B38]'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-bold">{curr}</span>
                          <span className="text-[10px] text-slate-400 font-sans">({meta?.symbol})</span>
                        </span>
                        {isSelected && <span className="w-1.5 h-1.5 rotate-45 bg-[#9A7B38]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="hidden xs:flex relative p-2 sm:p-2.5 rounded-full border border-slate-200 bg-slate-50 hover:border-[#9A7B38] hover:bg-[#9A7B38]/10 text-[#9A7B38] transition-all shadow-2xs active:scale-95 shrink-0 cursor-pointer"
              aria-label="View Wishlist"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4 fill-[#9A7B38]/20 text-[#9A7B38]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 font-mono text-[9px] font-bold bg-[#9A7B38] text-white w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Allocation Bag Button */}
            <button
              onClick={onOpenCart}
              className="group relative overflow-hidden rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-sm hover:shadow-md flex items-center gap-1 sm:gap-1.5 active:scale-95 shrink-0 cursor-pointer transition-all"
              aria-label="View Allocation Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span className="hidden md:inline">Bag</span>
              <span className="font-mono text-[9px] sm:text-[10px] font-bold bg-black text-[#C5A059] px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-inner">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 hover:border-[#9A7B38] flex items-center justify-center text-slate-800 bg-slate-50 focus:outline-none active:scale-95 shrink-0 shadow-2xs cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer in Clean White */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[50px] sm:top-[60px] z-50 lg:hidden flex flex-col justify-start">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 bg-white border-b border-slate-200 px-5 py-6 shadow-2xl max-h-[calc(100vh-65px)] overflow-y-auto space-y-5 animate-in slide-in-from-top-2 duration-300">
            
            {/* Quick Search Action inside Drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-[#9A7B38] text-xs transition-all text-left group cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#9A7B38] group-hover:scale-110 transition-transform" />
              <span className="font-sans">Search timepieces, calibres, collections...</span>
            </button>

            {/* Quick Action Cards: Bag & Wishlist */}
            <div className="grid grid-cols-2 gap-3 pb-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-[#9A7B38]/10 border border-[#9A7B38]/30 text-[#9A7B38] text-xs font-bold shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Atelier Bag</span>
                </div>
                <span className="font-mono bg-[#9A7B38] text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWishlist();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs cursor-pointer hover:border-[#9A7B38]"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#9A7B38]" />
                  <span>Wishlist</span>
                </div>
                <span className="font-mono bg-[#9A7B38] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount}
                </span>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className={`text-left text-xs tracking-[0.2em] uppercase py-3.5 px-4 rounded-xl transition-all flex items-center justify-between font-bold cursor-pointer ${
                      isActive
                        ? 'text-[#9A7B38] bg-[#9A7B38]/10 border-l-4 border-[#9A7B38] shadow-2xs font-extrabold'
                        : 'text-slate-800 hover:text-black hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rotate-45 bg-[#9A7B38]" />
                    ) : (
                      <span className="text-slate-400 text-xs">→</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Currency Selector Grid */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#9A7B38] font-bold">
                Valuation Currency
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {SUPPORTED_CURRENCIES.map((curr) => {
                  const isSelected = currentCurrency === curr;
                  return (
                    <button
                      key={curr}
                      onClick={() => {
                        onSelectCurrency(curr);
                        setMobileMenuOpen(false);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-mono transition-colors text-center font-bold cursor-pointer ${
                        isSelected
                          ? 'bg-[#9A7B38] text-white shadow-sm'
                          : 'bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {curr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Atelier Hotline & WhatsApp Links */}
            <div className="pt-2 flex items-center gap-2 text-xs">
              <a
                href="tel:+41228190192"
                className="flex-1 py-2.5 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-[#9A7B38] text-[11px] font-mono transition-colors"
              >
                📞 Call Atelier
              </a>
              <a
                href="https://wa.me/41228190192"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 text-center rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-[11px] font-mono transition-colors"
              >
                💬 WhatsApp
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
