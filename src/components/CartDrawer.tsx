import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CartItem, CurrencyCode } from '../types/watch';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const rawSubtotalUSD = items.reduce((acc, item) => {
    const itemPrice = item.bespokePrice || item.watch.priceUSD;
    return acc + itemPrice * item.quantity;
  }, 0);

  const discountAmountUSD = (rawSubtotalUSD * discountPercent) / 100;
  const finalTotalUSD = rawSubtotalUSD - discountAmountUSD;

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'AURELIA10') {
      setDiscountPercent(10);
      setCouponError('');
    } else {
      setCouponError('Invalid voucher code. Try "AURELIA10"');
    }
  };

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
              Your Atelier Bag
            </h3>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/[0.05]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 mb-4">
                <Tag className="w-7 h-7" />
              </div>
              <p className="font-cinzel text-base text-white tracking-wide">Your Bag is Empty</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5">
                Explore our Haute Horlogerie collections and select your bespoke timepiece.
              </p>
            </div>
          ) : (
            items.map((item, index) => {
              const price = item.bespokePrice || item.watch.priceUSD;
              return (
                <div
                  key={`${item.watch.id}-${index}`}
                  className="flex gap-4 pb-6 border-b border-white/[0.06] last:border-b-0"
                >
                  <img
                    src={item.watch.image}
                    alt={item.watch.name}
                    className="w-20 h-20 object-cover rounded bg-[#161922] border border-white/[0.08] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold text-white leading-tight">
                          {item.watch.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-slate-400 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-[#C5A059] mt-0.5">
                        {item.watch.reference}
                      </p>

                      {item.customEngraving && (
                        <p className="text-[10px] text-slate-400 mt-1 italic">
                          Engraved: &quot;{item.customEngraving}&quot;
                        </p>
                      )}
                      {item.bespokeCase && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Custom: {item.bespokeCase} · {item.bespokeDial}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-white/[0.1] rounded bg-white/[0.02]">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="p-1 hover:text-[#C5A059] transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-mono tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="p-1 hover:text-[#C5A059] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-mono font-medium text-white tabular-nums">
                        {formatPrice(price * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/[0.08] bg-[#0B0D10] space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={applyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Voucher (e.g. AURELIA10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white/[0.04] border border-white/[0.1] rounded text-white uppercase placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider bg-white/[0.08] hover:bg-white/[0.15] text-white rounded transition-colors"
              >
                Apply
              </button>
            </form>
            {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
            {discountPercent > 0 && (
              <p className="text-[11px] text-[#C5A059] flex items-center gap-1">
                <Tag className="w-3 h-3" /> 10% Haute Horlogerie Privilege Applied
              </p>
            )}

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-white">
                  {formatPrice(rawSubtotalUSD, currency)}
                </span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#C5A059]">
                  <span>Atelier Privilege ({discountPercent}%)</span>
                  <span className="font-mono tabular-nums">
                    -{formatPrice(discountAmountUSD, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Armored Courier & Insurance</span>
                <span className="text-[#C5A059] font-medium uppercase tracking-wider text-[11px]">
                  Complimentary
                </span>
              </div>
              <div className="pt-2 border-t border-white/[0.06] flex justify-between text-base font-semibold text-white">
                <span className="font-cinzel">Total</span>
                <span className="font-mono tabular-nums text-[#C5A059]">
                  {formatPrice(finalTotalUSD, currency)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_18px_rgba(197,160,89,0.35)] hover:shadow-[0_0_28px_rgba(197,160,89,0.6)] transition-all rounded-full flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[2.2]" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Full Atelier Guarantee & Certified Provenance Escrow</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
