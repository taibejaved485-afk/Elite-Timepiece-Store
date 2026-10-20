import React, { useState } from 'react';
import { Mail, Check, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValidEmail = (val: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    return emailRegex.test(val.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setErrorMessage('Please provide an email address.');
      return;
    }

    if (!isValidEmail(trimmed)) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    setErrorMessage(null);
    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
    }, 700);
  };

  const handleReset = () => {
    setEmail('');
    setStatus('idle');
    setErrorMessage(null);
  };

  return (
    <div className="space-y-4 p-6 rounded-2xl bg-[#0A0E17] border border-gold/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
      {/* Decorative ambient gold glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-1.5 relative z-10">
        <div className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-[0.3em] font-semibold">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>The Horological Gazette</span>
        </div>
        <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-white font-cinzel">
          Privilege Dispatch
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-light">
          Receive confidential dispatches on limited-edition allocations, novelties, and private atelier salon invitations.
        </p>
      </div>

      {status === 'success' ? (
        <div className="p-4 rounded-xl bg-gold/15 border border-gold/40 text-slate-200 space-y-2 relative z-10 animate-in fade-in duration-300 shadow-inner">
          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider">
            <Check className="w-4 h-4 shrink-0" />
            <span>Privilege Access Confirmed</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Welcome to the Aurelia Circle. A confidential welcome dispatch has been sent to <span className="text-white font-mono">{email}</span>.
          </p>
          <button
            onClick={handleReset}
            className="text-[10px] text-gold hover:text-white transition-colors underline pt-1 block cursor-pointer"
          >
            Register another recipient
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-3 relative z-10">
          <div className="space-y-1.5">
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gold/70 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                id="footer-newsletter-email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your email address..."
                aria-label="Email address for newsletter"
                aria-invalid={!!errorMessage}
                aria-describedby={errorMessage ? 'newsletter-error' : undefined}
                disabled={status === 'loading'}
                className={`w-full pl-10 pr-3.5 py-3 text-xs bg-[#05070C] rounded-xl text-white placeholder-stone-500 transition-all focus:outline-none shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)] ${
                  errorMessage
                    ? 'border border-red-500/80 focus:ring-2 focus:ring-red-400/30'
                    : 'border border-gold/30 hover:border-gold/60 focus:border-gold focus:ring-2 focus:ring-gold/30 shadow-[0_0_15px_rgba(197,160,89,0.15)]'
                }`}
              />
            </div>

            {errorMessage && (
              <div
                id="newsletter-error"
                role="alert"
                className="flex items-center gap-1.5 text-[11px] text-red-400 px-0.5 pt-0.5 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 px-4 text-xs font-bold uppercase tracking-[0.2em] text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] active:scale-[0.99] transition-all rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.35)] hover:shadow-[0_0_25px_rgba(197,160,89,0.6)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group focus:outline-none"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Enrolling...</span>
              </>
            ) : (
              <>
                <span>Subscribe to Gazette</span>
                <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
            <span>Strictly confidential</span>
            <span>Unsubscribe anytime</span>
          </p>
        </form>
      )}
    </div>
  );
};
