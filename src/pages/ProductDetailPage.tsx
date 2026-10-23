import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Shield, Compass, Sparkles, Heart, ShoppingBag, Share2, Check, Printer } from 'lucide-react';
import { Watch, CurrencyCode, PageRoute } from '../types/watch';
import { formatPrice } from '../utils/currency';
import { AnimatedPrice } from '../components/AnimatedPrice';
import { handleImageFallback } from '../utils/imageFallback';

interface ProductDetailPageProps {
  watch: Watch;
  onNavigate: (page: PageRoute) => void;
  currency: CurrencyCode;
  onAddToCart: (watch: Watch, quantity: number, selectedStrap?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (watch: Watch) => void;
  allWatches: Watch[];
  onSelectWatch: (watch: Watch) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  watch,
  onNavigate,
  currency,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  allWatches,
  onSelectWatch,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(watch.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedStrap, setSelectedStrap] = useState<string>('Alligator Leather - Noir');
  const [activeTab, setActiveTab] = useState<'specs' | 'movement' | 'provenance'>('specs');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAdd = () => {
    onAddToCart(watch, quantity, selectedStrap);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 py-8 sm:py-16 px-4 sm:px-8 lg:px-16 xl:px-24">
      {/* Top Back & Navigation Bar */}
      <div className="w-full mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => onNavigate('collections')}
          className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9A7B38] hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Haute Collections</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-[#9A7B38] hover:border-[#9A7B38] transition-colors"
            title="Share timepiece page"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-[#9A7B38] hover:border-[#9A7B38] transition-colors hidden sm:flex"
            title="Print certificate & specs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Main Product Hero Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-2xl group">
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={selectedImage}
              alt={watch.name}
              onError={handleImageFallback}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {watch.isLimitedEdition && (
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-[#C5A059]/40 px-3 py-1 rounded text-[11px] font-mono text-[#C5A059] uppercase tracking-widest shadow-lg">
                Limited Run of {watch.editionLimit} Pcs
              </div>
            )}
            <button
              onClick={() => onToggleWishlist(watch)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-lg ${
                isWishlisted
                  ? 'bg-[#C5A059] text-white'
                  : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {watch.gallery && watch.gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {watch.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-20 rounded-xl border-2 overflow-hidden transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-[#9A7B38] ring-2 ring-[#9A7B38]/30 shadow-md scale-105'
                      : 'border-slate-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" onError={handleImageFallback} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <Clock className="w-5 h-5 mx-auto text-[#9A7B38] mb-1.5" />
              <span className="font-semibold block text-slate-900">{watch.specs.powerReserve}</span>
              <span className="text-[10px] text-slate-500">Power Reserve</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <Shield className="w-5 h-5 mx-auto text-[#9A7B38] mb-1.5" />
              <span className="font-semibold block text-slate-900">5-Year Warranty</span>
              <span className="text-[10px] text-slate-500">COSC Certified</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <Compass className="w-5 h-5 mx-auto text-[#9A7B38] mb-1.5" />
              <span className="font-semibold block text-slate-900">{watch.specs.waterResistance}</span>
              <span className="text-[10px] text-slate-500">Water Resistance</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details, Pricing, Checkout & Tabs (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold tracking-wider text-[#9A7B38] uppercase">
                {watch.reference}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                {watch.collection} Collection
              </span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {watch.name}
            </h1>

            <p className="text-sm text-[#9A7B38] font-medium tracking-wide">
              {watch.tagline}
            </p>

            <div className="pt-2 flex items-baseline gap-4">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 tabular-nums">
                <AnimatedPrice amountUSD={watch.priceUSD} currency={currency} duration={1500} replayOnHover={true} />
              </span>
              <span className="text-xs text-slate-500">
                Includes taxes & insured armored courier delivery
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-light">
            {watch.description}
          </p>

          {/* Strap Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
              Strap Configuration: <span className="text-[#9A7B38] font-normal">{selectedStrap}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Alligator Leather - Noir', 'Tuscan Suede - Cognac', 'Grade 5 Titanium Bracelet', 'Oystersteel 904L Link'].map((strap) => (
                <button
                  key={strap}
                  onClick={() => setSelectedStrap(strap)}
                  className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                    selectedStrap === strap
                      ? 'border-[#9A7B38] bg-[#FAF7F0] text-slate-900 shadow-sm ring-1 ring-[#9A7B38]/30'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {strap}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart Action */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-slate-600 hover:bg-slate-200 transition-colors text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-mono font-bold text-slate-900 tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-slate-600 hover:bg-slate-200 transition-colors text-sm font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-xl hover:shadow-[0_0_25px_rgba(197,160,89,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5 text-black" />
                    <span>Secured to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-black" />
                    <span>Acquire Timepiece</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Technical Tabs (Specs, Movement, Story) */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex border-b border-slate-200">
              {[
                { id: 'specs', label: 'Technical Specifications' },
                { id: 'movement', label: 'Manufacture Movement' },
                { id: 'provenance', label: 'Provenance & History' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-[#9A7B38] border-b-2 border-[#9A7B38]'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 leading-relaxed">
              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-slate-400 font-mono">Case Diameter:</span> <strong className="text-slate-900">{watch.specs.caseDiameter}</strong></div>
                  <div><span className="text-slate-400 font-mono">Case Thickness:</span> <strong className="text-slate-900">{watch.specs.caseThickness}</strong></div>
                  <div><span className="text-slate-400 font-mono">Case Material:</span> <strong className="text-slate-900">{watch.specs.caseMaterial}</strong></div>
                  <div><span className="text-slate-400 font-mono">Dial Color:</span> <strong className="text-slate-900">{watch.specs.dialColor}</strong></div>
                  <div><span className="text-slate-400 font-mono">Crystal:</span> <strong className="text-slate-900">{watch.specs.crystal}</strong></div>
                  <div><span className="text-slate-400 font-mono">Water Resistance:</span> <strong className="text-slate-900">{watch.specs.waterResistance}</strong></div>
                </div>
              )}

              {activeTab === 'movement' && (
                <div className="space-y-2">
                  <div><span className="text-slate-400 font-mono">Calibre:</span> <strong className="text-slate-900">{watch.specs.calibre}</strong> ({watch.specs.movement})</div>
                  <div><span className="text-slate-400 font-mono">Frequency:</span> <strong className="text-slate-900">{watch.specs.frequency}</strong></div>
                  <div><span className="text-slate-400 font-mono">Jewels:</span> <strong className="text-slate-900">{watch.specs.jewels} rubies</strong></div>
                  <p className="text-slate-600 pt-1">
                    Hand-assembled and adjusted in six positions in Le Brassus, featuring free-sprung balance and variable inertia screws.
                  </p>
                </div>
              )}

              {activeTab === 'provenance' && (
                <div className="space-y-2">
                  <p className="text-slate-600">
                    Each Aurelia timepiece is accompanied by a physical Geneva Seal (Poinçon de Genève) certificate, personally signed by the master horologist who assembled the escapement.
                  </p>
                  <p className="text-slate-600">
                    Registered in the Manufacture Archives in Le Brassus, Switzerland since 1892.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related / Similar Masterpieces Section */}
      <div className="w-full mt-24 pt-16 border-t border-slate-200 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#9A7B38] font-semibold">Complementary Creations</div>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Other Masterpieces in Collection</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {allWatches
            .filter((w) => w.id !== watch.id)
            .slice(0, 3)
            .map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectWatch(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden group hover:border-[#9A7B38] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-slate-950 overflow-hidden relative">
                  <img src={item.image} alt={item.name} onError={handleImageFallback} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span className="font-mono text-[#9A7B38] font-semibold">{item.reference}</span>
                    <span className="font-mono font-bold text-slate-900">
                      <AnimatedPrice amountUSD={item.priceUSD} currency={currency} replayOnHover={true} />
                    </span>
                  </div>
                  <h4 className="font-cinzel text-base font-bold text-slate-900 group-hover:text-[#9A7B38] transition-colors">{item.name}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1">{item.tagline}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
