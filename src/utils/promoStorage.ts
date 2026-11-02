export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 5000 for $5,000 USD
  minOrderUSD?: number;
  active: boolean;
  usesCount: number;
  description: string;
}

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'AURELIA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderUSD: 20000,
    active: true,
    usesCount: 4,
    description: '10% Welcome concession for VIP horology patrons',
  },
  {
    id: 'promo-2',
    code: 'GENEVA5000',
    discountType: 'fixed',
    discountValue: 5000,
    minOrderUSD: 40000,
    active: true,
    usesCount: 2,
    description: '$5,000 Private acquisition endowment credit',
  },
  {
    id: 'promo-3',
    code: 'TOURBILLON15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderUSD: 80000,
    active: true,
    usesCount: 1,
    description: '15% High-complication private salon collector privilege',
  },
];

const STORAGE_KEY = 'aurelia_discount_codes_v1';

export function getPromoCodes(): PromoCode[] {
  if (typeof window === 'undefined') return INITIAL_PROMO_CODES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROMO_CODES));
      return INITIAL_PROMO_CODES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PROMO_CODES;
  } catch (e) {
    return INITIAL_PROMO_CODES;
  }
}

export function savePromoCodes(codes: PromoCode[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
    window.dispatchEvent(new CustomEvent('aurelia_promos_changed'));
  } catch (e) {
    console.error('Error saving promo codes', e);
  }
}

export function validatePromoCode(inputCode: string, orderTotalUSD: number): { valid: boolean; discountUSD: number; message: string; promo?: PromoCode } {
  const clean = inputCode.trim().toUpperCase();
  const all = getPromoCodes();
  const match = all.find((p) => p.code.toUpperCase() === clean);

  if (!match) {
    return { valid: false, discountUSD: 0, message: 'Invalid or expired concession code.' };
  }

  if (!match.active) {
    return { valid: false, discountUSD: 0, message: 'This concession code is currently deactivated.' };
  }

  if (match.minOrderUSD && orderTotalUSD < match.minOrderUSD) {
    return {
      valid: false,
      discountUSD: 0,
      message: `Minimum order value of $${match.minOrderUSD.toLocaleString()} USD required for code ${match.code}.`,
    };
  }

  let discountUSD = 0;
  if (match.discountType === 'percentage') {
    discountUSD = Math.round((orderTotalUSD * match.discountValue) / 100);
  } else {
    discountUSD = Math.min(match.discountValue, orderTotalUSD);
  }

  return {
    valid: true,
    discountUSD,
    message: `Applied ${match.code}: ${match.discountType === 'percentage' ? `${match.discountValue}% off` : `$${match.discountValue.toLocaleString()} off`}`,
    promo: match,
  };
}
