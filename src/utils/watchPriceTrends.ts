import { Watch, CurrencyCode } from '../types/watch';
import { convertPrice, formatPrice, formatConvertedPrice, getCurrencySymbol } from './currency';

export interface PriceTrendPoint {
  id: string;
  date: string;
  monthYear: string;
  quarter: string;
  timestamp: number;
  marketValueUSD: number;
  retailMSRPUSD: number;
  auctionHighUSD: number;
  eventMilestone?: string;
}

export type TrendTimeframe = '6M' | '1Y' | '3Y' | '5Y' | 'ALL';

export interface WatchPriceAnalysis {
  watchId: string;
  reference: string;
  watchName: string;
  timeframe: TrendTimeframe;
  initialPriceUSD: number;
  currentPriceUSD: number;
  allTimeHighUSD: number;
  allTimeLowUSD: number;
  totalAppreciationPercent: number;
  totalGainUSD: number;
  cagrPercent: number;
  liquidityTier: 'Exceptional (AAA)' | 'Prime Blue-Chip (AA+)' | 'Strong Retention (A)';
  retentionRating: string;
  points: PriceTrendPoint[];
}

/**
 * Pseudo-random deterministic hash generator based on watch properties
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generate a realistic, deterministic historical price evolution dataset for a watch.
 * Tracks MSRP baseline, secondary market index, and auction high marks from late 2021 to late 2026.
 */
export function generateWatchPriceHistory(watch: Watch): PriceTrendPoint[] {
  const seed = hashString(`${watch.id}-${watch.reference}`);
  const currentPrice = watch.priceUSD;

  // Collection & rarity specific growth dynamics
  let baseAppreciation = 0.22; // ~22% baseline appreciation over 5 years
  if (watch.isLimitedEdition) baseAppreciation += 0.18; // Limited runs command higher secondary premium
  if (watch.collection === 'Tourbillon') baseAppreciation += 0.15;
  if (watch.collection === 'Chronograph') baseAppreciation += 0.08;
  if (watch.collection === 'Heritage') baseAppreciation += 0.12;

  // Starting MSRP 5 years ago (Q4 2021)
  const initialMSRP = Math.round((currentPrice / (1 + baseAppreciation)) / 250) * 250;

  // Quarterly timeline points from Q4 2021 to Q4 2026 (21 quarters / 5 full years)
  const quarters = [
    { label: 'Q4 2021', monthYear: 'Oct 2021', ts: new Date('2021-10-01').getTime(), progress: 0.0, event: 'Geneva Salon World Premiere' },
    { label: 'Q1 2022', monthYear: 'Jan 2022', ts: new Date('2022-01-01').getTime(), progress: 0.04 },
    { label: 'Q2 2022', monthYear: 'Apr 2022', ts: new Date('2022-04-01').getTime(), progress: 0.09, event: 'Watches & Wonders Exhibition' },
    { label: 'Q3 2022', monthYear: 'Jul 2022', ts: new Date('2022-07-01').getTime(), progress: 0.14 },
    { label: 'Q4 2022', monthYear: 'Oct 2022', ts: new Date('2022-10-01').getTime(), progress: 0.21, event: 'COSC Chronometer Certification' },
    { label: 'Q1 2023', monthYear: 'Jan 2023', ts: new Date('2023-01-01').getTime(), progress: 0.28 },
    { label: 'Q2 2023', monthYear: 'Apr 2023', ts: new Date('2023-04-01').getTime(), progress: 0.35, event: 'Phillips Geneva Auction Record' },
    { label: 'Q3 2023', monthYear: 'Jul 2023', ts: new Date('2023-07-01').getTime(), progress: 0.41 },
    { label: 'Q4 2023', monthYear: 'Oct 2023', ts: new Date('2023-10-01').getTime(), progress: 0.49 },
    { label: 'Q1 2024', monthYear: 'Jan 2024', ts: new Date('2024-01-01').getTime(), progress: 0.56, event: 'Atelier Calibre Upgrade Announced' },
    { label: 'Q2 2024', monthYear: 'Apr 2024', ts: new Date('2024-04-01').getTime(), progress: 0.62 },
    { label: 'Q3 2024', monthYear: 'Jul 2024', ts: new Date('2024-07-01').getTime(), progress: 0.69 },
    { label: 'Q4 2024', monthYear: 'Oct 2024', ts: new Date('2024-10-01').getTime(), progress: 0.76, event: 'Christie’s Autumn Sale Highlight' },
    { label: 'Q1 2025', monthYear: 'Jan 2025', ts: new Date('2025-01-01').getTime(), progress: 0.81 },
    { label: 'Q2 2025', monthYear: 'Apr 2025', ts: new Date('2025-04-01').getTime(), progress: 0.86 },
    { label: 'Q3 2025', monthYear: 'Jul 2025', ts: new Date('2025-07-01').getTime(), progress: 0.90, event: 'Vault Allocation Sold Out' },
    { label: 'Q4 2025', monthYear: 'Oct 2025', ts: new Date('2025-10-01').getTime(), progress: 0.93 },
    { label: 'Q1 2026', monthYear: 'Jan 2026', ts: new Date('2026-01-01').getTime(), progress: 0.96 },
    { label: 'Q2 2026', monthYear: 'Apr 2026', ts: new Date('2026-04-01').getTime(), progress: 0.98, event: 'Haute Horlogerie Grand Prix' },
    { label: 'Q3 2026', monthYear: 'Jul 2026', ts: new Date('2026-07-01').getTime(), progress: 0.99 },
    { label: 'Q4 2026', monthYear: 'Nov 2026', ts: new Date('2026-11-01').getTime(), progress: 1.0, event: 'Current Secondary Market Index' },
  ];

  return quarters.map((q, idx) => {
    // Subtle pseudo-random micro oscillation based on seed
    const pseudoRandom = Math.sin(seed + idx * 1.7) * 0.025;
    const progressWithNoise = Math.min(1.0, Math.max(0, q.progress + pseudoRandom));

    // Retail MSRP steps up gradually every 1.5 - 2 years (typical Swiss luxury annual price revisions)
    const annualPriceStepIndex = Math.floor(idx / 4);
    const retailMSRP = Math.round((initialMSRP * (1 + annualPriceStepIndex * 0.045)) / 100) * 100;

    // Secondary Market Value trajectory
    const totalGrowth = currentPrice - initialMSRP;
    let marketValue = Math.round(initialMSRP + totalGrowth * progressWithNoise);

    // Ensure the last point matches current price exactly
    if (idx === quarters.length - 1) {
      marketValue = currentPrice;
    }

    // Auction high mark is typically 6% to 15% above median market
    const auctionPremiumRatio = 1 + 0.06 + Math.abs(Math.cos(seed + idx)) * 0.09;
    const auctionHigh = Math.round(marketValue * auctionPremiumRatio);

    return {
      id: `pt-${idx}-${q.label.replace(' ', '-')}`,
      date: q.label,
      monthYear: q.monthYear,
      quarter: q.label,
      timestamp: q.ts,
      marketValueUSD: marketValue,
      retailMSRPUSD: retailMSRP,
      auctionHighUSD: auctionHigh,
      eventMilestone: q.event,
    };
  });
}

/**
 * Filter points by selected timeframe
 */
export function filterPriceHistoryByTimeframe(
  allPoints: PriceTrendPoint[],
  timeframe: TrendTimeframe
): PriceTrendPoint[] {
  if (timeframe === 'ALL' || allPoints.length <= 4) {
    return allPoints;
  }

  // Points correspond to quarters:
  // 6M: last 3 data points (~6-9 months)
  // 1Y: last 5 data points (~12 months)
  // 3Y: last 13 data points (~36 months)
  // 5Y: all 21 data points (~60 months)
  switch (timeframe) {
    case '6M':
      return allPoints.slice(-3);
    case '1Y':
      return allPoints.slice(-5);
    case '3Y':
      return allPoints.slice(-13);
    case '5Y':
    default:
      return allPoints;
  }
}

/**
 * Compute key investment analysis metrics for the timepiece
 */
export function getWatchPriceAnalysis(
  watch: Watch,
  timeframe: TrendTimeframe = '3Y'
): WatchPriceAnalysis {
  const fullHistory = generateWatchPriceHistory(watch);
  const activePoints = filterPriceHistoryByTimeframe(fullHistory, timeframe);

  const initialPoint = activePoints[0] || fullHistory[0];
  const currentPoint = activePoints[activePoints.length - 1] || fullHistory[fullHistory.length - 1];

  const initialPriceUSD = initialPoint.marketValueUSD;
  const currentPriceUSD = currentPoint.marketValueUSD;

  const totalGainUSD = currentPriceUSD - initialPriceUSD;
  const totalAppreciationPercent = initialPriceUSD > 0
    ? Number(((totalGainUSD / initialPriceUSD) * 100).toFixed(1))
    : 0;

  // Find all-time high & low in the selected window
  const allValues = activePoints.map((p) => p.marketValueUSD);
  const allTimeHighUSD = Math.max(...allValues, currentPriceUSD);
  const allTimeLowUSD = Math.min(...allValues, initialPriceUSD);

  // Approximate CAGR
  const years = timeframe === '6M' ? 0.5 : timeframe === '1Y' ? 1 : timeframe === '3Y' ? 3 : 5;
  const cagrPercent = initialPriceUSD > 0 && years > 0
    ? Number(((Math.pow(currentPriceUSD / initialPriceUSD, 1 / years) - 1) * 100).toFixed(1))
    : totalAppreciationPercent;

  let liquidityTier: WatchPriceAnalysis['liquidityTier'] = 'Strong Retention (A)';
  if (totalAppreciationPercent >= 25 || watch.isLimitedEdition) {
    liquidityTier = 'Exceptional (AAA)';
  } else if (totalAppreciationPercent >= 12) {
    liquidityTier = 'Prime Blue-Chip (AA+)';
  }

  const retentionRating =
    totalAppreciationPercent >= 20
      ? 'High Secondary Appreciation & Collector Demand'
      : totalAppreciationPercent >= 10
      ? 'Steady Capital Preservation & Outperforming Inflation'
      : 'Stable Atelier Value & Certified Provenance';

  return {
    watchId: watch.id,
    reference: watch.reference,
    watchName: watch.name,
    timeframe,
    initialPriceUSD,
    currentPriceUSD,
    allTimeHighUSD,
    allTimeLowUSD,
    totalAppreciationPercent,
    totalGainUSD,
    cagrPercent,
    liquidityTier,
    retentionRating,
    points: activePoints,
  };
}
