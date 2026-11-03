import { PageRoute, Watch } from '../types/watch';

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogType: string;
  ogImage: string;
  canonicalPath: string;
  isNoIndex?: boolean;
  structuredData: Record<string, any>;
}

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://aurelia-horology.ch';
const DEFAULT_IMAGE = '/assets/images/hero_luxury_chronograph_1791612522214.jpg';

export function getSEOMetadataForRoute(
  route: PageRoute,
  watches: Watch[]
): SEOMetadata {
  // 1. Product Detail Page
  if (route.startsWith('product-')) {
    const watchId = route.replace('product-', '');
    const watch = watches.find((w) => w.id === watchId) || watches[0];
    const watchPrice = watch ? watch.priceUSD : 35000;
    const watchName = watch ? watch.name : 'Master Timepiece';
    const watchRef = watch ? watch.reference : 'REF. AH-2026';
    const watchImg = watch ? watch.image : DEFAULT_IMAGE;
    const watchDesc = watch
      ? `${watch.name} (${watch.reference}): ${watch.tagline || watch.description.slice(0, 130)}`
      : 'Swiss haute horlogerie in-house mechanical calibre by Maison Aurelia.';

    return {
      title: `${watchName} | Aurelia Haute Horlogerie`,
      description: watchDesc.slice(0, 160),
      keywords: `${watchName}, ${watchRef}, luxury watch, Swiss mechanical calibre, Haute Horlogerie, in-house movement, Geneva watchmaking`,
      ogType: 'product',
      ogImage: watchImg,
      canonicalPath: `/#product-${watch?.id || ''}`,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: watchName,
        image: [watchImg.startsWith('http') ? watchImg : `${BASE_URL}${watchImg}`],
        description: watchDesc,
        sku: watchRef,
        mpn: watchRef,
        brand: {
          '@type': 'Brand',
          name: 'Maison Aurelia',
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'Maison Aurelia Manufacture d’Horlogerie',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Le Brassus',
            addressRegion: 'Vaud',
            postalCode: '1348',
            addressCountry: 'CH',
          },
        },
        offers: {
          '@type': 'Offer',
          url: `${BASE_URL}/#product-${watch?.id || ''}`,
          priceCurrency: 'USD',
          price: watchPrice,
          priceValidUntil: '2028-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: watch && watch.stockCount > 0 ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
          seller: {
            '@type': 'Organization',
            name: 'Maison Aurelia Atelier',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '38',
          bestRating: '5',
          worstRating: '1',
        },
      },
    };
  }

  // 2. Collections Page
  if (route === 'collections') {
    return {
      title: 'Timepiece Collections | Aurelia Haute Horlogerie',
      description: 'Explore the complete catalogue of Aurelia Haute Horlogerie: Column-Wheel Chronographs, Flying Tourbillons, and DeepSea Divers.',
      keywords: 'Aurelia collections, luxury chronographs, Swiss flying tourbillon, titanium diver watch, dress watches, Geneva seal',
      ogType: 'website',
      ogImage: DEFAULT_IMAGE,
      canonicalPath: '/#collections',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Aurelia Haute Horlogerie Timepiece Collections',
        description: 'Complete horological catalogue of manufacture chronometers and limited-edition calibres.',
        url: `${BASE_URL}/#collections`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: watches.slice(0, 8).map((w, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${BASE_URL}/#product-${w.id}`,
            name: w.name,
          })),
        },
      },
    };
  }

  // 3. Craftsmanship & Calibres Page
  if (route === 'craftsmanship') {
    return {
      title: 'Haute Calibres & Craftsmanship | Aurelia Atelier',
      description: 'Inside the Le Brassus atelier: master hand-chamfering, guilloché dials, column-wheel architectures, and COSC chronometer testing.',
      keywords: 'watch craftsmanship, Swiss movement decoration, anglage hand polishing, column wheel chronograph, COSC chronometer certification, Le Brassus',
      ogType: 'article',
      ogImage: '/assets/images/craftsmanship_watchmaker_1791612587562.jpg',
      canonicalPath: '/#craftsmanship',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'Aurelia Horological Craftsmanship & Manufacture Standards',
        description: 'Artisanal finishing techniques, hand-beveling, and internal angle mirror polishing in Le Brassus, Switzerland.',
        url: `${BASE_URL}/#craftsmanship`,
      },
    };
  }

  // 4. Bespoke Studio Page
  if (route === 'bespoke') {
    return {
      title: 'Bespoke Atelier Studio | Custom Luxury Timepieces',
      description: 'Commission a one-of-a-kind Swiss mechanical timepiece with bespoke precious metals, custom guilloché dials, and personalized rotor engraving.',
      keywords: 'bespoke watchmaking, custom luxury watch, personalized mechanical timepiece, 18k rose gold watch, tailored watch dial, custom engraving',
      ogType: 'website',
      ogImage: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
      canonicalPath: '/#bespoke',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Bespoke Watch Commission',
        provider: {
          '@type': 'JewelryStore',
          name: 'Maison Aurelia Bespoke Atelier',
        },
        description: 'Bespoke horological commission service including custom precious metal alloys, tailored dial palettes, and artisan engravings.',
        url: `${BASE_URL}/#bespoke`,
      },
    };
  }

  // 5. Manufacture Heritage Page
  if (route === 'heritage') {
    return {
      title: 'Manufacture Heritage Since 1892 | Maison Aurelia',
      description: 'Over 130 years of horological lineage, grand complications, and artisanal Swiss chronometry in the Vallée de Joux.',
      keywords: 'Aurelia history, Swiss horology heritage 1892, Vallee de Joux watchmakers, historical chronometers, Geneva seal history',
      ogType: 'article',
      ogImage: DEFAULT_IMAGE,
      canonicalPath: '/#heritage',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'Maison Aurelia Manufacture Heritage (Est. 1892)',
        description: 'Chronicle of artisanal Swiss watchmaking from founding in 1892 through modern grand complication patents.',
        url: `${BASE_URL}/#heritage`,
      },
    };
  }

  // 6. Concierge & Salon Page
  if (route === 'concierge') {
    return {
      title: 'Client Concierge & VIP Salon | Maison Aurelia',
      description: 'Connect with Aurelia horological advisors for private viewing appointments, collection acquisitions, and global armored delivery.',
      keywords: 'Aurelia concierge, private salon viewing, luxury watch appointment, armored delivery, Geneva boutique, Swiss horology advisory',
      ogType: 'website',
      ogImage: DEFAULT_IMAGE,
      canonicalPath: '/#concierge',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Maison Aurelia Private Concierge & Client Advisory',
        url: `${BASE_URL}/#concierge`,
        mainEntity: {
          '@type': 'JewelryStore',
          name: 'Maison Aurelia Atelier & Salon',
          telephone: '+41 22 819 92 00',
          email: 'concierge@aurelia-horology.ch',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Rue du Rhône 42',
            addressLocality: 'Geneva',
            postalCode: '1204',
            addressCountry: 'CH',
          },
        },
      },
    };
  }

  // 7. Admin Console (Noindex for SEO hygiene)
  if (route === 'admin') {
    return {
      title: 'Store Management Console | Aurelia Admin Portal',
      description: 'Internal administration portal for timepiece inventory, client consignment orders, VIP concessions, and atelier telemetry.',
      keywords: 'admin, inventory management',
      ogType: 'website',
      ogImage: DEFAULT_IMAGE,
      canonicalPath: '/#admin',
      isNoIndex: true,
      structuredData: {},
    };
  }

  // 8. Legal & Policy Pages
  if (route === 'privacy') {
    return {
      title: 'Privacy Policy | Maison Aurelia Haute Horlogerie',
      description: 'Client confidentiality, GDPR compliance, and encrypted security protocols for Maison Aurelia patrons and transactions.',
      keywords: 'privacy policy, patron confidentiality, client security, GDPR watch boutique',
      ogType: 'website',
      ogImage: DEFAULT_IMAGE,
      canonicalPath: '/#privacy',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Maison Aurelia Client Privacy Policy',
        url: `${BASE_URL}/#privacy`,
      },
    };
  }

  if (route === 'terms') {
    return {
      title: 'Terms of Service | Maison Aurelia Swiss Guarantee',
      description: 'Official terms of acquisition, 5-year international manufacture warranty, and armored transit delivery protocols.',
      keywords: 'terms of service, international warranty terms, delivery insurance, Swiss guarantee',
      ogType: 'website',
      ogImage: DEFAULT_IMAGE,
      canonicalPath: '/#terms',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Maison Aurelia Terms of Service & Warranty Guarantee',
        url: `${BASE_URL}/#terms`,
      },
    };
  }

  if (route === 'provenance') {
    return {
      title: 'Digital Provenance Registry | Aurelia Ledger',
      description: 'Cryptographic provenance passports and ownership registry for authentic Aurelia haute horlogerie timepieces.',
      keywords: 'digital provenance, watch passport, cryptographic ownership, Geneva seal verification',
      ogType: 'website',
      ogImage: DEFAULT_IMAGE,
      canonicalPath: '/#provenance',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Aurelia Cryptographic Provenance Registry',
        url: `${BASE_URL}/#provenance`,
      },
    };
  }

  // 9. Horological Journal Articles
  if (route.startsWith('article-')) {
    return {
      title: 'Horological Journal & Notes | Maison Aurelia',
      description: 'Curated essays, technical chronometry deep-dives, and auction insights from master horologists at Maison Aurelia.',
      keywords: 'horological journal, watchmaking history, chronometer escapement, Swiss watch auction, mechanical calibres',
      ogType: 'article',
      ogImage: DEFAULT_IMAGE,
      canonicalPath: `/#${route}`,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Aurelia Horological Insights & Architectural Notes',
        image: [`${BASE_URL}${DEFAULT_IMAGE}`],
        author: {
          '@type': 'Organization',
          name: 'Maison Aurelia Atelier',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Maison Aurelia',
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/assets/aistudio/logo.png`,
          },
        },
      },
    };
  }

  // Default: Homepage (Rich Multi-Schema with Organization, WebSite & FAQPage)
  return {
    title: 'Aurelia Horology | Haute Horlogerie & Luxury Timepieces',
    description: 'Explore handcrafted Swiss luxury timepieces, master mechanical calibres, and bespoke commissions crafted in Le Brassus by Maison Aurelia.',
    keywords: 'Haute Horlogerie, luxury watches, Swiss mechanical timepieces, in-house calibres, chronograph, tourbillon, Geneva atelier, Le Brassus 1892',
    ogType: 'website',
    ogImage: DEFAULT_IMAGE,
    canonicalPath: '/#home',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'JewelryStore',
          '@id': `${BASE_URL}/#organization`,
          name: 'Maison Aurelia Haute Horlogerie',
          url: BASE_URL,
          logo: `${BASE_URL}/assets/aistudio/logo.png`,
          image: `${BASE_URL}${DEFAULT_IMAGE}`,
          description: 'Independent Swiss manufacture creating in-house mechanical calibres, chronographs, and grand complications since 1892.',
          priceRange: '$$$$',
          telephone: '+41 22 819 92 00',
          email: 'concierge@aurelia-horology.ch',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Rue du Rhône 42',
            addressLocality: 'Geneva',
            postalCode: '1204',
            addressCountry: 'CH',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 46.2044,
            longitude: 6.1432,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '10:00',
              closes: '18:30',
            },
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          url: BASE_URL,
          name: 'Aurelia Haute Horlogerie',
          publisher: {
            '@id': `${BASE_URL}/#organization`,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${BASE_URL}/#collections?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${BASE_URL}/#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How frequently does an Aurelia mechanical calibre require servicing?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We recommend a complete manufacture overhaul every 3 to 5 years at an authorized Swiss service center. In our Le Brassus atelier, master horologists completely dismantle each calibre, ultrasonically cleanse all components, renew worn escapement components with genuine manufacture parts, apply proprietary synthetic micro-lubricants, and recalibrate precision to COSC chronometer tolerances (-4/+6 seconds per day).',
              },
            },
            {
              '@type': 'Question',
              name: 'What protections are covered under the 5-Year International Warranty?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Every Aurelia timepiece carries an irrevocable 5-year international master warranty against mechanical flaws and chronometric drift. All timepieces are cryptographically registered in the official Geneva Seal archive and include complimentary demagnetization, rate regulation, gasket refresh, and insured transportation to and from our Swiss atelier.',
              },
            },
            {
              '@type': 'Question',
              name: 'How does international armored courier shipping and transit insurance operate?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'All outbound timepieces from our Le Brassus vault travel exclusively via dedicated high-security armored logistics (Ferrari Group / Malca-Amit). Every consignment is 100% insured underwritten by Lloyd’s of London for its full replacement value, featuring Delivered Duty Paid (DDP) customs pre-clearance and biometric photo ID signature handoff.',
              },
            },
          ],
        },
      ],
    },
  };
}

export function applySEOMetadata(metadata: SEOMetadata): void {
  if (typeof document === 'undefined') return;

  // 1. Title
  document.title = metadata.title;

  // 2. Meta Helper
  const setMeta = (selector: string, attr: string, value: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const isProp = selector.startsWith('meta[property=');
      const key = isProp ? 'property' : 'name';
      const nameVal = selector.replace(/meta\[(property|name)="(.*?)"\]/, '$2');
      el.setAttribute(key, nameVal);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  // 3. Core SEO Meta tags
  setMeta('meta[name="description"]', 'content', metadata.description);
  setMeta('meta[name="keywords"]', 'content', metadata.keywords);
  setMeta('meta[name="robots"]', 'content', metadata.isNoIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large');

  // 4. OpenGraph tags
  setMeta('meta[property="og:title"]', 'content', metadata.title);
  setMeta('meta[property="og:description"]', 'content', metadata.description);
  setMeta('meta[property="og:type"]', 'content', metadata.ogType);
  const fullImageUrl = metadata.ogImage.startsWith('http') ? metadata.ogImage : `${window.location.origin}${metadata.ogImage}`;
  setMeta('meta[property="og:image"]', 'content', fullImageUrl);
  setMeta('meta[property="og:url"]', 'content', `${window.location.origin}${metadata.canonicalPath}`);
  setMeta('meta[property="og:site_name"]', 'content', 'Maison Aurelia Haute Horlogerie');

  // 5. Twitter Card tags
  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', 'content', metadata.title);
  setMeta('meta[name="twitter:description"]', 'content', metadata.description);
  setMeta('meta[name="twitter:image"]', 'content', fullImageUrl);

  // 6. Canonical URL
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', `${window.location.origin}${metadata.canonicalPath}`);

  // 7. Schema.org JSON-LD structured data injection
  let jsonLdEl = document.getElementById('aurelia-structured-data');
  if (!jsonLdEl) {
    jsonLdEl = document.createElement('script');
    jsonLdEl.setAttribute('type', 'application/ld+json');
    jsonLdEl.setAttribute('id', 'aurelia-structured-data');
    document.head.appendChild(jsonLdEl);
  }
  jsonLdEl.textContent = JSON.stringify(metadata.structuredData);
}
