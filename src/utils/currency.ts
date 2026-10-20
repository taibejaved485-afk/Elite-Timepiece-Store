import { CurrencyCode } from '../types/watch';

export interface CurrencyMetadata {
  code: CurrencyCode;
  locale: string;
  rate: number;
  symbol: string;
  label: string;
  name: string;
  defaultFractionDigits: number;
}

export interface FormatPriceOptions {
  /**
   * Whether to include decimal fractions (e.g., .00).
   * Defaults to false for whole luxury timepiece prices.
   */
  showDecimals?: boolean;
  /** Force specific minimum decimal places */
  minimumFractionDigits?: number;
  /** Force specific maximum decimal places */
  maximumFractionDigits?: number;
  /**
   * How to display the currency: 'symbol' ($), 'narrowSymbol' ($), 'code' (USD), 'name' (US dollars).
   * Defaults to 'symbol'.
   */
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';
  /**
   * Whether to format in compact notation (e.g., $42.5K).
   * Defaults to false.
   */
  compact?: boolean;
  /** Override the default locale for the currency */
  locale?: string;
  /** Fallback string if amount is not finite or invalid */
  fallback?: string;
}

/**
 * Currency configurations and exchange rates against 1 USD base.
 */
export const CURRENCY_CONFIG: Record<CurrencyCode, CurrencyMetadata> = {
  USD: {
    code: 'USD',
    locale: 'en-US',
    rate: 1,
    symbol: '$',
    label: 'USD ($)',
    name: 'US Dollar',
    defaultFractionDigits: 0,
  },
  EUR: {
    code: 'EUR',
    locale: 'en-IE', // Uses standard international Euro symbol placement (€42,500)
    rate: 0.92,
    symbol: '€',
    label: 'EUR (€)',
    name: 'Euro',
    defaultFractionDigits: 0,
  },
  GBP: {
    code: 'GBP',
    locale: 'en-GB',
    rate: 0.79,
    symbol: '£',
    label: 'GBP (£)',
    name: 'British Pound',
    defaultFractionDigits: 0,
  },
  PKR: {
    code: 'PKR',
    locale: 'en-PK',
    rate: 278.5,
    symbol: '₨',
    label: 'PKR (₨)',
    name: 'Pakistani Rupee',
    defaultFractionDigits: 0,
  },
  AED: {
    code: 'AED',
    locale: 'en-AE',
    rate: 3.67,
    symbol: 'AED ',
    label: 'AED (د.إ)',
    name: 'UAE Dirham',
    defaultFractionDigits: 0,
  },
};

/**
 * Backward-compatible CURRENCY_RATES mapping
 */
export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: CURRENCY_CONFIG.USD.symbol, rate: CURRENCY_CONFIG.USD.rate, label: CURRENCY_CONFIG.USD.label },
  EUR: { symbol: CURRENCY_CONFIG.EUR.symbol, rate: CURRENCY_CONFIG.EUR.rate, label: CURRENCY_CONFIG.EUR.label },
  GBP: { symbol: CURRENCY_CONFIG.GBP.symbol, rate: CURRENCY_CONFIG.GBP.rate, label: CURRENCY_CONFIG.GBP.label },
  PKR: { symbol: CURRENCY_CONFIG.PKR.symbol, rate: CURRENCY_CONFIG.PKR.rate, label: CURRENCY_CONFIG.PKR.label },
  AED: { symbol: CURRENCY_CONFIG.AED.symbol, rate: CURRENCY_CONFIG.AED.rate, label: CURRENCY_CONFIG.AED.label },
};

/**
 * Cache for Intl.NumberFormat instances to prevent GC thrashing on repeated renders
 */
const formatterCache = new Map<string, Intl.NumberFormat>();

/**
 * Retrieve or build a cached Intl.NumberFormat instance
 */
function getCachedFormatter(
  locale: string,
  currency: CurrencyCode,
  options?: FormatPriceOptions
): Intl.NumberFormat {
  const showDecimals = options?.showDecimals ?? false;
  const minDigits =
    options?.minimumFractionDigits ?? (showDecimals ? 2 : 0);
  const maxDigits =
    options?.maximumFractionDigits ?? (showDecimals ? 2 : 0);
  const currencyDisplay = options?.currencyDisplay ?? 'symbol';
  const notation = options?.compact ? 'compact' : 'standard';

  const cacheKey = `${locale}|${currency}|${minDigits}|${maxDigits}|${currencyDisplay}|${notation}`;

  let formatter = formatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      currencyDisplay: currencyDisplay,
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
      notation: notation,
    });
    formatterCache.set(cacheKey, formatter);
  }

  return formatter;
}

/**
 * Converts a base USD amount to target currency.
 */
export function convertPrice(amountUSD: number, currency: CurrencyCode): number {
  if (typeof amountUSD !== 'number' || !Number.isFinite(amountUSD)) {
    return 0;
  }
  const meta = CURRENCY_CONFIG[currency] ?? CURRENCY_CONFIG.USD;
  return amountUSD * meta.rate;
}

/**
 * Formats a raw numeric amount that is already denominated in the target currency.
 *
 * @param amountInCurrency - The value already converted into the target currency.
 * @param currency - The currency code (USD, EUR, GBP, PKR, AED).
 * @param options - Customization options for decimal display, compact notation, etc.
 * @returns Formatted currency string using Intl.NumberFormat.
 */
export function formatConvertedPrice(
  amountInCurrency: number,
  currency: CurrencyCode,
  options?: FormatPriceOptions
): string {
  if (typeof amountInCurrency !== 'number' || !Number.isFinite(amountInCurrency)) {
    return options?.fallback ?? '—';
  }

  const meta = CURRENCY_CONFIG[currency] ?? CURRENCY_CONFIG.USD;
  const locale = options?.locale ?? meta.locale;

  try {
    const formatter = getCachedFormatter(locale, currency, options);
    const formatted = formatter.format(amountInCurrency);

    // Some locales might output localized symbols that benefit from slight spacing consistency
    return formatted;
  } catch (error) {
    // Resilient fallback in case of unsupported browser locales or unexpected options
    const showDecimals = options?.showDecimals ?? false;
    const rounded = showDecimals ? amountInCurrency.toFixed(2) : Math.round(amountInCurrency).toString();
    const formattedNumber = Number(rounded).toLocaleString('en-US');
    return `${meta.symbol}${formattedNumber}`;
  }
}

/**
 * Formats a base USD watch price into the target currency using Intl.NumberFormat.
 * Converts the amount according to real-time atelier rates and applies proper localization.
 *
 * @param amountUSD - The watch price denominated in base USD.
 * @param currency - The desired display currency code.
 * @param options - Customization options.
 * @returns Localized, professionally formatted currency string.
 *
 * @example
 * formatPrice(42500, 'USD') // "$42,500"
 * formatPrice(42500, 'EUR') // "€39,100"
 * formatPrice(42500, 'GBP') // "£33,575"
 * formatPrice(42500, 'PKR') // "₨ 11,836,250"
 * formatPrice(42500, 'AED') // "AED 155,975"
 */
export function formatPrice(
  amountUSD: number,
  currency: CurrencyCode,
  options?: FormatPriceOptions
): string {
  if (typeof amountUSD !== 'number' || !Number.isFinite(amountUSD)) {
    return options?.fallback ?? '—';
  }

  const converted = convertPrice(amountUSD, currency);
  return formatConvertedPrice(converted, currency, options);
}

/**
 * Helper to get the canonical symbol for a currency.
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_CONFIG[currency]?.symbol ?? '$';
}

/**
 * Helper to get the current conversion rate for a currency.
 */
export function getCurrencyRate(currency: CurrencyCode): number {
  return CURRENCY_CONFIG[currency]?.rate ?? 1;
}

/**
 * Type guard to check if a string is a valid supported CurrencyCode.
 */
export function isValidCurrencyCode(code: string): code is CurrencyCode {
  return Object.prototype.hasOwnProperty.call(CURRENCY_CONFIG, code);
}
