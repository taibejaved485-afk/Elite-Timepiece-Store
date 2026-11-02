import React, { useState } from 'react';
import { PageRoute } from '../types/watch';
import { Check, X, Clock, Shield, Globe, HelpCircle, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onReplayPreloader?: () => void;
  onOpenTrackOrder?: () => void;
}

interface FooterFAQItem {
  id: string;
  question: string;
  topic: string;
  icon: React.ElementType;
  badge: string;
  answer: string;
  keyHighlight: string;
}

const FOOTER_FAQ_ITEMS: FooterFAQItem[] = [
  {
    id: 'servicing',
    question: 'How frequently does an Aurelia mechanical calibre require servicing?',
    topic: 'Watch Servicing & Care',
    icon: Clock,
    badge: '3-5 Year Interval',
    answer: 'We recommend a complete manufacture overhaul every 3 to 5 years at an authorized Swiss service center. In our Le Brassus atelier, master horologists completely dismantle each calibre, ultrasonically cleanse all components, renew worn escapement components with genuine manufacture parts, apply proprietary synthetic micro-lubricants, and recalibrate precision to COSC chronometer tolerances (-4/+6 seconds per day).',
    keyHighlight: 'Includes complete ultrasonic bath, fresh water-resistance seals, and rate recalibration.'
  },
  {
    id: 'warranty',
    question: 'What protections are covered under the 5-Year International Warranty?',
    topic: 'International Warranty',
    icon: Shield,
    badge: '5-Year Guarantee',
    answer: 'Every Aurelia timepiece carries an irrevocable 5-year international master warranty against mechanical flaws and chronometric drift. All timepieces are cryptographically registered in the official Geneva Seal archive and include complimentary demagnetization, rate regulation, gasket refresh, and insured transportation to and from our Swiss atelier.',
    keyHighlight: 'Covers all mechanical movements, Geneva Seal archival registration, and global service.'
  },
  {
    id: 'shipping',
    question: 'How does international armored courier shipping and transit insurance operate?',
    topic: 'International Shipping & Transit',
    icon: Globe,
    badge: 'Worldwide Insured',
    answer: 'All outbound timepieces from our Le Brassus vault travel exclusively via dedicated high-security armored logistics (Ferrari Group / Malca-Amit). Every consignment is 100% insured underwritten by Lloyd’s of London for its full replacement value, featuring Delivered Duty Paid (DDP) customs pre-clearance and biometric photo ID signature handoff.',
    keyHighlight: '100% insured by Lloyd’s of London, discrete unbranded packaging, and white-glove handoff.'
  }
];

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onReplayPreloader,
  onOpenTrackOrder,
}) => {
  // Newsletter form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Left-to-right mobile FAQ scroll & index state
  const faqScrollRef = React.useRef<HTMLDivElement>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  const scrollFaq = (direction: 'left' | 'right') => {
    if (!faqScrollRef.current) return;
    const scrollAmount = faqScrollRef.current.clientWidth * 0.85;
    faqScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleFaqScroll = () => {
    if (!faqScrollRef.current) return;
    const { scrollLeft, clientWidth } = faqScrollRef.current;
    if (clientWidth === 0) return;
    const index = Math.round(scrollLeft / (clientWidth * 0.82));
    setActiveFaqIndex(Math.min(Math.max(index, 0), FOOTER_FAQ_ITEMS.length - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setTimeout(() => {
        setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      }, 4000);
    }, 600);
  };

  const handleNav = (page: PageRoute) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-section" className="w-full bg-white text-slate-800 border-t border-slate-200 font-sans">
      {/* Frequently Asked Questions Section inside Footer */}
      <section 
        id="footer-faq" 
        aria-label="Frequently Asked Questions"
        className="w-full border-b border-slate-200 bg-[#FAF9F5]"
      >
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-10 sm:py-16">
          {/* Header Row: Left-to-Right orientation */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#9A7B38] font-bold">
                <HelpCircle className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>Haute Horlogerie Client Advisory</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-light max-w-xl">
                Authoritative guidance on manufacture calibre care, international warranty protection, and insured global delivery.
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0">
              {/* Mobile Left-to-Right Navigation Arrows & Indicator Dots */}
              <div className="flex md:hidden items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollFaq('left')}
                  disabled={activeFaqIndex === 0}
                  aria-label="Previous question"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 px-1">
                  {FOOTER_FAQ_ITEMS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeFaqIndex === i ? 'w-4 bg-[#9A7B38]' : 'w-1.5 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => scrollFaq('right')}
                  disabled={activeFaqIndex === FOOTER_FAQ_ITEMS.length - 1}
                  aria-label="Next question"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleNav('concierge')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9A7B38] hover:text-slate-900 transition-colors cursor-pointer shrink-0"
              >
                <span>Salon Concierge Support</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Left-to-Right Cards: Horizontal Swipeable on Mobile, 3-Column Grid on Desktop */}
          <div 
            ref={faqScrollRef}
            onScroll={handleFaqScroll}
            className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 overflow-x-auto md:overflow-visible scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {FOOTER_FAQ_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="w-[84vw] sm:w-[320px] md:w-auto shrink-0 snap-center md:shrink bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-[#9A7B38]/60 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    {/* Header with Minimalist Luxury Icon, Topic & Question in Left-to-Right Layout */}
                    <div className="flex items-start gap-3">
                      {/* Elegant Minimalist Luxury Icon */}
                      <div className="w-9 h-9 rounded-lg bg-[#FAF7F0] border border-[#E9DEC6] text-[#9A7B38] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-black group-hover:border-[#C5A059] transition-all duration-300">
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B38] font-bold">
                            {item.topic}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                            {item.badge}
                          </span>
                        </div>
                        <h4 className="font-serif text-sm sm:text-[15px] font-bold text-slate-900 group-hover:text-[#9A7B38] transition-colors leading-snug">
                          {item.question}
                        </h4>
                      </div>
                    </div>

                    {/* Answer text - Left to right full width without restrictive left indentation */}
                    <p className="text-xs sm:text-[13px] text-slate-600 font-light leading-relaxed pt-1">
                      {item.answer}
                    </p>
                  </div>

                  {/* Key Takeaway Tag */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38] mt-1.5 shrink-0" />
                    <span className="font-light italic">{item.keyHighlight}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Swipe Left-to-Right Indicator Bar at the bottom */}
          <div className="flex md:hidden items-center justify-between pt-4 text-[11px] text-slate-500">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#9A7B38]">
              Card {activeFaqIndex + 1} of {FOOTER_FAQ_ITEMS.length}
            </span>
            <span className="text-slate-400 text-[10px]">Swipe left to right →</span>
          </div>
        </div>
      </section>

      {/* Responsive container across all viewports */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 pt-12 sm:pt-16 pb-12">
        {/* Main 4-Column Grid with responsive spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-16 2xl:gap-24 items-start">
          
          {/* Column 1: Brand Logo, Description, Socials, App Badges (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Brand Logo & Wordmark in Aurelia's signature Gold & Obsidian */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-3.5 text-left group focus:outline-none"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F121C] via-[#0A0D14] to-black border border-[#C5A059]/60 flex items-center justify-center text-[#C5A059] shadow-md shadow-[#C5A059]/15 group-hover:border-[#C5A059] group-hover:scale-105 transition-all duration-300">
                {/* Watch Escapement Crest */}
                <svg viewBox="0 0 40 40" className="w-7 h-7 text-[#C5A059]" fill="none" stroke="currentColor">
                  <circle cx="20" cy="20" r="16" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
                  <circle cx="20" cy="20" r="12" strokeWidth="1.5" />
                  <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.9" />
                  <path d="M20 4V9M20 31V36M4 20H9M31 20H36" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8.7 8.7L12.2 12.2M27.8 27.8L31.3 31.3M8.7 31.3L12.2 27.8M27.8 12.2L31.3 8.7" strokeWidth="1" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.25em] text-xl font-bold text-slate-900 group-hover:text-[#9A7B38] transition-colors">
                  AURELIA
                </span>
                <span className="text-[9.5px] tracking-[0.35em] uppercase text-[#9A7B38] font-bold">
                  HAUTE HORLOGERIE · 1892
                </span>
              </div>
            </button>

            {/* Atelier / Brand Mission Description */}
            <p className="text-slate-600 text-[14.5px] leading-relaxed max-w-xl">
              We&apos;re an independent Swiss Haute Horology atelier committed to making extraordinary mechanical artistry accessible to discerning collectors. We offer master-crafted calibres and bespoke horological commissions to help patrons celebrate milestones and personal legacy. Join Aurelia Horology today and experience horological perfection.
            </p>

            {/* Circular Social Media Icons in Aurelia Brand Gold Accent */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#FAF7F0] text-[#9A7B38] border border-[#E9DEC6] flex items-center justify-center hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-10 h-10 rounded-full bg-[#FAF7F0] text-[#9A7B38] border border-[#E9DEC6] flex items-center justify-center hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-[#FAF7F0] text-[#9A7B38] border border-[#E9DEC6] flex items-center justify-center hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[#FAF7F0] text-[#9A7B38] border border-[#E9DEC6] flex items-center justify-center hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-[#FAF7F0] text-[#9A7B38] border border-[#E9DEC6] flex items-center justify-center hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full bg-[#FAF7F0] text-[#9A7B38] border border-[#E9DEC6] flex items-center justify-center hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.04 3.25-1.57 3.25-3.38.01-6.24.01-12.48.01-18.72z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Real Website Pages) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-3 text-[14.5px] text-slate-600">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Atelier Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('collections')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Haute Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('craftsmanship')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Master Craftsmanship
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('heritage')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Manufacture Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('concierge')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Atelier Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources (Real Website Features & Services) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Resources
            </h3>
            <ul className="space-y-3 text-[14.5px] text-slate-600">
              <li>
                <button
                  onClick={() => handleNav('concierge')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Concierge FAQ & Care
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrackOrder ? onOpenTrackOrder : () => handleNav('concierge')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Track Armored Delivery</span>
                  <span className="px-1.5 py-0.5 bg-gold/15 text-[#9A7B38] rounded text-[10px] font-mono font-semibold">Live</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('heritage')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Historical Milestones
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('concierge')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Geneva Salons Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('provenance')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Geneva Seal Certificate
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Subscribe to Our Newsletter (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-slate-600 text-[14px] leading-relaxed">
              Get the latest updates on new timepiece releases, private allocations, and bespoke commissions.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center gap-3 animate-fade-in shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#C5A059] text-black font-bold flex items-center justify-center shrink-0 shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Subscribed Successfully!</p>
                  <p className="text-xs text-slate-600">You will receive our latest horological releases.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1">
                      First Name<span className="text-slate-700">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1">
                      Last Name<span className="text-slate-700">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Email Address & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1">
                      Email Address<span className="text-slate-700">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1">
                      Phone Number<span className="text-slate-700">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all"
                    />
                  </div>
                </div>

                {/* Subscribe Button (Aurelia's Signature Swiss Gold button) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-6 bg-gradient-to-r from-[#C5A059] via-[#D8B66C] to-[#9A7B38] hover:from-[#B89243] hover:to-[#856525] active:from-[#856525] text-slate-950 font-bold text-base rounded-lg transition-all duration-300 shadow-md hover:shadow-lg shadow-[#C5A059]/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A059]"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Full-width Divider Line */}
        <hr className="border-slate-200 mt-10 sm:mt-14 mb-6 sm:mb-8" />

        {/* Centered Copyright Note with Quick Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© 2026 Aurelia Horology. All Rights Reserved. Swiss Manufacture Vallée de Joux.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2">
            <button
              onClick={() => {
                onNavigate('privacy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#9A7B38] transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => {
                onNavigate('terms');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#9A7B38] transition-colors"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              onClick={() => {
                onNavigate('provenance');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#9A7B38] transition-colors"
            >
              Provenance Registry
            </button>
            {onOpenTrackOrder && (
              <>
                <span>·</span>
                <button
                  onClick={onOpenTrackOrder}
                  className="hover:text-[#9A7B38] text-slate-700 font-semibold transition-colors cursor-pointer"
                  title="Track Your Armored Timepiece Consignment"
                >
                  Track Order
                </button>
              </>
            )}
            <span>·</span>
            <button
              onClick={() => {
                onNavigate('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#9A7B38] text-slate-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              title="Maison Atelier Admin Control Panel"
            >
              <span>Atelier Admin</span>
            </button>
            {onReplayPreloader && (
              <>
                <span>·</span>
                <button
                  onClick={onReplayPreloader}
                  className="hover:text-[#9A7B38] text-slate-600 transition-colors flex items-center gap-1 font-medium group cursor-pointer"
                  title="Replay Swiss Horology Winding Preloader"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] group-hover:scale-125 transition-transform" />
                  <span>Replay Watch Preloader</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
