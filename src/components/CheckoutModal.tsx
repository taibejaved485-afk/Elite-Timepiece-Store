import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  Landmark,
  Copy,
  Check,
  Printer,
  Compass,
  ArrowRight
} from 'lucide-react';
import { CartItem, CurrencyCode } from '../types/watch';
import { formatPrice } from '../utils/currency';
import { AnimatedPrice } from './AnimatedPrice';
import { createNewOrder, PlacedOrder } from '../utils/orderStorage';
import { handleImageFallback } from '../utils/imageFallback';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onClearCart: () => void;
  onOpenTrackOrder?: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onClearCart,
  onOpenTrackOrder,
}) => {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Switzerland',
    postalCode: '',
    paymentMethod: 'armored-cod' as 'armored-cod' | 'wire' | 'card',
    notes: 'Please ring private bell upon arrival.',
  });
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [copiedOrder, setCopiedOrder] = useState(false);

  if (!isOpen) return null;

  const rawSubtotalUSD = items.reduce((acc, item) => {
    const itemPrice = item.bespokePrice || item.watch.priceUSD;
    return acc + itemPrice * item.quantity;
  }, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Create persistent order record in order registry
    const newOrder = createNewOrder(formData, items, rawSubtotalUSD);
    setPlacedOrder(newOrder);
    setStep('confirmation');
    onClearCart();
  };

  const handleCopyOrderNumber = () => {
    if (placedOrder?.orderNumber) {
      navigator.clipboard?.writeText?.(placedOrder.orderNumber);
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCloseAll = () => {
    setStep('form');
    setPlacedOrder(null);
    onClose();
  };

  const handleTrackDirect = () => {
    if (placedOrder && onOpenTrackOrder) {
      onOpenTrackOrder(placedOrder.orderNumber);
      handleCloseAll();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleCloseAll}
      />

      {/* Modal in Luxury White / Slate Theme */}
      <div className="relative z-10 w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-slate-900">
                {step === 'form' ? 'Atelier Private Acquisition' : 'Acquisition Confirmed'}
              </h3>
            </div>
            <p className="text-[11px] text-[#9A7B38] font-semibold tracking-wider uppercase mt-0.5 font-mono">
              Vallée de Joux Secure Dispatch Escrow
            </p>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close acquisition modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
            {/* Order Items Preview */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold tracking-wider uppercase text-[#9A7B38] font-cinzel">
                  Selected Timepieces ({items.length})
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Armored Courier Included</span>
              </div>
              <div className="divide-y divide-slate-200/70">
                {items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.watch.image}
                        alt={item.watch.name}
                        onError={handleImageFallback}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{item.watch.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Qty: {item.quantity} · {item.watch.reference}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-slate-900 font-bold tabular-nums shrink-0">
                      <AnimatedPrice
                        amountUSD={(item.bespokePrice || item.watch.priceUSD) * item.quantity}
                        currency={currency}
                      />
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700 font-cinzel">Total Acquisition Value</span>
                <span className="font-mono text-[#9A7B38] text-base tabular-nums">
                  <AnimatedPrice amountUSD={rawSubtotalUSD} currency={currency} />
                </span>
              </div>
            </div>

            {/* Client Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-cinzel">
                1. VIP Client Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Lord Alexander Sterling"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#9A7B38] shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Direct Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alexander@sterlingholdings.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#9A7B38] shadow-2xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Concierge Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+41 22 555 0192"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#9A7B38] shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-cinzel">
                2. Secure Delivery Destination
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Residence or Private Office Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="14 Rue du Rhône, Suite 400"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#9A7B38] shadow-2xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Geneva"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#9A7B38] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="1204"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#9A7B38] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Country *</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#9A7B38] shadow-2xs cursor-pointer"
                    >
                      <option value="Switzerland">Switzerland</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-cinzel">
                3. Settlement Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'armored-cod' })}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.paymentMethod === 'armored-cod'
                      ? 'bg-[#9A7B38]/10 border-[#9A7B38] text-slate-900 shadow-sm ring-1 ring-[#9A7B38]/30'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#9A7B38] mb-2" />
                  <div className="text-xs font-bold text-slate-900">Armored Hand-Delivery</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Inspection & payment upon delivery (COD)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'wire' })}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.paymentMethod === 'wire'
                      ? 'bg-[#9A7B38]/10 border-[#9A7B38] text-slate-900 shadow-sm ring-1 ring-[#9A7B38]/30'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-[#9A7B38] mb-2" />
                  <div className="text-xs font-bold text-slate-900">Swiss Private Wire</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Escrow Bank Überweisung to Zurich
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.paymentMethod === 'card'
                      ? 'bg-[#9A7B38]/10 border-[#9A7B38] text-slate-900 shadow-sm ring-1 ring-[#9A7B38]/30'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#9A7B38] mb-2" />
                  <div className="text-xs font-bold text-slate-900">Centurion / Card</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Zero-compromise encrypted settlement
                  </div>
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                type="submit"
                className="w-full py-4 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-md hover:shadow-lg transition-all rounded-full flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-black stroke-[2.2]" />
                <span>Confirm Acquisition & Reserve Allocation</span>
              </button>
              <div className="text-center text-[11px] text-slate-500 font-light">
                Guaranteed insured transit with official stamped Certificate of Origin & 5-Year Global Guarantee.
              </div>
            </div>
          </form>
        ) : (
          /* Confirmation Screen with Full Order Tracking Link */
          <div className="p-6 sm:p-10 text-center space-y-6 my-auto overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-[#9A7B38]/15 border border-[#9A7B38] mx-auto flex items-center justify-center text-[#9A7B38] shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs tracking-widest uppercase text-[#9A7B38] font-bold font-mono">
                Allocation Reserved & Confirmed
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-900">
                Order #{placedOrder?.orderNumber}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-light">
                Thank you, {formData.fullName || 'Collector'}. Your timepiece has been formally allocated in our Le Brassus vault. A copy of your consignment receipt has been sent to <span className="font-semibold text-slate-900">{formData.email}</span>.
              </p>
            </div>

            {/* Quick Order Number Copy Box */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                  Order Tracking Reference
                </span>
                <span className="font-mono text-sm font-bold text-[#9A7B38]">
                  {placedOrder?.orderNumber}
                </span>
              </div>
              <button
                onClick={handleCopyOrderNumber}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-mono text-[11px] transition-colors cursor-pointer"
              >
                {copiedOrder ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#9A7B38]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Summary Card */}
            <div className="max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5 shadow-2xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-light">Carrier Service:</span>
                <span className="text-slate-900 font-semibold">{placedOrder?.carrier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-light">Airway Bill (AWB):</span>
                <span className="font-mono text-[#9A7B38] font-bold">{placedOrder?.airwayBill}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-light">Delivery Destination:</span>
                <span className="text-slate-900 font-semibold text-right max-w-[220px] truncate">
                  {formData.address}, {formData.city}, {formData.country}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-light">Settlement Method:</span>
                <span className="text-slate-900 font-semibold capitalize">
                  {formData.paymentMethod === 'armored-cod'
                    ? 'Inspection on Delivery (COD)'
                    : formData.paymentMethod === 'wire'
                    ? 'Private Wire Escrow'
                    : 'Encrypted Centurion / Card'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                <span className="text-slate-800">Total Valuation Reserved:</span>
                <span className="font-mono text-[#9A7B38] text-sm tabular-nums">
                  {formatPrice(rawSubtotalUSD, currency)}
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              {onOpenTrackOrder && (
                <button
                  onClick={handleTrackDirect}
                  className="w-full sm:flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] transition-all rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Compass className="w-4 h-4 text-black" />
                  <span>Track Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              )}

              <button
                onClick={handlePrintReceipt}
                className="w-full sm:flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all rounded-full flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>Print Receipt</span>
              </button>
            </div>

            <div>
              <button
                onClick={handleCloseAll}
                className="text-xs text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider font-semibold cursor-pointer underline"
              >
                Return to Atelier Collection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
