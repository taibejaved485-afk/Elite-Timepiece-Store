import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  BarChart,
  PieChart,
  Area,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Download,
  Filter,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import { Watch, CurrencyCode } from '../types/watch';
import { formatPrice, convertPrice, formatConvertedPrice } from '../utils/currency';

interface AdminPakistanSalesAnalyticsProps {
  currency: CurrencyCode;
  watches?: Watch[];
}

type PakistanMetricView = 'dual' | 'volume' | 'frequency' | 'city';

interface DailyPakistanSale {
  dayIndex: number;
  dateStr: string;
  shortDate: string;
  orderCount: number;
  volumeUSD: number;
  volumePKR: number;
  volumePKRThousands: number;
  volumePKRMillions: number;
  volumeUSDk: number;
  primaryCity: string;
  topModel: string;
  clientHighlight?: string;
}

interface PakistanCityStat {
  city: string;
  province: string;
  orders: number;
  volumeUSD: number;
  volumePKR: number;
  volumePKRThousands: number;
  volumePKRMillions: number;
  sharePct: number;
  topModel: string;
  color: string;
}

// Deterministic generator for realistic 30-day Pakistani acquisition velocity
function generatePakistan30DayData(): {
  dailyData: DailyPakistanSale[];
  cityStats: PakistanCityStat[];
  summary: {
    totalVolumeUSD: number;
    totalVolumePKR: number;
    totalOrders: number;
    avgDailyOrders: number;
    avgOrderValuePKR: number;
    peakDayDate: string;
    peakDayOrders: number;
    peakDayVolumePKR: number;
    topCity: string;
    topModel: string;
  };
} {
  const cities = [
    { city: 'Lahore', province: 'Punjab', weight: 0.36, color: '#C5A059' },
    { city: 'Karachi', province: 'Sindh', weight: 0.28, color: '#0F172A' },
    { city: 'Islamabad', province: 'ICT', weight: 0.18, color: '#059669' },
    { city: 'Rawalpindi', province: 'Punjab', weight: 0.08, color: '#4F46E5' },
    { city: 'Peshawar', province: 'KP', weight: 0.05, color: '#D97706' },
    { city: 'Faisalabad', province: 'Punjab', weight: 0.03, color: '#DC2626' },
    { city: 'Multan', province: 'Punjab', weight: 0.02, color: '#0891B2' },
  ];

  const models = [
    { name: 'Royal Chronograph 41 (Rose Gold)', priceUSD: 35 },
    { name: 'Symphonie Skeleton Flying Tourbillon', priceUSD: 49 },
    { name: 'Abyss Master Diver 300M (Titanium)', priceUSD: 24 },
    { name: 'Patrimoine Ultra-Thin Dress (Gold)', priceUSD: 19 },
    { name: 'Heritage Valjoux 1892 Chronograph', priceUSD: 32 },
  ];

  const pkrRate = 278.5;

  // 30 days pattern leading up to Nov 06, 2026
  const dailyData: DailyPakistanSale[] = [];
  const baseDate = new Date('2026-11-06T00:00:00Z');

  // Daily seed pattern with weekend surges and peak allocation spikes
  const orderCountPattern = [
    1, 2, 0, 1, 3, 2, 1,
    2, 1, 0, 2, 4, 3, 1,
    2, 1, 2, 0, 3, 2, 1,
    3, 2, 1, 4, 2, 1, 2, 3, 2
  ];

  let totalVolumeUSD = 0;
  let totalVolumePKR = 0;
  let totalOrders = 0;

  let peakDayDate = '';
  let peakDayOrders = 0;
  let peakDayVolumePKR = 0;

  const cityVolumes: Record<string, { orders: number; volumeUSD: number }> = {};
  cities.forEach((c) => {
    cityVolumes[c.city] = { orders: 0, volumeUSD: 0 };
  });

  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);

    const dayIdx = 30 - i;
    const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const fullDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const orderCount = orderCountPattern[dayIdx - 1];
    let dailyUSD = 0;

    // Pick top model for the day
    const model = models[(dayIdx * 3) % models.length];
    const cityObj = cities[(dayIdx * 2) % cities.length];

    if (orderCount > 0) {
      dailyUSD = orderCount * model.priceUSD;
      // Add slight variety
      if (orderCount >= 3) dailyUSD += 15;
    }

    const dailyPKR = Math.round(dailyUSD * pkrRate);
    const volumePKRThousands = Number((dailyPKR / 1000).toFixed(1));
    const volumePKRMillions = Number((dailyPKR / 1000000).toFixed(3));
    const volumeUSDk = Number((dailyUSD / 1000).toFixed(2));

    totalVolumeUSD += dailyUSD;
    totalVolumePKR += dailyPKR;
    totalOrders += orderCount;

    cityVolumes[cityObj.city].orders += orderCount;
    cityVolumes[cityObj.city].volumeUSD += dailyUSD;

    if (dailyPKR > peakDayVolumePKR) {
      peakDayVolumePKR = dailyPKR;
      peakDayOrders = orderCount;
      peakDayDate = shortDate;
    }

    dailyData.push({
      dayIndex: dayIdx,
      dateStr: fullDate,
      shortDate,
      orderCount,
      volumeUSD: dailyUSD,
      volumePKR: dailyPKR,
      volumePKRThousands,
      volumePKRMillions,
      volumeUSDk,
      primaryCity: cityObj.city,
      topModel: model.name,
      clientHighlight: orderCount > 0 ? `${orderCount} order${orderCount > 1 ? 's' : ''} in ${cityObj.city}` : undefined,
    });
  }

  // Calculate city statistics
  const cityStats: PakistanCityStat[] = cities.map((c) => {
    const stat = cityVolumes[c.city];
    const volumePKR = Math.round(stat.volumeUSD * pkrRate);
    const volumePKRThousands = Number((volumePKR / 1000).toFixed(1));
    const sharePct = totalVolumeUSD > 0 ? Number(((stat.volumeUSD / totalVolumeUSD) * 100).toFixed(1)) : 0;
    return {
      city: c.city,
      province: c.province,
      orders: stat.orders,
      volumeUSD: stat.volumeUSD,
      volumePKR,
      volumePKRThousands,
      volumePKRMillions: Number((volumePKR / 1000000).toFixed(3)),
      sharePct,
      topModel: c.city === 'Lahore' || c.city === 'Islamabad' ? 'Symphonie Tourbillon' : 'Royal Chronograph 41',
      color: c.color,
    };
  });

  return {
    dailyData,
    cityStats,
    summary: {
      totalVolumeUSD,
      totalVolumePKR,
      totalOrders,
      avgDailyOrders: Number((totalOrders / 30).toFixed(1)),
      avgOrderValuePKR: totalOrders > 0 ? Math.round(totalVolumePKR / totalOrders) : 0,
      peakDayDate,
      peakDayOrders,
      peakDayVolumePKR,
      topCity: 'Lahore (DHA & Gulberg)',
      topModel: 'Royal Chronograph 41 (Rose Gold)',
    },
  };
}

export const AdminPakistanSalesAnalytics: React.FC<AdminPakistanSalesAnalyticsProps> = ({
  currency,
}) => {
  const [metricView, setMetricView] = useState<PakistanMetricView>('dual');
  const [cityFilter, setCityFilter] = useState<string>('all');

  const { dailyData, cityStats, summary } = useMemo(() => {
    return generatePakistan30DayData();
  }, []);

  // Filtered daily data if a specific city is selected
  const displayedDailyData = useMemo(() => {
    if (cityFilter === 'all') return dailyData;
    return dailyData.map((d) => {
      if (d.primaryCity !== cityFilter) {
        return {
          ...d,
          orderCount: 0,
          volumeUSD: 0,
          volumePKR: 0,
          volumePKRThousands: 0,
          volumePKRMillions: 0,
          volumeUSDk: 0,
        };
      }
      return d;
    });
  }, [dailyData, cityFilter]);

  // Custom luxury tooltip specifically formatted for Pakistani Rupee and local acquisitions
  const PakistanChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload as DailyPakistanSale;
      if (!dataPoint) return null;

      return (
        <div className="bg-slate-950/95 backdrop-blur-md text-white p-4 rounded-2xl border border-emerald-500/40 shadow-2xl text-xs space-y-2.5 font-sans z-50 min-w-[240px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
                🇵🇰 Pakistan Market Day
              </span>
              <span className="font-bold text-[#E2C775] text-sm">
                {dataPoint.dateStr}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              PKR
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5 font-sans">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Daily Volume (₨):</span>
              </span>
              <span className="font-bold text-emerald-400">
                ₨ {dataPoint.volumePKR.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                <span>USD Equivalent:</span>
              </span>
              <span className="text-slate-300">
                ${dataPoint.volumeUSD.toLocaleString()} USD
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>Acquisitions Frequency:</span>
              </span>
              <span className="text-white font-bold">
                {dataPoint.orderCount} timepiece{dataPoint.orderCount === 1 ? '' : 's'}
              </span>
            </div>

            {dataPoint.orderCount > 0 && (
              <div className="pt-2 border-t border-slate-800 font-sans text-[11px] space-y-1">
                <div className="flex items-center gap-1 text-[#E2C775]">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>Primary Hub: {dataPoint.primaryCity}</span>
                </div>
                <div className="text-slate-400 truncate">
                  Leading: {dataPoint.topModel}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
      {/* 1. Module Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none" role="img" aria-label="Pakistan Flag">
              🇵🇰
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              Regional Telemetry · Pakistan Market
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              Last 30 Days Acquisition Audit
            </span>
          </div>

          <h3 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pakistan Market: 30-Day Purchase Volume & Frequency
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            Continuous transaction monitoring tracking daily acquisition frequency, capital volume in Pakistani Rupees (₨ PKR), and metropolitan distribution across Lahore, Karachi, Islamabad, and secondary hubs.
          </p>
        </div>

        {/* Action Controls & City Filter */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          {/* City selector dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-xs font-mono">Hub:</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 hover:border-emerald-500 text-slate-800 text-xs px-3 py-1.5 rounded-xl font-medium focus:outline-none transition-colors cursor-pointer shadow-2xs"
            >
              <option value="all">All Pakistan Hubs</option>
              {cityStats.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city} ({c.sharePct}%)
                </option>
              ))}
            </select>
          </div>

          {/* Metric View Mode Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setMetricView('dual')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metricView === 'dual'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dual-Axis
            </button>
            <button
              onClick={() => setMetricView('volume')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metricView === 'volume'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Volume (₨)
            </button>
            <button
              onClick={() => setMetricView('frequency')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metricView === 'frequency'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Frequency
            </button>
            <button
              onClick={() => setMetricView('city')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metricView === 'city'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              City Share
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Executive KPI Cards for Pakistan Market */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 30-Day Realized Volume */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border border-emerald-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>30-Day Realized Volume</span>
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-900 font-mono">
            ₨ {summary.totalVolumePKR.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-mono">
              ${(summary.totalVolumeUSD / 1000).toFixed(1)}k USD eq.
            </span>
            <span className="font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
              +32.4% MoM
            </span>
          </div>
        </div>

        {/* Card 2: 30-Day Total Acquisitions Frequency */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Acquisition Frequency</span>
            <ShoppingBag className="w-3.5 h-3.5 text-[#9A7B38]" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            {summary.totalOrders} Timepieces
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Cadence: ~{summary.avgDailyOrders} orders/day</span>
            <span className="text-slate-700 font-bold">100% Verified</span>
          </div>
        </div>

        {/* Card 3: Average Order Value (Pakistan) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Average Order Value</span>
            <Sparkles className="w-3.5 h-3.5 text-[#9A7B38]" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#9A7B38] font-mono">
            ₨ {summary.avgOrderValuePKR.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Per Consignment</span>
            <span className="text-slate-700 font-mono font-medium">
              ${Math.round(summary.totalVolumeUSD / summary.totalOrders).toLocaleString()} USD
            </span>
          </div>
        </div>

        {/* Card 4: Peak Activity Day */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Peak Activity Day</span>
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-950 font-mono">
            {summary.peakDayDate}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{summary.peakDayOrders} Timepieces</span>
            <span className="font-mono text-emerald-700 font-bold">
              ₨ {summary.peakDayVolumePKR.toLocaleString()} PKR
            </span>
          </div>
        </div>
      </div>

      {/* 3. Primary Recharts Visualization Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono py-1">
          <div className="flex flex-wrap items-center gap-4">
            {(metricView === 'dual' || metricView === 'volume') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500 shadow-xs" />
                <span className="text-slate-800 font-semibold">
                  Daily Volume (₨ Thousands PKR)
                </span>
              </div>
            )}
            {(metricView === 'dual' || metricView === 'frequency') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-slate-900 shadow-xs" />
                <span className="text-slate-800 font-semibold">
                  Purchase Frequency (Orders)
                </span>
              </div>
            )}
            {metricView === 'dual' && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-[#C5A059]" />
                <span className="text-slate-500 font-sans">
                  Volume Velocity Curve
                </span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Showing 30 consecutive calendar days · Daily settlement telemetry
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="w-full h-80 sm:h-96 min-w-0 bg-slate-50/60 rounded-2xl p-2 sm:p-4 border border-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            {metricView === 'dual' ? (
              <ComposedChart
                data={displayedDailyData}
                margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="pakistanVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="shortDate"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#059669"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickFormatter={(val) => `₨${val}k`}
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
                <Tooltip content={<PakistanChartTooltip />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 600 }}
                />

                {/* Bar: Daily Frequency */}
                <Bar
                  yAxisId="right"
                  dataKey="orderCount"
                  name="Purchase Frequency (Orders)"
                  fill="#0F172A"
                  radius={[5, 5, 0, 0]}
                  barSize={16}
                />

                {/* Area: Daily Volume in PKR Thousands */}
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="volumePKRThousands"
                  name="Purchase Volume (₨ Thousands PKR)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fill="url(#pakistanVolumeGrad)"
                  activeDot={{ r: 6, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }}
                />

                {/* Line: Volume Trajectory */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="volumePKRThousands"
                  name="Velocity Trend"
                  stroke="#C5A059"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </ComposedChart>
            ) : metricView === 'volume' ? (
              <AreaChart
                data={displayedDailyData}
                margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="pureVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="shortDate"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  stroke="#059669"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickFormatter={(val) => `₨${val}k`}
                />
                <Tooltip content={<PakistanChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="volumePKRThousands"
                  name="Daily Purchase Volume (₨ Thousands PKR)"
                  stroke="#047857"
                  strokeWidth={3}
                  fill="url(#pureVolumeGrad)"
                  activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : metricView === 'frequency' ? (
              <BarChart
                data={displayedDailyData}
                margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="shortDate"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  stroke="#0F172A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  allowDecimals={false}
                />
                <Tooltip content={<PakistanChartTooltip />} />
                <Bar
                  dataKey="orderCount"
                  name="Daily Purchase Frequency (Orders)"
                  fill="#0F172A"
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                >
                  {displayedDailyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.orderCount >= 3 ? '#059669' : entry.orderCount > 0 ? '#0F172A' : '#CBD5E1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart
                data={cityStats}
                layout="vertical"
                margin={{ top: 15, right: 25, left: 25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#64748B"
                  fontSize={10}
                  tickFormatter={(val) => `₨${val}k`}
                />
                <YAxis
                  type="category"
                  dataKey="city"
                  stroke="#0F172A"
                  fontSize={11}
                  fontWeight={600}
                />
                <Tooltip
                  formatter={(val: any) => [`₨ ${val}k PKR`, 'Realized 30-Day Volume']}
                />
                <Bar
                  dataKey="volumePKRThousands"
                  name="Volume (₨ Thousands PKR)"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                >
                  {cityStats.map((entry, index) => (
                    <Cell key={`city-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Metropolitan Hubs Distribution Ledger (Lahore, Karachi, Islamabad, etc.) */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
              Metropolitan Hub Breakdown (30-Day Realized Allocation)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {cityStats.length} Premier Pakistani Hubs Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cityStats.slice(0, 4).map((c) => (
            <div
              key={c.city}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">
                    {c.city}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {c.province} · {c.orders} Acquisitions
                  </span>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {c.sharePct}%
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-800">
                  ₨ {c.volumePKR.toLocaleString()} PKR
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {c.topModel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Provenance & Delivery Status Note for Pakistan */}
      <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-3 text-xs text-slate-700">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-slate-900 font-semibold block">
            Armored Diplomatic Handover & Customs Clearance in Pakistan
          </strong>
          <p className="text-[11px] text-slate-600 leading-relaxed font-light">
            All 42 consignments delivered over the last 30 days were transported from Le Brassus via secure diplomatic armored courier (Brink's / Malca-Amit) directly to private client residences in DHA Lahore, Clifton Karachi, F-7 Islamabad, and Cantt Rawalpindi with 100% insured biometric handover protocol.
          </p>
        </div>
      </div>
    </div>
  );
};
