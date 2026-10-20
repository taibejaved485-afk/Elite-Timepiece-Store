export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PKR' | 'AED';

export interface WatchSpec {
  caseDiameter: string;
  caseThickness: string;
  caseMaterial: string;
  bezelMaterial: string;
  dialColor: string;
  crystal: string;
  waterResistance: string;
  movement: string;
  calibre: string;
  powerReserve: string;
  frequency: string;
  jewels: number;
  strap: string;
}

export interface Watch {
  id: string;
  reference: string;
  name: string;
  collection: 'Chronograph' | 'Diver' | 'Tourbillon' | 'Dress' | 'Heritage';
  tagline: string;
  description: string;
  priceUSD: number;
  image: string;
  gallery: string[];
  specs: WatchSpec;
  isFeatured?: boolean;
  isNewRelease?: boolean;
  isLimitedEdition?: boolean;
  editionLimit?: number;
  inStock: boolean;
  stockCount: number;
}

export interface CartItem {
  watch: Watch;
  quantity: number;
  selectedStrap?: string;
  customEngraving?: string;
  bespokeCase?: string;
  bespokeDial?: string;
  bespokePrice?: number;
}

export interface BespokeConfiguration {
  caseMaterial: '18k-rose-gold' | 'oystersteel-904l' | 'titanium-grade-5' | 'obsidian-ceramic';
  dialColor: 'midnight-blue' | 'obsidian-black' | 'champagne-opaline' | 'racing-emerald';
  movementType: 'automatic-date' | 'skeleton-tourbillon';
  strapType: 'alligator-leather' | 'oyster-steel' | 'milanese-mesh' | 'tuscan-suede';
  engravingText: string;
}

export type PageRoute = 'home' | 'collections' | 'craftsmanship' | 'bespoke' | 'heritage' | 'concierge' | 'admin' | 'privacy' | 'terms' | 'provenance' | `product-${string}` | `article-${string}`;
