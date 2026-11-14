import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ShieldCheck, MapPin, X, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Watch, CurrencyCode, PageRoute } from '../types/watch';
import { formatPrice } from '../utils/currency';
import { handleImageFallback } from '../utils/imageFallback';

export interface LivePurchaseEvent {
  id: string;
  clientName: string;
  location: string;
  country: string;
  watchId: string;
  watchName: string;
  watchRef: string;
  priceUSD: number;
  image: string;
  timeAgo: string;
  badge?: string;
}

const DUMMY_PURCHASE_HISTORY: LivePurchaseEvent[] = [
  {
    id: 'pur-pk-1',
    clientName: 'Malik Hamza',
    location: 'DHA Phase 6, Lahore',
    country: 'Pakistan',
    watchId: 'ah-001',
    watchName: 'Royal Chronograph 41',
    watchRef: 'REF. AH-2026-CH',
    priceUSD: 35,
    image: '/assets/images/hero_luxury_chronograph_1791612522214.jpg',
    timeAgo: '2 minutes ago',
    badge: 'Novelty 2026',
  },
  {
    id: 'pur-pk-2',
    clientName: 'Chaudhry Danial',
    location: 'F-7/2, Islamabad',
    country: 'Pakistan',
    watchId: 'ah-003',
    watchName: 'Symphonie Skeleton Flying Tourbillon',
    watchRef: 'REF. AH-2026-TB',
    priceUSD: 49,
    image: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
    timeAgo: '6 minutes ago',
    badge: 'Limited Series',
  },
  {
    id: 'pur-pk-3',
    clientName: 'Bilal Tariq',
    location: 'Clifton Block 4, Karachi',
    country: 'Pakistan',
    watchId: 'ah-002',
    watchName: 'Abyss Master Diver 300M',
    watchRef: 'REF. AH-2026-DV',
    priceUSD: 24,
    image: '/assets/images/watch_diver_submariner_1791612540699.jpg',
    timeAgo: '11 minutes ago',
    badge: 'Grade 5 Titanium',
  },
  {
    id: 'pur-pk-4',
    clientName: 'Dr. Zeeshan Abbasi',
    location: 'Gulberg III, Lahore',
    country: 'Pakistan',
    watchId: 'ah-004',
    watchName: 'Patrimoine Ultra-Thin Dress',
    watchRef: 'REF. AH-2026-DR',
    priceUSD: 19,
    image: '/assets/images/watch_dress_minimalist_1791612572332.jpg',
    timeAgo: '19 minutes ago',
    badge: 'Ultra-Slim 6.8mm',
  },
  {
    id: 'pur-pk-5',
    clientName: 'Mian Usman Farooq',
    location: 'Cantt, Rawalpindi',
    country: 'Pakistan',
    watchId: 'ah-005',
    watchName: 'Heritage Valjoux 1892',
    watchRef: 'REF. AH-2026-HT',
    priceUSD: 32,
    image: '/assets/images/craftsmanship_watchmaker_1791612587562.jpg',
    timeAgo: '28 minutes ago',
    badge: 'Historical Archive',
  },
  {
    id: 'pur-pk-6',
    clientName: 'Shehryar Khan Durrani',
    location: 'Hayatabad, Peshawar',
    country: 'Pakistan',
    watchId: 'ah-001',
    watchName: 'Royal Chronograph 41',
    watchRef: 'REF. AH-2026-CH',
    priceUSD: 35,
    image: '/assets/images/hero_luxury_chronograph_1791612522214.jpg',
    timeAgo: '35 minutes ago',
    badge: 'Express Delivery',
  },
  {
    id: 'pur-pk-7',
    clientName: 'Syed Murtaza Hashmi',
    location: 'Civil Lines, Multan',
    country: 'Pakistan',
    watchId: 'ah-003',
    watchName: 'Symphonie Skeleton Flying Tourbillon',
    watchRef: 'REF. AH-2026-TB',
    priceUSD: 49,
    image: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
    timeAgo: '47 minutes ago',
    badge: 'VIP Allocation',
  },
  {
    id: 'pur-pk-8',
    clientName: 'Farhan Qureshi',
    location: 'DHA Phase 8, Karachi',
    country: 'Pakistan',
    watchId: 'ah-002',
    watchName: 'Abyss Master Diver 300M',
    watchRef: 'REF. AH-2026-DV',
    priceUSD: 24,
    image: '/assets/images/watch_diver_submariner_1791612540699.jpg',
    timeAgo: '1 hour ago',
    badge: 'Automatic Calibre',
  },
  {
    id: 'pur-pk-9',
    clientName: 'Rana Jahanzeb',
    location: 'Kohinoor City, Faisalabad',
    country: 'Pakistan',
    watchId: 'ah-004',
    watchName: 'Patrimoine Ultra-Thin Dress',
    watchRef: 'REF. AH-2026-DR',
    priceUSD: 19,
    image: '/assets/images/watch_dress_minimalist_1791612572332.jpg',
    timeAgo: '1 hour ago',
  },
];

interface LivePurchaseNotifierProps {
  currency: CurrencyCode;
  onNavigate: (route: PageRoute) => void;
  watches?: Watch[];
}

export const LivePurchaseNotifier: React.FC<LivePurchaseNotifierProps> = ({
  currency,
  onNavigate,
  watches,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Initial delay before showing notification while viewing a product
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(initialTimer);
  }, [isDismissed]);

  useEffect(() => {
    if (isDismissed || !isVisible) return;

    let nextTimer: ReturnType<typeof setTimeout> | undefined;

    // Visible duration: 6 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);

      // Interval before showing next purchase: 8 seconds
      nextTimer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % DUMMY_PURCHASE_HISTORY.length);
        setIsVisible(true);
      }, 8000);
    }, 6000);

    return () => {
      clearTimeout(hideTimer);
      if (nextTimer) clearTimeout(nextTimer);
    };
  }, [isVisible, isDismissed]);

  const currentPurchase = DUMMY_PURCHASE_HISTORY[currentIndex];

  // Try to find the exact watch object if catalog was modified
  const matchedWatch = watches?.find((w) => w.id === currentPurchase.watchId);
  const watchImage = matchedWatch?.image || currentPurchase.image;
  const watchName = matchedWatch?.name || currentPurchase.watchName;
  const priceUSD = matchedWatch?.priceUSD || currentPurchase.priceUSD;

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 max-w-[340px] sm:max-w-sm pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="pointer-events-auto bg-[#0F141F]/95 backdrop-blur-md border border-[#C5A059]/40 rounded-2xl p-3 sm:p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_0_20px_rgba(197,160,89,0.15)] flex items-center gap-3 group relative overflow-hidden"
          >
            {/* Subtle luxury gold gradient bar on left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E2C775] via-[#C5A059] to-[#9A7B38]" />

            {/* Watch Image Thumbnail */}
            <div
              onClick={() => onNavigate(`product-${currentPurchase.watchId}` as PageRoute)}
              className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-[#C5A059]/30 shrink-0 cursor-pointer shadow-md group-hover:border-[#C5A059] transition-colors"
            >
              <img
                src={watchImage}
                alt={watchName}
                onError={handleImageFallback}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-0 right-0 p-0.5 bg-black/80 rounded-tl-md">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              </span>
            </div>

            {/* Content Details */}
            <div
              onClick={() => onNavigate(`product-${currentPurchase.watchId}` as PageRoute)}
              className="flex-1 min-w-0 cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5 text-[10px] text-[#E2C775] font-mono leading-none mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="uppercase tracking-wider font-semibold">Live Acquisition · Pakistan</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{currentPurchase.timeAgo}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-300 truncate">
                <span className="font-semibold text-white truncate">
                  {currentPurchase.clientName}
                </span>
                <span className="text-slate-500">in</span>
                <span className="text-[#C5A059] font-medium truncate flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  {currentPurchase.location}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white group-hover:text-[#E2C775] transition-colors truncate mt-0.5 leading-snug">
                {watchName}
              </h4>

              <div className="flex items-center gap-2 mt-1 text-[11px]">
                <span className="font-mono font-bold text-[#E2C775]">
                  {formatPrice(priceUSD, currency)}
                </span>
                {currentPurchase.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-[#C5A059]/15 text-[#E2C775] border border-[#C5A059]/30 truncate">
                    {currentPurchase.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="self-start p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Dismiss notification"
              aria-label="Dismiss purchase notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
