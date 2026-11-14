import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceDot,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ShieldCheck,
  Award,
  Sparkles,
  Info,
  DollarSign,
  ArrowUpRight,
  Maximize2,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Watch, CurrencyCode } from '../types/watch';
import {
  PriceTrendPoint,
  TrendTimeframe,
  getWatchPriceAnalysis,
  WatchPriceAnalysis,
} from '../utils/watchPriceTrends';
import {
  convertPrice,
  formatPrice,
  formatConvertedPrice,
  getCurrencySymbol,
} from '../utils/currency';
import { AnimatedPrice } from './AnimatedPrice';

interface WatchPriceTrendChartProps {
  watch: Watch;
  currency: CurrencyCode;
}

type ChartMetricMode = 'market' | 'comparison' | 'corridor';

export const WatchPriceTrendChart: React.FC<WatchPriceTrendChartProps> = ({
  watch,
  currency,
}) => {
  const [timeframe, setTimeframe] = useState<TrendTimeframe>('3Y');
  const [metricMode, setMetricMode] = useState<ChartMetricMode>('comparison');
  const [activeHoverPoint, setActiveHoverPoint] = useState<PriceTrendPoint | null>(null);

  // Compute analysis metrics and data points based on watch and timeframe
  const analysis: WatchPriceAnalysis = useMemo(() => {
    return getWatchPriceAnalysis(watch, timeframe);
  }, [watch, timeframe]);

  // Transform data points converting USD values into the active currency
  const convertedChartData = useMemo(() => {
    return analysis.points.map((pt) => {
      const marketValInCurrency = Math.round(convertPrice(pt.marketValueUSD, currency));
      const retailValInCurrency = Math.round(convertPrice(pt.retailMSRPUSD, currency));
      const auctionValInCurrency = Math.round(convertPrice(pt.auctionHighUSD, currency));

      return {
        ...pt,
        marketValue: marketValInCurrency,
        retailMSRP: retailValInCurrency,
        auctionHigh: auctionValInCurrency,
      };
    });
  }, [analysis.points, currency]);

  const currencySymbol = getCurrencySymbol(currency);

  // Calculate currency-converted high and low for Y-Axis bounds
  const yBounds = useMemo(() => {
    if (convertedChartData.length === 0) return { min: 0, max: 10000 };
    const values = convertedChartData.flatMap((d) => [
      d.marketValue,
      d.retailMSRP,
      metricMode === 'corridor' ? d.auctionHigh : d.marketValue,
    ]);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const padding = (maxVal - minVal) * 0.12 || minVal * 0.1;
    return {
      min: Math.max(0, Math.floor((minVal - padding) / 500) * 500),
      max: Math.ceil((maxVal + padding) / 500) * 500,
    };
  }, [convertedChartData, metricMode]);

  // Formatted summary statistics in active currency
  const formattedCurrentPrice = formatPrice(analysis.currentPriceUSD, currency);
  const formattedInitialPrice = formatPrice(analysis.initialPriceUSD, currency);
  const formattedGain = formatPrice(Math.abs(analysis.totalGainUSD), currency);
  const isPositiveGrowth = analysis.totalGainUSD >= 0;

  // Custom luxury tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const rawData = payload[0]?.payload as (PriceTrendPoint & {
        marketValue: number;
        retailMSRP: number;
        auctionHigh: number;
      });

      if (!rawData) return null;

      const diffFromInitialUSD = rawData.marketValueUSD - analysis.initialPriceUSD;
      const pctFromInitial = analysis.initialPriceUSD > 0
        ? ((diffFromInitialUSD / analysis.initialPriceUSD) * 100).toFixed(1)
        : '0';

      return (
        <div className="bg-slate-950/95 backdrop-blur-md text-white p-4 rounded-2xl border border-[#C5A059]/40 shadow-2xl text-xs space-y-3 z-50 min-w-[240px] max-w-xs animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                Historical Milestone
              </span>
              <span className="font-bold text-[#E2C775] text-sm">
                {rawData.date} ({rawData.monthYear})
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#C5A059]/20 text-[#E2C775] border border-[#C5A059]/40">
              {currency}
            </span>
          </div>

          <div className="space-y-1.5 font-sans">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] shadow-xs" />
                <span>Secondary Market:</span>
              </span>
              <span className="font-mono font-bold text-white text-xs">
                {formatConvertedPrice(rawData.marketValue, currency)}
              </span>
            </div>

            {(metricMode === 'comparison' || metricMode === 'corridor') && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span>Atelier MSRP:</span>
                </span>
                <span className="font-mono text-slate-300 text-xs">
                  {formatConvertedPrice(rawData.retailMSRP, currency)}
                </span>
              </div>
            )}

            {metricMode === 'corridor' && (
              <div className="flex items-center justify-between">
                <span className="text-sky-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span>Auction Peak:</span>
                </span>
                <span className="font-mono text-sky-200 text-xs font-semibold">
                  {formatConvertedPrice(rawData.auctionHigh, currency)}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Net Period Growth:</span>
              <span
                className={`font-mono font-semibold ${
                  Number(pctFromInitial) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {Number(pctFromInitial) >= 0 ? `+${pctFromInitial}%` : `${pctFromInitial}%`}
              </span>
            </div>

            {rawData.eventMilestone && (
              <div className="mt-2 p-2 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/30 text-[11px] text-[#E2C775] flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span className="leading-snug">{rawData.eventMilestone}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 lg:p-10 shadow-sm space-y-6 sm:space-y-8">
      {/* 1. Header & Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9A7B38] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9A7B38] font-bold">
              Haute Horlogerie Market Index
            </span>
            <span className="text-slate-300">·</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold uppercase">
              Live Recharts Engine
            </span>
          </div>

          <h2 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Historical Valuation & Market Evolution
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            Verified secondary market index tracking international auction records, collector liquidity, and atelier MSRP adjustments for <strong className="text-slate-900 font-semibold">{watch.name}</strong> ({watch.reference}).
          </p>
        </div>

        {/* Right side controls: Timeframe tabs & view toggles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-2xs">
            {(['6M', '1Y', '3Y', '5Y', 'ALL'] as TrendTimeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Metric mode dropdown/tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs shadow-2xs">
            <button
              onClick={() => setMetricMode('market')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                metricMode === 'market'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Show Secondary Market Value Curve Only"
            >
              Market Index
            </button>
            <button
              onClick={() => setMetricMode('comparison')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                metricMode === 'comparison'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Compare Secondary Market Value vs Original MSRP"
            >
              vs. MSRP
            </button>
            <button
              onClick={() => setMetricMode('corridor')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer hidden sm:block ${
                metricMode === 'corridor'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Include Auction Peaks Corridor"
            >
              Corridor
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Investment & Valuation Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Current Estimated Market Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Market Valuation</span>
            <Sparkles className="w-3.5 h-3.5 text-[#9A7B38]" />
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
            <AnimatedPrice
              amountUSD={analysis.currentPriceUSD}
              currency={currency}
              duration={1000}
            />
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Issue MSRP:</span>
            <span className="font-mono font-medium text-slate-700">{formattedInitialPrice}</span>
          </div>
        </div>

        {/* Card 2: Total Appreciation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Value Appreciation</span>
            {isPositiveGrowth ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            )}
          </div>
          <div
            className={`text-lg sm:text-2xl font-bold font-mono tabular-nums ${
              isPositiveGrowth ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {isPositiveGrowth ? `+${analysis.totalAppreciationPercent}%` : `${analysis.totalAppreciationPercent}%`}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Net Gain:</span>
            <span className="font-mono font-medium text-emerald-700">
              +{formattedGain}
            </span>
          </div>
        </div>

        {/* Card 3: 5-Year CAGR / Annualized Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Annualized CAGR</span>
            <Clock className="w-3.5 h-3.5 text-[#9A7B38]" />
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-[#9A7B38] tabular-nums">
            +{analysis.cagrPercent}%
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            <span>Inflation Hedge Rating</span>
          </div>
        </div>

        {/* Card 4: Horology Asset Grade */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Collector Liquidity</span>
            <Award className="w-3.5 h-3.5 text-[#9A7B38]" />
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {analysis.liquidityTier}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium truncate flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>High Retention</span>
          </div>
        </div>
      </div>

      {/* 3. Primary Recharts Interactive Chart Canvas */}
      <div className="space-y-3">
        {/* Chart Legend Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono py-1">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#C5A059]" />
              <span className="text-slate-800 font-semibold">
                Secondary Market Index ({currency})
              </span>
            </div>

            {(metricMode === 'comparison' || metricMode === 'corridor') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 border-t-2 border-dashed border-slate-400" />
                <span className="text-slate-500">
                  Atelier Retail MSRP ({currency})
                </span>
              </div>
            )}

            {metricMode === 'corridor' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-sky-400/60" />
                <span className="text-sky-700 font-medium">
                  Private Auction Highs
                </span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Denominated in <strong className="text-slate-600 font-semibold">{currency}</strong> · Hover curve to inspect
          </div>
        </div>

        {/* Responsive Recharts Container */}
        <div className="w-full h-80 sm:h-96 min-w-0 bg-slate-50/50 rounded-2xl p-2 sm:p-4 border border-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={convertedChartData}
              margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
            >
              <defs>
                {/* Gold Gradient for Market Value Area */}
                <linearGradient id="marketGoldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A059" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
                </linearGradient>

                {/* Sky Gradient for Auction Corridor */}
                <linearGradient id="auctionCorridorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />

              <YAxis
                domain={[yBounds.min, yBounds.max]}
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(val) => {
                  if (val >= 1000000) return `${currencySymbol}${(val / 1000000).toFixed(1)}M`;
                  if (val >= 1000) return `${currencySymbol}${(val / 1000).toFixed(0)}k`;
                  return `${currencySymbol}${val}`;
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Auction Highs Corridor (when active) */}
              {metricMode === 'corridor' && (
                <Area
                  type="monotone"
                  dataKey="auctionHigh"
                  name="Auction Highs"
                  stroke="#38BDF8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#auctionCorridorGradient)"
                  dot={false}
                  activeDot={{ r: 4, stroke: '#0284C7', strokeWidth: 2, fill: '#fff' }}
                />
              )}

              {/* Secondary Market Value Area */}
              <Area
                type="monotone"
                dataKey="marketValue"
                name="Secondary Market Value"
                stroke="#9A7B38"
                strokeWidth={2.5}
                fill="url(#marketGoldGradient)"
                activeDot={{
                  r: 6,
                  stroke: '#C5A059',
                  strokeWidth: 3,
                  fill: '#0F172A',
                }}
              />

              {/* Atelier Retail MSRP Step/Line */}
              {(metricMode === 'comparison' || metricMode === 'corridor') && (
                <Line
                  type="stepAfter"
                  dataKey="retailMSRP"
                  name="Atelier MSRP"
                  stroke="#64748B"
                  strokeWidth={1.8}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Milestones Chronicle & Provenance Timeline */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#9A7B38]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Auction & Valuation Milestones (Chronological Chronicle)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            {analysis.points.filter((p) => p.eventMilestone).length} Historical Events
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {analysis.points
            .filter((p) => p.eventMilestone)
            .map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors flex items-start gap-2.5"
              >
                <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#9A7B38] font-mono text-[10px] font-bold shadow-2xs">
                  {item.quarter.split(' ')[0]}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="font-semibold text-slate-900">{item.quarter}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-[#9A7B38] font-bold">
                      {formatPrice(item.marketValueUSD, currency)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1 leading-snug">
                    {item.eventMilestone}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 5. Institutional Horology Advisory Footnote */}
      <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#C5A059]/30 flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-4 h-4 text-[#9A7B38] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-slate-900 font-semibold block">
            Aurelia Horology Provenance & Market Index Methodology
          </strong>
          <p className="text-[11px] text-slate-600 leading-relaxed font-light">
            Valuations are synchronized with international auction salerooms (Geneva, London, New York, Hong Kong) and certified private concierge transactions. Past performance is indicative of blue-chip horological demand and craftsmanship scarcity. All figures reflect net realized hammer prices converted into {currency}.
          </p>
        </div>
      </div>
    </div>
  );
};
