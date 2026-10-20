import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Lock, CreditCard, Truck, Landmark } from 'lucide-react';
import { CartItem, CurrencyCode } from '../types/watch';
import { formatPrice } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onClearCart,
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
    paymentMethod: 'armored-cod',
    cardNumber: '•••• •••• •••• 4242',
    notes: 'Please ring private bell upon arrival.',
  });
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const rawSubtotalUSD = items.reduce((acc, item) => {
    const itemPrice = item.bespokePrice || item.watch.priceUSD;
    return acc + itemPrice * item.quantity;
  }, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `AH-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    try {
      localStorage.setItem(
        'aurelia_last_order',
        JSON.stringify({
          orderId: generatedId,
          email: formData.email,
          name: formData.fullName,
          city: formData.city,
          country: formData.country,
          items: items.map((i) => i.watch.name),
          totalUSD: rawSubtotalUSD,
          placedAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      // ignore storage errors
    }
    setStep('confirmation');
    onClearCart();
  };

  const handleCloseAll = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleCloseAll}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-[#0F1218] border border-white/[0.1] rounded-lg shadow-2xl text-white overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#12151C]">
          <div>
            <h3 className="font-cinzel text-xl font-bold tracking-wider text-white">
              {step === 'form' ? 'Atelier Private Acquisition' : 'Acquisition Confirmed'}
            </h3>
            <p className="text-xs text-[#C5A059] tracking-wider uppercase mt-0.5">
              Vallée de Joux Secure Dispatch Escrow
            </p>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/[0.05]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Order Items Preview */}
            <div className="p-4 rounded bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C5A059]">
                Selected Timepieces ({items.length})
              </span>
              <div className="divide-y divide-white/[0.04]">
                {items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">
                      {item.watch.name} × {item.quantity}
                    </span>
                    <span className="font-mono text-white tabular-nums">
                      {formatPrice((item.bespokePrice || item.watch.priceUSD) * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-white/[0.08] flex justify-between text-sm font-semibold">
                <span className="text-slate-300">Total Amount Due</span>
                <span className="font-mono text-[#C5A059] tabular-nums">
                  {formatPrice(rawSubtotalUSD, currency)}
                </span>
              </div>
            </div>

            {/* Client Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel">
                1. VIP Client Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Lord Alexander Sterling"
                    className="w-full px-3.5 py-2 text-xs bg-white/[0.04] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Direct Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alexander@sterlingholdings.com"
                    className="w-full px-3.5 py-2 text-xs bg-white/[0.04] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Concierge Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+41 22 555 0192"
                    className="w-full px-3.5 py-2 text-xs bg-white/[0.04] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel">
                2. Secure Delivery Destination
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Residence or Private Office Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="14 Rue du Rhône, Suite 400"
                    className="w-full px-3.5 py-2 text-xs bg-white/[0.04] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Geneva"
                      className="w-full px-3.5 py-2 text-xs bg-white/[0.04] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="1204"
                      className="w-full px-3.5 py-2 text-xs bg-white/[0.04] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Country *</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-[#161922] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
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
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel">
                3. Settlement Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'armored-cod' })}
                  className={`p-3 rounded border text-left transition-all ${
                    formData.paymentMethod === 'armored-cod'
                      ? 'bg-[#C5A059]/15 border-[#C5A059] text-white'
                      : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#C5A059] mb-2" />
                  <div className="text-xs font-semibold text-white">Armored Hand-Delivery</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Pay upon inspection at delivery (COD)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'wire' })}
                  className={`p-3 rounded border text-left transition-all ${
                    formData.paymentMethod === 'wire'
                      ? 'bg-[#C5A059]/15 border-[#C5A059] text-white'
                      : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-[#C5A059] mb-2" />
                  <div className="text-xs font-semibold text-white">Swiss Private Wire</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Escrow Bank Überweisung</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-3 rounded border text-left transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'bg-[#C5A059]/15 border-[#C5A059] text-white'
                      : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#C5A059] mb-2" />
                  <div className="text-xs font-semibold text-white">Centurion / Card</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Encrypted tokenization</div>
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-white/[0.08]">
              <button
                type="submit"
                className="w-full py-4 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.35)] hover:shadow-[0_0_30px_rgba(197,160,89,0.6)] transition-all rounded-full flex items-center justify-center gap-2 active:scale-95"
              >
                <Lock className="w-4 h-4 text-black stroke-[2.2]" />
                <span>Confirm Acquisition & Reserve Allocation</span>
              </button>
              <div className="mt-2 text-center text-[10px] text-slate-400">
                Guaranteed insured transit with official stamped Certificate of Origin.
              </div>
            </div>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-6 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#C5A059]/15 border border-[#C5A059] mx-auto flex items-center justify-center text-[#C5A059]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs tracking-widest uppercase text-[#C5A059] font-semibold">
                Allocation Reserved
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-white">
                Order #{orderId} Confirmed
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, {formData.fullName || 'Collector'}. Your timepiece has been reserved from our Geneva safe. Our Master Concierge will contact you within 2 business hours to schedule your armored handoff to {formData.city || 'your designated address'}.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded bg-white/[0.02] border border-white/[0.08] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Settlement Method:</span>
                <span className="text-white font-medium capitalize">
                  {formData.paymentMethod === 'armored-cod'
                    ? 'Inspection on Delivery (COD)'
                    : formData.paymentMethod === 'wire'
                    ? 'Private Wire Escrow'
                    : 'Encrypted Card'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="text-white font-medium">
                  {formData.address}, {formData.city}, {formData.country}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Dispatch:</span>
                <span className="text-[#C5A059] font-medium">48 Hours (Direct Flight)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/[0.06] font-semibold">
                <span className="text-white">Amount Reserved:</span>
                <span className="font-mono text-[#C5A059] tabular-nums">
                  {formatPrice(rawSubtotalUSD, currency)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCloseAll}
              className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-black bg-[#C5A059] hover:bg-[#D4B36E] transition-all rounded shadow-md"
            >
              Return to Atelier
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
