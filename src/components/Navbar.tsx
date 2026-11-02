import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Menu, X, ChevronDown, Globe, Search, Phone, MessageSquare } from 'lucide-react';
import { PageRoute, CurrencyCode } from '../types/watch';
import { CURRENCY_CONFIG } from '../utils/currency';
import { SiteSettings, getSiteSettings } from '../utils/siteSettings';

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
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSiteSettings(getSiteSettings());
    };
    window.addEventListener('aurelia_settings_changed', handleSettingsUpdate);
    return () => window.removeEventListener('aurelia_settings_changed', handleSettingsUpdate);
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
    setCurrencyDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* Top Dynamic Announcement Bar (Controllable via Admin Settings) */}
      {siteSettings.announcement.enabled && (
        <div className="w-full bg-[#111319] text-[#F3EAD3] py-1.5 px-4 text-[11px] font-normal border-b border-[#9A7B38]/25 flex items-center justify-center">
          <div className="flex items-center gap-2 overflow-hidden text-center truncate tracking-wide">
            {siteSettings.announcement.badge && (
              <span className="hidden xs:inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold tracking-widest uppercase bg-[#9A7B38] text-black">
                {siteSettings.announcement.badge}
              </span>
            )}
            <span className="truncate text-slate-200">{siteSettings.announcement.text}</span>
            {siteSettings.announcement.linkText && (
              <a
                href={siteSettings.announcement.linkUrl}
                className="text-[#E2C775] hover:text-white font-medium underline underline-offset-2 ml-1 cursor-pointer shrink-0 transition-colors"
              >
                {siteSettings.announcement.linkText}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main Luxury Header Bar - Clean, Minimalist & Professional */}
      <div
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-xl border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] py-3'
            : 'bg-white/95 backdrop-blur-md border-slate-100 py-4 shadow-2xs'
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 flex items-center justify-between gap-4">
          
          {/* Left Zone: Refined Brand Logo & Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-3 text-left focus:outline-none shrink-0 cursor-pointer"
            aria-label="Aurelia Horology Home"
          >
            {/* Minimalist Watch Balance Crest */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FAF8F5] to-[#F1ECE1] border border-[#9A7B38]/30 flex items-center justify-center p-1.5 shadow-2xs group-hover:border-[#9A7B38] group-hover:bg-[#FAF6EC] transition-all duration-300">
              <svg
                viewBox="0 0 40 40"
                className="w-full h-full text-[#9A7B38] transition-transform duration-500 group-hover:scale-105"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="20" cy="20" r="16" strokeWidth="1" strokeDasharray="1.5 2" opacity="0.6" />
                <circle cx="20" cy="20" r="13" strokeWidth="1.2" />
                <circle cx="20" cy="20" r="4.5" fill="currentColor" fillOpacity="0.2" strokeWidth="1" />
                <path d="M20 4V8M20 32V36M4 20H8M32 20H36" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M8.7 8.7L11.5 11.5M28.5 28.5L31.3 31.3M8.7 31.3L11.5 28.5M28.5 11.5L31.3 8.7" strokeWidth="0.8" opacity="0.6" />
                <polygon points="17,14 20,10 23,14 26,12 25,18 15,18 14,12" fill="currentColor" opacity="0.9" />
              </svg>
            </div>

            {/* Haute Horlogerie Typography */}
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl tracking-[0.24em] font-bold text-slate-900 group-hover:text-[#9A7B38] transition-colors duration-200">
                AURELIA
              </span>
              <span className="text-[8px] tracking-[0.34em] uppercase text-[#9A7B38] font-semibold -mt-0.5">
                GENÈVE · 1892
              </span>
            </div>
          </button>

          {/* Center Zone: Professional Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[12px] tracking-[0.16em] uppercase font-semibold">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`relative py-1.5 transition-colors duration-150 whitespace-nowrap focus:outline-none cursor-pointer ${
                    isActive
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Subtle Elegant Gold Indicator */}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#9A7B38] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Zone: Clean Action Buttons (Search, Currency, Wishlist, Bag, Menu) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-full border border-slate-200/80 hover:border-[#9A7B38]/60 text-slate-700 hover:text-[#9A7B38] flex items-center justify-center transition-colors bg-white hover:bg-[#FAF8F3] active:scale-95 cursor-pointer shadow-2xs"
              aria-label="Search Collection"
              title="Search Timepieces"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Currency Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/80 bg-white hover:border-[#9A7B38]/60 hover:bg-[#FAF8F3] text-xs font-mono text-slate-800 transition-colors shadow-2xs active:scale-95 cursor-pointer"
                title="Select Valuation Currency"
              >
                <Globe className="hidden sm:block w-3.5 h-3.5 text-[#9A7B38]" />
                <span className="font-bold text-slate-900">{currentCurrency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200" />
              </button>

              {currencyDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setCurrencyDropdownOpen(false)}
                >
                  <div className="px-3.5 py-1 border-b border-slate-100 text-[9px] uppercase font-mono tracking-widest text-slate-400 font-semibold">
                    Select Currency
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
                            ? 'bg-[#9A7B38]/10 text-[#9A7B38] font-bold'
                            : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-bold">{curr}</span>
                          <span className="text-[10px] text-slate-400 font-sans">({meta?.symbol})</span>
                        </span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="hidden sm:flex relative w-9 h-9 rounded-full border border-slate-200/80 bg-white hover:border-[#9A7B38]/60 hover:bg-[#FAF8F3] text-slate-700 hover:text-[#9A7B38] items-center justify-center transition-colors shadow-2xs active:scale-95 shrink-0 cursor-pointer"
              aria-label="View Wishlist"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[2]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 font-mono text-[9px] font-bold bg-[#9A7B38] text-white w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Atelier Bag (Cart) Button - Sophisticated Luxury Slate/Black Pill */}
            <button
              onClick={onOpenCart}
              className="group relative rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold tracking-wider uppercase text-white bg-slate-900 hover:bg-black transition-all shadow-xs flex items-center gap-2 active:scale-95 shrink-0 cursor-pointer"
              aria-label="View Allocation Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white stroke-[2.2]" />
              <span className="hidden sm:inline text-[11px] tracking-widest">Bag</span>
              <span className="font-mono text-[10px] font-bold bg-[#C5A059] text-slate-950 px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full border border-slate-200/80 hover:border-slate-300 flex items-center justify-center text-slate-800 bg-white hover:bg-slate-50 focus:outline-none active:scale-95 shrink-0 shadow-2xs cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer - Simple, Clean & Professional */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-50 lg:hidden flex flex-col justify-start">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 bg-white border-b border-slate-200 px-6 py-6 shadow-2xl max-h-[calc(100vh-70px)] overflow-y-auto space-y-6 animate-in slide-in-from-top-2 duration-200">
            
            {/* Quick Search Trigger inside Drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-950 text-xs transition-colors text-left cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#9A7B38]" />
              <span>Search timepieces, calibres, collections...</span>
            </button>

            {/* Mobile Quick Action Buttons: Bag & Wishlist */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>Atelier Bag</span>
                </div>
                <span className="font-mono bg-[#C5A059] text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWishlist();
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs cursor-pointer hover:border-[#9A7B38]"
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
            <nav className="flex flex-col divide-y divide-slate-100">
              {NAV_LINKS.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className={`text-left text-xs tracking-[0.16em] uppercase py-3.5 flex items-center justify-between font-semibold cursor-pointer transition-colors ${
                      isActive
                        ? 'text-[#9A7B38] font-bold'
                        : 'text-slate-800 hover:text-slate-950'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38]" />
                    ) : (
                      <span className="text-slate-300 text-sm">›</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Currency Selector Grid */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                Valuation Currency
              </div>
              <div className="grid grid-cols-5 gap-2">
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
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {curr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Concierge Assistance */}
            <div className="pt-2 flex items-center gap-2 text-xs">
              <a
                href="tel:+41228190192"
                className="flex-1 py-2.5 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>Call Atelier</span>
              </a>
              <a
                href="https://wa.me/41228190192"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Concierge Chat</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
