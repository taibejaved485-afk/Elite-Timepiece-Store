import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Watch, CurrencyCode } from '../types/watch';
import { formatPrice } from '../utils/currency';
import { AnimatedPrice } from './AnimatedPrice';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Watch[];
  currency: CurrencyCode;
  onRemoveFromWishlist: (watchId: string) => void;
  onAddToCart: (watch: Watch) => void;
  onViewWatch: (watch: Watch) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  currency,
  onRemoveFromWishlist,
  onAddToCart,
  onViewWatch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative z-10 w-full max-w-md bg-[#0F1218] text-white h-full flex flex-col shadow-2xl border-l border-white/[0.08] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-cinzel text-lg tracking-wider font-semibold text-white">
              Curated Wishlist
            </h3>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({wishlist.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/[0.05]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <p className="font-cinzel text-base text-white tracking-wide">No Saved Masterpieces</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5">
                Explore our Haute Horlogerie catalog and save timepieces to review or acquire later.
              </p>
            </div>
          ) : (
            wishlist.map((watch) => (
              <div
                key={watch.id}
                className="flex gap-4 pb-6 border-b border-white/[0.06] last:border-b-0"
              >
                <img
                  src={watch.image}
                  alt={watch.name}
                  className="w-20 h-20 object-cover rounded bg-[#161922] border border-white/[0.08] shrink-0 cursor-pointer"
                  onClick={() => onViewWatch(watch)}
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4
                        onClick={() => onViewWatch(watch)}
                        className="text-sm font-semibold text-white leading-tight cursor-pointer hover:text-[#C5A059] transition-colors"
                      >
                        {watch.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(watch.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-[#C5A059] mt-0.5">
                      {watch.reference}
                    </p>
                    <p className="text-xs font-mono font-medium text-white tabular-nums mt-1">
                      <AnimatedPrice amountUSD={watch.priceUSD} currency={currency} replayOnHover={true} />
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => onAddToCart(watch)}
                      className="flex-1 py-2 px-3 text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] text-black shadow-[0_0_12px_rgba(197,160,89,0.3)] transition-all rounded-full flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>Add to Bag</span>
                    </button>
                    <button
                      onClick={() => onViewWatch(watch)}
                      className="py-2 px-3 text-[11px] font-medium border border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-full transition-colors"
                      title="View Details"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
