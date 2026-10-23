import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Check, Sparkles, Shield, RefreshCw, 
  Search, Eye, ArrowLeft, SlidersHorizontal, Image as ImageIcon,
  DollarSign, Package, Award, Clock, AlertTriangle, Layers
} from 'lucide-react';
import { Watch, CurrencyCode } from '../types/watch';
import { formatPrice } from '../utils/currency';
import { AnimatedPrice } from '../components/AnimatedPrice';

interface AdminPageProps {
  watches: Watch[];
  currency: CurrencyCode;
  onAddWatch: (watch: Watch) => void;
  onUpdateWatch: (watch: Watch) => void;
  onDeleteWatch: (watchId: string) => void;
  onResetCatalog: () => void;
  onNavigate: (route: any) => void;
  onViewWatch: (watch: Watch) => void;
}

const PRESET_IMAGES = [
  { label: 'Royal Chronograph', url: '/assets/images/hero_luxury_chronograph_1791612522214.jpg' },
  { label: 'Abyss Diver Titanium', url: '/assets/images/watch_diver_submariner_1791612540699.jpg' },
  { label: 'Symphonie Skeleton', url: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg' },
  { label: 'Patrimoine Minimalist', url: '/assets/images/watch_dress_minimalist_1791612572332.jpg' },
];

const INITIAL_FORM_STATE: Omit<Watch, 'id'> = {
  reference: 'REF. AH-2026-SP',
  name: '',
  collection: 'Chronograph',
  tagline: '',
  description: '',
  priceUSD: 35000,
  image: '/assets/images/hero_luxury_chronograph_1791612522214.jpg',
  gallery: ['/assets/images/hero_luxury_chronograph_1791612522214.jpg'],
  specs: {
    caseDiameter: '41 mm',
    caseThickness: '11.5 mm',
    caseMaterial: '18k Rose Gold 4N',
    bezelMaterial: 'Mirror-Polished 18k Rose Gold',
    dialColor: 'Sunburst Royal Blue',
    crystal: 'Anti-Reflective Sapphire Crystal',
    waterResistance: '100 meters / 10 bar',
    movement: 'In-House Automatic Chronometer',
    calibre: 'Calibre AH-850 Manufacture',
    powerReserve: '65 hours',
    frequency: '28,800 vph (4 Hz)',
    jewels: 35,
    strap: 'Hand-Stitched Mississippi Alligator',
  },
  isFeatured: true,
  isNewRelease: true,
  isLimitedEdition: false,
  editionLimit: 25,
  inStock: true,
  stockCount: 3,
};

export const AdminPage: React.FC<AdminPageProps> = ({
  watches,
  currency,
  onAddWatch,
  onUpdateWatch,
  onDeleteWatch,
  onResetCatalog,
  onNavigate,
  onViewWatch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWatchId, setEditingWatchId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Watch, 'id'>>(INITIAL_FORM_STATE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter watches
  const filteredWatches = watches.filter((w) => {
    const matchesCollection = selectedCollection === 'all' || w.collection === selectedCollection;
    const matchesQuery = 
      searchQuery.trim() === '' ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.specs.calibre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCollection && matchesQuery;
  });

  // Calculate statistics
  const totalValuation = watches.reduce((acc, w) => acc + (w.priceUSD * w.stockCount), 0);
  const totalStock = watches.reduce((acc, w) => acc + w.stockCount, 0);
  const limitedCount = watches.filter((w) => w.isLimitedEdition).length;

  const handleOpenAdd = () => {
    setEditingWatchId(null);
    setFormData({
      ...INITIAL_FORM_STATE,
      reference: `REF. AH-${Math.floor(1000 + Math.random() * 9000)}-${['RG', 'TI', 'SS', 'SK'][Math.floor(Math.random() * 4)]}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (watch: Watch) => {
    setEditingWatchId(watch.id);
    setFormData({
      reference: watch.reference,
      name: watch.name,
      collection: watch.collection,
      tagline: watch.tagline,
      description: watch.description,
      priceUSD: watch.priceUSD,
      image: watch.image,
      gallery: watch.gallery || [watch.image],
      specs: { ...watch.specs },
      isFeatured: !!watch.isFeatured,
      isNewRelease: !!watch.isNewRelease,
      isLimitedEdition: !!watch.isLimitedEdition,
      editionLimit: watch.editionLimit || 25,
      inStock: watch.inStock,
      stockCount: watch.stockCount,
    });
    setIsModalOpen(true);
  };

  const handleAutofillSample = () => {
    const samples = [
      {
        name: 'Aurelia Stellaire Flying Tourbillon',
        collection: 'Tourbillon' as const,
        tagline: 'Titanium Grade 5 openworked flying tourbillon with ruby pallet fork',
        description: 'An architectural feat of Swiss micromechanics. Hand-finished titanium bridges framing a one-minute flying tourbillon cage floating over a deep meteorite dial with 72-hour power reserve.',
        priceUSD: 94000,
        image: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
        specs: {
          caseDiameter: '41 mm',
          caseThickness: '10.2 mm',
          caseMaterial: 'Aerospace Grade 5 Titanium',
          bezelMaterial: 'Titanium Satin Brushed with Mirror Chamfers',
          dialColor: 'Smoked Sapphire with Meteorite Sub-Dial',
          crystal: 'Box Domed Sapphire with Double AR Coating',
          waterResistance: '50 meters / 5 bar',
          movement: 'Manual-Wind Flying Tourbillon Manufacture',
          calibre: 'Calibre AH-920 Tourbillon',
          powerReserve: '72 hours',
          frequency: '21,600 vph (3 Hz)',
          jewels: 33,
          strap: 'Integrated Titanium Grade 5 Bracelet',
        },
        isFeatured: true,
        isLimitedEdition: true,
        editionLimit: 15,
        stockCount: 2,
      },
      {
        name: 'Aurelia DeepOcean Chronograph 500M',
        collection: 'Diver' as const,
        tagline: 'Extreme ocean flyback chronograph in 904L steel and ceramic',
        description: 'Engineered for absolute underwater fidelity. Unidirectional ceramic timing bezel, locking chronograph pushers, automatic helium relief valve, and high-contrast tritium glow markers.',
        priceUSD: 21500,
        image: '/assets/images/watch_diver_submariner_1791612540699.jpg',
        specs: {
          caseDiameter: '43 mm',
          caseThickness: '13.9 mm',
          caseMaterial: 'Oystersteel 904L Satin Polished',
          bezelMaterial: 'Matte Blue High-Tech Ceramic 60-Minute',
          dialColor: 'Abyssal Sunburst Blue with Wave Pattern',
          crystal: 'Domed Sapphire Crystal 4.2mm Thickness',
          waterResistance: '500 meters / 50 bar',
          movement: 'Automatic High-Beat Flyback Chronometer',
          calibre: 'Calibre AH-6500 Marine',
          powerReserve: '60 hours',
          frequency: '28,800 vph (4 Hz)',
          jewels: 37,
          strap: 'Vulcanized FKM Navy Rubber Strap',
        },
        isFeatured: false,
        isNewRelease: true,
        isLimitedEdition: false,
        editionLimit: 50,
        stockCount: 6,
      },
    ];

    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setFormData((prev) => ({
      ...prev,
      ...randomSample,
      reference: `REF. AH-${Math.floor(1000 + Math.random() * 9000)}-${randomSample.collection.substring(0, 2).toUpperCase()}`,
      gallery: [randomSample.image],
    }));
    showToast('Loaded luxury Swiss timepiece specification!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a timepiece name.');
      return;
    }

    if (editingWatchId) {
      const updatedWatch: Watch = {
        ...formData,
        id: editingWatchId,
      };
      onUpdateWatch(updatedWatch);
      showToast(`Updated "${formData.name}" successfully!`);
    } else {
      const newWatch: Watch = {
        ...formData,
        id: `aurelia-${formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      };
      onAddWatch(newWatch);
      showToast(`Commissioned "${formData.name}" into live catalog!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (watch: Watch) => {
    if (window.confirm(`Are you sure you want to remove "${watch.name}" (${watch.reference}) from the catalog?`)) {
      onDeleteWatch(watch.id);
      showToast(`Removed "${watch.name}" from catalog.`);
    }
  };

  const handleToggleStock = (watch: Watch) => {
    const updated: Watch = {
      ...watch,
      inStock: !watch.inStock,
      stockCount: !watch.inStock ? Math.max(watch.stockCount, 1) : 0,
    };
    onUpdateWatch(updated);
    showToast(`Updated stock status for ${watch.name}`);
  };

  const handleToggleFeatured = (watch: Watch) => {
    const updated: Watch = {
      ...watch,
      isFeatured: !watch.isFeatured,
    };
    onUpdateWatch(updated);
    showToast(`${watch.name} ${!watch.isFeatured ? 'is now featured on Home page' : 'removed from featured'}`);
  };

  return (
    <div className="w-full px-3 sm:px-8 lg:px-16 xl:px-24 py-6 sm:py-12 space-y-6 sm:space-y-12 min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:top-24 sm:right-8 z-50 bg-[#0E1118] border border-gold/60 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-[0_10px_30px_rgba(197,160,89,0.3)] flex items-center gap-2.5 sm:gap-3 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-gold shrink-0" />
          <span className="text-xs font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/15 pb-6">
        <div>
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-slate-400 hover:text-gold flex items-center gap-1.5 transition-colors mb-2 font-mono uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Atelier Public View
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold font-medium font-mono">
              Maison Administration
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-normal text-white mt-1">
            Atelier Curators & Product Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1 max-w-xl">
            Add new horological calibres, manage vault inventory allocations, update pricing, and feature signature timepieces across the website.
          </p>
        </div>

        {/* Global CTA Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={onResetCatalog}
            className="px-4 py-2.5 rounded-full border border-gold/30 hover:border-gold hover:bg-gold/10 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 font-mono"
            title="Reset catalog back to initial factory watches"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold" />
            <span>Reset Default Catalog</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="group relative overflow-hidden rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_18px_rgba(197,160,89,0.35)] hover:shadow-[0_0_28px_rgba(197,160,89,0.6)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Add New Timepiece</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-5 rounded-xl bg-gradient-to-b from-[#141822] to-[#0D1017] border border-gold/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs">
            <span>Catalogue Models</span>
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
          </div>
          <div className="font-mono text-xl sm:text-3xl font-bold text-white tabular-nums">
            {watches.length}
          </div>
          <div className="text-[9px] sm:text-[10px] text-gold/80 font-mono">Active Calibres</div>
        </div>

        <div className="p-3.5 sm:p-5 rounded-xl bg-gradient-to-b from-[#141822] to-[#0D1017] border border-gold/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs">
            <span>Allocated Units</span>
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
          </div>
          <div className="font-mono text-xl sm:text-3xl font-bold text-white tabular-nums">
            {totalStock}
          </div>
          <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono">In Vault Stock</div>
        </div>

        <div className="p-3.5 sm:p-5 rounded-xl bg-gradient-to-b from-[#141822] to-[#0D1017] border border-gold/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs">
            <span>Limited Editions</span>
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
          </div>
          <div className="font-mono text-xl sm:text-3xl font-bold text-white tabular-nums">
            {limitedCount}
          </div>
          <div className="text-[9px] sm:text-[10px] text-gold/80 font-mono">Numbered Series</div>
        </div>

        <div className="p-3.5 sm:p-5 rounded-xl bg-gradient-to-b from-[#141822] to-[#0D1017] border border-gold/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs">
            <span>Inventory Value</span>
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
          </div>
          <div className="font-mono text-lg sm:text-2xl font-bold text-gold tabular-nums truncate">
            {formatPrice(totalValuation, currency)}
          </div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono">Geneva Certified</div>
        </div>
      </div>

      {/* Control Bar: Search & Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Collection Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {['all', 'Chronograph', 'Tourbillon', 'Diver', 'Dress', 'Heritage'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCollection(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCollection === cat
                    ? 'bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] text-black font-bold shadow-[0_0_12px_rgba(197,160,89,0.35)]'
                    : 'bg-[#141822] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {cat === 'all' ? 'All Pieces' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, model, calibre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#12151E] border border-white/10 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Timepiece Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWatches.map((watch) => (
          <div
            key={watch.id}
            className="bg-gradient-to-b from-[#121620] to-[#0C0F16] rounded-xl border border-gold/20 overflow-hidden flex flex-col justify-between hover:border-gold/50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.8)] transition-all duration-300"
          >
            {/* Card Top: Image & Status Badges */}
            <div className="relative aspect-[16/10] bg-[#161A24] overflow-hidden group">
              <img
                src={watch.image}
                alt={watch.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-black/70 border border-gold/40 text-gold backdrop-blur-sm">
                  {watch.collection}
                </span>
                {watch.isFeatured && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gold text-black">
                    Home Featured
                  </span>
                )}
                {watch.isNewRelease && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white text-black">
                    Novelty 2026
                  </span>
                )}
                {watch.isLimitedEdition && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-purple-900/80 border border-purple-400 text-purple-200">
                    Lim. {watch.editionLimit} Pcs
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="absolute bottom-3 left-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium backdrop-blur-md ${
                  watch.inStock 
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300' 
                    : 'bg-red-950/80 border border-red-500/50 text-red-300'
                }`}>
                  {watch.inStock ? `${watch.stockCount} in Vault` : 'Made to Order'}
                </span>
              </div>

              {/* Quick View Button */}
              <button
                onClick={() => onViewWatch(watch)}
                className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/60 border border-white/20 text-white hover:text-gold hover:border-gold transition-colors"
                title="Examine Timepiece"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-gold">
                  <span>{watch.reference}</span>
                  <span className="text-slate-400">{watch.specs.caseDiameter}</span>
                </div>

                <h3 className="font-serif text-lg font-medium text-white mt-1 hover:text-gold transition-colors">
                  {watch.name}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-light leading-relaxed">
                  {watch.tagline}
                </p>

                {/* Micro specs */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-[11px] text-slate-400 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Calibre</span>
                    <span className="text-slate-300 truncate block">{watch.specs.calibre}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Reserve</span>
                    <span className="text-slate-300 truncate block">{watch.specs.powerReserve}</span>
                  </div>
                </div>
              </div>

              {/* Price & Actions Row */}
              <div className="pt-4 border-t border-gold/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Valuation</span>
                    <span className="font-mono text-lg font-bold text-white tabular-nums">
                      <AnimatedPrice amountUSD={watch.priceUSD} currency={currency} replayOnHover={true} />
                    </span>
                  </div>

                  {/* Toggle Featured Button */}
                  <button
                    onClick={() => handleToggleFeatured(watch)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider border transition-colors ${
                      watch.isFeatured
                        ? 'border-gold text-gold bg-gold/10'
                        : 'border-white/10 text-slate-500 hover:text-white'
                    }`}
                    title={watch.isFeatured ? 'Featured on Home page' : 'Click to feature on Home page'}
                  >
                    ★ {watch.isFeatured ? 'Featured' : 'Not Featured'}
                  </button>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(watch)}
                    className="flex-1 py-2 px-3 rounded-lg border border-gold/30 hover:border-gold hover:bg-gold/10 text-xs font-semibold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-gold" />
                    <span>Edit Specs</span>
                  </button>

                  <button
                    onClick={() => handleToggleStock(watch)}
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      watch.inStock
                        ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                        : 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10'
                    }`}
                    title={watch.inStock ? 'Mark as Out of Stock' : 'Mark as In Stock'}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(watch)}
                    className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors"
                    title="Delete Timepiece"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Timepiece Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-2xl bg-[#0D1017] border border-gold/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-4 sm:p-8 space-y-5 sm:space-y-6">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gold/20 pb-4">
              <div>
                <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{editingWatchId ? 'Edit Existing Timepiece' : 'Commission New Piece to Atelier'}</span>
                </div>
                <h2 className="font-serif text-xl sm:text-3xl text-white mt-1">
                  {editingWatchId ? `Modifying: ${formData.name || 'Timepiece'}` : 'New Haute Horlogerie Creation'}
                </h2>
              </div>

              {!editingWatchId && (
                <button
                  type="button"
                  onClick={handleAutofillSample}
                  className="px-3.5 py-1.5 rounded-full border border-gold/40 hover:border-gold hover:bg-gold/15 text-gold text-xs font-mono uppercase tracking-wider transition-all self-start sm:self-auto shrink-0"
                >
                  ⚡ Autofill Luxury Spec
                </button>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Identification & Nomenclature */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-mono border-b border-white/10 pb-1">
                  1. Identification & Nomenclature
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-300 mb-1">Timepiece Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aurelia Royal Tourbillon 42"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-[#141824] border border-white/15 rounded-lg text-white focus:outline-none focus:border-gold font-serif text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Reference Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. REF. AH-8800-RG"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-[#141824] border border-white/15 rounded-lg text-gold font-mono focus:outline-none focus:border-gold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Horological Collection *</label>
                    <select
                      value={formData.collection}
                      onChange={(e) => setFormData({ ...formData, collection: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-xs bg-[#141824] border border-white/15 rounded-lg text-white focus:outline-none focus:border-gold"
                    >
                      <option value="Chronograph">Chronograph</option>
                      <option value="Tourbillon">Tourbillon</option>
                      <option value="Diver">Diver 300M / 500M</option>
                      <option value="Dress">Ultra-Thin Dress</option>
                      <option value="Heritage">Heritage Classics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Price (USD) *</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={500}
                      value={formData.priceUSD}
                      onChange={(e) => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs bg-[#141824] border border-white/15 rounded-lg text-white font-mono focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Allocated Vault Units *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stockCount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({ 
                          ...formData, 
                          stockCount: val,
                          inStock: val > 0 
                        });
                      }}
                      className="w-full px-3.5 py-2 text-xs bg-[#141824] border border-white/15 rounded-lg text-white font-mono focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] text-slate-300 mb-1">Editorial Tagline *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Haute Horlogerie in 18k Rose Gold with sunburst navy dial"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-[#141824] border border-white/15 rounded-lg text-white focus:outline-none focus:border-gold font-light"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] text-slate-300 mb-1">Artisan Heritage Story & Description</label>
                    <textarea
                      rows={3}
                      placeholder="Detail the hand-finishing, beveling techniques, Geneva seal standards, and inspiration..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-[#141824] border border-white/15 rounded-lg text-white focus:outline-none focus:border-gold leading-relaxed font-light"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Visual Assets & Preset Selector */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-mono border-b border-white/10 pb-1">
                  2. Visual Imagery & Presentation
                </h3>
                
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Primary Image URL or Path</label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      image: e.target.value,
                      gallery: [e.target.value]
                    })}
                    placeholder="e.g. /assets/images/... or https://..."
                    className="w-full px-3.5 py-2 text-xs bg-[#141824] border border-white/15 rounded-lg text-white font-mono focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <span className="block text-[11px] text-slate-400 mb-2 font-mono">
                    Quick-Select High-Definition Atelier Preset:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          image: preset.url,
                          gallery: [preset.url] 
                        })}
                        className={`group p-2 rounded-xl border text-left transition-all flex flex-col items-center gap-2 ${
                          formData.image === preset.url
                            ? 'border-gold bg-gold/15 shadow-[0_0_12px_rgba(197,160,89,0.4)]'
                            : 'border-white/10 bg-[#121620] hover:border-gold/50'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full aspect-[4/3] object-cover rounded-lg group-hover:scale-102 transition-transform"
                        />
                        <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Badges & Curatorial Flags */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-mono border-b border-white/10 pb-1">
                  3. Curatorial Attributes & Privileges
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-[#141824] border border-white/10 cursor-pointer hover:border-gold/40">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded accent-gold w-4 h-4"
                    />
                    <span className="text-xs text-white">Feature on Home Novelties</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-[#141824] border border-white/10 cursor-pointer hover:border-gold/40">
                    <input
                      type="checkbox"
                      checked={formData.isNewRelease}
                      onChange={(e) => setFormData({ ...formData, isNewRelease: e.target.checked })}
                      className="rounded accent-gold w-4 h-4"
                    />
                    <span className="text-xs text-white">Novelty 2026 Badge</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-[#141824] border border-white/10 cursor-pointer hover:border-gold/40">
                    <input
                      type="checkbox"
                      checked={formData.isLimitedEdition}
                      onChange={(e) => setFormData({ ...formData, isLimitedEdition: e.target.checked })}
                      className="rounded accent-gold w-4 h-4"
                    />
                    <span className="text-xs text-white">Limited Edition Series</span>
                  </label>

                  {formData.isLimitedEdition && (
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] text-slate-300 mb-1">Edition Limit Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.editionLimit}
                        onChange={(e) => setFormData({ ...formData, editionLimit: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 text-xs bg-[#141824] border border-white/15 rounded-lg text-white font-mono focus:outline-none focus:border-gold"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Complete Technical Specifications */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-gold font-mono border-b border-white/10 pb-1">
                  4. Technical Watchmaking Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Case Diameter</label>
                    <input
                      type="text"
                      value={formData.specs.caseDiameter}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, caseDiameter: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Case Thickness</label>
                    <input
                      type="text"
                      value={formData.specs.caseThickness}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, caseThickness: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Case Material</label>
                    <input
                      type="text"
                      value={formData.specs.caseMaterial}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, caseMaterial: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Bezel Material</label>
                    <input
                      type="text"
                      value={formData.specs.bezelMaterial}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, bezelMaterial: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Dial Finish & Color</label>
                    <input
                      type="text"
                      value={formData.specs.dialColor}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, dialColor: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Sapphire Crystal</label>
                    <input
                      type="text"
                      value={formData.specs.crystal}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, crystal: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Water Resistance</label>
                    <input
                      type="text"
                      value={formData.specs.waterResistance}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, waterResistance: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Movement Type</label>
                    <input
                      type="text"
                      value={formData.specs.movement}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, movement: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Calibre Reference</label>
                    <input
                      type="text"
                      value={formData.specs.calibre}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, calibre: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Power Reserve</label>
                    <input
                      type="text"
                      value={formData.specs.powerReserve}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, powerReserve: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Frequency</label>
                    <input
                      type="text"
                      value={formData.specs.frequency}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, frequency: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Jewels (Rubies)</label>
                    <input
                      type="number"
                      value={formData.specs.jewels}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, jewels: Number(e.target.value) } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white font-mono"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-4">
                    <label className="block text-[10px] text-slate-400 mb-1">Bracelet / Strap Specification</label>
                    <input
                      type="text"
                      value={formData.specs.strap}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, strap: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-[#141824] border border-white/15 rounded text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-gold/20 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-white/15 hover:border-white/30 text-xs text-slate-300 transition-colors uppercase tracking-wider font-mono text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto group relative overflow-hidden rounded-full px-7 py-3 text-xs font-bold uppercase tracking-[0.16em] text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] shadow-[0_0_18px_rgba(197,160,89,0.35)] hover:shadow-[0_0_28px_rgba(197,160,89,0.6)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Check className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>{editingWatchId ? 'Save Timepiece Modifications' : 'Commission Piece into Catalog'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
