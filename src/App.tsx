import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageRoute, CurrencyCode, Watch, CartItem } from './types/watch';
import { WATCHES } from './data/watches';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';

import { CompareModal } from './components/CompareModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LuxuryWatchPreloader } from './components/LuxuryWatchPreloader';
import { ScrollProgressBar } from './components/ScrollProgressBar';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CraftsmanshipPage } from './pages/CraftsmanshipPage';
import { BespokePage } from './pages/BespokePage';
import { HeritagePage } from './pages/HeritagePage';
import { ConciergePage } from './pages/ConciergePage';
import { AdminPage } from './pages/AdminPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ArticlePage } from './pages/ArticlePage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Timepieces Catalog state with persistent localStorage
  const [watches, setWatches] = useState<Watch[]>(() => {
    try {
      const saved = localStorage.getItem('aurelia_watches_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading watches from localStorage', e);
    }
    return WATCHES;
  });

  // Sync watches to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('aurelia_watches_catalog', JSON.stringify(watches));
    } catch (e) {
      console.error('Error saving watches to localStorage', e);
    }
  }, [watches]);

  // Product CRUD actions for Admin
  const handleAddWatch = (newWatch: Watch) => {
    setWatches((prev) => [newWatch, ...prev]);
  };

  const handleUpdateWatch = (updatedWatch: Watch) => {
    setWatches((prev) => prev.map((w) => (w.id === updatedWatch.id ? updatedWatch : w)));
  };

  const handleDeleteWatch = (watchId: string) => {
    setWatches((prev) => prev.filter((w) => w.id !== watchId));
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog back to initial factory Swiss watches? Any custom added watches will be cleared.')) {
      setWatches(WATCHES);
      localStorage.removeItem('aurelia_watches_catalog');
    }
  };

  // Routing state
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');

  // Currency state (Default to PKR)
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');

  // E-Commerce state
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Seed with 1 initial iconic item for immediate exploration
    return [
      {
        watch: WATCHES[0],
        quantity: 1,
      },
    ];
  });
  const [wishlist, setWishlist] = useState<Watch[]>([]);

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const handleOpenProduct = (watch: Watch) => {
    handleNavigate(`product-${watch.id}`);
  };
  const [comparisonList, setComparisonList] = useState<Watch[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Sync route with window location hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      const validRoutes: PageRoute[] = [
        'home',
        'collections',
        'craftsmanship',
        'bespoke',
        'heritage',
        'concierge',
        'admin',
      ];
      if (validRoutes.includes(hash) || hash.startsWith('product-') || hash.startsWith('article-')) {
        setCurrentPage(hash);
      } else if (!hash) {
        setCurrentPage('home');
      }
    };

    // Check initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Smooth, instant navigation across all pages (no blocking transitions)
  const handleNavigate = (page: PageRoute) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (watch: Watch, quantity: number = 1, selectedStrap?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.watch.id === watch.id && !item.bespokePrice
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { watch, quantity, selectedStrap }];
    });
  };

  const handleAddBespokeToCart = (bespokeItem: CartItem) => {
    setCart((prev) => [...prev, bespokeItem]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (watch: Watch) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === watch.id);
      if (exists) {
        return prev.filter((w) => w.id !== watch.id);
      }
      return [...prev, watch];
    });
  };

  const handleRemoveFromWishlist = (watchId: string) => {
    setWishlist((prev) => prev.filter((w) => w.id !== watchId));
  };

  const handleToggleCompare = (watch: Watch) => {
    setComparisonList((prev) => {
      const exists = prev.some((w) => w.id === watch.id);
      if (exists) return prev.filter((w) => w.id !== watch.id);
      if (prev.length >= 2) return prev;
      return [...prev, watch];
    });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans selection:bg-gold/30 selection:text-white">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LuxuryWatchPreloader
            onComplete={() => setIsLoading(false)}
            minDuration={2400}
          />
        )}
      </AnimatePresence>
      <ScrollProgressBar />

      {/* Top Luxury Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        currentCurrency={currency}
        onSelectCurrency={setCurrency}
      />

      {/* Subpage Breadcrumbs & Horological Navigation Ribbon */}
      {currentPage !== 'home' && (
        <nav aria-label="Breadcrumb navigation" className="w-full bg-[#030509]/95 backdrop-blur-md border-b border-gold/20 py-2.5 px-4 sm:px-8 lg:px-16 xl:px-24 flex items-center justify-between text-xs sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
            <button 
              onClick={() => handleNavigate('home')} 
              className="text-slate-400 hover:text-gold transition-colors flex items-center gap-1 font-cinzel uppercase tracking-wider text-[11px]"
            >
              <span>Maison Aurelia</span>
            </button>
            <span className="text-gold/40">/</span>
            <span className="text-[#C5A059] font-semibold uppercase tracking-wider text-[11px] font-cinzel">
              {currentPage === 'collections' && 'Timepiece Collections'}
              {currentPage === 'craftsmanship' && 'Haute Calibres & Craftsmanship'}
              {currentPage === 'bespoke' && 'Bespoke Atelier Studio'}
              {currentPage === 'heritage' && 'Manufacture Heritage (1892)'}
              {currentPage === 'concierge' && 'Private Concierge & Salons'}
              {currentPage === 'admin' && 'Atelier Management Portal'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white">Le Brassus Atelier Online</span>
            </span>
            <span className="text-gold/30">·</span>
            <span className="text-gold/90 font-medium">100% In-House Mechanical Calibres</span>
          </div>
        </nav>
      )}

      {/* Main Page Content rendered by active route with smooth page transition */}
      <main className="flex-1 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentPage === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                featuredWatches={watches}
                currency={currency}
                onOpenQuickView={handleOpenProduct}
                onAddToCart={handleAddToCart}
              />
            )}

            {currentPage === 'collections' && (
              <CatalogPage
                watches={watches}
                currency={currency}
                onOpenQuickView={handleOpenProduct}
                onAddToCart={handleAddToCart}
                wishlistIds={wishlist.map((w) => w.id)}
                onToggleWishlist={handleToggleWishlist}
                comparisonList={comparisonList}
                onToggleCompare={handleToggleCompare}
                onOpenCompare={() => setIsCompareOpen(true)}
              />
            )}

            {currentPage === 'craftsmanship' && <CraftsmanshipPage onNavigate={handleNavigate} />}

            {currentPage === 'bespoke' && (
              <BespokePage
                currency={currency}
                onAddBespokeToCart={handleAddBespokeToCart}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'heritage' && <HeritagePage onNavigate={handleNavigate} />}

            {currentPage === 'concierge' && <ConciergePage onNavigate={handleNavigate} />}

            {currentPage === 'admin' && (
              <AdminPage
                watches={watches}
                currency={currency}
                onAddWatch={handleAddWatch}
                onUpdateWatch={handleUpdateWatch}
                onDeleteWatch={handleDeleteWatch}
                onResetCatalog={handleResetCatalog}
                onNavigate={handleNavigate}
                onViewWatch={handleOpenProduct}
              />
            )}

            {currentPage.startsWith('product-') && (() => {
              const watchId = currentPage.replace('product-', '');
              const foundWatch = watches.find((w) => w.id === watchId) || watches[0];
              return (
                <ProductDetailPage
                  watch={foundWatch}
                  onNavigate={handleNavigate}
                  currency={currency}
                  onAddToCart={handleAddToCart}
                  isWishlisted={wishlist.some((w) => w.id === foundWatch.id)}
                  onToggleWishlist={handleToggleWishlist}
                  allWatches={watches}
                  onSelectWatch={(w) => handleNavigate(`product-${w.id}`)}
                />
              );
            })()}

            {currentPage.startsWith('article-') && (() => {
              const articleId = currentPage.replace('article-', '');
              return (
                <ArticlePage
                  articleId={articleId}
                  onNavigate={handleNavigate}
                />
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Refined Luxury Footer */}
      <Footer onNavigate={handleNavigate} onReplayPreloader={() => setIsLoading(true)} />

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        currency={currency}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={(watch) => {
          handleAddToCart(watch);
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
        onViewWatch={(watch) => {
          setIsWishlistOpen(false);
          handleOpenProduct(watch);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        onClearCart={handleClearCart}
      />

      {isCompareOpen && (
        <CompareModal
          watches={comparisonList}
          currency={currency}
          onClose={() => setIsCompareOpen(false)}
          onToggleCompare={handleToggleCompare}
        />
      )}
    </div>
  );
}
