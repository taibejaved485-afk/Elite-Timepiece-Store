export interface SiteSettings {
  // Top Announcement Banner
  announcement: {
    enabled: boolean;
    badge: string;
    text: string;
    linkUrl: string;
    linkText: string;
  };
  // Atelier Showroom Status
  atelier: {
    statusBadge: string;
    statusText: string;
    headline: string;
    subheadline: string;
    locationNote: string;
  };
  // Concierge & Contact
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    visitingHours: string;
  };
  // Store & Logistics Policies
  policies: {
    freeInsuredDelivery: boolean;
    leadTimeDays: number;
    armoredCourier: string;
    warrantyYears: number;
    moneyBackGuaranteeDays: number;
    allowArmoredCOD: boolean;
    allowWireTransfer: boolean;
    allowCardPayment: boolean;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcement: {
    enabled: true,
    badge: 'GENEVA ATELIER',
    text: 'Complimentary Worldwide Armored Delivery & 5-Year Swiss Manufacture Guarantee Included',
    linkUrl: '#collections',
    linkText: 'Explore Vault →',
  },
  atelier: {
    statusBadge: 'LIVE VAULT INVENTORY',
    statusText: 'Le Brassus Subterranean Vaults Open & Active',
    headline: 'Master Horological Creations Since 1892',
    subheadline: ' Vallée de Joux, Switzerland — Hand-finished calibres with Geneva Seal perfection',
    locationNote: 'Private salon viewings by prior diplomatic or collector appointment only',
  },
  contact: {
    phone: '+41 22 819 1892',
    whatsapp: '+41 79 400 1892',
    email: 'concierge@aureliahorology.ch',
    address: 'Grand-Rue 42, 1348 Le Brassus, Vallée de Joux, Switzerland',
    visitingHours: 'Monday – Saturday: 09:00 – 18:00 CET',
  },
  policies: {
    freeInsuredDelivery: true,
    leadTimeDays: 4,
    armoredCourier: 'Malca-Amit & Brink’s Ultra-Secure Armored Logistics',
    warrantyYears: 5,
    moneyBackGuaranteeDays: 30,
    allowArmoredCOD: true,
    allowWireTransfer: true,
    allowCardPayment: true,
  },
};

const STORAGE_KEY = 'aurelia_site_settings_v1';

export function getSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
      return DEFAULT_SITE_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      announcement: { ...DEFAULT_SITE_SETTINGS.announcement, ...(parsed.announcement || {}) },
      atelier: { ...DEFAULT_SITE_SETTINGS.atelier, ...(parsed.atelier || {}) },
      contact: { ...DEFAULT_SITE_SETTINGS.contact, ...(parsed.contact || {}) },
      policies: { ...DEFAULT_SITE_SETTINGS.policies, ...(parsed.policies || {}) },
    };
  } catch (e) {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('aurelia_settings_changed', { detail: settings }));
  } catch (e) {
    console.error('Error saving site settings', e);
  }
}

export function resetSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
    window.dispatchEvent(new CustomEvent('aurelia_settings_changed', { detail: DEFAULT_SITE_SETTINGS }));
    return DEFAULT_SITE_SETTINGS;
  } catch (e) {
    return DEFAULT_SITE_SETTINGS;
  }
}
