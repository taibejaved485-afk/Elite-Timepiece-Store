import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Eye,
  Filter,
  Sparkles,
  ShieldCheck,
  FileText,
  Package,
  BookOpen,
  SlidersHorizontal,
  Info,
  Check,
  Zap,
} from 'lucide-react';
import { Watch, PageRoute } from '../types/watch';
import {
  SEODiagnosticItem,
  SEODiagnosticSummary,
  runSEODiagnosticScan,
  generateSEODiagnosticCSV,
} from '../utils/seoDiagnostics';

interface AdminSEODiagnosticsProps {
  watches: Watch[];
  onNavigate: (route: PageRoute) => void;
  showToast: (msg: string) => void;
}

export const AdminSEODiagnostics: React.FC<AdminSEODiagnosticsProps> = ({
  watches,
  onNavigate,
  showToast,
}) => {
  const [simulationActive, setSimulationActive] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'issues' | 'duplicates' | 'healthy'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Core Page' | 'Product' | 'Article' | 'Legal' | 'Admin'>('all');
  const [selectedItem, setSelectedItem] = useState<SEODiagnosticItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [copiedRoute, setCopiedRoute] = useState<string | null>(null);

  // Diagnostic Simulation overrides to demonstrate duplicate & missing detection
  const simulationOverrides = useMemo(() => {
    if (!simulationActive) return undefined;
    return {
      'craftsmanship': {
        description: 'Explore the complete catalogue of Aurelia Haute Horlogerie: Column-Wheel Chronographs, Flying Tourbillons, and DeepSea Divers.',
      },
      'heritage': {
        description: 'Explore the complete catalogue of Aurelia Haute Horlogerie: Column-Wheel Chronographs, Flying Tourbillons, and DeepSea Divers.',
      },
      'terms': {
        description: '', // simulated missing description
      },
    };
  }, [simulationActive]);

  // Execute SEO Diagnostic Scan
  const summary: SEODiagnosticSummary = useMemo(() => {
    return runSEODiagnosticScan(watches, simulationOverrides);
  }, [watches, simulationOverrides, scanKey]);

  // Trigger manual fresh scan
  const handleRefreshScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanKey((prev) => prev + 1);
      setIsScanning(false);
      showToast('Completed real-time SEO metadata diagnostic scan across all routes.');
    }, 350);
  };

  // Export CSV Audit Report
  const handleExportCSV = () => {
    const csvContent = generateSEODiagnosticCSV(summary);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aurelia-seo-diagnostics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded full SEO diagnostic audit report as CSV.');
  };

  // Export JSON Audit Report
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(summary, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aurelia-seo-diagnostics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded complete SEO diagnostic JSON schema.');
  };

  const handleCopyDescription = (text: string, route: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedRoute(route);
    showToast('Copied meta description to clipboard.');
    setTimeout(() => setCopiedRoute(null), 2500);
  };

  // Filter items based on user criteria
  const filteredItems = useMemo(() => {
    return summary.items.filter((item) => {
      // Status filter
      if (statusFilter === 'issues') {
        if (item.status === 'healthy') return false;
      } else if (statusFilter === 'duplicates') {
        if (item.duplicateWithRoutes.length === 0) return false;
      } else if (statusFilter === 'healthy') {
        if (item.status !== 'healthy') return false;
      }

      // Type filter
      if (typeFilter !== 'all' && item.pageType !== typeFilter) {
        return false;
      }

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesRoute = item.route.toLowerCase().includes(q);
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesKeywords = item.keywords.toLowerCase().includes(q);
        const matchesIssues = [...item.issues, ...item.warnings].some((msg) =>
          msg.toLowerCase().includes(q)
        );
        return matchesRoute || matchesName || matchesTitle || matchesDesc || matchesKeywords || matchesIssues;
      }

      return true;
    });
  }, [summary.items, statusFilter, typeFilter, searchQuery]);

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* 1. Header Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#9A7B38]/10 text-[#9A7B38]">
              <ShieldCheck className="w-4 h-4 text-[#9A7B38]" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Diagnostic & Audit Engine
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Inspector
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-sans">
            SEO Metadata Quality & Diagnostic Tool
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Automated crawler analyzing all meta descriptions, title lengths, and target keywords across core pages, timepiece catalog records, and journal monographs. Detects duplicate metadata and snippet truncation risks.
          </p>
          <div className="text-[10px] text-slate-400 font-mono pt-0.5">
            Last Audit Scan: <span className="font-semibold text-slate-700">{summary.timestamp}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            type="button"
            onClick={handleRefreshScan}
            disabled={isScanning}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-60"
            title="Re-run SEO diagnostic scan"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Re-Run Diagnostic Scan'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            title="Export CSV audit ledger"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            title="Export JSON audit report"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>JSON</span>
          </button>

          {/* Duplicate Simulator Toggle */}
          <button
            type="button"
            onClick={() => {
              setSimulationActive((prev) => !prev);
              showToast(
                !simulationActive
                  ? 'Simulating duplicate & missing metadata to demonstrate diagnostic flags.'
                  : 'Cleared simulation. Restored pristine 100% compliant metadata.'
              );
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
              simulationActive
                ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Toggle simulated duplicate and missing metadata to test the scanner's detection"
          >
            <Zap className={`w-3.5 h-3.5 ${simulationActive ? 'text-black fill-current' : 'text-slate-400'}`} />
            <span>{simulationActive ? 'Test Mode: Active' : 'Test Flags Mode'}</span>
          </button>
        </div>
      </div>

      {/* Simulation Active Notice Banner */}
      {simulationActive && (
        <div className="p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold text-amber-950 block">
                Diagnostic Simulation Mode Engaged
              </span>
              <span className="text-[11px] text-amber-800">
                Injected simulated duplicate descriptions into collections/craftsmanship/heritage and cleared terms metadata to test diagnostic flag triggers.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSimulationActive(false)}
            className="px-3 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-400 rounded-lg text-xs font-bold transition-colors cursor-pointer self-start sm:self-center shrink-0"
          >
            Reset to Real Compliant Data
          </button>
        </div>
      )}

      {/* 2. Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-4">
        {/* Total Routes Monitored */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Audited Routes</span>
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
          </div>
          <div className="font-mono text-xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {summary.totalRoutes}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate">
            10 Static · {watches.length} Watches · 3 Articles
          </div>
        </div>

        {/* SEO Health Score */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Health Score</span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9A7B38]" />
          </div>
          <div className={`font-mono text-xl sm:text-3xl font-extrabold tabular-nums ${
            summary.healthScore >= 90 ? 'text-emerald-600' : summary.healthScore >= 75 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {summary.healthScore}%
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-[#9A7B38] truncate">
            {summary.healthyCount} of {summary.totalRoutes} 100% Compliant
          </div>
        </div>

        {/* Duplicate Meta Descriptions */}
        <div className={`p-3.5 sm:p-5 rounded-2xl bg-white border shadow-sm space-y-1 transition-colors ${
          summary.duplicateDescriptionsCount > 0 ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Duplicates</span>
            <AlertTriangle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
              summary.duplicateDescriptionsCount > 0 ? 'text-amber-600' : 'text-slate-400'
            }`} />
          </div>
          <div className={`font-mono text-xl sm:text-3xl font-extrabold tabular-nums ${
            summary.duplicateDescriptionsCount > 0 ? 'text-amber-700' : 'text-slate-900'
          }`}>
            {summary.duplicateDescriptionsCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate">
            {summary.duplicateDescriptionsCount === 0 ? '✓ Zero Duplicate Descs' : `${summary.duplicateDescriptionsCount} Duplicates Flagged`}
          </div>
        </div>

        {/* Missing Metadata */}
        <div className={`p-3.5 sm:p-5 rounded-2xl bg-white border shadow-sm space-y-1 transition-colors ${
          summary.missingDescriptionsCount > 0 ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Missing Meta</span>
            <XCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
              summary.missingDescriptionsCount > 0 ? 'text-rose-600' : 'text-slate-400'
            }`} />
          </div>
          <div className={`font-mono text-xl sm:text-3xl font-extrabold tabular-nums ${
            summary.missingDescriptionsCount > 0 ? 'text-rose-700' : 'text-slate-900'
          }`}>
            {summary.missingDescriptionsCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate">
            {summary.missingDescriptionsCount === 0 ? '✓ 100% Description Coverage' : `${summary.missingDescriptionsCount} Missing Descriptions`}
          </div>
        </div>

        {/* Character Length Compliance */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span>&lt; 160 Chars</span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {summary.totalRoutes - summary.overlengthDescriptionsCount}
            <span className="text-xs text-slate-400 font-normal">/{summary.totalRoutes}</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold truncate">
            {summary.overlengthDescriptionsCount === 0 ? '✓ All within Snippet Limit' : `${summary.overlengthDescriptionsCount} Exceed 160 Chars`}
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by route (#collections), page name, title, description, or keyword..."
              className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#9A7B38] text-slate-900 shadow-2xs font-semibold placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status filter chips */}
          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Routes ({summary.totalRoutes})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('issues')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'issues'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Issues / Warnings ({summary.warningCount + summary.criticalCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('duplicates')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'duplicates'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Duplicates ({summary.duplicateDescriptionsCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('healthy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'healthy'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Healthy ({summary.healthyCount})
            </button>
          </div>

          {/* Page Type Filter dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#9A7B38] shadow-2xs cursor-pointer shrink-0"
          >
            <option value="all">All Page Types</option>
            <option value="Core Page">Core Pages (7)</option>
            <option value="Product">Product Pages ({watches.length})</option>
            <option value="Article">Article Pages (3)</option>
            <option value="Legal">Legal & Policy (2)</option>
            <option value="Admin">Admin Console (1)</option>
          </select>
        </div>
      </div>

      {/* 4. Diagnostic Summary Table */}
      <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded-md bg-slate-100 text-slate-700">
              <SlidersHorizontal className="w-4 h-4 text-slate-800" />
            </span>
            <div>
              <h3 className="font-sans text-xs sm:text-sm font-bold text-slate-900">
                SEO Metadata Diagnostic Ledger
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                Detailed scan of meta descriptions, character limits, target keywords, and duplicate flags.
              </p>
            </div>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
            Showing {filteredItems.length} of {summary.totalRoutes} Pages
          </span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-semibold font-mono">
                <th className="py-3 px-4 w-28">Status</th>
                <th className="py-3 px-4 w-48">Page / Route</th>
                <th className="py-3 px-4 w-60">Meta Title</th>
                <th className="py-3 px-4">Meta Description & Character Metric</th>
                <th className="py-3 px-4 w-40">Diagnostic Flags</th>
                <th className="py-3 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                    <p className="font-semibold text-slate-700">No issues found matching criteria</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try clearing your search query or switching filters.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isDuplicate = item.duplicateWithRoutes.length > 0;
                  const isMissing = !item.description || item.description.trim().length === 0;
                  const isOverlength = item.description.length > 160;

                  return (
                    <tr
                      key={item.route}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isMissing
                          ? 'bg-rose-50/30'
                          : isDuplicate
                          ? 'bg-amber-50/30'
                          : ''
                      }`}
                    >
                      {/* 1. Status Column */}
                      <td className="py-3 px-4 align-top">
                        {item.status === 'healthy' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>HEALTHY</span>
                          </span>
                        ) : item.status === 'warning' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>WARNING</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-50 text-rose-800 border border-rose-300">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>CRITICAL</span>
                          </span>
                        )}
                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                          {item.pageType}
                        </div>
                      </td>

                      {/* 2. Page & Route Column */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {item.name}
                        </div>
                        <div className="font-mono text-[10px] text-[#9A7B38] mt-0.5 flex items-center gap-1">
                          <span>{item.urlPath}</span>
                        </div>
                        {item.isNoIndex && (
                          <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            noindex, nofollow
                          </span>
                        )}
                      </td>

                      {/* 3. Meta Title Column */}
                      <td className="py-3 px-4 align-top">
                        <div className="text-slate-800 font-medium leading-snug line-clamp-2">
                          {item.title || <span className="text-rose-500 italic">None configured</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            item.titleLength > 60
                              ? 'bg-amber-100 text-amber-900 font-bold'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.titleLength}/60 chars
                          </span>
                        </div>
                      </td>

                      {/* 4. Meta Description & Character Metric */}
                      <td className="py-3 px-4 align-top space-y-1.5">
                        {isMissing ? (
                          <div className="text-rose-600 font-semibold text-xs italic flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Missing Meta Description</span>
                          </div>
                        ) : (
                          <div className="text-slate-700 leading-relaxed font-light text-[11px] sm:text-xs">
                            {item.description}
                          </div>
                        )}

                        {/* Character count bar */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                            isMissing
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : isOverlength
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {item.descriptionLength}/160 chars
                          </span>

                          {/* Length progress indicator */}
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className={`h-full ${
                                isMissing
                                  ? 'bg-rose-500 w-0'
                                  : isOverlength
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (item.descriptionLength / 160) * 100)}%` }}
                            />
                          </div>

                          {item.hasStructuredData && (
                            <span className="text-[9px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-1 py-0.2 rounded">
                              Schema: {item.structuredDataType || 'JSON-LD'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Diagnostic Flags */}
                      <td className="py-3 px-4 align-top space-y-1">
                        {item.issues.map((iss, i) => (
                          <div key={i} className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <XCircle className="w-3 h-3 shrink-0" />
                            <span className="truncate">{iss}</span>
                          </div>
                        ))}
                        {item.warnings.map((warn, i) => (
                          <div key={i} className="text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0 text-amber-600" />
                            <span className="truncate">{warn}</span>
                          </div>
                        ))}
                        {item.issues.length === 0 && item.warnings.length === 0 && (
                          <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50/70 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3 shrink-0 text-emerald-600" />
                            <span>100% Unique & Compliant</span>
                          </div>
                        )}
                      </td>

                      {/* 6. Actions */}
                      <td className="py-3 px-4 align-top text-right space-y-1">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#9A7B38] text-slate-600 hover:text-[#9A7B38] transition-colors cursor-pointer"
                            title="Inspect SERP search snippet preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyDescription(item.description, item.route)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#9A7B38] text-slate-600 hover:text-[#9A7B38] transition-colors cursor-pointer"
                            title="Copy meta description"
                          >
                            {copiedRoute === item.route ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate(item.route)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#9A7B38] text-slate-600 hover:text-[#9A7B38] transition-colors cursor-pointer"
                            title="Open page in boutique"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Detail SERP Inspector Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-slate-900 p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9A7B38]">
                  SERP Search Snippet Inspector
                </span>
                <h3 className="font-sans text-base sm:text-lg font-bold text-slate-900">
                  {selectedItem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Google Search Result Simulation Card */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                Google Search Result Preview (Desktop Simulation)
              </span>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 font-sans">
                <div className="text-[11px] text-slate-600 flex items-center gap-1 font-mono">
                  <span>https://aurelia-horology.ch</span>
                  <span>›</span>
                  <span className="text-slate-500">{selectedItem.route}</span>
                </div>
                <div className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                  {selectedItem.title}
                </div>
                <div className="text-xs sm:text-sm text-[#4d5156] leading-relaxed pt-0.5">
                  {selectedItem.description || (
                    <span className="text-rose-500 italic">[No meta description configured for this route]</span>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnostics Metadata Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-mono text-[10px] uppercase font-semibold">Title Tag Metrics</span>
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>{selectedItem.titleLength} characters</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    selectedItem.titleLength > 60 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {selectedItem.titleLength <= 60 ? '✓ Under 60 chars' : '⚠️ Truncation risk'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{selectedItem.title}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-mono text-[10px] uppercase font-semibold">Meta Description Metrics</span>
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>{selectedItem.descriptionLength} characters</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    selectedItem.descriptionLength > 160
                      ? 'bg-amber-100 text-amber-900'
                      : selectedItem.descriptionLength === 0
                      ? 'bg-rose-100 text-rose-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {selectedItem.descriptionLength <= 160 && selectedItem.descriptionLength > 0
                      ? '✓ Compliant (<160 chars)'
                      : 'Flagged'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-3">{selectedItem.description}</p>
              </div>
            </div>

            {/* Target Keywords */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="text-slate-500 font-mono text-[10px] uppercase font-semibold">Target Keywords</span>
              <p className="font-mono text-[11px] text-slate-800">{selectedItem.keywords || 'None'}</p>
            </div>

            {/* Issues & Warnings List */}
            {selectedItem.issues.length > 0 || selectedItem.warnings.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-1.5 text-xs">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Diagnostic Flags ({selectedItem.issues.length + selectedItem.warnings.length})</span>
                </span>
                <ul className="list-disc pl-4 space-y-1 text-amber-900 text-[11px]">
                  {selectedItem.issues.map((it, idx) => (
                    <li key={`iss-${idx}`} className="font-semibold text-rose-800">{it}</li>
                  ))}
                  {selectedItem.warnings.map((it, idx) => (
                    <li key={`warn-${idx}`}>{it}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">All SEO metadata specifications for this page pass audit inspection.</span>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleCopyDescription(selectedItem.description, selectedItem.route)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Description</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate(selectedItem.route);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Navigate to Page</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
