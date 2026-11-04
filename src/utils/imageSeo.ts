import { Watch } from '../types/watch';

/**
 * Generates a descriptive, SEO-optimized alt tag for a watch image based on its metadata.
 * Optimizes for accessibility (WCAG) and Google Image Search rankings (brand, model, reference, collection, materials, complication).
 */
export function getWatchImageAlt(watch?: Partial<Watch>, contextType: 'hero' | 'gallery' | 'card' | 'thumbnail' | 'modal' = 'card'): string {
  if (!watch) {
    return 'Aurelia Horology Swiss luxury timepiece craft';
  }

  const name = watch.name || 'Luxury Timepiece';
  const reference = watch.reference ? ` (${watch.reference})` : '';
  const collection = watch.collection ? `${watch.collection} Collection` : 'Haute Horlogerie';
  const material = watch.specs?.caseMaterial ? ` in ${watch.specs.caseMaterial}` : '';
  const calibre = watch.specs?.calibre ? ` powered by ${watch.specs.calibre}` : '';
  const complication = watch.tagline ? ` - ${watch.tagline}` : '';

  switch (contextType) {
    case 'hero':
      return `${name}${reference} - ${collection}${material}${calibre}${complication} | Aurelia Horology Geneva`;
    case 'modal':
      return `Detailed inspection view of ${name}${reference}${material}, ${collection} luxury Swiss watch`;
    case 'thumbnail':
      return `Thumbnail preview of ${name}${reference} (${collection})`;
    case 'gallery':
      return `High-resolution gallery angle of ${name}${reference}${material} by Aurelia Horology`;
    case 'card':
    default:
      return `${name}${reference} ${collection}${material} luxury watch by Aurelia Horology`;
  }
}

/**
 * Generates SEO-optimized alt tags for non-watch imagery (brand, craftsmanship, atelier, concierge).
 */
export function getStaticImageAlt(imageKey: 'craftsmanship' | 'bespoke' | 'heritage' | 'atelier' | 'concierge' | 'logo'): string {
  switch (imageKey) {
    case 'craftsmanship':
      return 'Master watchmaker hand-beveling Swiss movement bridges at Aurelia Atelier Geneva';
    case 'bespoke':
      return 'Bespoke watch customizer interface selecting precious metals, dials, and straps';
    case 'heritage':
      return 'Historical Aurelia watchmaking archives and antique Swiss horological tools since 1892';
    case 'atelier':
      return 'Aurelia Horology high-horology workshop and Geneva manufacturing facility';
    case 'concierge':
      return 'Private VIP watch concierge and armored worldwide delivery service';
    case 'logo':
      return 'Aurelia Horology Geneva 1892 official Maison crest and logotype';
    default:
      return 'Aurelia Horology luxury Swiss watchmaking atelier';
  }
}
