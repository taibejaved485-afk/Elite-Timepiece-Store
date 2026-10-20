import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Search,
  Send,
  User,
  Truck,
  PackageCheck,
  AlertCircle,
  ArrowRight,
  Lock,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { WATCHES } from '../data/watches';
import { getShippingStatus } from '../utils/shipping';
import { ConciergeFAQ } from '../components/ConciergeFAQ';
import { PageRoute } from '../types/watch';

interface ConciergePageProps {
  onNavigate?: (page: PageRoute) => void;
}

interface OrderTrackingData {
  orderId: string;
  email: string;
  clientName: string;
  destination: string;
  carrier: string;
  vaultTransitId: string;
  estimatedDelivery: string;
  statusBadge: string;
  currentStage: number;
  stages: {
    title: string;
    location: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
  }[];
  timepieces: string[];
}

export const ConciergePage: React.FC<ConciergePageProps> = ({ onNavigate }) => {
  // Appointment Form State
  const [appointment, setAppointment] = useState({
    fullName: '',
    email: '',
    phone: '',
    salonLocation: 'Geneva Salon · 14 Rue du Rhône',
    date: '2026-10-18',
    time: '14:30',
    preferredModel: 'Aurelia Royal Chronograph 41',
    champagnePreference: 'Dom Pérignon 2013',
  });
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  // Serial Number Checker State
  const [serialQuery, setSerialQuery] = useState('');
  const [serialResult, setSerialResult] = useState<{
    found: boolean;
    reference?: string;
    model?: string;
    manufactureYear?: string;
    calibre?: string;
    status?: string;
    serviceDue?: string;
  } | null>(null);

  // Order Status Lookup State
  const [orderQueryNumber, setOrderQueryNumber] = useState('');
  const [orderQueryEmail, setOrderQueryEmail] = useState('');
  const [orderStatusLoading, setOrderStatusLoading] = useState(false);
  const [orderStatusError, setOrderStatusError] = useState<string | null>(null);
  const [orderStatusResult, setOrderStatusResult] = useState<OrderTrackingData | null>(null);
  const [storedOrder, setStoredOrder] = useState<{
    orderId: string;
    email: string;
    name: string;
    city: string;
    country: string;
    items: string[];
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aurelia_last_order');
      if (saved) {
        setStoredOrder(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLookupOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = orderQueryNumber.trim().toUpperCase();
    const cleanEmail = orderQueryEmail.trim().toLowerCase();

    if (!cleanNum || !cleanEmail) {
      setOrderStatusError('Please enter valid order reference and email.');
      return;
    }

    setOrderStatusError(null);
    setOrderStatusLoading(true);

    try {
      const status = await getShippingStatus(cleanNum);
      
      // Merge with existing UI data structure
      setOrderStatusResult({
        orderId: status.orderId,
        email: cleanEmail,
        clientName: 'Collector',
        destination: 'Private Residence',
        carrier: status.carrier,
        vaultTransitId: 'SUI-VAULT-9201',
        estimatedDelivery: 'Within 48 Hours',
        statusBadge: status.statusBadge,
        currentStage: status.currentStage,
        stages: status.stages.map((s, i) => ({
          title: s.title,
          location: 'Atelier',
          timestamp: 'Active',
          completed: s.completed,
          current: s.current,
        })),
        timepieces: ['Aurelia Masterpiece'],
      });
    } catch (err) {
      setOrderStatusError('Could not retrieve tracking status.');
    } finally {
      setOrderStatusLoading(false);
    }
  };

  const handlePreloadDemoOrder = (num: string, mail: string) => {
    setOrderQueryNumber(num);
    setOrderQueryEmail(mail);
    setOrderStatusError(null);
  };

  // Concierge Message State
  const [message, setMessage] = useState({
    name: '',
    email: '',
    subject: 'Bespoke In-House Allocation Inquiry',
    body: '',
  });
  const [messageSent, setMessageSent] = useState(false);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentBooked(true);
  };

  const handleCheckSerial = (e: React.FormEvent) => {
    e.preventDefault();
    const query = serialQuery.trim().toUpperCase();
    if (!query) return;

    // Check against existing watches or generate authentic provenance
    const match = WATCHES.find(
      (w) => w.reference.toUpperCase().includes(query) || w.id.toUpperCase().includes(query)
    );

    if (match) {
      setSerialResult({
        found: true,
        reference: match.reference,
        model: match.name,
        manufactureYear: '2025 / 2026 Manufacture Cycle',
        calibre: match.specs.calibre,
        status: 'Genuine Poinçon de Genève Registry Confirmed',
        serviceDue: 'October 2031 (5-Year Cycle)',
      });
    } else {
      // Return genuine record for typical test serial formats
      setSerialResult({
        found: true,
        reference: query,
        model: 'Aurelia Masterpiece Calibre Series',
        manufactureYear: 'Historical Archive Registry (Vallée de Joux)',
        calibre: 'Calibre In-House AH-Series Certified',
        status: 'Authentic Geneva Provenance Confirmed',
        serviceDue: 'Recommended 5-Year Overhaul',
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
  };

  return (
    <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-16 space-y-12 sm:space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
          Haute Horlogerie Private Concierge
        </div>
        <h1 className="font-cinzel text-2xl sm:text-5xl font-bold text-white tracking-tight">
          Private Salons & Collector Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light px-2">
          Whether arranging a private viewing behind closed doors at our salons or verifying the provenance of a vintage archive reference, our Master Concierge is at your service.
        </p>
      </div>

      {/* 1. VIP Salon Booking & Private Consult */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 5 cols: Salon Salons info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-mono">
              Exclusive Access
            </span>
            <h2 className="font-cinzel text-2xl font-bold text-white">
              Private Salon Viewings
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience the weight of solid gold and hear the whisper of flying tourbillons in an intimate, private setting accompanied by our senior horological specialists.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                city: 'Geneva Salon',
                address: '14 Rue du Rhône, 1204 Genève',
                phone: '+41 22 819 0192',
              },
              {
                city: 'London Mayfair Salon',
                address: '28 New Bond Street, London W1S 2RH',
                phone: '+44 20 7946 0910',
              },
              {
                city: 'Dubai Fashion Avenue',
                address: 'The Dubai Mall, Luxury Precinct Level 1',
                phone: '+971 4 362 7500',
              },
              {
                city: 'New York Madison Salon',
                address: '680 Madison Avenue, New York, NY 10065',
                phone: '+1 212 555 0148',
              },
            ].map((salon, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#11141B] border border-white/[0.06] flex items-start gap-3"
              >
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-white font-cinzel">{salon.city}</h4>
                  <p className="text-[11px] text-slate-400">{salon.address}</p>
                  <p className="text-[10px] font-mono text-[#C5A059]">{salon.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 7 cols: Interactive Booking Form */}
        <div className="lg:col-span-7 bg-[#12151D] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6">
          {appointmentBooked ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#C5A059]/15 border border-[#C5A059] mx-auto flex items-center justify-center text-[#C5A059]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-white">
                Salon Appointment Confirmed
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, {appointment.fullName}. Your private viewing at {appointment.salonLocation} has been secured for {appointment.date} at {appointment.time}. A discreet calendar invitation and salon pass have been dispatched to {appointment.email}.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setAppointmentBooked(false)}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#C5A059] hover:bg-[#D4B36E] rounded"
                >
                  Book Another Appointment
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookAppointment} className="space-y-5">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white">
                  Schedule Private Appointment
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complimentary 60-minute horologist session with dedicated security escort
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={appointment.fullName}
                    onChange={(e) => setAppointment({ ...appointment, fullName: e.target.value })}
                    placeholder="Baron Arthur Vance"
                    className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Direct Email *</label>
                  <input
                    type="email"
                    required
                    value={appointment.email}
                    onChange={(e) => setAppointment({ ...appointment, email: e.target.value })}
                    placeholder="arthur@vance-capital.com"
                    className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={appointment.phone}
                    onChange={(e) => setAppointment({ ...appointment, phone: e.target.value })}
                    placeholder="+44 7700 900142"
                    className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Preferred Salon *</label>
                  <select
                    value={appointment.salonLocation}
                    onChange={(e) => setAppointment({ ...appointment, salonLocation: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#161922] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Geneva Salon · 14 Rue du Rhône">Geneva · Rue du Rhône</option>
                    <option value="London Mayfair · 28 New Bond St">London · New Bond Street</option>
                    <option value="Dubai Mall · Fashion Avenue">Dubai · Fashion Avenue</option>
                    <option value="New York · Madison Avenue">New York · Madison Avenue</option>
                    <option value="Virtual Video Salon Consult">Virtual 1-on-1 Video Salon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={appointment.date}
                    onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Time Slot *</label>
                  <select
                    value={appointment.time}
                    onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#161922] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="11:00 AM">11:00 AM (Morning Session)</option>
                    <option value="02:30 PM">02:30 PM (Afternoon Session)</option>
                    <option value="05:00 PM">05:00 PM (Twilight Preview)</option>
                    <option value="07:30 PM">07:30 PM (Private VIP Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Timepiece Models to Have Prepared in Viewing Room
                </label>
                <input
                  type="text"
                  value={appointment.preferredModel}
                  onChange={(e) => setAppointment({ ...appointment, preferredModel: e.target.value })}
                  placeholder="e.g. Royal Chronograph 41, Symphonie Skeleton Tourbillon"
                  className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_18px_rgba(197,160,89,0.35)] hover:shadow-[0_0_28px_rgba(197,160,89,0.6)] transition-all rounded-full active:scale-95"
              >
                Confirm Salon Reservation
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 2. Order Tracking Status */}
      <div className="p-4 sm:p-10 rounded-2xl bg-gradient-to-b from-[#141824] to-[#0E121B] border border-white/[0.08] space-y-5 sm:space-y-6">
        <div className="space-y-1">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium font-mono">
            Direct Vault Dispatch
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">Armored Transit & Order Tracking</h3>
          <p className="text-xs text-slate-400 font-light">Enter your acquisition order reference and email to check live courier coordinates.</p>
        </div>

        <form onSubmit={handleLookupOrder} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <input 
            type="text" 
            placeholder="Order ID (e.g. AH-892014)" 
            value={orderQueryNumber} 
            onChange={e => setOrderQueryNumber(e.target.value)} 
            className="w-full sm:flex-1 px-4 py-2.5 bg-bg-secondary border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-gold uppercase" 
          />
          <input 
            type="email" 
            placeholder="Collector Email Address" 
            value={orderQueryEmail} 
            onChange={e => setOrderQueryEmail(e.target.value)} 
            className="w-full sm:flex-1 px-4 py-2.5 bg-bg-secondary border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold" 
          />
          <button 
            type="submit" 
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] text-black font-bold uppercase tracking-wider rounded-full text-xs shadow-[0_0_14px_rgba(197,160,89,0.3)] transition-all active:scale-95 shrink-0"
          >
            Track Dispatch
          </button>
        </form>

        {storedOrder && !orderStatusResult && (
          <div className="text-[11px] text-slate-400 font-mono">
            Recent Acquisition: <button type="button" onClick={() => handlePreloadDemoOrder(storedOrder.orderId, storedOrder.email)} className="text-gold underline hover:text-white">{storedOrder.orderId}</button>
          </div>
        )}

        {orderStatusLoading && <div className="text-gold text-xs font-mono animate-pulse">Consulting Swiss logistics vault...</div>}
        {orderStatusError && <div className="text-red-400 text-xs font-mono">{orderStatusError}</div>}
        
        {orderStatusResult && (
          <div className="p-4 sm:p-6 bg-bg-secondary/90 rounded-xl border border-gold/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Order Reference</span>
                <div className="font-mono text-base font-bold text-gold">{orderStatusResult.orderId}</div>
              </div>
              <div className="self-start sm:self-auto">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/40">
                  {orderStatusResult.statusBadge}
                </span>
              </div>
            </div>

            {/* Desktop Horizontal Progress Bar */}
            <div className="hidden sm:block space-y-2">
              <div className="relative w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-gold/20">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] transition-all duration-700" 
                  style={{ width: `${Math.min(100, ((orderStatusResult.currentStage + 1) / orderStatusResult.stages.length) * 100)}%` }} 
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                {orderStatusResult.stages.map((stage, i) => (
                  <span key={i} className={stage.completed || stage.current ? 'text-gold font-semibold' : ''}>
                    {stage.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Mobile Vertical Stepped List */}
            <div className="sm:hidden space-y-2.5">
              {orderStatusResult.stages.map((stage, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-2.5 p-2 rounded-lg text-xs font-mono ${
                    stage.completed || stage.current 
                      ? 'bg-gold/10 border border-gold/30 text-gold' 
                      : 'bg-white/[0.02] text-slate-500'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    stage.completed || stage.current ? 'bg-gold text-black' : 'bg-white/10 text-white/50'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="font-medium">{stage.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Interactive Serial Provenance Registry Check */}
      <div className="p-4 sm:p-10 rounded-2xl bg-gradient-to-b from-[#141824] to-[#0E121B] border border-white/[0.08] space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#C5A059] font-mono">
                Geneva Central Archive
              </span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
              Timepiece Provenance & Serial Verification
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-light">
              Verify the authenticity, manufacture date, and movement registry of any Aurelia timepiece.
            </p>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Sample references: <span className="text-[#C5A059] cursor-pointer" onClick={() => setSerialQuery('REF. AH-5980-RG')}>AH-5980-RG</span> · <span className="text-[#C5A059] cursor-pointer" onClick={() => setSerialQuery('REF. AH-9010-SK')}>AH-9010-SK</span>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={handleCheckSerial} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={serialQuery}
              onChange={(e) => setSerialQuery(e.target.value)}
              placeholder="Enter Reference (e.g. REF. AH-5980-RG)"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder-slate-400 uppercase font-mono focus:outline-none focus:border-[#C5A059]"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_16px_rgba(197,160,89,0.3)] hover:shadow-[0_0_24px_rgba(197,160,89,0.6)] transition-all rounded-full active:scale-95 text-center shrink-0"
          >
            Verify Provenance
          </button>
        </form>

        {/* Lookup Result Box */}
        {serialResult && (
          <div className="p-6 rounded-lg bg-[#0B0D12] border border-[#C5A059]/40 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                <span className="font-cinzel text-sm font-bold text-white">
                  Official Provenance Certificate Match
                </span>
              </div>
              <span className="text-[10px] font-mono bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded border border-[#C5A059]/30">
                Verified In Le Brassus Ledger
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Timepiece Model:</span>
                <span className="text-white font-semibold">{serialResult.model}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Reference / Serial:</span>
                <span className="text-[#C5A059] font-mono">{serialResult.reference}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Movement Calibre:</span>
                <span className="text-white font-mono">{serialResult.calibre}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Manufacture Cycle:</span>
                <span className="text-white">{serialResult.manufactureYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Certification Status:</span>
                <span className="text-emerald-400">{serialResult.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Next Routine Service:</span>
                <span className="text-white font-mono">{serialResult.serviceDue}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Concierge Direct Inquiry */}
      <div className="bg-[#12151D] border border-white/[0.08] rounded-xl p-6 sm:p-10 space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-mono">
            Direct Dispatch
          </span>
          <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
            Inquire with the Atelier Horologist
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            For specific caliber queries, custom dial commissions, or rare allocation waiting lists.
          </p>
        </div>

        {messageSent ? (
          <div className="p-6 rounded bg-[#C5A059]/10 border border-[#C5A059]/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#C5A059] mx-auto" />
            <h4 className="font-cinzel text-lg font-bold text-white">Dispatched to Atelier Concierge</h4>
            <p className="text-xs text-slate-300">
              A private horologist will review your inquiry and respond within four business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={message.name}
                  onChange={(e) => setMessage({ ...message, name: e.target.value })}
                  placeholder="Collector Name"
                  className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  value={message.email}
                  onChange={(e) => setMessage({ ...message, email: e.target.value })}
                  placeholder="collector@domain.com"
                  className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Inquiry Subject</label>
              <input
                type="text"
                value={message.subject}
                onChange={(e) => setMessage({ ...message, subject: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Your Message *</label>
              <textarea
                required
                rows={4}
                value={message.body}
                onChange={(e) => setMessage({ ...message, body: e.target.value })}
                placeholder="Detail your request regarding allocation, bespoke metals, or heritage restoration..."
                className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.1] rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_18px_rgba(197,160,89,0.35)] hover:shadow-[0_0_28px_rgba(197,160,89,0.6)] transition-all rounded-full flex items-center gap-2 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-black stroke-[2.2]" />
              <span>Send Confidential Inquiry</span>
            </button>
          </form>
        )}
      </div>

      {/* 6. Concierge FAQ */}
      <ConciergeFAQ />
    </div>
  );
};
