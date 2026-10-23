import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Lock,
  Phone,
  Copy,
  Check,
  ArrowRight,
  PackageCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PageRoute } from '../types/watch';
import { getPlacedOrders, findOrderByQuery, PlacedOrder, getLastPlacedOrder } from '../utils/orderStorage';
import { handleImageFallback } from '../utils/imageFallback';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: PageRoute) => void;
  initialOrderNumber?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialOrderNumber,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [currentOrder, setCurrentOrder] = useState<PlacedOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedAWB, setCopiedAWB] = useState(false);
  const [copiedOrderNum, setCopiedOrderNum] = useState(false);

  // Initialize or reload orders on open
  useEffect(() => {
    if (!isOpen) return;

    if (initialOrderNumber) {
      setSearchInput(initialOrderNumber);
      const found = findOrderByQuery(initialOrderNumber);
      if (found) {
        setCurrentOrder(found);
        setErrorMessage('');
        return;
      }
    }

    // Default to last placed order or first demo order
    const last = getLastPlacedOrder();
    if (last) {
      setCurrentOrder(last);
      setSearchInput(last.orderNumber);
    } else {
      const all = getPlacedOrders();
      if (all.length > 0) {
        setCurrentOrder(all[0]);
        setSearchInput(all[0].orderNumber);
      }
    }
  }, [isOpen, initialOrderNumber]);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : searchInput).trim();
    if (!query) {
      setErrorMessage('Please enter an order number, tracking AWB, or email.');
      return;
    }

    const found = findOrderByQuery(query);
    if (found) {
      setCurrentOrder(found);
      setErrorMessage('');
    } else {
      setErrorMessage(`No active consignment found matching "${query}". Try one of the verified sample references below.`);
    }
  };

  const handleCopyAWB = () => {
    if (currentOrder?.airwayBill) {
      navigator.clipboard?.writeText?.(currentOrder.airwayBill);
      setCopiedAWB(true);
      setTimeout(() => setCopiedAWB(false), 2000);
    }
  };

  const handleCopyOrderNum = () => {
    if (currentOrder?.orderNumber) {
      navigator.clipboard?.writeText?.(currentOrder.orderNumber);
      setCopiedOrderNum(true);
      setTimeout(() => setCopiedOrderNum(false), 2000);
    }
  };

  const allKnownOrders = getPlacedOrders();

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white text-slate-900 border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto relative max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#9A7B38]/15 border border-[#9A7B38]/30 flex items-center justify-center text-[#9A7B38] shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-slate-900">
                    Armored Consignment Telemetry
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    GPS Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-light font-mono mt-0.5">
                  High-Value Armored Transit · Switzerland to Worldwide Escort
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close tracking modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
            {/* Search Input Bar */}
            <form onSubmit={(e) => handleSearch(e)} className="space-y-2">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#9A7B38] absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter Order ID (e.g. AUR-2026-..., AUR-89201-CH) or Email..."
                  className="w-full pl-11 pr-28 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#9A7B38] focus:bg-white shadow-2xs transition-all font-mono"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] rounded-full transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Track
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                <span className="text-slate-500 font-medium">Recent Orders:</span>
                {allKnownOrders.slice(0, 4).map((o) => (
                  <button
                    key={o.orderNumber}
                    type="button"
                    onClick={() => {
                      setSearchInput(o.orderNumber);
                      handleSearch(undefined, o.orderNumber);
                    }}
                    className={`font-mono px-2.5 py-1 rounded-full text-[10px] transition-colors cursor-pointer border ${
                      currentOrder?.orderNumber === o.orderNumber
                        ? 'bg-[#9A7B38] text-white border-[#9A7B38] font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    {o.orderNumber}
                  </button>
                ))}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>

            {currentOrder && (
              <div className="space-y-6">
                {/* Order Summary & Status Header Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={currentOrder.items[0]?.image || '/assets/images/hero_luxury_chronograph_1791612522214.jpg'}
                          alt=""
                          onError={handleImageFallback}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                        <span className="absolute -top-1.5 -right-1.5 bg-[#9A7B38] text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                          {currentOrder.items.length}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
                            {currentOrder.orderNumber}
                          </span>
                          <button
                            onClick={handleCopyOrderNum}
                            className="text-slate-400 hover:text-[#9A7B38] transition-colors cursor-pointer"
                            title="Copy Order Number"
                          >
                            {copiedOrderNum ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#9A7B38] mt-0.5">
                          {currentOrder.timepieceSummary}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-light">
                          Patron: <span className="font-semibold text-slate-800">{currentOrder.clientName}</span> · Placed on {currentOrder.orderDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs">
                        ● {currentOrder.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Stage {currentOrder.progressStep} of 5 Complete
                      </span>
                    </div>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                        Estimated Delivery
                      </span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">
                        {currentOrder.estimatedDelivery}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                        Airway Bill (AWB)
                      </span>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <span className="font-mono font-bold text-[#9A7B38]">
                          {currentOrder.airwayBill}
                        </span>
                        <button
                          onClick={handleCopyAWB}
                          className="text-slate-400 hover:text-slate-800 cursor-pointer"
                          title="Copy Airway Bill"
                        >
                          {copiedAWB ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                        Secured Destination
                      </span>
                      <span className="font-semibold text-slate-900 mt-0.5 block truncate" title={currentOrder.destination}>
                        {currentOrder.destination}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Step-by-Step Milestones Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#9A7B38]" />
                      <span>Chronological Escrow & Courier Milestones</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">Real-Time Telemetry</span>
                  </div>

                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200">
                    {currentOrder.steps.map((step, idx) => {
                      const isCompleted = step.completed;
                      const isCurrent = step.current;

                      return (
                        <div key={idx} className="relative group">
                          {/* Stepper Dot */}
                          <div
                            className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-gradient-to-br from-[#C5A059] to-[#9A7B38] text-black shadow-sm'
                                : 'bg-slate-100 border-2 border-slate-300 text-slate-400'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                            )}
                          </div>

                          {/* Milestone Box */}
                          <div
                            className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                              isCurrent
                                ? 'bg-[#9A7B38]/10 border-[#9A7B38] shadow-sm ring-1 ring-[#9A7B38]/30'
                                : isCompleted
                                ? 'bg-white border-slate-200 shadow-2xs'
                                : 'bg-slate-50/60 border-slate-200/60 opacity-60'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h5 className="font-cinzel text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                                <span>{step.title}</span>
                                {isCurrent && (
                                  <span className="text-[9px] font-mono uppercase bg-[#9A7B38] text-white px-2 py-0.2 rounded-full font-bold">
                                    Current Stage
                                  </span>
                                )}
                              </h5>
                              <span className="font-mono text-[10px] text-[#9A7B38] font-semibold">
                                {step.timestamp}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-light">
                              {step.description}
                            </p>

                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                              <MapPin className="w-3 h-3 text-[#9A7B38]" />
                              <span>{step.location}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Armored Courier & Insurance Guarantee Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#9A7B38] shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block font-cinzel">
                        Full Lloyd’s of London Valuation Cover
                      </span>
                      <span className="text-[11px] text-slate-500 font-light">
                        Every timepiece in transit is covered up to 100% of declared replacement value.
                      </span>
                    </div>
                  </div>

                  <a
                    href="tel:+41228190192"
                    className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-[#9A7B38] text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#9A7B38]" />
                    <span>Contact Armored Escort</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
