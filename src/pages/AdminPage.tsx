import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit3, Trash2, Check, Sparkles, Shield, RefreshCw, 
  Search, Eye, ArrowLeft, SlidersHorizontal, Image as ImageIcon,
  DollarSign, Package, Award, Clock, AlertTriangle, Layers,
  ShoppingBag, Truck, MapPin, Phone, Mail, Globe, Save,
  CheckCircle2, XCircle, ArrowUpRight, MessageSquare, ChevronRight, ChevronLeft,
  ExternalLink, Bell, CreditCard, Lock, LogOut, Key, EyeOff, User,
  Copy, Download, Upload, Filter, ArrowUpDown, FileText, CheckSquare,
  Square, Printer, Tag, BarChart3, Activity, Compass, ShieldAlert,
  TrendingUp, TrendingDown, CircleDollarSign, History, Users, UserCheck, Star, Calendar, MessageCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ComposedChart,
  Line,
  LineChart
} from 'recharts';
import { Watch, CurrencyCode } from '../types/watch';
import { formatPrice } from '../utils/currency';
import { AnimatedPrice } from '../components/AnimatedPrice';
import { 
  PlacedOrder, 
  getPlacedOrders, 
  updatePlacedOrder, 
  deletePlacedOrder, 
  resetOrdersToDemo 
} from '../utils/orderStorage';
import { 
  SiteSettings, 
  getSiteSettings, 
  saveSiteSettings, 
  resetSiteSettings 
} from '../utils/siteSettings';
import {
  PromoCode,
  getPromoCodes,
  savePromoCodes,
  INITIAL_PROMO_CODES
} from '../utils/promoStorage';
import {
  AuditLogItem,
  getAuditLogs,
  logAdminAction,
  clearAuditLogs
} from '../utils/auditLogger';
import { AdminActivityLog } from '../components/AdminActivityLog';

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
  { label: 'Royal Chronograph 41 (Rose Gold)', url: '/assets/images/hero_luxury_chronograph_1791612522214.jpg' },
  { label: 'Abyss Master Diver (Titanium)', url: '/assets/images/watch_diver_submariner_1791612540699.jpg' },
  { label: 'Symphonie Skeleton (Tourbillon)', url: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg' },
  { label: 'Patrimoine Minimalist (Platinum)', url: '/assets/images/watch_dress_minimalist_1791612572332.jpg' },
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

type AdminTab = 'products' | 'orders' | 'settings' | 'analytics' | 'audit';

const ADMIN_CREDS_KEY = 'aurelia_admin_credentials_v1';
const ADMIN_SESSION_KEY = 'aurelia_admin_session_v1';

function getAdminCredentials(): { username: string; password: string } {
  if (typeof window === 'undefined') return { username: 'admin', password: 'admin123' };
  try {
    const raw = localStorage.getItem(ADMIN_CREDS_KEY);
    if (!raw) {
      const def = { username: 'admin', password: 'admin123' };
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(def));
      return def;
    }
    const parsed = JSON.parse(raw);
    return {
      username: parsed.username || 'admin',
      password: parsed.password || 'admin123',
    };
  } catch (e) {
    return { username: 'admin', password: 'admin123' };
  }
}

function saveAdminCredentials(creds: { username: string; password: string }): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
  } catch (e) {
    console.error('Error saving admin credentials', e);
  }
}

const LuxuryChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-[#C5A059]/40 shadow-2xl text-xs space-y-2 font-sans z-50 min-w-[200px]">
        <div className="font-bold text-[#E2C775] border-b border-slate-800 pb-1.5 font-sans text-sm tracking-wide">
          {label}
        </div>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => {
            const isRev = 
              entry.name?.toLowerCase().includes('revenue') || 
              entry.dataKey === 'revenue' || 
              entry.dataKey === 'revenueUSD' || 
              entry.dataKey === 'projected' ||
              entry.dataKey === 'value';
            const isRevK = entry.dataKey === 'revenueK' || entry.dataKey === 'targetK';
            const isUnits = entry.dataKey === 'units' || entry.dataKey === 'unitsSold';
            const isOrders = entry.dataKey === 'orders' || entry.dataKey === 'count' || entry.dataKey === 'orderVolume';
            const isAOV = entry.dataKey === 'aov' || entry.dataKey === 'avgOrderValue';
            const isAOVK = entry.dataKey === 'aovK';

            let formattedVal = entry.value;
            if (isRevK) {
              formattedVal = `$${Number(entry.value).toLocaleString()}k USD ($${(Number(entry.value) * 1000).toLocaleString()})`;
            } else if (isAOVK) {
              formattedVal = `$${Number(entry.value).toLocaleString()}k USD`;
            } else if (isAOV) {
              formattedVal = `$${Number(entry.value).toLocaleString()} USD`;
            } else if (isRev) {
              formattedVal = `$${Number(entry.value).toLocaleString()} USD`;
            } else if (isUnits) {
              formattedVal = `${entry.value} timepieces`;
            } else if (isOrders) {
              formattedVal = `${entry.value} consignments`;
            } else if (typeof entry.value === 'number') {
              formattedVal = `${entry.value} units in vault`;
            }

            return (
              <div key={`entry-${index}`} className="flex items-center justify-between gap-4 py-0.5">
                <span className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: entry.color || entry.fill || '#C5A059' }}
                  />
                  <span>{entry.name}:</span>
                </span>
                <span className="font-mono font-bold text-white text-xs">
                  {formattedVal}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const DEFAULT_CUSTOMER_SUPPORT_NOTES: Record<string, { id: string; text: string; date: string; author: string; tag: string }[]> = {
  'sterling.vance@mayfairholdings.co.uk': [
    {
      id: 'note-1',
      text: 'Patron requested bespoke hand-stitched Mississippi Alligator strap in midnight navy to pair with 18k Rose Gold case.',
      date: 'Oct 20, 2026 · 10:15 CET',
      author: 'Concierge Geneva',
      tag: 'Preference',
    },
    {
      id: 'note-2',
      text: 'Confirmed delivery address at Mayfair Private Residence with white-glove security handover.',
      date: 'Oct 21, 2026 · 14:30 CET',
      author: 'Armored Ops',
      tag: 'Delivery',
    },
  ],
  'alistair.chen@difc-capital.ae': [
    {
      id: 'note-3',
      text: 'Collector holds piece 08/25 of Symphonie Skeleton Flying Tourbillon. Inquired about upcoming 2027 Grand Complication allocation.',
      date: 'Oct 21, 2026 · 16:45 CET',
      author: 'VIP Salon Dubai',
      tag: 'VIP Care',
    },
    {
      id: 'note-4',
      text: 'Armored COD payment confirmed via authorized diplomatic courier in DIFC.',
      date: 'Oct 22, 2026 · 11:20 CET',
      author: 'Finance Concierge',
      tag: 'Inquiry',
    },
  ],
  'marcus@nordicventures.se': [
    {
      id: 'note-5',
      text: 'Prefers 30-bar pressure test certificate and magnetic provenance passport enclosed in presentation box.',
      date: 'Oct 22, 2026 · 09:40 CET',
      author: 'Atelier QA',
      tag: 'Preference',
    },
  ],
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
  // Authentication State - Always require password entry on every visit to admin portal
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {}
    return false;
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Live Swiss Station CET Clock
  const [currentTimeCET, setCurrentTimeCET] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeCET(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Europe/Zurich',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 15-Minute Inactivity Auto-Logout & Visual Countdown Timer
  const SESSION_MAX_SECONDS = 15 * 60; // 900 seconds (15 minutes)
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState<number>(SESSION_MAX_SECONDS);

  const handleExtendSession = () => {
    setSessionSecondsLeft(SESSION_MAX_SECONDS);
    showToast('Administrative session extended by 15 minutes.');
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Reset countdown timer on initial login or route entry
    setSessionSecondsLeft(SESSION_MAX_SECONDS);

    // Interval to tick down remaining seconds
    const timerInterval = setInterval(() => {
      setSessionSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          try {
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
            localStorage.removeItem(ADMIN_SESSION_KEY);
          } catch (e) {}
          logAdminAction(
            'Auto-Logout',
            'security',
            'Administrative session terminated due to 15 minutes of inactivity.',
            getAdminCredentials().username
          );
          setIsAuthenticated(false);
          showToast('Session expired due to 15 minutes of inactivity. Returned to public Maison.');
          setTimeout(() => {
            onNavigate('home');
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Interaction event listeners reset the 15-minute countdown
    const resetTimer = () => {
      setSessionSecondsLeft(SESSION_MAX_SECONDS);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      clearInterval(timerInterval);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, onNavigate]);

  // Format seconds into MM:SS display
  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const menuNavRef = useRef<HTMLElement>(null);

  const scrollMenuNav = (direction: 'left' | 'right') => {
    if (menuNavRef.current) {
      const scrollAmount = 180;
      menuNavRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Products Tab State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState<'all' | 'instock' | 'soldout' | 'lowstock'>('all');
  const [selectedSort, setSelectedSort] = useState<'price-desc' | 'price-asc' | 'stock-desc' | 'name-asc' | 'ref-asc'>('price-desc');
  const [selectedWatchIds, setSelectedWatchIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWatchId, setEditingWatchId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Watch, 'id'>>(INITIAL_FORM_STATE);
  const [duplicateWatchConflict, setDuplicateWatchConflict] = useState<{
    existingWatch: Watch;
    pendingAction: 'add' | 'update';
  } | null>(null);

  // Quick inline price editing
  const [inlinePriceEditId, setInlinePriceEditId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<number>(0);

  // Orders Tab State
  const [orders, setOrders] = useState<PlacedOrder[]>(getPlacedOrders);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('all');
  const [inspectingOrder, setInspectingOrder] = useState<PlacedOrder | null>(null);
  const [selectedOrderNumbers, setSelectedOrderNumbers] = useState<string[]>([]);
  const [newMilestoneLocation, setNewMilestoneLocation] = useState('');
  const [newMilestoneNote, setNewMilestoneNote] = useState('');

  // Customer History & Support State in Order Management
  const [orderSubTab, setOrderSubTab] = useState<'orders' | 'customer-history'>('orders');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [newSupportNoteText, setNewSupportNoteText] = useState('');
  const [newSupportNoteTag, setNewSupportNoteTag] = useState<'Preference' | 'Inquiry' | 'Delivery' | 'VIP Care'>('Preference');
  const [supportNotes, setSupportNotes] = useState<Record<string, { id: string; text: string; date: string; author: string; tag: string }[]>>(() => {
    if (typeof window === 'undefined') return DEFAULT_CUSTOMER_SUPPORT_NOTES;
    try {
      const raw = localStorage.getItem('aurelia_customer_support_notes_v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return DEFAULT_CUSTOMER_SUPPORT_NOTES;
  });

  // Site Settings Tab State
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // VIP Promos Tab State
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(getPromoCodes);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [newPromo, setNewPromo] = useState<Omit<PromoCode, 'id' | 'usesCount'>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderUSD: 20000,
    active: true,
    description: '',
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(getAuditLogs);
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>('all');

  // Security Credentials Management in Tab 3
  const [adminCreds, setAdminCreds] = useState<{ username: string; password: string }>(getAdminCredentials);
  const [newAdminUsername, setNewAdminUsername] = useState(adminCreds.username);
  const [newAdminPassword, setNewAdminPassword] = useState(adminCreds.password);
  const [credsSavedNotice, setCredsSavedNotice] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'monthly' | 'quarterly' | 'weekly'>('monthly');
  const [salesAnalyticsFilter, setSalesAnalyticsFilter] = useState<'all' | 'last6' | 'q3q4'>('all');
  const [salesAnalyticsMetricView, setSalesAnalyticsMetricView] = useState<'dual' | 'revenue' | 'volume' | 'aov'>('dual');
  const [selectedDepletionModel, setSelectedDepletionModel] = useState<string>('all');
  const [showDepletionAnalytics, setShowDepletionAnalytics] = useState<boolean>(true);

  // File import ref
  const fileImportRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshOrders = () => {
    setOrders(getPlacedOrders());
  };

  const refreshAuditLogs = () => {
    setAuditLogs(getAuditLogs());
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    setTimeout(() => {
      const creds = getAdminCredentials();
      const enteredUser = loginUsername.trim().toLowerCase();
      const actualUser = creds.username.trim().toLowerCase();

      if (enteredUser === actualUser && loginPassword === creds.password) {
        if (rememberMe) {
          localStorage.setItem(ADMIN_SESSION_KEY, 'true');
        } else {
          sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        }
        setIsAuthenticated(true);
        setLoginPassword('');
        logAdminAction('Administrator Sign-In', 'security', `Session started by ${creds.username}`, creds.username);
        refreshAuditLogs();
        showToast(`Access granted! Welcome, ${creds.username}.`);
      } else {
        setLoginError('Invalid administrator username or password. Check default credentials below.');
      }
      setIsLoggingIn(false);
    }, 350);
  };

  // Logout handler
  const handleLogout = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {}
    logAdminAction('Administrator Sign-Out', 'security', 'Active administrative session terminated.', adminCreds.username);
    setIsAuthenticated(false);
    setLoginPassword('');
    showToast('Logged out of Atelier Administrator session.');
  };

  // Quick autofill demo credentials
  const handleAutofillCreds = () => {
    const creds = getAdminCredentials();
    setLoginUsername(creds.username);
    setLoginPassword(creds.password);
    setLoginError(null);
    setForgotPasswordSuccess(null);
    showToast('Autofilled master administrator credentials');
  };

  const handleForgotPassword = () => {
    const defaultCreds = { username: 'admin', password: 'admin123' };
    saveAdminCredentials(defaultCreds);
    setLoginUsername('admin');
    setLoginPassword('admin123');
    setLoginError(null);
    setForgotPasswordSuccess('Master credentials successfully reset to default: admin / admin123');
    setTimeout(() => setForgotPasswordSuccess(null), 6000);
    showToast('Admin credentials reset to default (admin / admin123).');
  };

  // Update master credentials in settings
  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      showToast('Username and password cannot be empty.');
      return;
    }
    const updated = { username: newAdminUsername.trim(), password: newAdminPassword.trim() };
    saveAdminCredentials(updated);
    setAdminCreds(updated);
    setCredsSavedNotice(true);
    logAdminAction('Credentials Updated', 'security', `Master passkey updated for ${updated.username}`, updated.username);
    refreshAuditLogs();
    showToast('Administrator credentials updated successfully!');
    setTimeout(() => setCredsSavedNotice(false), 3000);
  };

  // Filter & Sort Watches
  const filteredWatches = watches
    .filter((w) => {
      const matchesCollection = selectedCollection === 'all' || w.collection === selectedCollection;
      const matchesStock = 
        selectedStockFilter === 'all' ||
        (selectedStockFilter === 'instock' && w.inStock && w.stockCount > 0) ||
        (selectedStockFilter === 'soldout' && (!w.inStock || w.stockCount === 0)) ||
        (selectedStockFilter === 'lowstock' && w.inStock && w.stockCount < 3 && w.stockCount > 0);
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery = 
        q === '' ||
        w.name.toLowerCase().includes(q) ||
        w.reference.toLowerCase().includes(q) ||
        w.specs.calibre.toLowerCase().includes(q);
      return matchesCollection && matchesStock && matchesQuery;
    })
    .sort((a, b) => {
      if (selectedSort === 'price-desc') return b.priceUSD - a.priceUSD;
      if (selectedSort === 'price-asc') return a.priceUSD - b.priceUSD;
      if (selectedSort === 'stock-desc') return b.stockCount - a.stockCount;
      if (selectedSort === 'name-asc') return a.name.localeCompare(b.name);
      if (selectedSort === 'ref-asc') return a.reference.localeCompare(b.reference);
      return 0;
    });

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedOrderStatus === 'all' || o.status === selectedOrderStatus;
    const q = orderSearchQuery.trim().toLowerCase();
    const matchesQuery = 
      q === '' ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.clientName.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.airwayBill.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  // Filter Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    return auditCategoryFilter === 'all' || log.category === auditCategoryFilter;
  });

  // Key KPI Calculations
  const totalValuation = watches.reduce((acc, w) => acc + (w.priceUSD * w.stockCount), 0);
  const totalStock = watches.reduce((acc, w) => acc + w.stockCount, 0);
  const limitedCount = watches.filter((w) => w.isLimitedEdition).length;
  const lowStockWatches = watches.filter((w) => w.stockCount > 0 && w.stockCount < 3);
  const lowStockCount = lowStockWatches.length;
  const totalOrderRevenue = orders.reduce((acc, o) => acc + o.totalUSD, 0);
  const averagePriceUSD = watches.length > 0 ? Math.round(watches.reduce((acc, w) => acc + w.priceUSD, 0) / watches.length) : 0;

  // Collection Distribution for Analytics
  const collectionStats = ['Chronograph', 'Tourbillon', 'Diver', 'Dress', 'Grand Complication'].map((col) => {
    const colWatches = watches.filter((w) => w.collection === col);
    const count = colWatches.length;
    const value = colWatches.reduce((acc, w) => acc + w.priceUSD * w.stockCount, 0);
    const pct = totalValuation > 0 ? Math.round((value / totalValuation) * 100) : 0;
    return { collection: col, count, value, pct };
  });

  // -------------------------------------------------------------
  // RECHARTS DATA PREPARATION: Revenue, Top Watches, Recent Orders
  // -------------------------------------------------------------

  // 1. Total Revenue Performance Data by Timeframe
  const revenueTrendData = React.useMemo(() => {
    if (analyticsTimeframe === 'weekly') {
      return [
        { period: 'W38 (Sep 15)', revenue: 68000, projected: 60000, orders: 2 },
        { period: 'W39 (Sep 22)', revenue: 94000, projected: 75000, orders: 3 },
        { period: 'W40 (Sep 29)', revenue: 118000, projected: 90000, orders: 3 },
        { period: 'W41 (Oct 06)', revenue: 152000, projected: 120000, orders: 4 },
        { period: 'W42 (Oct 13)', revenue: 185000, projected: 145000, orders: 4 },
        { period: 'W43 (Current)', revenue: Math.max(totalOrderRevenue, 240000), projected: 190000, orders: Math.max(orders.length, 5) },
      ];
    }
    if (analyticsTimeframe === 'quarterly') {
      return [
        { period: 'Q3 2025', revenue: 380000, projected: 350000, orders: 11 },
        { period: 'Q4 2025', revenue: 540000, projected: 480000, orders: 15 },
        { period: 'Q1 2026', revenue: 620000, projected: 580000, orders: 17 },
        { period: 'Q2 2026', revenue: 780000, projected: 700000, orders: 21 },
        { period: 'Q3 2026', revenue: 960000, projected: 880000, orders: 24 },
        { period: 'Q4 2026 (Live)', revenue: Math.max(totalOrderRevenue + 720000, 1150000), projected: 1050000, orders: Math.max(orders.length + 18, 28) },
      ];
    }
    // Monthly (default)
    return [
      { period: 'May 2026', revenue: 142000, projected: 130000, orders: 3 },
      { period: 'Jun 2026', revenue: 198000, projected: 180000, orders: 4 },
      { period: 'Jul 2026', revenue: 265000, projected: 240000, orders: 5 },
      { period: 'Aug 2026', revenue: 312000, projected: 290000, orders: 6 },
      { period: 'Sep 2026', revenue: 384000, projected: 350000, orders: 7 },
      { period: 'Oct 2026 (Live)', revenue: Math.max(totalOrderRevenue, 445000), projected: 420000, orders: Math.max(orders.length, 8) },
    ];
  }, [analyticsTimeframe, totalOrderRevenue, orders.length]);

  // 1b. Dedicated Monthly Sales Analytics: Revenue & Order Volume Trends
  const monthlySalesTrends = React.useMemo(() => {
    // 2026 Calendar Months
    const calendarMonths = [
      { key: '2026-01', month: 'Jan 2026', short: 'Jan', baseRev: 145000, baseOrders: 3, baseUnits: 4, targetRev: 135000 },
      { key: '2026-02', month: 'Feb 2026', short: 'Feb', baseRev: 168000, baseOrders: 4, baseUnits: 5, targetRev: 155000 },
      { key: '2026-03', month: 'Mar 2026', short: 'Mar', baseRev: 215000, baseOrders: 4, baseUnits: 5, targetRev: 195000 },
      { key: '2026-04', month: 'Apr 2026', short: 'Apr', baseRev: 252000, baseOrders: 5, baseUnits: 6, targetRev: 230000 },
      { key: '2026-05', month: 'May 2026', short: 'May', baseRev: 288000, baseOrders: 5, baseUnits: 7, targetRev: 265000 },
      { key: '2026-06', month: 'Jun 2026', short: 'Jun', baseRev: 326000, baseOrders: 6, baseUnits: 8, targetRev: 300000 },
      { key: '2026-07', month: 'Jul 2026', short: 'Jul', baseRev: 364000, baseOrders: 6, baseUnits: 8, targetRev: 335000 },
      { key: '2026-08', month: 'Aug 2026', short: 'Aug', baseRev: 405000, baseOrders: 7, baseUnits: 9, targetRev: 375000 },
      { key: '2026-09', month: 'Sep 2026', short: 'Sep', baseRev: 452000, baseOrders: 8, baseUnits: 10, targetRev: 420000 },
      { key: '2026-10', month: 'Oct 2026 (Live)', short: 'Oct', baseRev: 395000, baseOrders: 6, baseUnits: 8, targetRev: 450000, isLive: true },
    ];

    // Compute dynamic contribution from real placed orders
    const liveOrdersRev = totalOrderRevenue;
    const liveOrdersCount = orders.length;
    const liveOrdersUnits = orders.reduce((sum, o) => sum + (o.items?.reduce((s, it) => s + (it.quantity || 1), 0) || 1), 0);

    let prevRevenue = 125000;
    let prevOrders = 3;

    const fullSeries = calendarMonths.map((m) => {
      const revenueUSD = m.isLive ? m.baseRev + liveOrdersRev : m.baseRev;
      const orderVolume = m.isLive ? m.baseOrders + liveOrdersCount : m.baseOrders;
      const units = m.isLive ? m.baseUnits + liveOrdersUnits : m.baseUnits;

      const revenueK = Math.round(revenueUSD / 1000);
      const targetK = Math.round(m.targetRev / 1000);
      const aov = Math.round(revenueUSD / Math.max(orderVolume, 1));
      const aovK = Number((aov / 1000).toFixed(1));

      const momRevPct = Number((((revenueUSD - prevRevenue) / prevRevenue) * 100).toFixed(1));
      const momOrderPct = Number((((orderVolume - prevOrders) / prevOrders) * 100).toFixed(1));
      const quotaAttainment = Number(((revenueUSD / m.targetRev) * 100).toFixed(1));

      prevRevenue = revenueUSD;
      prevOrders = orderVolume;

      return {
        key: m.key,
        month: m.month,
        shortMonth: m.short,
        revenueUSD,
        revenueK,
        targetRevenueUSD: m.targetRev,
        targetK,
        orderVolume,
        units,
        aov,
        aovK,
        momRevPct,
        momOrderPct,
        quotaAttainment,
        isLive: !!m.isLive,
      };
    });

    if (salesAnalyticsFilter === 'last6') {
      return fullSeries.slice(-6);
    }
    if (salesAnalyticsFilter === 'q3q4') {
      return fullSeries.slice(-4);
    }
    return fullSeries;
  }, [orders, totalOrderRevenue, salesAnalyticsFilter]);

  // Aggregate Executive Sales Analytics KPIs
  const salesAnalyticsKPIs = React.useMemo(() => {
    const totalRev = monthlySalesTrends.reduce((acc, m) => acc + m.revenueUSD, 0);
    const totalOrders = monthlySalesTrends.reduce((acc, m) => acc + m.orderVolume, 0);
    const totalUnits = monthlySalesTrends.reduce((acc, m) => acc + m.units, 0);
    const aov = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;
    
    let peakRevMonth = monthlySalesTrends[0];
    let peakOrderMonth = monthlySalesTrends[0];
    monthlySalesTrends.forEach((m) => {
      if (m.revenueUSD > (peakRevMonth?.revenueUSD || 0)) peakRevMonth = m;
      if (m.orderVolume > (peakOrderMonth?.orderVolume || 0)) peakOrderMonth = m;
    });

    const latestMonth = monthlySalesTrends[monthlySalesTrends.length - 1];
    const prevMonth = monthlySalesTrends.length > 1 ? monthlySalesTrends[monthlySalesTrends.length - 2] : null;
    const latestMoMRev = prevMonth 
      ? Number((((latestMonth.revenueUSD - prevMonth.revenueUSD) / prevMonth.revenueUSD) * 100).toFixed(1))
      : 12.5;
    const latestMoMOrders = prevMonth 
      ? Number((((latestMonth.orderVolume - prevMonth.orderVolume) / prevMonth.orderVolume) * 100).toFixed(1))
      : 15.0;

    return {
      totalRev,
      totalOrders,
      totalUnits,
      aov,
      peakRevMonth,
      peakOrderMonth,
      latestMoMRev,
      latestMoMOrders,
      latestMonth,
    };
  }, [monthlySalesTrends]);

  // 2. Top-Selling Watches by Revenue & Units from Actual Orders + Catalog
  const topSellingWatchesData = React.useMemo(() => {
    const map: Record<string, { fullName: string; reference: string; units: number; revenue: number; image: string; collection: string }> = {};

    // Tally real client orders
    orders.forEach((o) => {
      o.items?.forEach((item) => {
        const key = item.name || item.reference || 'Watch';
        if (!map[key]) {
          const match = watches.find((w) => w.id === item.id || w.name === item.name || w.reference === item.reference);
          map[key] = {
            fullName: item.name,
            reference: item.reference || match?.reference || 'REF. AH-SPECIAL',
            units: 0,
            revenue: 0,
            image: item.image || match?.image || '/assets/images/hero_luxury_chronograph_1791612522214.jpg',
            collection: match?.collection || 'Chronograph',
          };
        }
        const qty = item.quantity || 1;
        map[key].units += qty;
        map[key].revenue += (item.priceUSD || 35000) * qty;
      });
    });

    // Supplement with catalog timepieces
    watches.forEach((w, index) => {
      const key = w.name;
      if (!map[key]) {
        const simulatedUnits = w.isFeatured ? 5 - (index % 3) : 2;
        map[key] = {
          fullName: w.name,
          reference: w.reference,
          units: simulatedUnits,
          revenue: w.priceUSD * simulatedUnits,
          image: w.image,
          collection: w.collection,
        };
      }
    });

    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        shortName: item.fullName.length > 18 ? item.fullName.substring(0, 16) + '...' : item.fullName,
        revenueK: Math.round(item.revenue / 1000),
      }));
  }, [orders, watches]);

  // 2b. 30-Day Inventory Depletion Rate for Popular Models
  const popularDepletionModels = React.useMemo(() => {
    // Pick the top 4 popular models
    const top = topSellingWatchesData.slice(0, 4);
    const luxuryPalette = ['#C5A059', '#2563EB', '#059669', '#7C3AED'];

    return top.map((item, idx) => {
      const match = watches.find(
        (w) => w.name === item.fullName || w.reference === item.reference || w.id === (item as any).id
      );
      const currentStock = match ? match.stockCount : 2;
      // Calculate units depleted in the last 30 days from real orders + baseline velocity
      const soldUnits = Math.max(item.units || 2, 2 + (idx === 0 ? 4 : idx === 1 ? 3 : 2));
      const initialStock = currentStock + soldUnits;
      const depletionRatePct = initialStock > 0 ? Math.round((soldUnits / initialStock) * 100) : 0;
      const dailyBurnRate = Number((soldUnits / 30).toFixed(2));
      const daysUntilExhaustion = dailyBurnRate > 0 ? Math.max(1, Math.round(currentStock / dailyBurnRate)) : 99;

      return {
        id: match?.id || `pop-${idx}`,
        fullName: item.fullName,
        shortName: item.shortName,
        reference: item.reference,
        image: item.image,
        collection: item.collection,
        color: luxuryPalette[idx % luxuryPalette.length],
        currentStock,
        initialStock,
        soldUnits,
        depletionRatePct,
        dailyBurnRate,
        daysUntilExhaustion,
        isLowStock: currentStock < 3,
      };
    });
  }, [topSellingWatchesData, watches]);

  const depletionTimelineData = React.useMemo(() => {
    // 6 measurement points over the last 30 days
    const intervals = [
      { label: '30d ago', progress: 0 },
      { label: '24d ago', progress: 0.2 },
      { label: '18d ago', progress: 0.4 },
      { label: '12d ago', progress: 0.62 },
      { label: '6d ago', progress: 0.82 },
      { label: 'Today', progress: 1.0 },
    ];

    return intervals.map((interval) => {
      const point: Record<string, any> = {
        day: interval.label,
      };

      popularDepletionModels.forEach((model) => {
        if (interval.progress === 1.0) {
          point[model.shortName] = model.currentStock;
        } else {
          const estimated = Math.round(model.initialStock - (model.soldUnits * interval.progress));
          point[model.shortName] = Math.max(model.currentStock, estimated);
        }
      });

      return point;
    });
  }, [popularDepletionModels]);

  // 3. Orders by Status Distribution (Recharts Bar & Badges)
  const ordersStatusChartData = React.useMemo(() => {
    const counts: Record<string, number> = {
      'Allocated': 0,
      'Atelier Assembly': 0,
      'In Transit': 0,
      'Out for Delivery': 0,
      'Delivered': 0,
    };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      } else {
        counts['In Transit'] = (counts['In Transit'] || 0) + 1;
      }
    });

    return [
      { status: 'Allocated', count: counts['Allocated'] || 1, fill: '#64748B', desc: 'Secure Vault Hold' },
      { status: 'Atelier Assembly', count: counts['Atelier Assembly'] || 2, fill: '#C5A059', desc: 'Horologist Calibration' },
      { status: 'In Transit', count: counts['In Transit'] || 3, fill: '#2563EB', desc: 'Armored Courier Transit' },
      { status: 'Out for Delivery', count: counts['Out for Delivery'] || 1, fill: '#7C3AED', desc: 'Diplomatic Hand-Off' },
      { status: 'Delivered', count: counts['Delivered'] || 2, fill: '#059669', desc: 'Patron Verified' },
    ];
  }, [orders]);

  // 4. Collection Revenue Share (Donut Chart)
  const collectionPieData = React.useMemo(() => {
    const collectionColors: Record<string, string> = {
      Chronograph: '#C5A059',
      Tourbillon: '#9A7B38',
      Diver: '#2563EB',
      Dress: '#0F172A',
      'Grand Complication': '#D97706',
    };
    return collectionStats.map((c) => ({
      name: c.collection,
      value: c.value,
      count: c.count,
      color: collectionColors[c.collection] || '#64748B',
    }));
  }, [collectionStats]);

  // 5. Recent Orders Placed (Top 6 latest)
  const recentOrdersList = React.useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const timeB = new Date(b.placedAtISO || b.orderDate).getTime() || 0;
        const timeA = new Date(a.placedAtISO || a.orderDate).getTime() || 0;
        return timeB - timeA;
      })
      .slice(0, 6);
  }, [orders]);

  // 6. Customer History & Support Aggregation
  const customersList = React.useMemo(() => {
    const map: Record<string, {
      id: string;
      name: string;
      email: string;
      phone: string;
      city: string;
      country: string;
      address: string;
      postalCode: string;
      orders: PlacedOrder[];
      totalSpendUSD: number;
      totalUnits: number;
      firstOrderDate: string;
      lastOrderDate: string;
      tier: string;
      tierColor: string;
      tierBadge: string;
      preferences: { name: string; count: number; value: number; color: string }[];
      timeline: { period: string; amountUSD: number; amountK: number; orderNumber: string; status: string; label: string }[];
    }> = {};

    orders.forEach((o) => {
      const key = (o.email || o.clientName || 'anonymous').toLowerCase().trim();
      if (!map[key]) {
        map[key] = {
          id: key,
          name: o.clientName || 'Patron',
          email: o.email || 'client@aurelia.ch',
          phone: o.phone || '+41 22 819 0192',
          city: o.city || 'Geneva',
          country: o.country || 'Switzerland',
          address: o.address || 'Quai du Mont-Blanc',
          postalCode: o.postalCode || '1201',
          orders: [],
          totalSpendUSD: 0,
          totalUnits: 0,
          firstOrderDate: o.orderDate,
          lastOrderDate: o.orderDate,
          tier: 'Atelier Member',
          tierColor: 'bg-slate-100 text-slate-700 border-slate-200',
          tierBadge: 'Member',
          preferences: [],
          timeline: [],
        };
      }

      const c = map[key];
      c.orders.push(o);
      c.totalSpendUSD += o.totalUSD;
      const unitsInOrder = o.items ? o.items.reduce((s, it) => s + (it.quantity || 1), 0) : 1;
      c.totalUnits += unitsInOrder;
      c.lastOrderDate = o.orderDate;
    });

    const categoryColors: Record<string, string> = {
      Chronograph: '#C5A059',
      Tourbillon: '#9A7B38',
      Diver: '#2563EB',
      Dress: '#0F172A',
      'Grand Complication': '#D97706',
    };

    return Object.values(map).map((c) => {
      // Determine VIP tier
      if (c.totalSpendUSD >= 100000) {
        c.tier = 'Sovereign Collector (Tier I)';
        c.tierColor = 'bg-amber-50 text-amber-900 border-amber-300';
        c.tierBadge = '👑 Tier I Sovereign';
      } else if (c.totalSpendUSD >= 50000) {
        c.tier = 'Grand Complication Patron (Tier II)';
        c.tierColor = 'bg-[#9A7B38]/15 text-[#9A7B38] border-[#9A7B38]/30';
        c.tierBadge = '⭐ Tier II Patron';
      } else if (c.totalSpendUSD >= 25000) {
        c.tier = 'Heritage Collector (Tier III)';
        c.tierColor = 'bg-blue-50 text-blue-800 border-blue-200';
        c.tierBadge = '🔷 Tier III Collector';
      } else {
        c.tier = 'Atelier Patron';
        c.tierColor = 'bg-slate-100 text-slate-700 border-slate-200';
        c.tierBadge = '✨ Atelier Patron';
      }

      // Calculate collection preference breakdown
      const catMap: Record<string, { count: number; value: number }> = {};
      c.orders.forEach((ord) => {
        ord.items?.forEach((it) => {
          const found = watches.find((w) => w.id === it.id || w.name === it.name);
          const col = found?.collection || 'Chronograph';
          if (!catMap[col]) catMap[col] = { count: 0, value: 0 };
          catMap[col].count += it.quantity || 1;
          catMap[col].value += (it.priceUSD || 35000) * (it.quantity || 1);
        });
      });

      c.preferences = Object.entries(catMap).map(([name, val]) => ({
        name,
        count: val.count,
        value: val.value,
        color: categoryColors[name] || '#64748B',
      }));

      if (c.preferences.length === 0) {
        c.preferences = [{ name: 'Chronograph', count: 1, value: c.totalSpendUSD, color: '#C5A059' }];
      }

      // Spend timeline sorted chronologically
      c.timeline = [...c.orders]
        .sort((a, b) => new Date(a.placedAtISO || a.orderDate).getTime() - new Date(b.placedAtISO || b.orderDate).getTime())
        .map((ord, idx) => ({
          period: ord.orderDate.split(',')[0] || `Order ${idx + 1}`,
          amountUSD: ord.totalUSD,
          amountK: Math.round(ord.totalUSD / 1000),
          orderNumber: ord.orderNumber,
          status: ord.status,
          label: `#${ord.orderNumber}`,
        }));

      return c;
    }).sort((a, b) => b.totalSpendUSD - a.totalSpendUSD);
  }, [orders, watches]);

  // Currently selected customer profile
  const selectedCustomer = React.useMemo(() => {
    if (!customersList || customersList.length === 0) return null;
    if (selectedCustomerId) {
      const found = customersList.find(
        (c) => c.id === selectedCustomerId.toLowerCase().trim() || 
               c.email.toLowerCase().trim() === selectedCustomerId.toLowerCase().trim() ||
               c.name.toLowerCase().trim() === selectedCustomerId.toLowerCase().trim()
      );
      if (found) return found;
    }
    return customersList[0];
  }, [customersList, selectedCustomerId]);

  // Filtered customer list for search
  const filteredCustomersList = React.useMemo(() => {
    const q = customerSearchQuery.trim().toLowerCase();
    if (!q) return customersList;
    return customersList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [customersList, customerSearchQuery]);

  // Handlers for Watch CRUD
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

  const handleDuplicateWatch = (watch: Watch) => {
    const duplicated: Watch = {
      ...watch,
      id: `aurelia-${watch.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-copy-${Date.now().toString().slice(-4)}`,
      name: `${watch.name} (Duplicate)`,
      reference: `${watch.reference}-CP`,
      stockCount: 1,
      inStock: true,
      isFeatured: false,
    };
    onAddWatch(duplicated);
    logAdminAction('Duplicated Timepiece', 'product', `Cloned ${watch.name} as ${duplicated.reference}`, adminCreds.username);
    refreshAuditLogs();
    showToast(`Duplicated "${watch.name}" into catalog!`);
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

  const executeSaveWatch = (customName?: string) => {
    const finalFormData = customName ? { ...formData, name: customName } : formData;

    if (editingWatchId) {
      const existing = watches.find((w) => w.id === editingWatchId);
      const updatedWatch: Watch = {
        ...finalFormData,
        id: editingWatchId,
      };
      onUpdateWatch(updatedWatch);
      const priceChangeNotice = existing && existing.priceUSD !== finalFormData.priceUSD 
        ? ` (Price modified: $${existing.priceUSD.toLocaleString()} → $${finalFormData.priceUSD.toLocaleString()} USD)` 
        : ` (Valuation: $${finalFormData.priceUSD.toLocaleString()} USD)`;
      const stockChangeNotice = existing && existing.stockCount !== finalFormData.stockCount
        ? `, Stock: ${existing.stockCount} → ${finalFormData.stockCount} units`
        : `, Stock: ${finalFormData.stockCount} units`;
      logAdminAction(
        'Updated Timepiece',
        'product',
        `Updated specifications for "${finalFormData.name}" (${finalFormData.reference}, ${finalFormData.collection})${priceChangeNotice}${stockChangeNotice}`,
        adminCreds.username
      );
      refreshAuditLogs();
      showToast(`Updated "${finalFormData.name}" successfully!`);
    } else {
      const newWatch: Watch = {
        ...finalFormData,
        id: `aurelia-${finalFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      };
      onAddWatch(newWatch);
      logAdminAction(
        'Added Timepiece',
        'product',
        `Commissioned new timepiece "${finalFormData.name}" (${finalFormData.reference}) in ${finalFormData.collection} collection - Price: $${finalFormData.priceUSD.toLocaleString()} USD, Stock: ${finalFormData.stockCount} units, Movement: ${finalFormData.specs.movement || 'In-House Automatic'}`,
        adminCreds.username
      );
      refreshAuditLogs();
      showToast(`Commissioned "${finalFormData.name}" into live catalog!`);
    }

    setIsModalOpen(false);
    setDuplicateWatchConflict(null);
  };

  const handleSubmitWatch = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = formData.name.trim();
    if (!cleanName) {
      showToast('Please enter a timepiece model name.');
      return;
    }

    // Check if another watch already exists with this exact model name (case-insensitive)
    const existingDuplicate = watches.find(
      (w) =>
        w.name.trim().toLowerCase() === cleanName.toLowerCase() &&
        (!editingWatchId || w.id !== editingWatchId)
    );

    if (existingDuplicate) {
      setDuplicateWatchConflict({
        existingWatch: existingDuplicate,
        pendingAction: editingWatchId ? 'update' : 'add',
      });
      return;
    }

    executeSaveWatch();
  };

  const handleAutoDifferentiateName = () => {
    if (!duplicateWatchConflict) return;
    const materialSuffix = formData.specs.caseMaterial 
      ? ` (${formData.specs.caseMaterial.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').slice(0, 2).join(' ')})` 
      : ' (Edition II)';
    const newName = `${formData.name.trim()}${materialSuffix}`;
    setFormData((prev) => ({ ...prev, name: newName }));
    executeSaveWatch(newName);
  };

  const handleOverrideDuplicate = () => {
    if (!duplicateWatchConflict) return;
    logAdminAction(
      'Duplicate Name Override',
      'product',
      `Admin approved identical model name "${formData.name}" against existing ${duplicateWatchConflict.existingWatch.reference}`,
      adminCreds.username
    );
    executeSaveWatch();
  };

  const handleDelete = (watch: Watch) => {
    if (window.confirm(`Are you sure you want to remove "${watch.name}" (${watch.reference}) from the catalog?`)) {
      onDeleteWatch(watch.id);
      logAdminAction(
        'Deleted Timepiece',
        'product',
        `Permanently deleted timepiece "${watch.name}" (${watch.reference}, Collection: ${watch.collection}) from catalog - Valuation: $${watch.priceUSD.toLocaleString()} USD, Stock: ${watch.stockCount} units`,
        adminCreds.username
      );
      refreshAuditLogs();
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
    logAdminAction(
      'Stock Status Changed',
      'product',
      `${watch.name} (${watch.reference}) marked as ${updated.inStock ? `In Stock (${updated.stockCount} units)` : 'Sold Out (0 units)'}`,
      adminCreds.username
    );
    refreshAuditLogs();
    showToast(`Updated stock status for ${watch.name}`);
  };

  const handleToggleFeatured = (watch: Watch) => {
    const updated: Watch = {
      ...watch,
      isFeatured: !watch.isFeatured,
    };
    onUpdateWatch(updated);
    logAdminAction('Feature Toggle', 'product', `Timepiece "${watch.name}" featured state: ${updated.isFeatured ? 'Featured on Home Showcase' : 'Standard Catalog Display'}`, adminCreds.username);
    refreshAuditLogs();
    showToast(`${watch.name} ${!watch.isFeatured ? 'is now featured on Home page' : 'removed from featured'}`);
  };

  const handleAdjustStock = (watch: Watch, delta: number) => {
    const newCount = Math.max(0, watch.stockCount + delta);
    const updated: Watch = {
      ...watch,
      stockCount: newCount,
      inStock: newCount > 0,
    };
    onUpdateWatch(updated);
    logAdminAction(
      'Stock Adjusted',
      'product',
      `Stock count for "${watch.name}" (${watch.reference}) adjusted by ${delta > 0 ? '+' : ''}${delta} units (${watch.stockCount} → ${newCount} units)`,
      adminCreds.username
    );
    refreshAuditLogs();
    showToast(`Stock updated to ${newCount} units for ${watch.name}`);
  };

  // Inline Price Quick Edit
  const handleSaveInlinePrice = (watch: Watch) => {
    if (inlinePriceValue <= 0) return;
    const updated: Watch = {
      ...watch,
      priceUSD: inlinePriceValue,
    };
    onUpdateWatch(updated);
    setInlinePriceEditId(null);
    logAdminAction('Price Changed', 'product', `Price for ${watch.name} adjusted to $${inlinePriceValue.toLocaleString()} USD`, adminCreds.username);
    refreshAuditLogs();
    showToast(`Price updated to $${inlinePriceValue.toLocaleString()} USD for ${watch.name}`);
  };

  // Bulk Actions
  const handleToggleSelectWatch = (watchId: string) => {
    setSelectedWatchIds((prev) =>
      prev.includes(watchId) ? prev.filter((id) => id !== watchId) : [...prev, watchId]
    );
  };

  const handleSelectAllWatches = () => {
    if (selectedWatchIds.length === filteredWatches.length) {
      setSelectedWatchIds([]);
    } else {
      setSelectedWatchIds(filteredWatches.map((w) => w.id));
    }
  };

  const handleBulkSetStock = (inStock: boolean) => {
    selectedWatchIds.forEach((id) => {
      const found = watches.find((w) => w.id === id);
      if (found) {
        onUpdateWatch({
          ...found,
          inStock,
          stockCount: inStock ? Math.max(found.stockCount, 1) : 0,
        });
      }
    });
    logAdminAction('Bulk Stock Update', 'product', `Updated stock status for ${selectedWatchIds.length} timepieces`, adminCreds.username);
    refreshAuditLogs();
    showToast(`Updated stock status for ${selectedWatchIds.length} timepieces.`);
    setSelectedWatchIds([]);
  };

  const handleBulkToggleFeatured = () => {
    selectedWatchIds.forEach((id) => {
      const found = watches.find((w) => w.id === id);
      if (found) {
        onUpdateWatch({
          ...found,
          isFeatured: !found.isFeatured,
        });
      }
    });
    logAdminAction('Bulk Feature Toggle', 'product', `Toggled home featured status for ${selectedWatchIds.length} watches`, adminCreds.username);
    refreshAuditLogs();
    showToast(`Toggled home featured status for ${selectedWatchIds.length} watches.`);
    setSelectedWatchIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Permanently remove ${selectedWatchIds.length} selected timepieces from catalog?`)) {
      const removedItems = watches.filter((w) => selectedWatchIds.includes(w.id));
      const watchSummary = removedItems.map((w) => `"${w.name}" (${w.reference})`).join(', ');
      selectedWatchIds.forEach((id) => onDeleteWatch(id));
      logAdminAction('Bulk Deletion', 'product', `Bulk deleted ${selectedWatchIds.length} timepiece(s): ${watchSummary}`, adminCreds.username);
      refreshAuditLogs();
      showToast(`Removed ${selectedWatchIds.length} timepieces.`);
      setSelectedWatchIds([]);
    }
  };

  // Export / Import Catalog
  const handleExportCatalogJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(watches, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aurelia_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported complete catalog JSON archive.');
  };

  const handleImportCatalogJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].reference) {
          parsed.forEach((w: Watch) => onUpdateWatch(w));
          logAdminAction('Catalog Restored', 'product', `Imported ${parsed.length} timepieces from JSON archive`, adminCreds.username);
          refreshAuditLogs();
          showToast(`Successfully imported ${parsed.length} timepieces into catalog!`);
        } else {
          alert('Invalid catalog JSON format.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Export Orders to CSV
  const handleExportOrdersCSV = () => {
    const headers = ['Order Number', 'Date', 'Client Name', 'Email', 'Phone', 'City', 'Country', 'Total USD', 'Status', 'Payment Method', 'Carrier', 'Airway Bill'];
    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.orderDate}"`,
      `"${o.clientName}"`,
      `"${o.email}"`,
      `"${o.phone}"`,
      `"${o.city}"`,
      `"${o.country}"`,
      o.totalUSD,
      `"${o.status}"`,
      `"${o.paymentMethod}"`,
      `"${o.carrier}"`,
      `"${o.airwayBill}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aurelia_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Exported orders to CSV spreadsheet.');
  };

  // Order Handlers
  const handleUpdateOrderStatus = (orderNumber: string, status: PlacedOrder['status'], step: number) => {
    const updated = updatePlacedOrder(orderNumber, {
      status,
      progressStep: step,
    });
    if (updated) {
      refreshOrders();
      if (inspectingOrder?.orderNumber === orderNumber) {
        setInspectingOrder(updated);
      }
      logAdminAction('Order Status Advanced', 'order', `Order #${orderNumber} set to "${status}" (Stage ${step})`, adminCreds.username);
      refreshAuditLogs();
      showToast(`Order #${orderNumber} updated to ${status}`);
    }
  };

  const handleAddMilestoneNote = (orderNumber: string) => {
    if (!newMilestoneNote.trim() || !newMilestoneLocation.trim() || !inspectingOrder) return;
    const now = new Date();
    const newMilestone = {
      title: 'Operational Telemetry Checkpoint',
      description: newMilestoneNote.trim(),
      timestamp: `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} CET`,
      location: newMilestoneLocation.trim(),
      completed: true,
      current: true,
    };
    const updatedSteps = inspectingOrder.steps.map((s) => ({ ...s, current: false }));
    updatedSteps.splice(Math.max(0, inspectingOrder.progressStep - 1), 0, newMilestone);

    const updated = updatePlacedOrder(orderNumber, {
      steps: updatedSteps,
      currentLocation: newMilestoneLocation.trim(),
    });
    if (updated) {
      refreshOrders();
      setInspectingOrder(updated);
      setNewMilestoneLocation('');
      setNewMilestoneNote('');
      logAdminAction('Milestone Pushed', 'order', `New checkpoint logged for #${orderNumber} at ${newMilestoneLocation}`, adminCreds.username);
      refreshAuditLogs();
      showToast('Logged transit milestone to patron telemetry!');
    }
  };

  const handleDeleteOrder = (orderNumber: string) => {
    if (window.confirm(`Are you sure you want to permanently delete Order #${orderNumber}?`)) {
      deletePlacedOrder(orderNumber);
      setSelectedOrderNumbers((prev) => prev.filter((id) => id !== orderNumber));
      refreshOrders();
      if (inspectingOrder?.orderNumber === orderNumber) {
        setInspectingOrder(null);
      }
      logAdminAction('Order Deleted', 'order', `Permanently purged record #${orderNumber}`, adminCreds.username);
      refreshAuditLogs();
      showToast(`Order #${orderNumber} deleted.`);
    }
  };

  const handleGeneratePerformancePDF = () => {
    try {
      const reportTitle = "AURELIA HAUTE HORLOGERIE - MONTHLY PERFORMANCE & SALES REPORT";
      const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      const totalRevUSD = monthlySalesTrends.reduce((sum, m) => sum + m.revenueUSD, 0);
      const totalVol = monthlySalesTrends.reduce((sum, m) => sum + m.orderVolume, 0);
      const avgAov = Math.round(totalRevUSD / Math.max(totalVol, 1));

      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Aurelia Performance Report - ${generatedDate}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; background: #fff; }
            .header { border-bottom: 2px solid #C5A059; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .brand { font-family: serif; font-size: 26px; font-weight: bold; color: #0f172a; letter-spacing: 1px; }
            .subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #9A7B38; font-weight: bold; margin-top: 4px; }
            .date { font-size: 11px; color: #64748B; font-family: monospace; }
            .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 35px; }
            .kpi-card { background: #FAF8F3; border: 1px solid #E2D7C5; border-radius: 12px; padding: 16px; }
            .kpi-label { font-size: 10px; text-transform: uppercase; color: #64748B; font-weight: bold; letter-spacing: 1px; }
            .kpi-value { font-size: 22px; font-weight: bold; color: #9A7B38; font-family: monospace; margin-top: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background: #0f172a; color: #F3EAD3; text-align: left; padding: 10px 12px; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
            td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #334155; }
            tr:nth-child(even) { background: #f8fafc; }
            .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">AURELIA HAUTE HORLOGERIE</div>
              <div class="subtitle">Official Executive Sales & Performance Dossier</div>
            </div>
            <div class="date">Generated: ${generatedDate} · Geneva Vault</div>
          </div>

          <div class="summary-grid">
            <div class="kpi-card">
              <div class="kpi-label">Total Realized Revenue (2026)</div>
              <div class="kpi-value">$${totalRevUSD.toLocaleString()} USD</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Consignment Order Volume</div>
              <div class="kpi-value">${totalVol} Orders</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Average Order Value (AOV)</div>
              <div class="kpi-value">$${avgAov.toLocaleString()} USD</div>
            </div>
          </div>

          <h3 style="font-family: serif; font-size: 16px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 15px;">
            Monthly Revenue & Order Volume Ledger
          </h3>

          <table>
            <thead>
              <tr>
                <th>Calendar Period</th>
                <th>Realized Revenue</th>
                <th>Target Quota</th>
                <th>Order Volume</th>
                <th>MoM Growth</th>
                <th>Quota Attainment</th>
              </tr>
            </thead>
            <tbody>
      `;

      monthlySalesTrends.forEach((m) => {
        htmlContent += `
          <tr>
            <td><strong>${m.month}</strong></td>
            <td><strong>$${m.revenueUSD.toLocaleString()} USD</strong></td>
            <td>$${(m.revenueUSD * 0.92).toFixed(0)} USD</td>
            <td>${m.orderVolume} orders</td>
            <td style="color: ${m.momRevPct >= 0 ? '#16a34a' : '#dc2626'}; font-weight: bold;">${m.momRevPct >= 0 ? '+' : ''}${m.momRevPct}%</td>
            <td><strong>${m.quotaAttainment}%</strong></td>
          </tr>
        `;
      });

      htmlContent += `
            </tbody>
          </table>

          <div class="footer">
            <span>Manufacture Aurelia · Quai du Mont-Blanc 19, 1201 Geneva, Switzerland</span>
            <span>Geneva Seal Certified · Confidential Executive Report</span>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
        logAdminAction('PDF Report Generated', 'settings', 'Generated and opened formatted monthly performance PDF report', adminCreds.username);
        refreshAuditLogs();
        showToast('Performance PDF report generated successfully!');
      } else {
        showToast('Popup blocked. Please allow popups to download PDF.');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not generate PDF report.');
    }
  };

  // Bulk Order Operations
  const handleToggleSelectOrder = (orderNumber: string) => {
    setSelectedOrderNumbers((prev) =>
      prev.includes(orderNumber) ? prev.filter((id) => id !== orderNumber) : [...prev, orderNumber]
    );
  };

  const handleSelectAllOrders = () => {
    if (selectedOrderNumbers.length === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrderNumbers([]);
    } else {
      setSelectedOrderNumbers(filteredOrders.map((o) => o.orderNumber));
    }
  };

  const handleBulkUpdateOrderStatus = (status: PlacedOrder['status']) => {
    if (selectedOrderNumbers.length === 0) return;
    let step = 1;
    if (status === 'Atelier Assembly') step = 2;
    else if (status === 'In Transit') step = 3;
    else if (status === 'Out for Delivery') step = 4;
    else if (status === 'Delivered') step = 5;

    selectedOrderNumbers.forEach((orderNumber) => {
      updatePlacedOrder(orderNumber, {
        status,
        progressStep: step,
        currentLocation:
          status === 'In Transit'
            ? 'Geneva Air Freight Armored Escort Center'
            : status === 'Delivered'
            ? 'Patron Private Residence (Secured Handover)'
            : undefined,
      });
    });

    refreshOrders();
    if (inspectingOrder && selectedOrderNumbers.includes(inspectingOrder.orderNumber)) {
      const refreshed = getPlacedOrders().find((o) => o.orderNumber === inspectingOrder.orderNumber);
      if (refreshed) setInspectingOrder(refreshed);
    }

    logAdminAction(
      'Bulk Order Status Update',
      'order',
      `Bulk updated ${selectedOrderNumbers.length} order(s) to "${status}" (Stage ${step})`,
      adminCreds.username
    );
    refreshAuditLogs();
    showToast(`Bulk updated ${selectedOrderNumbers.length} order(s) to "${status}".`);
    setSelectedOrderNumbers([]);
  };

  const handleBulkDeleteOrders = () => {
    if (selectedOrderNumbers.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${selectedOrderNumbers.length} selected orders from the registry?`
      )
    ) {
      selectedOrderNumbers.forEach((orderNumber) => {
        deletePlacedOrder(orderNumber);
      });
      refreshOrders();
      if (inspectingOrder && selectedOrderNumbers.includes(inspectingOrder.orderNumber)) {
        setInspectingOrder(null);
      }
      logAdminAction(
        'Bulk Order Deletion',
        'order',
        `Permanently purged ${selectedOrderNumbers.length} order records`,
        adminCreds.username
      );
      refreshAuditLogs();
      showToast(`Permanently deleted ${selectedOrderNumbers.length} order(s).`);
      setSelectedOrderNumbers([]);
    }
  };

  const handleResetOrders = () => {
    if (window.confirm('Reset orders back to initial Swiss demo consignments?')) {
      resetOrdersToDemo();
      setSelectedOrderNumbers([]);
      refreshOrders();
      setInspectingOrder(null);
      showToast('Orders reset to demo vault records.');
    }
  };

  const handleAddSupportNote = (customerEmail: string) => {
    if (!newSupportNoteText.trim()) return;
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} CET`;
    const newNote = {
      id: `note-${Date.now()}`,
      text: newSupportNoteText.trim(),
      date: dateStr,
      author: adminCreds.username || 'Admin Concierge',
      tag: newSupportNoteTag,
    };

    const targetKey = customerEmail.toLowerCase().trim();
    const updated = {
      ...supportNotes,
      [targetKey]: [newNote, ...(supportNotes[targetKey] || [])],
    };
    setSupportNotes(updated);
    try {
      localStorage.setItem('aurelia_customer_support_notes_v1', JSON.stringify(updated));
    } catch (e) {}
    setNewSupportNoteText('');
    logAdminAction('Support Note Added', 'order', `Logged VIP support note for patron ${customerEmail}`, adminCreds.username);
    refreshAuditLogs();
    showToast('Customer support note recorded to dossier!');
  };

  // Promo Code Handlers
  const handleTogglePromoActive = (promoId: string) => {
    const updated = promoCodes.map((p) => (p.id === promoId ? { ...p, active: !p.active } : p));
    savePromoCodes(updated);
    setPromoCodes(updated);
    showToast('Promo code status toggled.');
  };

  const handleDeletePromo = (promoId: string) => {
    const updated = promoCodes.filter((p) => p.id !== promoId);
    savePromoCodes(updated);
    setPromoCodes(updated);
    showToast('Promo code removed.');
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code.trim()) return;
    const created: PromoCode = {
      ...newPromo,
      id: `promo-${Date.now()}`,
      code: newPromo.code.trim().toUpperCase(),
      usesCount: 0,
    };
    const updated = [created, ...promoCodes];
    savePromoCodes(updated);
    setPromoCodes(updated);
    setIsPromoModalOpen(false);
    logAdminAction('Created Promo Code', 'promo', `Registered coupon code ${created.code}`, adminCreds.username);
    refreshAuditLogs();
    showToast(`Concession code "${created.code}" registered!`);
  };

  // Settings Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteSettings(settings);
    setSettingsSavedSuccess(true);
    logAdminAction('Site Settings Deployed', 'settings', 'Updated announcement banner and atelier showroom parameters', adminCreds.username);
    refreshAuditLogs();
    showToast('Atelier site controls updated & deployed live!');
    setTimeout(() => setSettingsSavedSuccess(false), 3000);
  };

  const handleResetSettings = () => {
    if (window.confirm('Reset all site settings, announcement banner, and contact details to factory defaults?')) {
      const def = resetSiteSettings();
      setSettings(def);
      showToast('Site settings reset to defaults.');
    }
  };

  // --------------------------------------------------------------------------
  // AUTHENTICATION GUARD: If not authenticated, render Luxury Admin Login Screen
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="relative w-full min-h-[calc(100dvh-110px)] bg-[#FAF9F5] sm:bg-[#F5F4EE] flex items-start justify-center px-3 sm:px-4 pt-3 sm:pt-6 pb-10 font-sans overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-8 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-top duration-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Central Clean Admin Login Card in Luxury White */}
        <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-xl text-slate-800 font-sans">
          {/* Top Bar: Return Link */}
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <button
              onClick={() => onNavigate('home')}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Store</span>
            </button>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A7B38]">
              Aurelia Atelier
            </span>
          </div>

          {/* Icon & Title */}
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#FAF7F0] border border-[#E9DEC6] flex items-center justify-center text-[#9A7B38] shadow-2xs">
              <Shield className="w-5 h-5 text-[#9A7B38]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif">
                Admin Portal Sign In
              </h1>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-light">
                Enter your credentials to manage timepiece inventory, orders, and store settings.
              </p>
            </div>
          </div>

          {/* Login Error Alert */}
          {loginError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Forgot Password Success Alert */}
          {forgotPasswordSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{forgotPasswordSuccess}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    setLoginError(null);
                    setForgotPasswordSuccess(null);
                  }}
                  placeholder="Enter username"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9A7B38] focus:ring-1 focus:ring-[#9A7B38] transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError(null);
                    setForgotPasswordSuccess(null);
                  }}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9A7B38] focus:ring-1 focus:ring-[#9A7B38] transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#9A7B38] rounded border-slate-300"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-[#9A7B38] hover:text-slate-900 font-semibold hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#C5A059] via-[#D8B66C] to-[#9A7B38] hover:from-[#B89243] hover:to-[#856525] active:from-[#856525] transition-all shadow-md hover:shadow-lg shadow-[#C5A059]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoggingIn ? (
                <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Key className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Discreet Demo Helper */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="font-mono text-[11px]">
              <span>Demo: </span>
              <span className="text-[#9A7B38] font-bold">admin</span>
              <span className="text-slate-400"> / </span>
              <span className="text-[#9A7B38] font-bold">admin123</span>
            </div>
            <button
              type="button"
              onClick={handleAutofillCreds}
              className="text-xs font-semibold text-[#9A7B38] hover:text-[#7d6229] hover:underline cursor-pointer"
            >
              Autofill
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED: Full Dedicated Maison Master Administration Dashboard
  // --------------------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:top-24 sm:right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for JSON Catalog Import */}
      <input
        ref={fileImportRef}
        type="file"
        accept=".json"
        onChange={handleImportCatalogJSON}
        className="hidden"
      />

      {/* Top Professional Navigation Bar */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight font-sans whitespace-nowrap">Aurelia Atelier</span>
                <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Admin
                </span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:block">Management Console</span>
            </div>
          </div>

          {/* Right: CET Clock, Session Timer, User Profile, Store Link & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-4 min-w-0">
            {/* System Status: CET Clock & Session Timer */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* CET Clock */}
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>CET: {currentTimeCET}</span>
              </div>

              {/* Inactivity Session Timer */}
              <div className={`flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border text-[11px] sm:text-xs transition-colors shrink-0 ${
                sessionSecondsLeft < 180
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <Clock className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${sessionSecondsLeft < 180 ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
                <span className="font-mono font-medium">
                  {formatCountdown(sessionSecondsLeft)}
                </span>
                <button
                  type="button"
                  onClick={handleExtendSession}
                  className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
                  title="Extend session by 15 minutes"
                >
                  +15m
                </button>
              </div>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-slate-200 mx-0.5 sm:mx-1 hidden sm:block" />

            {/* User Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Admin User Chip */}
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-800">{adminCreds.username}</span>
              </div>

              {/* Return to Store */}
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Return to Storefront"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Store</span>
              </button>

              {/* Log Out */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Sign out of admin console"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Container */}
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 space-y-5 sm:space-y-6 font-sans">
        
        {/* Simple Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
              Store Management Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
              Manage timepiece inventory, review client consignment orders, configure boutique settings, and view sales telemetry.
            </p>
          </div>
        </div>

        {/* Main Content Layout: Vertical Navigation Sidebar + Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Vertical Navigation Menu (Responsive Tabs on Mobile) */}
          <aside className="lg:col-span-3 xl:col-span-2 space-y-4 lg:sticky lg:top-24 w-full">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-2 sm:p-3 space-y-2 lg:space-y-3">
              <div className="px-1 sm:px-2 py-0.5 sm:py-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Menu Modules
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">v1.2</span>
                </div>

                {/* Left & Right Scroll Buttons (Single set on mobile/tablet) */}
                <div className="flex lg:hidden items-center gap-1">
                  <button
                    type="button"
                    onClick={() => scrollMenuNav('left')}
                    className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 active:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200 shadow-2xs"
                    title="Scroll modules left"
                    aria-label="Scroll modules left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollMenuNav('right')}
                    className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 active:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200 shadow-2xs"
                    title="Scroll modules right"
                    aria-label="Scroll modules right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Items: Horizontal scroll on mobile, vertical on desktop */}
              <nav
                ref={menuNavRef}
                className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 lg:gap-1 pb-1 lg:pb-0 scrollbar-none px-0.5 touch-pan-x scroll-smooth w-full"
                aria-label="Admin Navigation Modules"
              >
                {/* 1. Timepieces */}
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className={`shrink-0 lg:w-full flex items-center justify-between gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-lg transition-colors cursor-pointer text-left text-xs whitespace-nowrap ${
                    activeTab === 'products'
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal bg-slate-50 lg:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Timepieces Catalog</span>
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.2 rounded-md ${
                    activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {watches.length}
                  </span>
                </button>

                {/* 2. Consignment Orders */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('orders');
                    refreshOrders();
                  }}
                  className={`shrink-0 lg:w-full flex items-center justify-between gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-lg transition-colors cursor-pointer text-left text-xs whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal bg-slate-50 lg:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Orders</span>
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.2 rounded-md ${
                    activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {orders.length}
                  </span>
                </button>

                {/* 3. Site Settings */}
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`shrink-0 lg:w-full flex items-center justify-between gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-lg transition-colors cursor-pointer text-left text-xs whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal bg-slate-50 lg:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Settings</span>
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.2 rounded-md ${
                    activeTab === 'settings' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {promoCodes.length}
                  </span>
                </button>

                {/* 4. Sales Analytics */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('analytics');
                    refreshAuditLogs();
                  }}
                  className={`shrink-0 lg:w-full flex items-center justify-between gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-lg transition-colors cursor-pointer text-left text-xs whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal bg-slate-50 lg:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Analytics</span>
                  </div>
                </button>

                {/* 5. Activity Log */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('audit');
                    refreshAuditLogs();
                  }}
                  className={`shrink-0 lg:w-full flex items-center justify-between gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-lg transition-colors cursor-pointer text-left text-xs whitespace-nowrap ${
                    activeTab === 'audit'
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal bg-slate-50 lg:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Activity Log</span>
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.2 rounded-md ${
                    activeTab === 'audit' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {auditLogs.length}
                  </span>
                </button>
              </nav>

              {/* Sidebar Action Button (Desktop only, as header already has Add button) */}
              <div className="hidden lg:block pt-2 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Timepiece</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="lg:col-span-9 xl:col-span-10 min-w-0">

        {/* ---------------- TAB 1: PRODUCT & VAULT MANAGER ---------------- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* 1. Timepieces Module Header Card */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                    <Package className="w-4 h-4 text-slate-800" />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
                    Inventory & Calibres Module
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-sans">
                  Timepieces & Calibre Inventory
                </h2>
                <p className="text-xs text-slate-500 max-w-xl">
                  Manage boutique catalog allocations, stock levels, reference pricing, and bespoke commissions.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="col-span-2 sm:col-auto px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Timepiece</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCatalogJSON}
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Export catalog backup as JSON"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileImportRef.current?.click()}
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Import watches from JSON backup"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Import</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('analytics')}
                  className="col-span-2 sm:col-auto px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  title="View stock consumption curve and predictive reorder modeling in Sales Analytics"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                  <span>Velocity Modeling</span>
                </button>
              </div>
            </div>

            {/* 2. Metric KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <span>Total Watches</span>
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9A7B38]" />
                </div>
                <div className="font-mono text-xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                  {watches.length}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#9A7B38] font-semibold truncate">Active in Catalog</div>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <span>Vault Inventory</span>
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                </div>
                <div className="font-mono text-xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                  {totalStock}
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] flex-wrap gap-1">
                  <span className="text-emerald-600 font-semibold truncate">Physical Units</span>
                  {lowStockCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedStockFilter(selectedStockFilter === 'lowstock' ? 'all' : 'lowstock')}
                      className="inline-flex items-center gap-1 font-mono font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full border border-amber-300 transition-colors cursor-pointer text-[9px] sm:text-[10px]"
                      title="Filter watches with fewer than 3 items in stock"
                    >
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-700" />
                      <span>{lowStockCount} Low</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <span>Limited Editions</span>
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9A7B38]" />
                </div>
                <div className="font-mono text-xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                  {limitedCount}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#9A7B38] font-semibold truncate">Numbered Series</div>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <span>Total Value</span>
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9A7B38]" />
                </div>
                <div className="font-mono text-base sm:text-2xl font-extrabold text-[#9A7B38] tabular-nums truncate">
                  <AnimatedPrice amountUSD={totalValuation} currency={currency} />
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate">Geneva Insured Holding</div>
              </div>
            </div>

            {/* 3. Catalog Filter & Search Card Component */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                    <Filter className="w-3.5 h-3.5 text-slate-800" />
                  </span>
                  <h3 className="font-sans text-xs sm:text-sm font-bold text-slate-900">
                    Filter & Search Catalog
                  </h3>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium">
                  {filteredWatches.length} of {watches.length} models
                </span>
              </div>
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by timepiece name, reference, calibre..."
                    className="w-full pl-10 pr-12 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#9A7B38] text-slate-900 shadow-2xs font-semibold"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#9A7B38] shadow-2xs cursor-pointer"
                  >
                    <option value="all">All Collections</option>
                    <option value="Chronograph">Chronographs</option>
                    <option value="Tourbillon">Tourbillons</option>
                    <option value="Diver">Diver 300M</option>
                    <option value="Dress">Dress / Patrimoine</option>
                    <option value="Grand Complication">Grand Complications</option>
                  </select>

                  <select
                    value={selectedStockFilter}
                    onChange={(e) => setSelectedStockFilter(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#9A7B38] shadow-2xs cursor-pointer"
                  >
                    <option value="all">All Inventory</option>
                    <option value="instock">In Vault Only</option>
                    <option value="lowstock">⚠️ Low Stock (&lt; 3 left) {lowStockCount > 0 ? `(${lowStockCount})` : ''}</option>
                    <option value="soldout">Sold Out Only</option>
                  </select>

                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#9A7B38] shadow-2xs cursor-pointer"
                  >
                    <option value="price-desc">Price: Highest First</option>
                    <option value="price-asc">Price: Lowest First</option>
                    <option value="stock-desc">Stock: Most Units</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="ref-asc">Reference: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Secondary Action Row: Export/Import, Reset, Add Watch */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200/70">
                <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handleExportCatalogJSON}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:border-[#9A7B38] text-[11px] sm:text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    title="Export backup JSON of all watches"
                  >
                    <Download className="w-3.5 h-3.5 text-[#9A7B38]" />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => fileImportRef.current?.click()}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:border-[#9A7B38] text-[11px] sm:text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    title="Import watches from JSON backup"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#9A7B38]" />
                    <span>Import</span>
                  </button>

                  <button
                    onClick={onResetCatalog}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:border-[#9A7B38] text-[11px] sm:text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    title="Reset to factory Swiss catalog"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#9A7B38]" />
                    <span>Reset</span>
                  </button>
                </div>

                <button
                  onClick={handleOpenAdd}
                  className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Add New Timepiece</span>
                </button>
              </div>
            </div>

            {/* Low Stock Alert Notice Banner */}
            {lowStockCount > 0 && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs shadow-2xs animate-in fade-in-50 duration-200">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-900 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-950 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span>Vault Low Stock Notice</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-200 text-amber-900 border border-amber-300">
                        {lowStockCount} Timepiece{lowStockCount > 1 ? 's' : ''} &lt; 3 Units Left
                      </span>
                    </h4>
                    <p className="text-amber-850 text-[11px] mt-0.5">
                      The inventory below contains timepieces with fewer than 3 items remaining in the vault file.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedStockFilter(selectedStockFilter === 'lowstock' ? 'all' : 'lowstock')}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xs transition-colors cursor-pointer shadow-2xs font-mono text-center"
                  >
                    {selectedStockFilter === 'lowstock' ? 'Show All Watches' : 'Filter Low Stock Calibres'}
                  </button>
                </div>
              </div>
            )}

            {/* Bulk Actions Bar (Appears when 1+ watches are selected) */}
            {selectedWatchIds.length > 0 && (
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
                  <span className="px-2 py-0.5 rounded-full bg-[#C5A059] text-black font-mono font-extrabold text-[11px]">
                    {selectedWatchIds.length} Selected
                  </span>
                  <span>Bulk Timepiece Actions</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => handleBulkSetStock(true)}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-bold cursor-pointer"
                  >
                    Mark In-Vault
                  </button>
                  <button
                    onClick={() => handleBulkSetStock(false)}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[11px] sm:text-xs font-bold cursor-pointer"
                  >
                    Mark Sold Out
                  </button>
                  <button
                    onClick={handleBulkToggleFeatured}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-[#9A7B38] hover:bg-[#B89243] text-black text-[11px] sm:text-xs font-bold cursor-pointer"
                  >
                    Toggle Featured
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] sm:text-xs font-bold cursor-pointer"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedWatchIds([])}
                    className="px-2 py-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            )}

            {/* 4. Timepieces Ledger Table Card Component */}
            <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="p-3.5 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-white">
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                    <Layers className="w-4 h-4 text-slate-800" />
                  </span>
                  <div>
                    <h3 className="font-sans text-xs sm:text-sm font-bold text-slate-900">
                      Active Timepiece Ledger
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500">
                      Physical vault stock, reference codes, calibres, and boutique prices.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
                    {filteredWatches.length} of {watches.length} Models
                  </span>
                </div>
              </div>

              {/* Mobile View: Dedicated Responsive Cards */}
              <div className="block md:hidden divide-y divide-slate-100">
                {filteredWatches.length === 0 ? (
                  <div className="py-12 px-4 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#9A7B38]" />
                    <p className="font-semibold text-slate-600 text-xs">No timepieces found matching criteria</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try clearing filters or add a new timepiece.</p>
                  </div>
                ) : (
                  filteredWatches.map((watch) => {
                    const isSelected = selectedWatchIds.includes(watch.id);
                    return (
                      <div
                        key={watch.id}
                        className={`p-3.5 space-y-3 transition-colors ${isSelected ? 'bg-[#9A7B38]/5' : 'bg-white'}`}
                      >
                        {/* Top: Checkbox, Thumbnail, Title & Tags */}
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectWatch(watch.id)}
                            className="text-slate-400 hover:text-slate-800 cursor-pointer pt-1"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#9A7B38]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                          <div className="relative shrink-0">
                            <img
                              src={watch.image}
                              alt={watch.name}
                              className="w-13 h-13 rounded-xl object-cover bg-slate-100 border border-slate-200 shadow-2xs"
                            />
                            {watch.stockCount > 0 && watch.stockCount < 3 && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {watch.reference}
                              </span>
                              <span className="text-[9px] font-semibold text-[#9A7B38] bg-[#9A7B38]/10 px-1.5 py-0.2 rounded">
                                {watch.collection}
                              </span>
                              {watch.isLimitedEdition && (
                                <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.2 rounded font-mono">
                                  Ltd {watch.editionLimit || 25}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1 line-clamp-1">{watch.name}</h4>
                            <div className="text-[10px] text-slate-400 font-mono truncate">{watch.specs.calibre || 'In-House'}</div>
                          </div>
                        </div>

                        {/* Middle: Valuation Price & Stock Stepper */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                          <div>
                            <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                              <AnimatedPrice amountUSD={watch.priceUSD} currency={currency} />
                            </div>
                            <div className="text-[10px] text-slate-400 font-sans">${watch.priceUSD.toLocaleString()} USD</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Stock Stepper */}
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleAdjustStock(watch, -1)}
                                className="px-2 py-1 hover:bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                                title="Decrease stock"
                              >
                                -
                              </button>
                              <span className={`px-2 font-mono font-bold text-xs ${
                                watch.stockCount > 0 && watch.stockCount < 3
                                  ? 'text-amber-800 bg-amber-50'
                                  : watch.stockCount === 0
                                  ? 'text-rose-700 bg-rose-50'
                                  : 'text-slate-800'
                              }`}>
                                {watch.stockCount}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAdjustStock(watch, 1)}
                                className="px-2 py-1 hover:bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                                title="Increase stock"
                              >
                                +
                              </button>
                            </div>

                            {/* Status badge */}
                            <button
                              type="button"
                              onClick={() => handleToggleStock(watch)}
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border cursor-pointer ${
                                watch.inStock && watch.stockCount > 0
                                  ? watch.stockCount < 3
                                    ? 'bg-amber-50 text-amber-900 border-amber-300 font-mono'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-rose-50 text-rose-700 border-rose-300'
                              }`}
                            >
                              {watch.inStock && watch.stockCount > 0 ? (watch.stockCount < 3 ? 'Low Stock' : 'In Vault') : 'Sold Out'}
                            </button>
                          </div>
                        </div>

                        {/* Bottom: Action buttons */}
                        <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(watch)}
                            className={`px-2 py-1 rounded-lg border text-xs flex items-center gap-1 cursor-pointer ${
                              watch.isFeatured
                                ? 'bg-[#9A7B38]/15 border-[#9A7B38] text-[#9A7B38] font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                            title="Toggle Featured"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-current" />
                            <span className="text-[10px]">{watch.isFeatured ? 'Featured' : 'Feature'}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onViewWatch(watch)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#9A7B38] cursor-pointer"
                              title="View in store"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicateWatch(watch)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 cursor-pointer"
                              title="Duplicate timepiece"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(watch)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-blue-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              title="Edit full specifications"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                              <span className="text-[11px]">Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(watch)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Delete timepiece"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop View: Full Data Ledger Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[760px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
                      <th className="py-3.5 px-3 w-10 text-center">
                        <button
                          onClick={handleSelectAllWatches}
                          className="text-slate-500 hover:text-slate-800 cursor-pointer"
                          title="Select / Deselect all"
                        >
                          {selectedWatchIds.length > 0 && selectedWatchIds.length === filteredWatches.length ? (
                            <CheckSquare className="w-4 h-4 text-[#9A7B38]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="py-3.5 px-4">Timepiece</th>
                      <th className="py-3.5 px-4">Collection & Reference</th>
                      <th className="py-3.5 px-4">Valuation Price</th>
                      <th className="py-3.5 px-4">Vault Stock</th>
                      <th className="py-3.5 px-4 text-center">Featured</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredWatches.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <Package className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#9A7B38]" />
                          <p className="font-semibold text-slate-600">No timepieces found matching criteria</p>
                          <p className="text-xs text-slate-400 mt-1">Try clearing your filters or add a new timepiece.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredWatches.map((watch) => {
                        const isSelected = selectedWatchIds.includes(watch.id);
                        return (
                          <tr
                            key={watch.id}
                            className={`transition-colors ${isSelected ? 'bg-[#9A7B38]/5' : 'hover:bg-slate-50/80'}`}
                          >
                            {/* Checkbox */}
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => handleToggleSelectWatch(watch.id)}
                                className="text-slate-400 hover:text-slate-800 cursor-pointer"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-[#9A7B38]" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>

                            {/* Image & Name */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                  <img
                                    src={watch.image}
                                    alt={watch.name}
                                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shadow-2xs"
                                  />
                                  {watch.stockCount > 0 && watch.stockCount < 3 && (
                                    <span
                                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-mono font-black border border-white shadow-xs flex items-center justify-center animate-pulse"
                                      title="Low stock alert: fewer than 3 items remaining"
                                    >
                                      !
                                    </span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-slate-900 line-clamp-1">{watch.name}</span>
                                    {watch.stockCount > 0 && watch.stockCount < 3 && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shrink-0 font-mono">
                                        <AlertTriangle className="w-2.5 h-2.5 text-amber-700" />
                                        <span>Low Stock</span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 line-clamp-1">{watch.tagline}</div>
                                </div>
                              </div>
                            </td>

                            {/* Collection & Ref */}
                            <td className="py-3 px-4">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 mb-1">
                                {watch.collection}
                              </span>
                              <div className="font-mono text-[11px] text-[#9A7B38] font-bold">{watch.reference}</div>
                            </td>

                            {/* Price with Quick Inline Edit */}
                            <td className="py-3 px-4">
                              {inlinePriceEditId === watch.id ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-400">$</span>
                                  <input
                                    type="number"
                                    min="1000"
                                    step="500"
                                    value={inlinePriceValue}
                                    onChange={(e) => setInlinePriceValue(Number(e.target.value))}
                                    className="w-24 px-2 py-1 rounded border border-[#9A7B38] text-xs font-mono font-bold text-slate-900 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleSaveInlinePrice(watch)}
                                    className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                                    title="Save price"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setInlinePriceEditId(null)}
                                    className="p-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer"
                                    title="Cancel"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="group/price flex items-center gap-1.5">
                                  <div>
                                    <div className="font-mono font-bold text-slate-900 text-xs">
                                      <AnimatedPrice amountUSD={watch.priceUSD} currency={currency} />
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-sans">${watch.priceUSD.toLocaleString()} USD</div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setInlinePriceEditId(watch.id);
                                      setInlinePriceValue(watch.priceUSD);
                                    }}
                                    className="opacity-0 group-hover/price:opacity-100 p-1 text-slate-400 hover:text-[#9A7B38] transition-opacity cursor-pointer"
                                    title="Quick edit price"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Stock Controls with Low Stock Alert */}
                            <td className="py-3 px-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                                    <button
                                      onClick={() => handleAdjustStock(watch, -1)}
                                      className="px-2 py-1 hover:bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                                      title="Decrease stock"
                                    >
                                      -
                                    </button>
                                    <span className={`px-2.5 font-mono font-bold text-xs ${
                                      watch.stockCount > 0 && watch.stockCount < 3
                                        ? 'text-amber-800 bg-amber-50'
                                        : watch.stockCount === 0
                                        ? 'text-rose-700 bg-rose-50'
                                        : 'text-slate-800'
                                    }`}>
                                      {watch.stockCount}
                                    </span>
                                    <button
                                      onClick={() => handleAdjustStock(watch, 1)}
                                      className="px-2 py-1 hover:bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                                      title="Increase stock"
                                    >
                                      +
                                    </button>
                                  </div>
                                  {watch.isLimitedEdition && (
                                    <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-mono">
                                      Ltd {watch.editionLimit || 25}
                                    </span>
                                  )}
                                </div>

                                {/* Low Stock Alert Badge below stepper */}
                                <div>
                                  {watch.stockCount > 0 && watch.stockCount < 3 ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                                      <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                                      <span>Low Stock ({watch.stockCount} left)</span>
                                    </span>
                                  ) : watch.stockCount === 0 ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                                      <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                                      <span>Depleted (0)</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200">
                                      <span>{watch.stockCount} in vault</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Toggle Featured */}
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleToggleFeatured(watch)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  watch.isFeatured
                                    ? 'bg-[#9A7B38]/15 border-[#9A7B38] text-[#9A7B38]'
                                    : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
                                }`}
                                title={watch.isFeatured ? 'Featured on Home (Click to unfeature)' : 'Click to feature on Home'}
                              >
                                <Sparkles className="w-4 h-4 fill-current" />
                              </button>
                            </td>

                            {/* Stock Status Badge */}
                            <td className="py-3 px-4 text-center">
                              {watch.inStock && watch.stockCount > 0 && watch.stockCount < 3 ? (
                                <button
                                  onClick={() => handleToggleStock(watch)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-2xs font-mono"
                                  title="Low stock: Fewer than 3 items remaining! Click to toggle status."
                                >
                                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span>Low Stock</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleStock(watch)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                                    watch.inStock && watch.stockCount > 0
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                      : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                                  }`}
                                >
                                  {watch.inStock && watch.stockCount > 0 ? 'In Vault' : 'Sold Out'}
                                </button>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onViewWatch(watch)}
                                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#9A7B38] hover:border-[#9A7B38] transition-colors cursor-pointer"
                                  title="View timepiece live in store"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateWatch(watch)}
                                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 hover:border-emerald-300 transition-colors cursor-pointer"
                                  title="Duplicate / Clone timepiece"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEdit(watch)}
                                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
                                  title="Edit full specifications"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(watch)}
                                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
                                  title="Delete timepiece"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: ORDER & CONSIGNMENT MANAGER ---------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* 1. Orders Module Header Card */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                    <ShoppingBag className="w-4 h-4 text-slate-800" />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
                    Commerce & Consignment Module
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-sans">
                  Consignment Orders & Client Patron Records
                </h2>
                <p className="text-xs text-slate-500 max-w-xl">
                  Inspect luxury consignments, track courier air waybills, update dispatch stages, and manage collector customer histories.
                </p>
              </div>

              {/* Sub-Tab Navigation & Sales Analytics */}
              <div className="flex flex-wrap items-center gap-2 self-start lg:self-center w-full lg:w-auto">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200 flex-1 sm:flex-initial">
                  <button
                    type="button"
                    onClick={() => setOrderSubTab('orders')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      orderSubTab === 'orders'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-700" />
                    <span>Orders ({orders.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderSubTab('customer-history')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      orderSubTab === 'customer-history'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <History className="w-3.5 h-3.5 text-slate-700" />
                    <span>Patrons ({customersList.length})</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('analytics')}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs w-full sm:w-auto"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sales Analytics</span>
                </button>
              </div>
            </div>

            {/* SUB-TAB 1: ALL CONSIGNMENT ORDERS FEED */}
            {orderSubTab === 'orders' && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in-50 duration-150">
                {/* 2. KPI Cards for Orders */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      <span>Total Orders</span>
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9A7B38]" />
                    </div>
                    <div className="font-mono text-xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                      {orders.length}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-[#9A7B38] font-semibold truncate">Active Vault Consignments</div>
                  </div>

                  <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      <span>Total Revenue</span>
                      <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                    </div>
                    <div className="font-mono text-base sm:text-2xl font-extrabold text-emerald-700 tabular-nums truncate">
                      <AnimatedPrice amountUSD={totalOrderRevenue} currency={currency} />
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold truncate">${totalOrderRevenue.toLocaleString()} USD</div>
                  </div>

                  <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      <span>In Transit</span>
                      <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <div className="font-mono text-xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                      {orders.filter((o) => o.status === 'In Transit' || o.status === 'Out for Delivery').length}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-blue-600 font-semibold truncate">Armored Air Courier</div>
                  </div>

                  <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      <span>Delivered</span>
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                    </div>
                    <div className="font-mono text-xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                      {orders.filter((o) => o.status === 'Delivered').length}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate">Geneva Handover Verified</div>
                  </div>
                </div>

                {/* 3. Filter, Search, and Export Card Component */}
                <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                        <Filter className="w-3.5 h-3.5 text-slate-800" />
                      </span>
                      <h3 className="font-sans text-xs sm:text-sm font-bold text-slate-900">
                        Filter & Search Consignments
                      </h3>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium">
                      {filteredOrders.length} of {orders.length} orders
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-1">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          placeholder="Search Order ID, Client Name, Email, or AWB..."
                          className="w-full pl-10 pr-12 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#9A7B38] text-slate-900 shadow-2xs font-semibold"
                        />
                        {orderSearchQuery && (
                          <button
                            onClick={() => setOrderSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <select
                        value={selectedOrderStatus}
                        onChange={(e) => setSelectedOrderStatus(e.target.value)}
                        className="w-full sm:w-auto px-3.5 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#9A7B38] shadow-2xs cursor-pointer"
                      >
                        <option value="all">All Order Statuses</option>
                        <option value="Allocated">Allocated</option>
                        <option value="Atelier Assembly">Atelier Assembly</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 sm:flex items-center gap-2">
                      <button
                        onClick={handleExportOrdersCSV}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-[#9A7B38] text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Export all orders to CSV"
                      >
                        <Download className="w-3.5 h-3.5 text-[#9A7B38]" />
                        <span>Export CSV</span>
                      </button>

                      <button
                        onClick={handleResetOrders}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-[#9A7B38] hover:text-[#9A7B38] text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Reset to default demo orders"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#9A7B38]" />
                        <span>Reset Orders</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions Bar (Appears when 1+ orders are selected) */}
                {selectedOrderNumbers.length > 0 && (
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono font-extrabold shadow-xs text-[11px]">
                        {selectedOrderNumbers.length} Selected
                      </span>
                      <span className="text-slate-300 text-[11px] truncate">
                        Total:{' '}
                        <span className="text-[#E2C775] font-mono">
                          $
                          {orders
                            .filter((o) => selectedOrderNumbers.includes(o.orderNumber))
                            .reduce((sum, o) => sum + o.totalUSD, 0)
                            .toLocaleString()}{' '}
                          USD
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => handleBulkUpdateOrderStatus('In Transit')}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                        title="Mark selected orders as Shipped / In Transit"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Shipped</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBulkUpdateOrderStatus('Delivered')}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                        title="Mark selected orders as Delivered"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Delivered</span>
                      </button>

                      <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700 text-xs">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleBulkUpdateOrderStatus(e.target.value as PlacedOrder['status']);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                          className="bg-transparent text-[11px] font-semibold text-slate-200 focus:outline-none cursor-pointer"
                        >
                          <option value="" disabled className="bg-slate-900 text-slate-400">Set Status...</option>
                          <option value="Allocated" className="bg-slate-900 text-slate-200">Allocated</option>
                          <option value="Atelier Assembly" className="bg-slate-900 text-slate-200">Assembly</option>
                          <option value="In Transit" className="bg-slate-900 text-slate-200">In Transit</option>
                          <option value="Out for Delivery" className="bg-slate-900 text-slate-200">Out for Deliv</option>
                          <option value="Delivered" className="bg-slate-900 text-slate-200">Delivered</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleBulkDeleteOrders}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                        title="Delete selected orders"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedOrderNumbers([])}
                        className="px-2 py-1 text-[11px] text-slate-400 hover:text-white cursor-pointer transition-colors"
                      >
                        Deselect
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Orders Dispatch Ledger Table Card Component */}
                <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <div className="p-3.5 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-white">
                    <div className="flex items-center gap-2.5">
                      <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                        <Truck className="w-4 h-4 text-slate-800" />
                      </span>
                      <div>
                        <h3 className="font-sans text-xs sm:text-sm font-bold text-slate-900">
                          Consignment Dispatch Ledger
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-500">
                          Live order queue with airway bills, buyer profiles, and courier milestones.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
                        {filteredOrders.length} of {orders.length} Consignments
                      </span>
                    </div>
                  </div>

                  {/* Mobile View: Dedicated Responsive Order Cards */}
                  <div className="block md:hidden divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <div className="py-12 px-4 text-center text-slate-400">
                        <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#9A7B38]" />
                        <p className="font-semibold text-slate-600 text-xs">No orders found</p>
                        <p className="text-[11px] text-slate-400 mt-1">Orders placed via Checkout will appear here.</p>
                      </div>
                    ) : (
                      filteredOrders.map((order) => {
                        const isSelected = selectedOrderNumbers.includes(order.orderNumber);
                        return (
                          <div
                            key={order.orderNumber}
                            className={`p-3.5 space-y-3 transition-colors ${
                              isSelected ? 'bg-amber-50/70' : 'bg-white'
                            }`}
                          >
                            {/* Card Top: Checkbox, Order ID, Date & Status Dropdown */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelectOrder(order.orderNumber)}
                                  className="text-slate-500 hover:text-slate-800 cursor-pointer pt-0.5"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-[#9A7B38]" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400" />
                                  )}
                                </button>
                                <div>
                                  <div className="font-mono font-extrabold text-[#9A7B38] text-xs">
                                    {order.orderNumber}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-sans">{order.orderDate}</div>
                                </div>
                              </div>

                              {/* Status Selector */}
                              <select
                                value={order.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value as PlacedOrder['status'];
                                  let step = 1;
                                  if (newStatus === 'Atelier Assembly') step = 2;
                                  else if (newStatus === 'In Transit') step = 3;
                                  else if (newStatus === 'Out for Delivery') step = 4;
                                  else if (newStatus === 'Delivered') step = 5;
                                  handleUpdateOrderStatus(order.orderNumber, newStatus, step);
                                }}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                                  order.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : order.status === 'In Transit' || order.status === 'Out for Delivery'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Allocated">Stage 1: Allocated</option>
                                <option value="Atelier Assembly">Stage 2: Assembly</option>
                                <option value="In Transit">Stage 3: In Transit</option>
                                <option value="Out for Delivery">Stage 4: Out for Deliv</option>
                                <option value="Delivered">Stage 5: Delivered</option>
                              </select>
                            </div>

                            {/* Client & Airway Bill info */}
                            <div className="flex items-start justify-between gap-2 text-xs pt-1 border-t border-slate-100">
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-900 truncate">{order.clientName}</div>
                                <div className="text-[11px] text-slate-500 truncate">{order.email}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">AWB: {order.airwayBill}</div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                                  <AnimatedPrice amountUSD={order.totalUSD} currency={currency} />
                                </div>
                                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                                  {order.paymentMethod === 'armored-cod' ? '🛡️ COD' : order.paymentMethod === 'wire' ? '🏦 Wire' : '💳 Card'}
                                </span>
                              </div>
                            </div>

                            {/* Timepiece items summary */}
                            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 shrink-0 bg-slate-50 border border-slate-200 rounded-lg p-1 pr-2">
                                  <img src={it.image} alt={it.name} className="w-6 h-6 rounded object-cover" />
                                  <span className="text-[10px] font-bold text-slate-700 max-w-[120px] truncate">{it.name}</span>
                                  <span className="text-[9px] text-slate-400 font-mono">x{it.quantity}</span>
                                </div>
                              ))}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCustomerId(order.email || order.clientName);
                                  setOrderSubTab('customer-history');
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#9A7B38] text-slate-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <History className="w-3.5 h-3.5 text-[#9A7B38]" />
                                <span className="text-[11px]">Patron Dossier</span>
                              </button>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setInspectingOrder(order)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                                  <span className="text-[11px]">Inspect</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.orderNumber)}
                                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 cursor-pointer"
                                  title="Delete order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Desktop View: Full Consignment Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
                          <th className="py-3.5 px-3 w-10 text-center">
                            <button
                              type="button"
                              onClick={handleSelectAllOrders}
                              className="text-slate-500 hover:text-slate-800 cursor-pointer flex items-center justify-center mx-auto"
                              title={
                                selectedOrderNumbers.length > 0 && selectedOrderNumbers.length === filteredOrders.length
                                  ? "Deselect all orders"
                                  : "Select all filtered orders"
                              }
                            >
                              {selectedOrderNumbers.length > 0 && selectedOrderNumbers.length === filteredOrders.length ? (
                                <CheckSquare className="w-4 h-4 text-[#9A7B38]" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                              )}
                            </button>
                          </th>
                          <th className="py-3.5 px-4">Order ID & Date</th>
                          <th className="py-3.5 px-4">Client Patron</th>
                          <th className="py-3.5 px-4">Timepieces</th>
                          <th className="py-3.5 px-4">Total Amount</th>
                          <th className="py-3.5 px-4">Payment Method</th>
                          <th className="py-3.5 px-4">Consignment Status</th>
                          <th className="py-3.5 px-4 text-right">Inspect & Manage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-slate-400">
                              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#9A7B38]" />
                              <p className="font-semibold text-slate-600">No orders found</p>
                              <p className="text-xs text-slate-400 mt-1">Orders placed via Checkout will appear here immediately.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => {
                            const isSelected = selectedOrderNumbers.includes(order.orderNumber);
                            return (
                            <tr
                              key={order.orderNumber}
                              className={`transition-colors ${
                                isSelected ? 'bg-amber-50/70 hover:bg-amber-50' : 'hover:bg-slate-50/80'
                              }`}
                            >
                              <td className="py-3.5 px-3 w-10 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelectOrder(order.orderNumber)}
                                  className="text-slate-500 hover:text-slate-800 cursor-pointer flex items-center justify-center mx-auto"
                                  title={isSelected ? `Deselect #${order.orderNumber}` : `Select #${order.orderNumber}`}
                                >
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-[#9A7B38]" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                                  )}
                                </button>
                              </td>
                              <td className="py-3.5 px-4 font-mono">
                                <div className="font-extrabold text-[#9A7B38] text-xs">{order.orderNumber}</div>
                                <div className="text-[10px] text-slate-400">{order.orderDate}</div>
                                <div className="text-[10px] text-slate-500 font-sans truncate max-w-[140px]">AWB: {order.airwayBill}</div>
                              </td>

                              <td className="py-3.5 px-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCustomerId(order.email || order.clientName);
                                    setOrderSubTab('customer-history');
                                  }}
                                  className="text-left group/patron cursor-pointer focus:outline-none space-y-1"
                                  title="View Customer Purchase History & Support Dossier"
                                >
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-slate-900 group-hover/patron:text-[#9A7B38] transition-colors">
                                      {order.clientName}
                                    </span>
                                    {(() => {
                                      // Compute total spend for this customer email/name across orders
                                      const patronKey = (order.email || order.clientName).toLowerCase().trim();
                                      const patronOrders = orders.filter(
                                        (o) => (o.email || o.clientName).toLowerCase().trim() === patronKey
                                      );
                                      const patronSpend = patronOrders.reduce((sum, o) => sum + o.totalUSD, 0);

                                      let tierLabel = 'Standard';
                                      let tierBadge = '✨ Standard';
                                      let tierClass = 'bg-slate-100 text-slate-700 border-slate-200';

                                      if (patronSpend >= 100000) {
                                        tierLabel = 'VIP';
                                        tierBadge = '👑 VIP Sovereign';
                                        tierClass = 'bg-amber-100 text-amber-900 border-amber-300';
                                      } else if (patronSpend >= 40000) {
                                        tierLabel = 'Gold';
                                        tierBadge = '⭐ Gold Collector';
                                        tierClass = 'bg-[#9A7B38]/15 text-[#9A7B38] border-[#9A7B38]/30';
                                      }

                                      return (
                                        <span
                                          className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono border ${tierClass}`}
                                          title={`Loyalty Tier: ${tierLabel} (Lifetime Spend: $${patronSpend.toLocaleString()} USD)`}
                                        >
                                          <span>{tierBadge}</span>
                                        </span>
                                      );
                                    })()}
                                    <ArrowUpRight className="w-3 h-3 text-[#9A7B38] opacity-60 group-hover/patron:opacity-100 transition-opacity" />
                                  </div>
                                  <div className="text-[11px] text-slate-500">{order.email}</div>
                                  <div className="text-[10px] text-slate-400">{order.city}, {order.country}</div>
                                </button>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="text-slate-800 font-medium line-clamp-1 max-w-[200px]">
                                  {order.timepieceSummary}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                                </div>
                              </td>

                              <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                                <AnimatedPrice amountUSD={order.totalUSD} currency={currency} />
                                <div className="text-[10px] text-slate-400 font-sans">${order.totalUSD.toLocaleString()} USD</div>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                                  {order.paymentMethod === 'armored-cod'
                                    ? '🛡️ Armored COD'
                                    : order.paymentMethod === 'wire'
                                    ? '🏦 Swiss Wire'
                                    : '💳 Private Card'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <select
                                    value={order.status}
                                    onChange={(e) => {
                                      const newStatus = e.target.value as PlacedOrder['status'];
                                      let step = 1;
                                      if (newStatus === 'Atelier Assembly') step = 2;
                                      else if (newStatus === 'In Transit') step = 3;
                                      else if (newStatus === 'Out for Delivery') step = 4;
                                      else if (newStatus === 'Delivered') step = 5;
                                      handleUpdateOrderStatus(order.orderNumber, newStatus, step);
                                    }}
                                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider border cursor-pointer shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9A7B38] ${
                                      order.status === 'Delivered'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : order.status === 'In Transit' || order.status === 'Out for Delivery'
                                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                                        : 'bg-amber-50 text-amber-800 border-amber-300'
                                    }`}
                                  >
                                    <option value="Allocated">Allocated</option>
                                    <option value="Atelier Assembly">Atelier Assembly</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                  <span className="text-[10px] text-slate-400 font-mono">Stage {order.progressStep}/5</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCustomerId(order.email || order.clientName);
                                      setOrderSubTab('customer-history');
                                    }}
                                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:border-[#9A7B38] hover:text-[#9A7B38] text-slate-400 transition-colors cursor-pointer"
                                    title="View Customer Purchase History"
                                  >
                                    <History className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setInspectingOrder(order)}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-[#9A7B38] hover:text-[#9A7B38] text-xs font-bold text-slate-700 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-[#9A7B38]" />
                                    <span>Inspect</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOrder(order.orderNumber)}
                                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:border-rose-300 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                                    title="Delete order"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: CUSTOMER PURCHASE HISTORY & SUPPORT DOSSIER */}
            {orderSubTab === 'customer-history' && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                {/* Master Patron Intelligence & History Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Patron Directory (4 cols) */}
                  <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#9A7B38] font-bold">
                          <Users className="w-3.5 h-3.5" />
                          <span>Collector Directory</span>
                        </div>
                        <h3 className="font-sans text-base font-bold text-slate-900 mt-0.5">
                          Patron Roster ({customersList.length})
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-[#9A7B38]/10 text-[#9A7B38] px-2 py-0.5 rounded-full">
                        VIP CRM
                      </span>
                    </div>

                    {/* Patron Search Bar */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                        placeholder="Search patron by name, email, city..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#9A7B38] text-slate-900 font-medium"
                      />
                      {customerSearchQuery && (
                        <button
                          onClick={() => setCustomerSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Customers List Cards */}
                    <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                      {filteredCustomersList.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          No matching patrons found.
                        </div>
                      ) : (
                        filteredCustomersList.map((customer) => {
                          const isSelected = selectedCustomer?.id === customer.id;
                          const initials = customer.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase();

                          return (
                            <button
                              key={customer.id}
                              type="button"
                              onClick={() => setSelectedCustomerId(customer.id)}
                              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                                isSelected
                                  ? 'bg-[#FAF8F3] border-[#9A7B38] shadow-sm ring-1 ring-[#9A7B38]/30'
                                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                              }`}
                            >
                              {/* Avatar Monogram */}
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-sans font-bold text-xs shrink-0 border ${
                                  isSelected
                                    ? 'bg-[#9A7B38] text-white border-[#9A7B38]'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {initials || 'VIP'}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="font-bold text-slate-900 text-xs truncate">
                                    {customer.name}
                                  </h4>
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600 shrink-0">
                                    {customer.orders.length} ord
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {customer.email}
                                </p>

                                <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-slate-100/80">
                                  <span className="text-[10px] text-slate-400 truncate">
                                    {customer.city}, {customer.country}
                                  </span>
                                  <span className="text-[11px] font-mono font-extrabold text-[#9A7B38] shrink-0">
                                    ${customer.totalSpendUSD.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Column: Selected Patron Dossier & Visualizations (8 cols) */}
                  <div className="lg:col-span-8 space-y-6">
                    {selectedCustomer ? (
                      <>
                        {/* 1. Patron Profile Header & Support Quick Actions */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3.5">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#161922] via-[#0E1118] to-black border border-[#C5A059]/60 flex items-center justify-center text-[#C5A059] font-sans text-xl font-bold shadow-sm">
                                {selectedCustomer.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')
                                  .toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-sans text-xl sm:text-2xl font-bold text-slate-900">
                                    {selectedCustomer.name}
                                  </h3>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${selectedCustomer.tierColor}`}
                                  >
                                    {selectedCustomer.tierBadge}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap font-sans">
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                    {selectedCustomer.email}
                                  </span>
                                  <span>·</span>
                                  <span className="flex items-center gap-1 font-mono">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    {selectedCustomer.phone}
                                  </span>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    {selectedCustomer.city}, {selectedCustomer.country}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Direct Customer Support Outreach Buttons */}
                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <a
                                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Greetings ${selectedCustomer.name}, this is Aurelia Haute Horlogerie private concierge support regarding your horological acquisitions.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs hover:bg-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                title="Contact patron on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                                <span>WhatsApp</span>
                              </a>
                              <a
                                href={`mailto:${selectedCustomer.email}?subject=${encodeURIComponent(`Maison Aurelia Private Concierge - Horology Portfolio Inquiries`)}`}
                                className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                title="Send email to patron"
                              >
                                <Mail className="w-3.5 h-3.5 text-[#9A7B38]" />
                                <span>Email</span>
                              </a>
                              <a
                                href={`tel:${selectedCustomer.phone}`}
                                className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                title="Call patron directly"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#9A7B38]" />
                                <span>Call</span>
                              </a>
                            </div>
                          </div>

                          {/* 4 Key Customer Support Metrics */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                                Lifetime Spend (LTV)
                              </span>
                              <span className="text-base sm:text-lg font-extrabold text-[#9A7B38] font-mono tabular-nums">
                                ${selectedCustomer.totalSpendUSD.toLocaleString()} USD
                              </span>
                              <span className="text-[10px] text-slate-500 block">Across {selectedCustomer.orders.length} order(s)</span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                                Collection Scale
                              </span>
                              <span className="text-base sm:text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                                {selectedCustomer.totalUnits} Timepiece(s)
                              </span>
                              <span className="text-[10px] text-slate-500 block">Acquired in vault file</span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                                Average Order Value
                              </span>
                              <span className="text-base sm:text-lg font-extrabold text-emerald-700 font-mono tabular-nums">
                                ${Math.round(selectedCustomer.totalSpendUSD / selectedCustomer.orders.length).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-emerald-600 block">Per transaction</span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                                Collector History Since
                              </span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900 block truncate font-mono">
                                {selectedCustomer.firstOrderDate}
                              </span>
                              <span className="text-[10px] text-slate-500 block">Initial acquisition</span>
                            </div>
                          </div>

                          {/* Handover & Delivery Details */}
                          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#9A7B38] shrink-0" />
                              <span className="text-slate-700">
                                <strong className="text-slate-900">Armored Delivery Address:</strong> {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.country} ({selectedCustomer.postalCode})
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0 self-start sm:self-auto">
                              ✓ Verified Destination
                            </span>
                          </div>
                        </div>

                        {/* 2. Data Visualizations of Past Purchases (Recharts) */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          {/* Spend History Bar Chart */}
                          <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B38] font-bold">
                                  Purchase Spend Trajectory
                                </span>
                                <h4 className="font-sans text-sm font-bold text-slate-900">
                                  Historical Order Valuations ($k USD)
                                </h4>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500">
                                {selectedCustomer.timeline.length} Recorded Consignments
                              </span>
                            </div>

                            <div className="w-full h-52 min-w-0">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={selectedCustomer.timeline}
                                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                  <XAxis
                                    dataKey="period"
                                    stroke="#64748B"
                                    fontSize={10}
                                    tickLine={false}
                                  />
                                  <YAxis
                                    stroke="#64748B"
                                    fontSize={10}
                                    tickLine={false}
                                    tickFormatter={(val) => `$${val}k`}
                                  />
                                  <Tooltip content={<LuxuryChartTooltip />} />
                                  <Bar
                                    dataKey="amountK"
                                    fill="#C5A059"
                                    radius={[5, 5, 0, 0]}
                                    name="Order Valuation ($k USD)"
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Collection Preference Donut Chart */}
                          <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B38] font-bold">
                                  Horological Preferences
                                </span>
                                <h4 className="font-sans text-sm font-bold text-slate-900">
                                  Collection Distribution
                                </h4>
                              </div>
                            </div>

                            <div className="w-full h-52 min-w-0 flex items-center justify-center">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={selectedCustomer.preferences}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={42}
                                    outerRadius={68}
                                    paddingAngle={3}
                                    dataKey="value"
                                    nameKey="name"
                                  >
                                    {selectedCustomer.preferences.map((entry, index) => (
                                      <Cell key={`pref-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip content={<LuxuryChartTooltip />} />
                                  <Legend
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '10px', fontWeight: 600, paddingTop: '4px' }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>

                        {/* 3. Chronological Past Purchases Ledger */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#9A7B38] font-bold">
                                <History className="w-3.5 h-3.5" />
                                <span>Past Purchases Ledger</span>
                              </div>
                              <h4 className="font-sans text-base font-bold text-slate-900 mt-0.5">
                                Chronological Acquisition History ({selectedCustomer.orders.length} Orders)
                              </h4>
                            </div>
                            <span className="text-xs font-mono font-bold text-[#9A7B38]">
                              Combined: ${selectedCustomer.totalSpendUSD.toLocaleString()} USD
                            </span>
                          </div>

                          <div className="space-y-3">
                            {selectedCustomer.orders.map((order) => (
                              <div
                                key={order.orderNumber}
                                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#9A7B38]/50 transition-all shadow-2xs space-y-3"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-[#9A7B38]">
                                      #{order.orderNumber}
                                    </span>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-xs text-slate-500 font-sans">{order.orderDate}</span>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        order.status === 'Delivered'
                                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                          : order.status === 'In Transit'
                                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                                      }`}
                                    >
                                      {order.status}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className="font-mono font-bold text-slate-900 text-xs">
                                      <AnimatedPrice amountUSD={order.totalUSD} currency={currency} />
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setInspectingOrder(order)}
                                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#9A7B38] text-[11px] font-bold text-slate-700 hover:text-[#9A7B38] flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Eye className="w-3 h-3 text-[#9A7B38]" />
                                      <span>Inspect Details</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Items in this order */}
                                <div className="space-y-2">
                                  {order.items?.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white shrink-0"
                                        />
                                        <div className="min-w-0">
                                          <h5 className="font-bold text-slate-900 text-xs truncate">
                                            {item.name}
                                          </h5>
                                          <div className="text-[10px] text-[#9A7B38] font-mono">
                                            {item.reference} · Qty: {item.quantity}
                                          </div>
                                          {item.bespokeEngraving && (
                                            <span className="text-[9px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 block truncate mt-0.5">
                                              Bespoke: &quot;{item.bespokeEngraving}&quot;
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      <span className="font-mono font-bold text-slate-800 text-xs shrink-0">
                                        ${(item.priceUSD * (item.quantity || 1)).toLocaleString()} USD
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4. Customer Support Intelligence & Concierge Notes */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#9A7B38] font-bold">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Support Intelligence</span>
                              </div>
                              <h4 className="font-sans text-base font-bold text-slate-900 mt-0.5">
                                Concierge Notes & VIP Care Dossier
                              </h4>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">
                              {(supportNotes[selectedCustomer.email.toLowerCase().trim()] || []).length} Recorded Notes
                            </span>
                          </div>

                          {/* Notes History */}
                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {(!supportNotes[selectedCustomer.email.toLowerCase().trim()] || 
                              supportNotes[selectedCustomer.email.toLowerCase().trim()].length === 0) ? (
                              <div className="p-4 rounded-xl bg-slate-50 text-center text-slate-400 text-xs">
                                No concierge support notes recorded yet for this patron. Add an operational preference or support update below.
                              </div>
                            ) : (
                              supportNotes[selectedCustomer.email.toLowerCase().trim()].map((note) => (
                                <div
                                  key={note.id}
                                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                                >
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                          note.tag === 'Preference'
                                            ? 'bg-purple-100 text-purple-800'
                                            : note.tag === 'VIP Care'
                                            ? 'bg-amber-100 text-amber-800'
                                            : note.tag === 'Delivery'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-slate-200 text-slate-800'
                                        }`}
                                      >
                                        {note.tag}
                                      </span>
                                      <span className="text-[11px] font-mono text-slate-400">{note.date}</span>
                                    </div>
                                    <span className="text-[10px] text-[#9A7B38] font-mono font-bold">
                                      Logged by {note.author}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-700 leading-relaxed">{note.text}</p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Add Support Note Form */}
                          <div className="pt-3 border-t border-slate-100 space-y-3">
                            <span className="text-xs font-bold text-slate-800 block">
                              Log New Concierge Support Note
                            </span>
                            <div className="flex flex-col sm:flex-row gap-2.5">
                              <select
                                value={newSupportNoteTag}
                                onChange={(e) => setNewSupportNoteTag(e.target.value as any)}
                                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-[#9A7B38] shrink-0"
                              >
                                <option value="Preference">Tag: Preference</option>
                                <option value="Inquiry">Tag: Inquiry</option>
                                <option value="Delivery">Tag: Delivery</option>
                                <option value="VIP Care">Tag: VIP Care</option>
                              </select>

                              <input
                                type="text"
                                value={newSupportNoteText}
                                onChange={(e) => setNewSupportNoteText(e.target.value)}
                                placeholder="e.g. Patron prefers sapphire caseback inspection before dispatch..."
                                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSupportNote(selectedCustomer.email);
                                  }
                                }}
                              />

                              <button
                                type="button"
                                onClick={() => handleAddSupportNote(selectedCustomer.email)}
                                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-2xs cursor-pointer shrink-0 transition-all active:scale-95"
                              >
                                Record Note
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
                        <Users className="w-10 h-10 mx-auto mb-2 text-[#9A7B38] opacity-40" />
                        <h4 className="font-sans text-base font-bold text-slate-800">No Patron Selected</h4>
                        <p className="text-xs text-slate-500 mt-1">Select a patron from the directory list on the left to inspect their dossier.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Inspect / Edit Order Modal with Print Invoice & Customer Reachout */}
            {inspectingOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-slate-900">
                  <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10 gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#9A7B38]">CONSIGNMENT #{inspectingOrder.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 border border-slate-200">
                          {inspectingOrder.status}
                        </span>
                      </div>
                      <h2 className="font-sans text-base sm:text-xl font-bold text-slate-900 mt-0.5 truncate">Client Order & Armored Escort</h2>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 sm:p-2 rounded-xl border border-slate-200 hover:border-[#9A7B38] text-slate-600 hover:text-[#9A7B38] cursor-pointer"
                        title="Print Swiss Consignment Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setInspectingOrder(null)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Status Updaters */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#9A7B38]">
                        Quick Dispatch & Status Progression
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { label: 'Allocated', step: 1 },
                          { label: 'Atelier Assembly', step: 2 },
                          { label: 'In Transit', step: 3 },
                          { label: 'Out for Delivery', step: 4 },
                          { label: 'Delivered', step: 5 },
                        ].map((s) => (
                          <button
                            key={s.label}
                            onClick={() => handleUpdateOrderStatus(inspectingOrder.orderNumber, s.label as any, s.step)}
                            className={`py-2 px-2 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer border ${
                              inspectingOrder.status === s.label
                                ? 'bg-[#9A7B38] text-white border-[#9A7B38] shadow-sm'
                                : 'bg-white text-slate-700 hover:border-[#9A7B38] border-slate-200'
                            }`}
                          >
                            Step {s.step}: {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Patron Information & Direct Contact Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patron Information</div>
                        <div className="font-bold text-slate-900 text-sm">{inspectingOrder.clientName}</div>
                        <div className="text-slate-600 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {inspectingOrder.email}</div>
                        <div className="text-slate-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {inspectingOrder.phone}</div>

                        {/* Direct Contact Buttons */}
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <a
                            href={`https://wa.me/${inspectingOrder.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Greetings ${inspectingOrder.clientName}, this is Aurelia Haute Horlogerie regarding your consignment #${inspectingOrder.orderNumber}. Your delivery status is currently: ${inspectingOrder.status}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[10px] hover:bg-emerald-100 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            💬 WhatsApp Client
                          </a>
                          <a
                            href={`mailto:${inspectingOrder.email}?subject=${encodeURIComponent(`Aurelia Horology - Consignment #${inspectingOrder.orderNumber} Status`)}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-300 font-bold text-[10px] hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            ✉️ Email Patron
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCustomerId(inspectingOrder.email || inspectingOrder.clientName);
                              setOrderSubTab('customer-history');
                              setInspectingOrder(null);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] text-[#9A7B38] border border-[#9A7B38]/40 hover:bg-[#9A7B38] hover:text-white font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Open full customer purchase history and support notes"
                          >
                            <History className="w-3 h-3" />
                            <span>Customer History</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Armored Handover Address</div>
                        <div className="font-bold text-slate-900">{inspectingOrder.address}</div>
                        <div className="text-slate-600">{inspectingOrder.city}, {inspectingOrder.postalCode}</div>
                        <div className="text-slate-600 font-semibold">{inspectingOrder.country}</div>
                      </div>
                    </div>

                    {/* Timepieces Ordered */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Allocated Timepieces</div>
                      <div className="space-y-2">
                        {inspectingOrder.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                                <div className="text-[11px] text-[#9A7B38] font-mono">{item.reference} · Qty: {item.quantity}</div>
                                {item.bespokeEngraving && (
                                  <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 border border-amber-200">
                                    Engraving: &quot;{item.bespokeEngraving}&quot;
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="font-mono font-bold text-slate-900 text-xs">
                              {formatPrice(item.priceUSD * item.quantity, currency)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Custom Courier Transit Checkpoint */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#9A7B38]">
                        Push Custom Courier Transit Update
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          value={newMilestoneLocation}
                          onChange={(e) => setNewMilestoneLocation(e.target.value)}
                          placeholder="Location (e.g. Zurich Kloten Hub)"
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          value={newMilestoneNote}
                          onChange={(e) => setNewMilestoneNote(e.target.value)}
                          placeholder="Update note (e.g. Customs cleared aboard charter)"
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddMilestoneNote(inspectingOrder.orderNumber)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-[#9A7B38] text-xs font-bold transition-colors cursor-pointer"
                      >
                        Push Checkpoint to Client Telemetry
                      </button>
                    </div>

                    {/* Carrier & Insurance */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-sans">Armored Carrier:</span>
                        <span className="font-bold text-slate-800 font-sans">{inspectingOrder.carrier}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-sans">Airway Bill (AWB):</span>
                        <span className="font-bold text-[#9A7B38]">{inspectingOrder.airwayBill}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-sans">Valuation Insurance:</span>
                        <span className="text-emerald-700 font-semibold font-sans">{inspectingOrder.valuationCover}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-3xl">
                    <button
                      onClick={() => setInspectingOrder(null)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- TAB 3: SITE CONTROLS & CONCESSIONS ---------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-6 w-full">
            {/* 1. Settings Module Header Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                    <SlidersHorizontal className="w-4 h-4 text-slate-800" />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
                    Store Configuration Module
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
                  Site Controls & Concessions Configuration
                </h2>
                <p className="text-xs text-slate-500 max-w-xl">
                  Manage promotional concession discount codes, administrator security credentials, currency exchange multipliers, and boutique announcements.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start lg:self-center">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Concession Code</span>
                </button>
              </div>
            </div>

            {/* 2. VIP Promo Codes / Concessions Manager Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Tag className="w-5 h-5 text-[#9A7B38]" />
                  <div>
                    <h3 className="font-sans text-base font-bold text-slate-900">VIP Collector Concession Codes (Coupons)</h3>
                    <p className="text-xs text-slate-500">Manage promotional discount codes applied by patrons at checkout.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Code</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {promoCodes.map((promo) => (
                  <div key={promo.id} className="py-3 flex items-center justify-between text-xs gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#9A7B38] bg-[#9A7B38]/10 px-2 py-0.5 rounded border border-[#9A7B38]/20">
                          {promo.code}
                        </span>
                        <span className="font-bold text-slate-800">
                          {promo.discountType === 'percentage' ? `${promo.discountValue}% Off` : `$${promo.discountValue.toLocaleString()} Off`}
                        </span>
                        {promo.minOrderUSD && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            (Min order: ${promo.minOrderUSD.toLocaleString()})
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{promo.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePromoActive(promo.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer border ${
                          promo.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                        }`}
                      >
                        {promo.active ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => handleDeletePromo(promo.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete code"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Administrator Credentials Security Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Key className="w-5 h-5 text-[#9A7B38]" />
                <div>
                  <h3 className="font-sans text-base font-bold text-slate-900">Administrator Security & Credentials</h3>
                  <p className="text-xs text-slate-500">Update the username and secret passkey required to access this Maison Admin portal.</p>
                </div>
              </div>

              {credsSavedNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Admin username and password updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleUpdateCredentials} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Admin Username</label>
                    <input
                      type="text"
                      required
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">New Secret Passkey</label>
                    <input
                      type="text"
                      required
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-xs hover:shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Update Credentials</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Site Settings Form */}
            <form onSubmit={handleSaveSettings} className="space-y-8">
              {settingsSavedSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Website settings saved successfully! All users and pages now reflect these updates.</span>
                </div>
              )}

              {/* 1. Top Announcement Banner Control with Live Preview */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-5 h-5 text-[#9A7B38]" />
                    <div>
                      <h3 className="font-sans text-base font-bold text-slate-900">Top Announcement Banner</h3>
                      <p className="text-xs text-slate-500">Control the golden notification banner displayed at the top of the entire website.</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.announcement.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcement: { ...settings.announcement, enabled: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-[#9A7B38] rounded"
                    />
                    <span>Banner Active</span>
                  </label>
                </div>

                {/* Live Preview of Announcement Bar */}
                {settings.announcement.enabled && (
                  <div className="p-3 rounded-xl bg-[#161922] text-[#F3EAD3] border border-[#9A7B38]/40 text-xs flex items-center justify-center gap-2 font-medium">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold tracking-widest uppercase bg-[#9A7B38] text-black">
                      {settings.announcement.badge || 'GENEVA'}
                    </span>
                    <span>{settings.announcement.text}</span>
                    <span className="text-[#E2C775] underline font-bold">{settings.announcement.linkText}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={settings.announcement.badge}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcement: { ...settings.announcement, badge: e.target.value },
                        })
                      }
                      placeholder="GENEVA ATELIER"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">Announcement Message</label>
                    <input
                      type="text"
                      value={settings.announcement.text}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcement: { ...settings.announcement, text: e.target.value },
                        })
                      }
                      placeholder="Complimentary Worldwide Armored Delivery & Swiss Guarantee"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Action Link Text</label>
                    <input
                      type="text"
                      value={settings.announcement.linkText}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcement: { ...settings.announcement, linkText: e.target.value },
                        })
                      }
                      placeholder="Explore Vault →"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">Action Link Target</label>
                    <input
                      type="text"
                      value={settings.announcement.linkUrl}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcement: { ...settings.announcement, linkUrl: e.target.value },
                        })
                      }
                      placeholder="#collections"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Atelier Showroom & Vault Status */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <Shield className="w-5 h-5 text-[#9A7B38]" />
                  <div>
                    <h3 className="font-sans text-base font-bold text-slate-900">Atelier Showroom & Vault Status</h3>
                    <p className="text-xs text-slate-500">Live indicators showing store opening and vault access status.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Vault Status Tag</label>
                    <input
                      type="text"
                      value={settings.atelier.statusBadge}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          atelier: { ...settings.atelier, statusBadge: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Status Description</label>
                    <input
                      type="text"
                      value={settings.atelier.statusText}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          atelier: { ...settings.atelier, statusText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">Maison Headline</label>
                    <input
                      type="text"
                      value={settings.atelier.headline}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          atelier: { ...settings.atelier, headline: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-sans font-bold text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">Salon Private Viewing Policy Note</label>
                    <input
                      type="text"
                      value={settings.atelier.locationNote}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          atelier: { ...settings.atelier, locationNote: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Concierge & Contact Information */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <Phone className="w-5 h-5 text-[#9A7B38]" />
                  <div>
                    <h3 className="font-sans text-base font-bold text-slate-900">Concierge & Contact Details</h3>
                    <p className="text-xs text-slate-500">Official contact points shown in the drawer and concierge pages.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Atelier Hotline Telephone</label>
                    <input
                      type="text"
                      value={settings.contact.phone}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, phone: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">WhatsApp VIP Concierge</label>
                    <input
                      type="text"
                      value={settings.contact.whatsapp}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, whatsapp: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Official Concierge Email</label>
                    <input
                      type="email"
                      value={settings.contact.email}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, email: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Visiting & Viewing Hours</label>
                    <input
                      type="text"
                      value={settings.contact.visitingHours}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, visitingHours: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">Swiss Manufacture Address</label>
                    <input
                      type="text"
                      value={settings.contact.address}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, address: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>
                </div>
              </div>

              {/* Save Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:border-[#9A7B38] text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-[#9A7B38]" />
                  <span>Reset Site Defaults</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>Save & Deploy Site Controls</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ---------------- TAB 4: SALES ANALYTICS (MONTHLY REVENUE & ORDER VOLUME TRENDS) ---------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* 1. Analytics Module Header Card */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                    <BarChart3 className="w-4 h-4 text-slate-800" />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
                    Business Intelligence & Telemetry Module
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
                  Sales Analytics & Performance Telemetry
                </h2>
                <p className="text-xs text-slate-500 max-w-xl">
                  Consignment sales telemetry tracking monthly revenue ($k USD), order velocity, quota attainment, and predictive inventory forecasting.
                </p>
              </div>

              {/* Time Range Selector & Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
                  {[
                    { id: 'all', label: 'All 2026' },
                    { id: 'last6', label: 'Last 6 Mo' },
                    { id: 'q3q4', label: 'Q3 & Q4' },
                  ].map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setSalesAnalyticsFilter(range.id as any)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                        salesAnalyticsFilter === range.id
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={window.print}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Print Sales Analytics Report"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleGeneratePerformancePDF}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Generate and download formatted monthly performance PDF report"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Top 4 Sales Executive Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Period Realized Revenue</span>
                  <CircleDollarSign className="w-4 h-4 text-[#9A7B38]" />
                </div>
                <div className="text-2xl font-extrabold text-[#9A7B38] font-mono tabular-nums">
                  <AnimatedPrice amountUSD={salesAnalyticsKPIs.totalRev} currency={currency} />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 font-semibold text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{salesAnalyticsKPIs.latestMoMRev}% MoM Growth</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">${(salesAnalyticsKPIs.totalRev / 1000).toFixed(0)}k USD</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Consignment Order Volume</span>
                  <ShoppingBag className="w-4 h-4 text-slate-800" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {salesAnalyticsKPIs.totalOrders} <span className="text-xs text-slate-500 font-sans font-normal">Orders</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 font-semibold text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{salesAnalyticsKPIs.latestMoMOrders}% Volume MoM</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">{salesAnalyticsKPIs.totalUnits} Timepieces</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Average Order Value (AOV)</span>
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
                  <AnimatedPrice amountUSD={salesAnalyticsKPIs.aov} currency={currency} />
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>Per client transaction</span>
                  <span className="font-mono text-emerald-600 font-bold">+8.4% YoY</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Peak Performance Month</span>
                  <Award className="w-4 h-4 text-[#9A7B38]" />
                </div>
                <div className="text-lg font-extrabold text-slate-900 font-mono truncate">
                  {salesAnalyticsKPIs.peakRevMonth?.month || 'October 2026'}
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span className="font-mono text-[#9A7B38] font-bold">
                    ${(salesAnalyticsKPIs.peakRevMonth?.revenueUSD || 0).toLocaleString()} USD
                  </span>
                  <span>{salesAnalyticsKPIs.peakRevMonth?.orderVolume || 0} orders</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PRIMARY RECHARTS VISUALIZATION: MONTHLY REVENUE & ORDER VOLUME TRENDS      */}
            {/* ========================================================================= */}
            <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 sm:space-y-6 min-w-0 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9A7B38] animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B38] font-bold">
                      Recharts Interactive Multi-Metric Telemetry
                    </span>
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    Monthly Revenue & Order Volume Trends
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dual-axis correlation of monthly realized revenue ($k USD) alongside client order volume and target quotas.
                  </p>
                </div>

                {/* Metric View Toggles */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start md:self-center overflow-x-auto max-w-full">
                  {[
                    { id: 'dual', label: 'Dual-Axis (Revenue + Orders)' },
                    { id: 'revenue', label: 'Revenue ($k)' },
                    { id: 'volume', label: 'Order Volume' },
                    { id: 'aov', label: 'AOV Trend' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSalesAnalyticsMetricView(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                        salesAnalyticsMetricView === tab.id
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Legend / Color Guide */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono pt-1">
                <div className="flex flex-wrap items-center gap-4">
                  {(salesAnalyticsMetricView === 'dual' || salesAnalyticsMetricView === 'revenue') && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-md bg-[#C5A059]" />
                      <span className="text-slate-700 font-semibold">Realized Monthly Revenue ($k USD)</span>
                    </div>
                  )}
                  {(salesAnalyticsMetricView === 'dual' || salesAnalyticsMetricView === 'volume') && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-md bg-[#0F172A]" />
                      <span className="text-slate-700 font-semibold">Order Volume (Consignments)</span>
                    </div>
                  )}
                  {salesAnalyticsMetricView === 'volume' && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-md bg-[#9A7B38]" />
                      <span className="text-slate-700 font-semibold">Dispatched Timepieces</span>
                    </div>
                  )}
                  {salesAnalyticsMetricView === 'aov' && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-md bg-emerald-600" />
                      <span className="text-slate-700 font-semibold">Average Order Value ($k USD)</span>
                    </div>
                  )}
                  {(salesAnalyticsMetricView === 'dual' || salesAnalyticsMetricView === 'revenue') && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-400" />
                      <span className="text-slate-500">Projected Target Quota ($k USD)</span>
                    </div>
                  )}
                </div>

                <span className="text-[11px] text-slate-400">
                  Showing {monthlySalesTrends.length} Months Data
                </span>
              </div>

              {/* Recharts Container */}
              <div className="w-full h-84 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  {salesAnalyticsMetricView === 'dual' ? (
                    <ComposedChart
                      data={monthlySalesTrends}
                      margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="salesGoldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="shortMonth"
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#9A7B38"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                        tickFormatter={(val) => `$${val}k`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                        allowDecimals={false}
                        tickFormatter={(val) => `${val} ord`}
                      />
                      <Tooltip content={<LuxuryChartTooltip />} />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '14px', fontSize: '11px', fontWeight: 600 }}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="orderVolume"
                        fill="#0F172A"
                        radius={[6, 6, 0, 0]}
                        name="Order Volume (Orders)"
                        barSize={24}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenueK"
                        stroke="#9A7B38"
                        strokeWidth={3}
                        fill="url(#salesGoldGradient)"
                        name="Monthly Realized Revenue ($k USD)"
                        activeDot={{ r: 6, fill: '#C5A059', stroke: '#FFFFFF', strokeWidth: 2 }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="targetK"
                        stroke="#94A3B8"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                        name="Target Revenue Quota ($k USD)"
                      />
                    </ComposedChart>
                  ) : salesAnalyticsMetricView === 'revenue' ? (
                    <AreaChart
                      data={monthlySalesTrends}
                      margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="salesGoldGradientRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A059" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="shortMonth"
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                      />
                      <YAxis
                        stroke="#9A7B38"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                        tickFormatter={(val) => `$${val}k`}
                      />
                      <Tooltip content={<LuxuryChartTooltip />} />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '14px', fontSize: '11px', fontWeight: 600 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenueK"
                        stroke="#9A7B38"
                        strokeWidth={3}
                        fill="url(#salesGoldGradientRev)"
                        name="Monthly Realized Revenue ($k USD)"
                        activeDot={{ r: 6, fill: '#C5A059', stroke: '#FFFFFF', strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="targetK"
                        stroke="#94A3B8"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                        name="Projected Target ($k USD)"
                      />
                    </AreaChart>
                  ) : salesAnalyticsMetricView === 'volume' ? (
                    <BarChart
                      data={monthlySalesTrends}
                      margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="shortMonth"
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                      />
                      <YAxis
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                        allowDecimals={false}
                      />
                      <Tooltip content={<LuxuryChartTooltip />} />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '14px', fontSize: '11px', fontWeight: 600 }}
                      />
                      <Bar
                        dataKey="orderVolume"
                        fill="#0F172A"
                        radius={[6, 6, 0, 0]}
                        name="Order Volume (Orders)"
                        barSize={22}
                      />
                      <Bar
                        dataKey="units"
                        fill="#C5A059"
                        radius={[6, 6, 0, 0]}
                        name="Timepiece Units Dispatched"
                        barSize={22}
                      />
                    </BarChart>
                  ) : (
                    <LineChart
                      data={monthlySalesTrends}
                      margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="shortMonth"
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                      />
                      <YAxis
                        stroke="#059669"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                        tickFormatter={(val) => `$${val}k`}
                      />
                      <Tooltip content={<LuxuryChartTooltip />} />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '14px', fontSize: '11px', fontWeight: 600 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="aovK"
                        stroke="#059669"
                        strokeWidth={3}
                        name="Average Order Value ($k USD)"
                        activeDot={{ r: 6, fill: '#059669', stroke: '#FFFFFF', strokeWidth: 2 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Trajectory KPI Insights Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Quota Attainment</span>
                  <span className="text-base font-extrabold text-emerald-700 font-mono">
                    {salesAnalyticsKPIs.latestMonth?.quotaAttainment || '108.4'}%
                  </span>
                  <span className="text-[10px] text-emerald-600 block">Surpassing Budget Target</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Avg Order Value (AOV)</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    ${salesAnalyticsKPIs.aov.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Per Client Consignment</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Live Month Volume</span>
                  <span className="text-base font-extrabold text-[#9A7B38] font-mono">
                    {salesAnalyticsKPIs.latestMonth?.orderVolume || orders.length} Orders
                  </span>
                  <span className="text-[10px] text-slate-500 block">Current Operating Cycle</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Realized Run-Rate</span>
                  <span className="text-base font-extrabold text-indigo-700 font-mono">
                    ${Math.round(salesAnalyticsKPIs.totalRev / Math.max(monthlySalesTrends.length, 1)).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Average Monthly Revenue</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* MONTHLY PERFORMANCE & ORDER VOLUME TRENDS LEDGER TABLE                     */}
            {/* ========================================================================= */}
            <div className="p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 min-w-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B38] font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Chronological Performance Ledger</span>
                  </div>
                  <h3 className="font-sans text-lg font-bold text-slate-900 mt-0.5">
                    Monthly Sales & Volume Breakdown (2026)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Granular breakdown of monthly revenue, order volume, dispatch velocity, and MoM expansion.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#9A7B38]">
                    Combined: ${(salesAnalyticsKPIs.totalRev).toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[720px] text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Calendar Month</th>
                      <th className="py-3 px-4 font-bold">Realized Revenue</th>
                      <th className="py-3 px-4 font-bold">Order Volume</th>
                      <th className="py-3 px-4 font-bold">Units Dispatched</th>
                      <th className="py-3 px-4 font-bold">Average Order Value</th>
                      <th className="py-3 px-4 font-bold">Target Quota</th>
                      <th className="py-3 px-4 font-bold">Attainment</th>
                      <th className="py-3 px-4 font-bold text-right">MoM Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {monthlySalesTrends.map((row) => (
                      <tr
                        key={row.key}
                        className={`transition-colors ${
                          row.isLive
                            ? 'bg-amber-50/40 hover:bg-amber-50/70 font-semibold'
                            : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{row.month}</span>
                            {row.isLive && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                                Live Cycle
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          <AnimatedPrice amountUSD={row.revenueUSD} currency={currency} />
                          <div className="text-[10px] text-slate-400 font-sans">${row.revenueK}k USD</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {row.orderVolume} orders
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-mono">
                          {row.units} pcs
                        </td>

                        <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">
                          ${row.aov.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          ${row.targetK}k USD
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                              row.quotaAttainment >= 100
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {row.quotaAttainment}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-600">
                            {row.momRevPct >= 0 ? (
                              <>
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>+{row.momRevPct}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                                <span className="text-rose-500">{row.momRevPct}%</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* VISUALIZATION 2: TOP-SELLING WATCHES (RECHARTS BAR) & COLLECTION ALLOCATION */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
              {/* Top Selling Watches Recharts Bar Chart */}
              <div className="lg:col-span-7 p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B38] font-bold">
                      Recharts Bar Chart
                    </span>
                    <h3 className="font-sans text-lg font-bold text-slate-900">
                      Top-Selling Timepieces
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ranking by total revenue generated ($k USD) and units sold.
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                    Top 5 Ranked
                  </div>
                </div>

                <div className="w-full h-72 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topSellingWatchesData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="shortName"
                        stroke="#64748B"
                        fontSize={10}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                      />
                      <YAxis
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                      />
                      <Tooltip content={<LuxuryChartTooltip />} />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '8px', fontSize: '11px', fontWeight: 600 }}
                      />
                      <Bar
                        dataKey="revenueK"
                        fill="#C5A059"
                        radius={[6, 6, 0, 0]}
                        name="Revenue ($k USD)"
                      />
                      <Bar
                        dataKey="units"
                        fill="#0F172A"
                        radius={[6, 6, 0, 0]}
                        name="Units Sold"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Collection Portfolio Allocation Donut Chart */}
              <div className="lg:col-span-5 p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B38] font-bold">
                      Recharts Pie Chart
                    </span>
                    <h3 className="font-sans text-lg font-bold text-slate-900">
                      Collection Revenue Share
                    </h3>
                    <p className="text-xs text-slate-500">
                      Portfolio share across Swiss manufacture categories.
                    </p>
                  </div>
                </div>

                <div className="w-full h-72 min-w-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={collectionPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={88}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                      >
                        {collectionPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<LuxuryChartTooltip />} />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top-Selling Timepiece Spotlight Cards */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans text-base font-bold text-slate-900">
                    Top-Selling Calibre Leaderboard
                  </h3>
                  <p className="text-xs text-slate-500">Detailed breakdown of the atelier's highest earning timepieces.</p>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs text-[#9A7B38] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {topSellingWatchesData.map((w, idx) => (
                  <div
                    key={w.reference}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-[#9A7B38]/50 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={w.image}
                          alt={w.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                        />
                        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-slate-900 text-[#C5A059] font-mono text-[10px] font-bold flex items-center justify-center border border-[#C5A059]/40 shadow-xs">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-slate-400 block truncate">{w.reference}</span>
                        <h4 className="text-xs font-bold text-slate-900 truncate" title={w.fullName}>
                          {w.fullName}
                        </h4>
                        <span className="text-[10px] font-semibold text-[#9A7B38]">{w.collection}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Units Sold</span>
                        <span className="font-mono font-bold text-slate-800">{w.units} pcs</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Revenue</span>
                        <span className="font-mono font-bold text-[#9A7B38]">${w.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* VISUALIZATION 3: RECENT ORDERS STATUS PIPELINE & LOGISTICS TELEMETRY      */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
              {/* Recharts Bar Chart: Status Distribution */}
              <div className="lg:col-span-7 p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B38] font-bold">
                      Fulfillment Stages
                    </span>
                    <h3 className="font-sans text-lg font-bold text-slate-900">
                      Consignment Status Pipeline
                    </h3>
                    <p className="text-xs text-slate-500">
                      Active consignment volumes distributed across Swiss manufacture and armored transit checkpoints.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#9A7B38] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Orders ({orders.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-full h-64 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersStatusChartData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="status"
                        stroke="#64748B"
                        fontSize={9}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                      />
                      <YAxis
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                        allowDecimals={false}
                      />
                      <Tooltip content={<LuxuryChartTooltip />} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Orders">
                        {ordersStatusChartData.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Status legend indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  {ordersStatusChartData.map((s) => (
                    <div key={s.status} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.fill }} />
                        <span className="font-bold text-slate-800 text-[11px] truncate">{s.status}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-xs ml-2">
                        {s.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Swiss Logistics & Escort Protocol Summary */}
              <div className="lg:col-span-5 p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between min-w-0 overflow-hidden">
                <div className="space-y-1 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-700 font-bold">
                      Geneva Vault Security
                    </span>
                  </div>
                  <h3 className="font-sans text-lg font-bold text-slate-900">
                    Armored Logistics Telemetry
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time compliance monitoring for high-value patron consignments.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">In Armored Transit</span>
                      <span className="font-mono text-xl font-extrabold text-blue-700">
                        {orders.filter((o) => o.status === 'In Transit' || o.status === 'Out for Delivery').length} consignments
                      </span>
                    </div>
                    <Truck className="w-6 h-6 text-blue-600/70" />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Delivered & Verified</span>
                      <span className="font-mono text-xl font-extrabold text-emerald-700">
                        {orders.filter((o) => o.status === 'Delivered').length} consignments
                      </span>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600/70" />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Average Delivery Window</span>
                      <span className="font-mono text-xl font-extrabold text-[#9A7B38]">
                        48 - 72 Hours
                      </span>
                    </div>
                    <Clock className="w-6 h-6 text-[#9A7B38]/70" />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lloyd's of London $10M Insured</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#9A7B38] hover:underline cursor-pointer"
                  >
                    Open Orders Desk →
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* VISUALIZATION 4: 30-DAY INVENTORY DEPLETION RATE & AI REORDER PREDICTION  */}
            {/* ========================================================================= */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B38] font-bold">
                      Recharts Inventory Telemetry · 30-Day Velocity
                    </span>
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-slate-900">
                    Vault Stock Depletion Rate (Last 30 Days)
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Real-time stock consumption curve for highest-demand Swiss calibres tracking physical vault unit depletion towards current inventory levels.
                  </p>
                </div>

                {/* Model Selector Toggles */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start lg:self-center overflow-x-auto max-w-full">
                  <button
                    type="button"
                    onClick={() => setSelectedDepletionModel('all')}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedDepletionModel === 'all'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All 4 Models
                  </button>
                  {popularDepletionModels.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedDepletionModel(m.shortName)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        selectedDepletionModel === m.shortName
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                      <span>{m.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Chart Container */}
              <div className="w-full h-72 sm:h-80 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={depletionTimelineData}
                    margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#E2E8F0' }}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#E2E8F0' }}
                      allowDecimals={false}
                      tickFormatter={(val) => `${val} pcs`}
                    />
                    <Tooltip content={<LuxuryChartTooltip />} />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: '12px', fontSize: '11px', fontWeight: 600 }}
                    />
                    {popularDepletionModels
                      .filter((m) => selectedDepletionModel === 'all' || selectedDepletionModel === m.shortName)
                      .map((model) => (
                        <Line
                          key={model.id}
                          type="monotone"
                          dataKey={model.shortName}
                          stroke={model.color}
                          strokeWidth={selectedDepletionModel === model.shortName ? 3.5 : 2.5}
                          dot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2, fill: model.color }}
                          activeDot={{ r: 7, stroke: '#FFFFFF', strokeWidth: 2, fill: model.color }}
                          name={`${model.fullName} (${model.reference})`}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI-Driven Predictive Reorder Panel */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-lg border border-[#C5A059]/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#E2C775] border border-[#C5A059]/40 font-bold">
                          Gemini AI Predictive Engine
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">30-Day Velocity & Reorder Recommendations</span>
                      </div>
                      <h4 className="font-sans text-base font-bold text-white mt-0.5">
                        Intelligent Replenishment & Stockout Forecast
                      </h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('AI forecasting model recalibrated against latest Geneva vault telemetry!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-slate-700 text-xs font-bold text-[#E2C775] transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                    title="Recalibrate AI forecasting model"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Recalibrate AI Model</span>
                  </button>
                </div>

                {/* AI Recommendations Table / Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                  {popularDepletionModels.map((m) => {
                    const dailyBurn = Number(m.dailyBurnRate) || 0.2;
                    const recommendedReorderQty = Math.max(5, Math.ceil(dailyBurn * 45 - m.currentStock));
                    const urgencyLevel = m.currentStock <= 1 ? 'Critical Reorder' : m.currentStock < 3 ? 'Recommended' : 'Optimal Buffer';
                    const urgencyColor = m.currentStock <= 1 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : m.currentStock < 3 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

                    return (
                      <div key={m.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs font-bold text-white truncate max-w-[130px]" title={m.fullName}>
                            {m.shortName}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border ${urgencyColor}`}>
                            {urgencyLevel}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs font-mono">
                          <div className="flex justify-between text-slate-400">
                            <span>Current Stock:</span>
                            <span className="text-white font-bold">{m.currentStock} units</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>30d Burn Speed:</span>
                            <span className="text-amber-400 font-bold">{m.soldUnits} sold / {m.dailyBurnRate}pd</span>
                          </div>
                          <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1">
                            <span>AI Reorder Qty:</span>
                            <span className="text-[#E2C775] font-extrabold text-sm">+{recommendedReorderQty} pcs</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const targetWatch = watches.find((w) => w.id === m.id || w.name === m.fullName);
                            if (targetWatch) {
                              handleAdjustStock(targetWatch, recommendedReorderQty);
                              showToast(`AI Reorder Order Generated: +${recommendedReorderQty} units for ${m.shortName}!`);
                            }
                          }}
                          className="w-full py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                          title={`Instantly reorder ${recommendedReorderQty} units based on AI forecast`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-black" />
                          <span>Execute AI Reorder (+{recommendedReorderQty})</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4 Popular Calibres Depletion Telemetry Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
                {popularDepletionModels.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      m.isLowStock
                        ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300/40'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={m.image}
                        alt={m.fullName}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-white shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                          <h4 className="text-xs font-bold text-slate-900 truncate" title={m.fullName}>
                            {m.fullName}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block truncate">{m.reference}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Vault Curve:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {m.initialStock} pcs <span className="text-slate-400 font-normal">30d ago</span> ➔ <span className={m.isLowStock ? 'text-amber-800 font-black' : 'text-slate-900'}>{m.currentStock} left</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Depletion Rate:</span>
                        <span className="font-mono font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          -{m.depletionRatePct}% in 30d
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/80">
                        <span className="text-slate-500">Burn Velocity:</span>
                        <span className="font-mono text-slate-700">~{m.dailyBurnRate} pcs/day</span>
                      </div>
                    </div>

                    {/* Low Stock Alert in Telemetry Card */}
                    <div className="pt-1 flex items-center justify-between">
                      {m.isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                          <AlertTriangle className="w-2.5 h-2.5 text-amber-700" />
                          <span>Low Stock Alert</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100/70">
                          <span>{m.daysUntilExhaustion}d buffer</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const targetWatch = watches.find((w) => w.id === m.id || w.name === m.fullName);
                          if (targetWatch) handleAdjustStock(targetWatch, 2);
                        }}
                        className="text-[10px] font-bold text-[#9A7B38] hover:text-[#7A6028] hover:underline flex items-center gap-0.5 cursor-pointer font-mono"
                        title="Quick replenish +2 units into vault"
                      >
                        +2 Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 5: DEDICATED ADMIN ACTIVITY LOG & AUDIT TRAIL ---------------- */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <AdminActivityLog
              logs={auditLogs}
              onRefreshLogs={refreshAuditLogs}
              onClearLogs={refreshAuditLogs}
              adminUser={adminCreds.username}
              title="Maison Security & Activity Audit Log"
              subtitle="Full-spectrum historical chronicle of all timepiece additions, updates, deletions, and administrative operations."
            />
          </div>
        )}

          </main>
        </div>

      </div>

      {/* Floating Session Expiration Warning Modal / Banner (Appears when <= 3 minutes remain) */}
      {sessionSecondsLeft > 0 && sessionSecondsLeft <= 180 && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-5 rounded-3xl border-2 border-amber-400 shadow-2xl max-w-md animate-in slide-in-from-bottom duration-300 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Security Expiry Warning
                </span>
              </div>
              <h4 className="font-sans font-bold text-white text-sm mt-0.5">
                Administrative Session Expiring Soon
              </h4>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Your administrative session will automatically terminate in{' '}
            <span className="font-mono font-bold text-amber-300 underline">{formatCountdown(sessionSecondsLeft)}</span> due to inactivity. Would you like to stay logged in?
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Log Out Now
            </button>
            <button
              type="button"
              onClick={handleExtendSession}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white" />
              <span>Extend Session (+15m)</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- TIMEPIECE ADD / EDIT MODAL ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-slate-900">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A7B38] font-mono block">
                  {editingWatchId ? 'Modify Timepiece Record' : 'Commission New Timepiece'}
                </span>
                <h2 className="font-sans text-lg sm:text-2xl font-bold text-slate-900 truncate">
                  {editingWatchId ? `Edit: ${formData.name || 'Timepiece'}` : 'Add New Horological Calibre'}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {!editingWatchId && (
                  <button
                    type="button"
                    onClick={handleAutofillSample}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-[#9A7B38]/30 bg-[#9A7B38]/10 text-[#9A7B38] hover:bg-[#9A7B38]/20 text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer"
                    title="Load complete sample luxury specs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Autofill</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitWatch} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A7B38] font-mono">
                  1. Identification & Nomenclature
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Timepiece Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aurelia Royal Chronograph 41"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Reference Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      placeholder="REF. AH-5980-RG"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 font-bold focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Collection</label>
                    <select
                      value={formData.collection}
                      onChange={(e) => setFormData({ ...formData, collection: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-[#9A7B38]"
                    >
                      <option value="Chronograph">Chronograph</option>
                      <option value="Tourbillon">Tourbillon</option>
                      <option value="Diver">Diver</option>
                      <option value="Dress">Dress</option>
                      <option value="Grand Complication">Grand Complication</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Valuation Price (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        required
                        min="1000"
                        step="500"
                        value={formData.priceUSD}
                        onChange={(e) => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 font-bold focus:outline-none focus:border-[#9A7B38]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="e.g. Master chronograph with column-wheel vertical clutch"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed provenance, horological architecture, and artisan finish..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>
                </div>
              </div>

              {/* Imagery with Live Preview */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A7B38] font-mono">
                  2. Imagery & Atelier Showcase
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex gap-4 items-center">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0 shadow-2xs"
                    />
                    <div className="flex-1">
                      <label className="block font-bold text-slate-700 mb-1">Primary Image Path / URL</label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value, gallery: [e.target.value] })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none focus:border-[#9A7B38]"
                      />
                    </div>
                  </div>

                  {/* Preset quick image selection */}
                  <div>
                    <label className="block text-slate-500 font-bold mb-2">Or select high-resolution preset watch imagery:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_IMAGES.map((img) => (
                        <button
                          key={img.url}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: img.url, gallery: [img.url] })}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            formData.image === img.url
                              ? 'border-[#9A7B38] bg-[#9A7B38]/10'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img src={img.url} alt={img.label} className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                          <span className="text-[10px] font-bold text-slate-800 line-clamp-1">{img.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A7B38] font-mono">
                  3. Calibre & Technical Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Calibre</label>
                    <input
                      type="text"
                      value={formData.specs.calibre}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, calibre: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Movement</label>
                    <input
                      type="text"
                      value={formData.specs.movement}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, movement: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Power Reserve</label>
                    <input
                      type="text"
                      value={formData.specs.powerReserve}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, powerReserve: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Case Diameter</label>
                    <input
                      type="text"
                      value={formData.specs.caseDiameter}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, caseDiameter: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Case Material</label>
                    <input
                      type="text"
                      value={formData.specs.caseMaterial}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, caseMaterial: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Water Resistance</label>
                    <input
                      type="text"
                      value={formData.specs.waterResistance}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, waterResistance: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory & Display Flags */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A7B38] font-mono">
                  4. Vault Allocations & Badges
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Vault Stock Units</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stockCount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          stockCount: val,
                          inStock: val > 0,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Edition Limit</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.editionLimit}
                      onChange={(e) => setFormData({ ...formData, editionLimit: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col justify-center space-y-2 pt-2">
                    <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4 h-4 accent-[#9A7B38] rounded"
                      />
                      <span>Feature on Home Showcase</span>
                    </label>

                    <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isLimitedEdition}
                        onChange={(e) => setFormData({ ...formData, isLimitedEdition: e.target.checked })}
                        className="w-4 h-4 accent-[#9A7B38] rounded"
                      />
                      <span>Limited Numbered Series</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="p-3.5 sm:p-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2 sm:gap-3 bg-slate-50 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 rounded-b-2xl sm:rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {editingWatchId ? 'Save Timepiece Updates' : 'Add to Catalog'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ---------------- DUPLICATE MODEL NAME PREVENTION MODAL ---------------- */}
      {duplicateWatchConflict && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-amber-200/90 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-4 sm:my-8 max-h-[94vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-b border-amber-200/80 px-4 py-3.5 sm:px-6 sm:py-5 flex items-start justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 shadow-sm shrink-0">
                  <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Catalog Collision Guard
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500">
                      {duplicateWatchConflict.pendingAction === 'update' ? 'Update Conflict' : 'New Entry Conflict'}
                    </span>
                  </div>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-slate-900 mt-0.5 truncate">
                    Duplicate Model Name Detected
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDuplicateWatchConflict(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 ml-2"
                title="Dismiss and revise model name"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs text-slate-600 overflow-y-auto flex-1">
              <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-slate-800">
                    A timepiece titled <span className="font-bold text-slate-900 underline decoration-amber-400 decoration-2">"{duplicateWatchConflict.existingWatch.name}"</span> already exists in the catalog.
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Duplicate names cause catalog ambiguities in customer invoices, warranty certificates, and stock reconciliation. Please review the comparison below to resolve.
                  </p>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Existing Watch Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Existing in Catalog
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-semibold">
                      {duplicateWatchConflict.existingWatch.reference}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={duplicateWatchConflict.existingWatch.image}
                      alt={duplicateWatchConflict.existingWatch.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{duplicateWatchConflict.existingWatch.name}</p>
                      <p className="text-[11px] text-[#9A7B38] font-bold">
                        {formatPrice(duplicateWatchConflict.existingWatch.priceUSD, currency)}
                      </p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                        {duplicateWatchConflict.existingWatch.collection}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 text-[11px] space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Stock:</span>
                      <span className={`font-semibold ${duplicateWatchConflict.existingWatch.stockCount < 3 ? 'text-amber-700 font-bold' : 'text-slate-700'}`}>
                        {duplicateWatchConflict.existingWatch.stockCount} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Calibre:</span>
                      <span className="font-mono text-slate-700 truncate max-w-[130px]">
                        {duplicateWatchConflict.existingWatch.specs.calibre || 'In-House'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pending Watch Card */}
                <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/30 p-3.5 sm:p-4 space-y-3 relative">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200/70">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Pending Submission
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                      {formData.reference || 'REF-NEW'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt={formData.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-amber-200 shrink-0 bg-white"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-dashed border-amber-300 bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{formData.name}</p>
                      <p className="text-[11px] text-[#9A7B38] font-bold">
                        {formatPrice(formData.priceUSD, currency)}
                      </p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                        {formData.collection}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-200/70 text-[11px] space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Stock:</span>
                      <span className="font-semibold text-slate-700">{formData.stockCount} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Calibre:</span>
                      <span className="font-mono text-slate-700 truncate max-w-[130px]">
                        {formData.specs.calibre || 'In-House'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation Suggestion Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Suggested Distinct Name</span>
                    <p className="text-xs font-semibold text-slate-800 font-mono truncate">
                      {formData.name.trim()} {formData.specs.caseMaterial ? `(${formData.specs.caseMaterial.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').slice(0, 2).join(' ')})` : '(Edition II)'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutoDifferentiateName}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#9A7B38] text-white hover:bg-[#85682D] transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  Apply & Save
                </button>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={handleOverrideDuplicate}
                className="text-[11px] text-slate-500 hover:text-rose-600 underline cursor-pointer order-last sm:order-first transition-colors py-1"
                title="Override warning and retain duplicate name in catalog"
              >
                Force Save (Allow Duplicate)
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setDuplicateWatchConflict(null)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer text-center"
                >
                  Revise Name
                </button>
                <button
                  type="button"
                  onClick={handleAutoDifferentiateName}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Fix</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-4 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-sans text-base sm:text-lg font-bold text-slate-900">Create VIP Concession Code</h3>
              <button
                onClick={() => setIsPromoModalOpen(false)}
                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Coupon Code (e.g. ROYAL20)</label>
                <input
                  type="text"
                  required
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                  placeholder="ROYAL20"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono font-bold uppercase text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Type</label>
                  <select
                    value={newPromo.discountType}
                    onChange={(e) => setNewPromo({ ...newPromo, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPromo.discountValue}
                    onChange={(e) => setNewPromo({ ...newPromo, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Minimum Order Value (USD)</label>
                <input
                  type="number"
                  min="0"
                  value={newPromo.minOrderUSD || 0}
                  onChange={(e) => setNewPromo({ ...newPromo, minOrderUSD: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description / Concession Purpose</label>
                <input
                  type="text"
                  value={newPromo.description}
                  onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                  placeholder="VIP private salon collector concession"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold uppercase tracking-wider"
                >
                  Register Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
