import { PageRoute, Watch } from '../types/watch';
import { getSEOMetadataForRoute } from './seo';
import { ARTICLES_LIST } from '../data/articles';

export interface SEODiagnosticItem {
  route: PageRoute;
  urlPath: string;
  name: string;
  pageType: 'Core Page' | 'Product' | 'Article' | 'Legal' | 'Admin';
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  keywords: string;
  canonicalPath: string;
  ogType: string;
  isNoIndex?: boolean;
  hasStructuredData: boolean;
  structuredDataType?: string;
  issues: string[];
  warnings: string[];
  status: 'healthy' | 'warning' | 'critical';
  duplicateWithRoutes: string[];
  duplicateTitleWithRoutes: string[];
}

export interface SEODiagnosticSummary {
  timestamp: string;
  totalRoutes: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  duplicateDescriptionsCount: number;
  duplicateTitlesCount: number;
  missingDescriptionsCount: number;
  missingTitlesCount: number;
  overlengthDescriptionsCount: number;
  healthScore: number;
  items: SEODiagnosticItem[];
}

interface StaticRouteConfig {
  route: PageRoute;
  name: string;
  pageType: 'Core Page' | 'Legal' | 'Admin';
}

const STATIC_ROUTES: StaticRouteConfig[] = [
  { route: 'home', name: 'Maison Homepage', pageType: 'Core Page' },
  { route: 'collections', name: 'Timepiece Collections', pageType: 'Core Page' },
  { route: 'craftsmanship', name: 'Haute Craftsmanship & Calibres', pageType: 'Core Page' },
  { route: 'bespoke', name: 'Bespoke Studio Customizer', pageType: 'Core Page' },
  { route: 'heritage', name: 'Manufacture Heritage (1892)', pageType: 'Core Page' },
  { route: 'concierge', name: 'VIP Concierge & Client Salon', pageType: 'Core Page' },
  { route: 'provenance', name: 'Digital Provenance Registry', pageType: 'Core Page' },
  { route: 'privacy', name: 'Client Privacy Policy', pageType: 'Legal' },
  { route: 'terms', name: 'Terms of Service & Warranty', pageType: 'Legal' },
  { route: 'admin', name: 'Store Management Console', pageType: 'Admin' },
];

/**
 * Executes a comprehensive SEO metadata diagnostic scan across all routes in the application.
 * Analyzes meta descriptions, titles, character limits, duplicates, missing metadata, and schema presence.
 */
export function runSEODiagnosticScan(
  watches: Watch[],
  simulationOverrides?: Record<string, { description?: string; title?: string }>
): SEODiagnosticSummary {
  const rawItems: Array<{
    route: PageRoute;
    urlPath: string;
    name: string;
    pageType: 'Core Page' | 'Product' | 'Article' | 'Legal' | 'Admin';
    title: string;
    titleLength: number;
    description: string;
    descriptionLength: number;
    keywords: string;
    canonicalPath: string;
    ogType: string;
    isNoIndex?: boolean;
    hasStructuredData: boolean;
    structuredDataType?: string;
  }> = [];

  // 1. Scan Static / Core Routes
  STATIC_ROUTES.forEach(({ route, name, pageType }) => {
    const meta = getSEOMetadataForRoute(route, watches);
    const override = simulationOverrides?.[route];
    const finalDesc = override?.description !== undefined ? override.description : meta.description;
    const finalTitle = override?.title !== undefined ? override.title : meta.title;

    rawItems.push({
      route,
      urlPath: `/#${route}`,
      name,
      pageType,
      title: finalTitle,
      titleLength: finalTitle.length,
      description: finalDesc,
      descriptionLength: finalDesc.length,
      keywords: meta.keywords,
      canonicalPath: meta.canonicalPath,
      ogType: meta.ogType,
      isNoIndex: meta.isNoIndex,
      hasStructuredData: Object.keys(meta.structuredData || {}).length > 0,
      structuredDataType: meta.structuredData?.['@type'] || (meta.structuredData?.['@graph'] ? 'Graph / Multi' : undefined),
    });
  });

  // 2. Scan Dynamic Watch Product Routes
  watches.forEach((watch) => {
    const route: PageRoute = `product-${watch.id}`;
    const meta = getSEOMetadataForRoute(route, watches);
    const override = simulationOverrides?.[route];
    const finalDesc = override?.description !== undefined ? override.description : meta.description;
    const finalTitle = override?.title !== undefined ? override.title : meta.title;

    rawItems.push({
      route,
      urlPath: `/#product-${watch.id}`,
      name: `${watch.name} (${watch.reference})`,
      pageType: 'Product',
      title: finalTitle,
      titleLength: finalTitle.length,
      description: finalDesc,
      descriptionLength: finalDesc.length,
      keywords: meta.keywords,
      canonicalPath: meta.canonicalPath,
      ogType: meta.ogType,
      isNoIndex: meta.isNoIndex,
      hasStructuredData: Object.keys(meta.structuredData || {}).length > 0,
      structuredDataType: meta.structuredData?.['@type'],
    });
  });

  // 3. Scan Dynamic Journal Article Routes
  ARTICLES_LIST.forEach((article) => {
    const route: PageRoute = `article-${article.id}`;
    const meta = getSEOMetadataForRoute(route, watches);
    const override = simulationOverrides?.[route];
    const finalDesc = override?.description !== undefined ? override.description : meta.description;
    const finalTitle = override?.title !== undefined ? override.title : meta.title;

    rawItems.push({
      route,
      urlPath: `/#article-${article.id}`,
      name: `Journal: ${article.title}`,
      pageType: 'Article',
      title: finalTitle,
      titleLength: finalTitle.length,
      description: finalDesc,
      descriptionLength: finalDesc.length,
      keywords: meta.keywords,
      canonicalPath: meta.canonicalPath,
      ogType: meta.ogType,
      isNoIndex: meta.isNoIndex,
      hasStructuredData: Object.keys(meta.structuredData || {}).length > 0,
      structuredDataType: meta.structuredData?.['@type'],
    });
  });

  // 4. Map duplicates for Descriptions and Titles
  const descriptionOccurrences: Record<string, string[]> = {};
  const titleOccurrences: Record<string, string[]> = {};

  rawItems.forEach((item) => {
    const normalizedDesc = item.description.trim().toLowerCase();
    if (normalizedDesc) {
      if (!descriptionOccurrences[normalizedDesc]) {
        descriptionOccurrences[normalizedDesc] = [];
      }
      descriptionOccurrences[normalizedDesc].push(item.route);
    }

    const normalizedTitle = item.title.trim().toLowerCase();
    if (normalizedTitle) {
      if (!titleOccurrences[normalizedTitle]) {
        titleOccurrences[normalizedTitle] = [];
      }
      titleOccurrences[normalizedTitle].push(item.route);
    }
  });

  // 5. Evaluate individual item health and flags
  let duplicateDescriptionsCount = 0;
  let duplicateTitlesCount = 0;
  let missingDescriptionsCount = 0;
  let missingTitlesCount = 0;
  let overlengthDescriptionsCount = 0;
  let healthyCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  const items: SEODiagnosticItem[] = rawItems.map((item) => {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Check missing metadata (Critical)
    if (!item.description || item.description.trim().length === 0) {
      issues.push('Missing Meta Description: Page has no description tag configured');
      missingDescriptionsCount++;
    }

    if (!item.title || item.title.trim().length === 0) {
      issues.push('Missing Title: Page has no document title configured');
      missingTitlesCount++;
    }

    // Check Duplicate Meta Descriptions
    const normalizedDesc = item.description.trim().toLowerCase();
    const duplicateWithRoutes = normalizedDesc && descriptionOccurrences[normalizedDesc]?.length > 1
      ? descriptionOccurrences[normalizedDesc].filter((r) => r !== item.route)
      : [];

    if (duplicateWithRoutes.length > 0) {
      warnings.push(`Duplicate Meta Description: Shared identically with ${duplicateWithRoutes.join(', ')}`);
      duplicateDescriptionsCount++;
    }

    // Check Duplicate Titles
    const normalizedTitle = item.title.trim().toLowerCase();
    const duplicateTitleWithRoutes = normalizedTitle && titleOccurrences[normalizedTitle]?.length > 1
      ? titleOccurrences[normalizedTitle].filter((r) => r !== item.route)
      : [];

    if (duplicateTitleWithRoutes.length > 0) {
      warnings.push(`Duplicate Title: Title is identical to ${duplicateTitleWithRoutes.join(', ')}`);
      duplicateTitlesCount++;
    }

    // Check Description Length Rules
    if (item.description.length > 160) {
      warnings.push(`Overlength Description (${item.description.length} chars): Exceeds recommended 160 character snippet limit`);
      overlengthDescriptionsCount++;
    } else if (item.description.length > 0 && item.description.length < 50) {
      warnings.push(`Underlength Description (${item.description.length} chars): Too short for optimal search visibility (recommend 50-160 chars)`);
    }

    // Check Title Length Rules
    if (item.title.length > 60) {
      warnings.push(`Title exceeds 60 characters (${item.title.length} chars): May be truncated in Google search results`);
    } else if (item.title.length > 0 && item.title.length < 20) {
      warnings.push(`Short Title (${item.title.length} chars): Recommend adding descriptive brand suffix`);
    }

    // Check Keywords
    if (!item.keywords || item.keywords.trim().length === 0) {
      warnings.push('Missing Meta Keywords: No target keywords specified for search indexers');
    }

    // Determine status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (issues.length > 0) {
      status = 'critical';
      criticalCount++;
    } else if (warnings.length > 0) {
      status = 'warning';
      warningCount++;
    } else {
      status = 'healthy';
      healthyCount++;
    }

    return {
      ...item,
      issues,
      warnings,
      status,
      duplicateWithRoutes,
      duplicateTitleWithRoutes,
    };
  });

  // Calculate Health Score (100 base, -10 per critical, -3 per warning, clamped 0-100)
  const total = items.length;
  const penalty = (criticalCount * 12) + (warningCount * 3.5);
  const healthScore = Math.max(0, Math.min(100, Math.round(100 - (penalty / Math.max(1, total)) * 10)));

  const now = new Date();
  const timestamp = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ' · ' + now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return {
    timestamp,
    totalRoutes: total,
    healthyCount,
    warningCount,
    criticalCount,
    duplicateDescriptionsCount,
    duplicateTitlesCount,
    missingDescriptionsCount,
    missingTitlesCount,
    overlengthDescriptionsCount,
    healthScore,
    items,
  };
}

/**
 * Generates a clean CSV string of the diagnostic audit for downloading.
 */
export function generateSEODiagnosticCSV(summary: SEODiagnosticSummary): string {
  const headers = [
    'Route',
    'Name',
    'Page Type',
    'Status',
    'Title',
    'Title Chars',
    'Description',
    'Description Chars',
    'Keywords',
    'Issues',
    'Warnings',
    'Duplicate Routes',
  ];

  const escapeCSV = (val: any) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = summary.items.map((it) => [
    escapeCSV(it.route),
    escapeCSV(it.name),
    escapeCSV(it.pageType),
    escapeCSV(it.status.toUpperCase()),
    escapeCSV(it.title),
    it.titleLength,
    escapeCSV(it.description),
    it.descriptionLength,
    escapeCSV(it.keywords),
    escapeCSV(it.issues.join(' | ')),
    escapeCSV(it.warnings.join(' | ')),
    escapeCSV(it.duplicateWithRoutes.join(', ')),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
