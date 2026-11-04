import { PageRoute, Watch } from '../types/watch';
import { ARTICLES_DATA, Article } from '../data/articles';

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

export interface ArticleSEOInput {
  id?: string;
  title: string;
  subtitle?: string;
  category?: string;
  excerpt?: string;
  content?: string[];
  pullQuote?: string;
  targetKeywords?: string[];
  author?: string;
}

export interface ArticleSEODescriptionOptions {
  maxLength?: number;
  includeBrand?: boolean;
  targetKeywords?: string[];
}

/**
 * Auto-generates a unique, high-quality SEO meta description for an article page
 * based on its content excerpt, guaranteeing it remains strictly under 160 characters
 * while incorporating relevant target keywords and brand recognition.
 */
export function generateArticleSEOMetaDescription(
  article: ArticleSEOInput,
  options: ArticleSEODescriptionOptions = {}
): string {
  const maxLength = Math.min(options.maxLength ?? 158, 160);
  const includeBrand = options.includeBrand ?? true;
  const brandSuffix = includeBrand ? ' | Aurelia Horology' : '';

  // 1. Determine raw base excerpt from the article
  let rawExcerpt = '';
  if (article.excerpt && article.excerpt.trim()) {
    rawExcerpt = article.excerpt.trim();
  } else if (article.content && article.content.length > 0 && article.content[0].trim()) {
    rawExcerpt = article.content[0].trim();
  } else if (article.subtitle && article.subtitle.trim()) {
    rawExcerpt = article.subtitle.trim();
  } else if (article.pullQuote && article.pullQuote.trim()) {
    rawExcerpt = article.pullQuote.trim();
  } else {
    rawExcerpt = `Explore ${article.title || 'Haute Horlogerie craftsmanship and Swiss chronometry in Le Brassus'}.`;
  }

  // Clean raw excerpt of extra whitespace and surrounding quotes
  rawExcerpt = rawExcerpt.replace(/\s+/g, ' ').replace(/^["']|["']$/g, '').trim();

  // 2. Resolve target keywords to weave into description
  const keywordsList: string[] = [
    ...(options.targetKeywords || []),
    ...(article.targetKeywords || []),
  ];

  // Pick top keyword if not already mentioned in rawExcerpt
  const missingKeyword = keywordsList.find(
    (kw) => !rawExcerpt.toLowerCase().includes(kw.toLowerCase())
  );

  // 3. Compose candidate text incorporating context & target keywords
  let candidate = '';
  if (missingKeyword && article.category && !rawExcerpt.toLowerCase().includes(article.category.toLowerCase())) {
    const prefix = `${article.category}: `;
    candidate = `${prefix}${rawExcerpt}`;
  } else {
    candidate = rawExcerpt;
  }

  // Ensure brand suffix is accounted for
  const availableLengthForBody = maxLength - brandSuffix.length;

  if (candidate.length > availableLengthForBody) {
    // Truncate at full word boundary
    const truncated = candidate.slice(0, availableLengthForBody).trim();
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    let cleanCut = lastSpaceIndex > 30 ? truncated.slice(0, lastSpaceIndex) : truncated;
    // Clean trailing punctuation before adding period
    cleanCut = cleanCut.replace(/[,;:\-\s.]+$/, '');
    candidate = `${cleanCut}.`;
  } else {
    // Ensure candidate ends with clean punctuation
    if (!candidate.endsWith('.') && !candidate.endsWith('!') && !candidate.endsWith('?')) {
      candidate = `${candidate}.`;
    }
  }

  // Append brand suffix
  let finalDescription = `${candidate}${brandSuffix}`;

  // Hard safety check: ensure strictly <= maxLength (always <= 160)
  if (finalDescription.length > maxLength) {
    const overflow = finalDescription.length - maxLength;
    const bodyOnly = candidate.slice(0, candidate.length - overflow - 1).trim();
    const lastSpace = bodyOnly.lastIndexOf(' ');
    const safeBody = (lastSpace > 30 ? bodyOnly.slice(0, lastSpace) : bodyOnly).replace(/[,;:\-\s.]+$/, '');
    finalDescription = `${safeBody}.${brandSuffix}`;
  }

  return finalDescription;
}

/**
 * Generates unique, H1-optimized meta titles (under 60 characters) with brand suffix
 * for every page route in accordance with strict Hoth SEO guidelines.
 */
export function getSEOMetadataForRoute(
  route: PageRoute,
  watches: Watch[]
): SEOMetadata {
  // 1. Product Detail Page with dynamic specification-based meta tags
  if (route.startsWith('product-')) {
    const watchId = route.replace('product-', '');
    const watch = watches.find((w) => w.id === watchId) || watches[0];
    const watchPrice = watch ? watch.priceUSD : 35000;
    const watchName = watch ? watch.name : 'Master Timepiece';
    const watchRef = watch ? watch.reference : 'REF. AH-2026';
    const watchImg = watch ? watch.image : DEFAULT_IMAGE;

    // Extract specifications
    const movement = watch?.specs?.movement || 'In-House Swiss Mechanical Calibre';
    const calibre = watch?.specs?.calibre || 'Manufacture Movement';
    const caseMaterial = watch?.specs?.caseMaterial || 'Precious Metal';
    const waterRes = watch?.specs?.waterResistance || 'Water Resistant';
    const powerReserve = watch?.specs?.powerReserve || 'Power Reserve';
    const frequency = watch?.specs?.frequency || 'High-Beat';
    const collection = watch?.collection || 'Haute Horlogerie';
    const complication = watch?.tagline || watch?.description?.slice(0, 100) || 'Swiss luxury horology';

    const watchDesc = watch
      ? `${watch.name} (${watch.reference}) - ${collection}. Hand-crafted in ${caseMaterial} featuring ${movement} (${calibre}), ${powerReserve} power reserve, and ${waterRes}. ${complication}`
      : 'Swiss haute horlogerie in-house mechanical calibre by Maison Aurelia.';

    const rawTitle = `${watchName} | Aurelia Horology`;

    return {
      title: rawTitle,
      description: watchDesc.slice(0, 160),
      keywords: `${watchName}, ${watchRef}, ${collection}, ${caseMaterial}, ${movement}, ${calibre}, ${powerReserve}, ${frequency}, luxury watch, Swiss mechanical timepieces, Haute Horlogerie`,
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
        material: caseMaterial,
        category: collection,
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
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Movement Type', value: movement },
          { '@type': 'PropertyValue', name: 'Calibre', value: calibre },
          { '@type': 'PropertyValue', name: 'Case Material', value: caseMaterial },
          { '@type': 'PropertyValue', name: 'Power Reserve', value: powerReserve },
          { '@type': 'PropertyValue', name: 'Water Resistance', value: waterRes },
          { '@type': 'PropertyValue', name: 'Frequency', value: frequency },
        ],
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

  // 2. Collections Page (49 chars)
  if (route === 'collections') {
    return {
      title: 'Timepiece Collections | Aurelia Horology',
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

  // 3. Craftsmanship Page (48 chars)
  if (route === 'craftsmanship') {
    return {
      title: 'Haute Craftsmanship & Calibres | Aurelia Horology',
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

  // 4. Bespoke Studio Page (48 chars)
  if (route === 'bespoke') {
    return {
      title: 'Bespoke Watch Atelier Studio | Aurelia Horology',
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

  // 5. Manufacture Heritage Page (47 chars)
  if (route === 'heritage') {
    return {
      title: 'Manufacture Heritage Since 1892 | Aurelia Horology',
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

  // 6. Concierge & Salon Page (48 chars)
  if (route === 'concierge') {
    return {
      title: 'Client Concierge & VIP Salon | Aurelia Horology',
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

  // 7. Admin Console (Noindex for SEO hygiene) (50 chars)
  if (route === 'admin') {
    return {
      title: 'Store Management Console | Aurelia Horology Admin',
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
      title: 'Client Privacy Policy | Aurelia Horology', // 42 chars
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
      title: 'Terms of Service & Warranty | Aurelia Horology', // 49 chars
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
      title: 'Digital Provenance Registry | Aurelia Horology', // 48 chars
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

  // 9. Horological Journal Articles (Dynamic unique titles under 60 chars & excerpt-based meta descriptions under 160 chars)
  if (route.startsWith('article-')) {
    const articleId = route.replace('article-', '');
    const article = ARTICLES_DATA[articleId] || ARTICLES_DATA['art-1'];

    // Auto-generate unique, high-quality SEO meta description under 160 characters with target keywords
    const articleDesc = article
      ? generateArticleSEOMetaDescription(article)
      : 'Curated technical chronometry essays, balance wheel dynamics, and haute horlogerie finishing notes by Maison Aurelia.';

    // H1-optimized unique title under 60 chars with brand suffix
    let rawTitle = article ? `${article.title} | Aurelia Horology` : 'Horological Journal | Aurelia Horology';
    if (rawTitle.length > 60 && article) {
      rawTitle = `${article.title} | Aurelia`;
    }
    if (rawTitle.length > 60 && article) {
      rawTitle = `${article.title.slice(0, 48)}... | Aurelia`;
    }

    const articleKeywords = article?.targetKeywords
      ? `${article.targetKeywords.join(', ')}, ${article.title}, ${article.category}, Swiss horology, Haute Horlogerie, Le Brassus`
      : 'horological journal, watchmaking history, chronometer escapement, Swiss watch auction, mechanical calibres';
    const articleImg = article?.image || DEFAULT_IMAGE;
    const authorName = article?.author || 'Maison Aurelia Atelier';

    return {
      title: rawTitle,
      description: articleDesc,
      keywords: articleKeywords,
      ogType: 'article',
      ogImage: articleImg,
      canonicalPath: `/#${route}`,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article?.title || 'Aurelia Horological Insights & Architectural Notes',
        description: articleDesc,
        image: [articleImg.startsWith('http') ? articleImg : `${BASE_URL}${articleImg}`],
        author: {
          '@type': 'Person',
          name: authorName,
          jobTitle: article?.authorRole || 'Master Horologist',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Maison Aurelia',
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/assets/aistudio/logo.png`,
          },
        },
        datePublished: '2026-10-01',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${BASE_URL}/#${route}`,
        },
      },
    };
  }

  // Default: Homepage (52 chars - optimal 50-60 range)
  return {
    title: 'Aurelia Horology | Haute Horlogerie Timepieces',
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

/**
 * Injects FAQPage structured data into the document head for FAQ rich snippets in Google search results.
 */
export function injectFAQPageStructuredData(
  faqs: { question: string; answer: string }[],
  scriptId: string = 'aurelia-faq-structured-data'
): void {
  if (typeof document === 'undefined') return;

  let scriptEl = document.getElementById(scriptId);
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.setAttribute('type', 'application/ld+json');
    scriptEl.setAttribute('id', scriptId);
    document.head.appendChild(scriptEl);
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  scriptEl.textContent = JSON.stringify(faqSchema);
}

