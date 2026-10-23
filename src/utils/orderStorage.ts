import { CartItem } from '../types/watch';

export interface OrderMilestone {
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current?: boolean;
}

export interface PlacedOrder {
  orderNumber: string;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  items: {
    id: string;
    name: string;
    reference: string;
    image: string;
    quantity: number;
    priceUSD: number;
    bespokeDial?: string;
    bespokeEngraving?: string;
  }[];
  timepieceSummary: string;
  totalUSD: number;
  paymentMethod: 'armored-cod' | 'wire' | 'card';
  orderDate: string;
  estimatedDelivery: string;
  carrier: string;
  airwayBill: string;
  valuationCover: string;
  currentLocation: string;
  destination: string;
  status: 'In Transit' | 'Out for Delivery' | 'Atelier Assembly' | 'Delivered' | 'Allocated';
  progressStep: number; // 1 to 5
  steps: OrderMilestone[];
  placedAtISO: string;
}

const STORAGE_KEY = 'aurelia_placed_orders_v2';
const LAST_ORDER_KEY = 'aurelia_last_order_v2';

export const INITIAL_DEMO_ORDERS: PlacedOrder[] = [
  {
    orderNumber: 'AUR-89201-CH',
    clientName: 'Lord Sterling Vance',
    email: 'sterling.vance@mayfairholdings.co.uk',
    phone: '+44 20 7946 0912',
    address: '14 Grosvenor Square, Mayfair',
    city: 'London',
    country: 'United Kingdom',
    postalCode: 'W1K 6JP',
    items: [
      {
        id: 'watch-1',
        name: 'Aurelia Royal Chronograph 41',
        reference: 'REF. AH-5980-RG',
        image: '/assets/images/hero_luxury_chronograph_1791612522214.jpg',
        quantity: 1,
        priceUSD: 42500,
      },
    ],
    timepieceSummary: 'Aurelia Royal Chronograph 41 (18k Rose Gold)',
    totalUSD: 42500,
    paymentMethod: 'wire',
    orderDate: 'October 19, 2026',
    estimatedDelivery: 'October 25, 2026 · Armored Escort (14:00 - 16:30)',
    carrier: 'Malca-Amit Ultra-Secure Armored Logistics',
    airwayBill: 'MA-9921-GVA-LON',
    valuationCover: '100% Comprehensive Lloyd’s of London Armored Policy',
    currentLocation: 'London Heathrow Armored Cargo Hub (Transit Clearance)',
    destination: 'Mayfair Private Residence, London, UK',
    status: 'In Transit',
    progressStep: 4,
    placedAtISO: '2026-10-19T09:30:00.000Z',
    steps: [
      {
        title: 'Order Verified & Vault Allocation',
        description: 'Timepiece retrieved from Le Brassus subterranean vault under dual-key authorization.',
        timestamp: 'Oct 19 · 09:30 CET',
        location: 'Manufacture Aurelia, Le Brassus, Switzerland',
        completed: true,
      },
      {
        title: 'COSC Chronometer Testing & Geneva Seal Validation',
        description: 'Final 5-position rate verification completed (rate deviation: +0.3 sec/day). Cryptographic NFC chip registered.',
        timestamp: 'Oct 20 · 14:45 CET',
        location: 'Chronometry Quality Control, Geneva',
        completed: true,
      },
      {
        title: 'Walnut Presentation Box Packaging & Wax Seal',
        description: 'Hand-polished Swiss walnut showcase vacuum-sealed with tamper-evident security ribbon.',
        timestamp: 'Oct 21 · 11:15 CET',
        location: 'Geneva Logistics Depot',
        completed: true,
      },
      {
        title: 'Armed Flight & Regional Terminal Transit',
        description: 'Consignment secured aboard private chartered courier flight under constant biometric escort.',
        timestamp: 'Oct 22 · 18:20 GMT',
        location: 'London Heathrow Armored Terminal',
        completed: true,
        current: true,
      },
      {
        title: 'White-Glove Armored Handover',
        description: 'Government photo identification and verified digital signature required upon delivery.',
        timestamp: 'Scheduled: Oct 25 · 14:00 GMT',
        location: 'Mayfair Client Salon',
        completed: false,
      },
    ],
  },
  {
    orderNumber: 'AUR-9010-SK',
    clientName: 'Dr. Alistair Chen',
    email: 'alistair.chen@difc-capital.ae',
    phone: '+971 4 362 7000',
    address: 'Gate Precinct 4, Level 7, DIFC',
    city: 'Dubai',
    country: 'United Arab Emirates',
    postalCode: '506500',
    items: [
      {
        id: 'watch-2',
        name: 'Symphonie Skeleton Flying Tourbillon',
        reference: 'REF. AH-9010-SK',
        image: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
        quantity: 1,
        priceUSD: 115000,
      },
    ],
    timepieceSummary: 'Symphonie Skeleton Flying Tourbillon (Limited 25 Pcs)',
    totalUSD: 115000,
    paymentMethod: 'armored-cod',
    orderDate: 'October 20, 2026',
    estimatedDelivery: 'October 26, 2026 · Morning Diplomatic Escort',
    carrier: 'Brink’s Global Luxury Horology Courier',
    airwayBill: 'BG-7740-ZRH-DXB',
    valuationCover: 'Full Insured Valuation ($120,000 USD)',
    currentLocation: 'Zurich Kloten International Armored Depot',
    destination: 'DIFC Financial District, Dubai, UAE',
    status: 'In Transit',
    progressStep: 3,
    placedAtISO: '2026-10-20T11:00:00.000Z',
    steps: [
      {
        title: 'Order Verified & Vault Allocation',
        description: 'Skeleton tourbillon allocation reserved from numbered limited series (Piece 08/25).',
        timestamp: 'Oct 20 · 11:00 CET',
        location: 'Le Brassus Manufacture',
        completed: true,
      },
      {
        title: 'Regulation & Chronofiable Certification',
        description: 'Master watchmaker hand-tuned titanium tourbillon cage and verified 72-hour power reserve.',
        timestamp: 'Oct 21 · 16:30 CET',
        location: 'Atelier Quality Division',
        completed: true,
      },
      {
        title: 'Consignment Transferred to Armored Fleet',
        description: 'Transferred to Brink’s Swiss bullion armored transit for air cargo clearance.',
        timestamp: 'Oct 22 · 14:10 CET',
        location: 'Zurich Kloten Security Depot',
        completed: true,
        current: true,
      },
      {
        title: 'Customs Diplomatic Air Transit',
        description: 'Carnet ATA and export documentation processed by Swiss Horological Federation.',
        timestamp: 'Pending Air Departure',
        location: 'Zurich / Dubai Flight Path',
        completed: false,
      },
      {
        title: 'VIP Private Salon Handover',
        description: 'White-glove consultation and bespoke strap sizing on arrival.',
        timestamp: 'Scheduled: Oct 26',
        location: 'Dubai International Financial Centre',
        completed: false,
      },
    ],
  },
  {
    orderNumber: 'AUR-300-TI',
    clientName: 'Marcus Lindqvist',
    email: 'marcus@nordicventures.se',
    phone: '+46 8 505 2000',
    address: 'Strandvägen 18, Östermalm',
    city: 'Stockholm',
    country: 'Sweden',
    postalCode: '114 56',
    items: [
      {
        id: 'watch-3',
        name: 'Abyss Master Diver 300M Titanium',
        reference: 'REF. AH-300-TI',
        image: '/assets/images/watch_diver_submariner_1791612540699.jpg',
        quantity: 1,
        priceUSD: 24500,
      },
    ],
    timepieceSummary: 'Abyss Master Diver 300M Titanium',
    totalUSD: 24500,
    paymentMethod: 'card',
    orderDate: 'October 21, 2026',
    estimatedDelivery: 'October 27, 2026',
    carrier: 'Ferrari Group Fine Art & Luxury Courier',
    airwayBill: 'FG-4482-GVA-ARN',
    valuationCover: 'Full Commercial Valuation Insurance',
    currentLocation: 'Geneva Manufacture Cleanroom Packaging',
    destination: 'Östermalm Residence, Stockholm, Sweden',
    status: 'Atelier Assembly',
    progressStep: 2,
    placedAtISO: '2026-10-21T14:20:00.000Z',
    steps: [
      {
        title: 'Acquisition Confirmed',
        description: 'Armored order registered and assigned dedicated client concierge.',
        timestamp: 'Oct 21 · 14:20 CET',
        location: 'Le Brassus Atelier',
        completed: true,
      },
      {
        title: '30-Bar Hydrostatic Pressure Validation',
        description: 'Laboratory water resistance testing to 300 meters depth certified by master horologist.',
        timestamp: 'Oct 22 · 09:15 CET',
        location: 'Hydrodynamic Lab, Le Brassus',
        completed: true,
        current: true,
      },
      {
        title: 'Armored Packaging & Security Barcode',
        description: 'Preparation of titanium travel capsule and magnetic provenance passport.',
        timestamp: 'In Progress',
        location: 'Packaging Atelier',
        completed: false,
      },
      {
        title: 'Transit to Carrier Hub',
        description: 'Scheduled armored courier collection.',
        timestamp: 'Pending',
        location: 'Geneva Airport Hub',
        completed: false,
      },
      {
        title: 'Secure Handover to Patron',
        description: 'Armed escort delivery to verified Scandinavian address.',
        timestamp: 'Expected Oct 27',
        location: 'Stockholm Delivery Zone',
        completed: false,
      },
    ],
  },
];

export function getPlacedOrders(): PlacedOrder[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_DEMO_ORDERS;
  } catch (err) {
    return INITIAL_DEMO_ORDERS;
  }
}

export function savePlacedOrder(order: PlacedOrder): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getPlacedOrders();
    const updated = [order, ...existing.filter((o) => o.orderNumber !== order.orderNumber)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch (err) {
    // ignore quota/storage issues
  }
}

export function getLastPlacedOrder(): PlacedOrder | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    if (raw) return JSON.parse(raw);
    const all = getPlacedOrders();
    return all[0] || null;
  } catch (err) {
    return null;
  }
}

export function findOrderByQuery(query: string): PlacedOrder | null {
  const clean = query.trim().toUpperCase();
  if (!clean) return null;

  const orders = getPlacedOrders();
  // Match by exact order number, case-insensitive
  const byNum = orders.find((o) => o.orderNumber.toUpperCase() === clean);
  if (byNum) return byNum;

  // Match by Airway bill
  const byAWB = orders.find((o) => o.airwayBill.toUpperCase() === clean);
  if (byAWB) return byAWB;

  // Match by email
  const byEmail = orders.find((o) => o.email.toUpperCase() === clean);
  if (byEmail) return byEmail;

  // Partial match by orderNumber
  const byPartial = orders.find((o) => o.orderNumber.toUpperCase().includes(clean));
  if (byPartial) return byPartial;

  return null;
}

/**
 * Creates a brand new fully populated order from Checkout form submission
 */
export function createNewOrder(
  formData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    paymentMethod: 'armored-cod' | 'wire' | 'card';
    notes?: string;
  },
  items: CartItem[],
  totalUSD: number
): PlacedOrder {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `AUR-2026-${randomSuffix}`;
  const awbSuffix = Math.floor(10000 + Math.random() * 90000);
  const airwayBill = `MA-${awbSuffix}-GVA-EXP`;

  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const orderDate = now.toLocaleDateString('en-US', dateOptions);

  const deliveryDateObj = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
  const estimatedDelivery = `${deliveryDateObj.toLocaleDateString('en-US', dateOptions)} · Priority Armored Courier`;

  const orderItems = items.map((i) => ({
    id: i.watch.id,
    name: i.watch.name,
    reference: i.watch.reference,
    image: i.watch.image,
    quantity: i.quantity,
    priceUSD: i.bespokePrice || i.watch.priceUSD,
    bespokeDial: i.bespokeDial,
    bespokeEngraving: i.bespokeEngraving || i.customEngraving,
  }));

  const timepieceSummary = orderItems.map((i) => `${i.name} (×${i.quantity})`).join(', ');

  const newOrder: PlacedOrder = {
    orderNumber,
    clientName: formData.fullName || 'Valued Horology Patron',
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    city: formData.city,
    country: formData.country,
    postalCode: formData.postalCode,
    items: orderItems,
    timepieceSummary,
    totalUSD,
    paymentMethod: formData.paymentMethod,
    orderDate,
    estimatedDelivery,
    carrier: 'Malca-Amit Ultra-Secure Armored Courier',
    airwayBill,
    valuationCover: '100% Comprehensive Lloyd’s of London Armored Policy',
    currentLocation: 'Le Brassus Atelier Subterranean Vault (Prepared for Dispatch)',
    destination: `${formData.address}, ${formData.city}, ${formData.country}`,
    status: 'Atelier Assembly',
    progressStep: 2,
    placedAtISO: now.toISOString(),
    steps: [
      {
        title: 'Acquisition Confirmed & Vault Allocation',
        description: `Order successfully booked and authorized. Escrow allocation reserved from Le Brassus safes for ${formData.fullName}.`,
        timestamp: `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · Just Now`,
        location: 'Manufacture Aurelia, Le Brassus, Switzerland',
        completed: true,
      },
      {
        title: 'Master Horologist Inspection & COSC Protocol',
        description: 'Undergoing 5-position rate verification, escapement regulation, and water resistance validation.',
        timestamp: 'In Progress (Active Testing)',
        location: 'Le Brassus Testing Laboratory',
        completed: true,
        current: true,
      },
      {
        title: 'Handcrafted Wooden Presentation Box Packaging',
        description: 'Hand-polished Swiss walnut box, bespoke Certificate of Origin, and tamper-evident cryptographic security seal.',
        timestamp: 'Scheduled Next (24 Hours)',
        location: 'Geneva Logistics Depot',
        completed: false,
      },
      {
        title: 'Armored Aircraft & Dedicated Secure Transit',
        description: 'Insured high-value transport with continuous satellite GPS monitoring and armed courier custody.',
        timestamp: 'Pending Air Departure',
        location: 'Geneva Airport High-Security Terminal',
        completed: false,
      },
      {
        title: 'White-Glove Direct Handover to Client',
        description: `Delivery to ${formData.address}, ${formData.city}. Photographic ID and dual verification required.`,
        timestamp: `Expected: ${estimatedDelivery}`,
        location: `${formData.city}, ${formData.country}`,
        completed: false,
      },
    ],
  };

  savePlacedOrder(newOrder);
  return newOrder;
}
