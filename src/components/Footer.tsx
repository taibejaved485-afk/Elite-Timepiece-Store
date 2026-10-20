import React, { useState } from 'react';
import { PageRoute } from '../types/watch';
import { Check, X } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onReplayPreloader?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onReplayPreloader }) => {
  // Newsletter form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Policy modal states
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'cert' | null>(null);

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
    <footer className="w-full bg-white text-slate-800 border-t border-slate-200 font-sans">
      {/* Full-width container across all desktop and ultrawide viewports */}
      <div className="w-full px-5 sm:px-10 md:px-14 lg:px-16 xl:px-24 2xl:px-32 pt-16 pb-12">
        {/* Main 4-Column Grid with generous spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-10 xl:gap-16 2xl:gap-24 items-start">
          
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
                  onClick={() => handleNav('concierge')}
                  className="hover:text-[#9A7B38] hover:font-medium transition-colors text-left"
                >
                  Track Armored Delivery
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
                  onClick={() => setActiveModal('cert')}
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
                <div className="grid grid-cols-2 gap-3">
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
                <div className="grid grid-cols-2 gap-3">
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
        <hr className="border-slate-200 mt-14 mb-8" />

        {/* Centered Copyright Note with Quick Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Aurelia Horology. All Rights Reserved. Swiss Manufacture Vallée de Joux.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-[#9A7B38] transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-[#9A7B38] transition-colors"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveModal('cert')}
              className="hover:text-[#9A7B38] transition-colors"
            >
              Provenance Registry
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

      {/* Interactive Information Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-800 border border-slate-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-900 font-serif">Privacy Policy</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Aurelia Horology adheres to strict Swiss banking-grade data privacy standards. All collector credentials, provenance records, and private commission inquiries are protected by 256-bit AES encryption.
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-[#9A7B38] font-medium">
                  No patron data is ever sold or transferred to third-party marketing entities.
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-900 font-serif">Terms of Service</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every Aurelia Horology timepiece is covered by our lifetime guarantee of authenticity and 5-year international mechanical warranty, registered in the Le Brassus central archives.
                </p>
                <ul className="text-xs text-slate-600 list-disc pl-5 space-y-1">
                  <li>Global insured door-to-door courier delivery.</li>
                  <li>Complimentary movement regulation within the first 24 months.</li>
                  <li>Serial certificate authenticated by the Master Watchmaker.</li>
                </ul>
              </div>
            )}

            {activeModal === 'cert' && (
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-900 font-serif">Digital Provenance Registry</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every mechanical timepiece forged in our atelier is accompanied by an immutable digital passport verifying its calibre number, assembly date, and hand-finishing master watchmaker.
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-[#9A7B38] font-semibold">
                  Official Swiss Horological Certification: COSC & Chronofiable® Certified.
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-2.5 bg-gradient-to-r from-[#C5A059] to-[#9A7B38] hover:from-[#B89243] hover:to-[#856525] text-slate-950 rounded-lg text-sm font-bold transition-all shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
