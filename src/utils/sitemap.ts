import { Watch } from '../types/watch';
import { WATCHES } from '../data/watches';
import { ARTICLES_LIST } from '../data/articles';

export interface SitemapURLItem {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Retrieves the current dynamic list of watches from localStorage if available,
 * falling back to the default static WATCHES catalog.
 */
export function getCatalogWatchesForSitemap(): Watch[] {
  if (typeof window === 'undefined') return WATCHES;
  try {
    const raw = localStorage.getItem('aurelia_watches_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading watches for sitemap from localStorage:', e);
  }
  return WATCHES;
}

/**
 * Generates an automated XML sitemap string pulling static routes and dynamic watch inventory.
 */
export function generateXMLSitemap(baseUrl: string = 'https://ais-pre-dmw73dcvs32gezgasszetf-22337179705.asia-southeast1.run.app'): string {
  const today = new Date().toISOString().split('T')[0];
  const watches = getCatalogWatchesForSitemap();

  const staticRoutes: SitemapURLItem[] = [
    { loc: `${baseUrl}/#home`, lastmod: today, changefreq: 'daily', priority: 1.0 },
    { loc: `${baseUrl}/#collections`, lastmod: today, changefreq: 'daily', priority: 0.9 },
    { loc: `${baseUrl}/#craftsmanship`, lastmod: today, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/#bespoke`, lastmod: today, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/#heritage`, lastmod: today, changefreq: 'monthly', priority: 0.8 },
    { loc: `${baseUrl}/#concierge`, lastmod: today, changefreq: 'weekly', priority: 0.7 },
    { loc: `${baseUrl}/#provenance`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/#admin`, lastmod: today, changefreq: 'weekly', priority: 0.4 },
    { loc: `${baseUrl}/#privacy`, lastmod: today, changefreq: 'yearly', priority: 0.5 },
    { loc: `${baseUrl}/#terms`, lastmod: today, changefreq: 'yearly', priority: 0.5 },
  ];

  const dynamicWatchRoutes: SitemapURLItem[] = watches.map((watch) => ({
    loc: `${baseUrl}/#product-${watch.id}`,
    lastmod: today,
    changefreq: 'daily',
    priority: watch.isFeatured ? 0.9 : 0.8,
  }));

  const dynamicArticleRoutes: SitemapURLItem[] = ARTICLES_LIST.map((art) => ({
    loc: `${baseUrl}/#article-${art.id}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: 0.7,
  }));

  const allUrls = [...staticRoutes, ...dynamicWatchRoutes, ...dynamicArticleRoutes];

  const xmlEntries = allUrls
    .map(
      (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlEntries}
</urlset>`;
}

/**
 * Automatically triggers a download or updates the sitemap representation in the DOM/console.
 */
export function exportSitemapXMLFile(): void {
  const xmlContent = generateXMLSitemap();
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
