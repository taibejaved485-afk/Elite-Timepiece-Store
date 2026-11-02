import React, { useState, useMemo } from 'react';
import {
  History, Search, Filter, Shield, Plus, Edit3, Trash2,
  Clock, User, Download, RefreshCw, AlertTriangle, CheckCircle2,
  Copy, Layers, ArrowUpDown, FileText, Sparkles, Check, Tag,
  ShoppingBag, SlidersHorizontal, Lock
} from 'lucide-react';
import { AuditLogItem, clearAuditLogs } from '../utils/auditLogger';

interface AdminActivityLogProps {
  logs: AuditLogItem[];
  onRefreshLogs: () => void;
  adminUser?: string;
  onClearLogs?: () => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const AdminActivityLog: React.FC<AdminActivityLogProps> = ({
  logs,
  onRefreshLogs,
  adminUser = 'admin',
  onClearLogs,
  title = 'Admin Activity Log & Audit Trail',
  subtitle = 'Automatic chronological chronicle of all timepiece additions, updates, deletions, and administrative actions.',
  compact = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Compute stats on timepiece operations
  const stats = useMemo(() => {
    let additions = 0;
    let updates = 0;
    let deletions = 0;
    let security = 0;

    logs.forEach((log) => {
      const act = log.action.toLowerCase();
      if (act.includes('added') || act.includes('commission') || act.includes('duplicate')) {
        additions++;
      } else if (act.includes('updated') || act.includes('price') || act.includes('stock') || act.includes('feature')) {
        updates++;
      } else if (act.includes('deleted') || act.includes('purged') || act.includes('removal')) {
        deletions++;
      }
      if (log.category === 'security') {
        security++;
      }
    });

    return {
      total: logs.length,
      additions,
      updates,
      deletions,
      security,
    };
  }, [logs]);

  // Filter & sort logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        // Category filter
        if (selectedCategory !== 'all' && log.category !== selectedCategory) {
          return false;
        }

        // Action type quick filter
        if (selectedActionType === 'additions') {
          const act = log.action.toLowerCase();
          if (!act.includes('added') && !act.includes('commission') && !act.includes('duplicate')) {
            return false;
          }
        } else if (selectedActionType === 'updates') {
          const act = log.action.toLowerCase();
          if (!act.includes('updated') && !act.includes('price') && !act.includes('stock') && !act.includes('feature')) {
            return false;
          }
        } else if (selectedActionType === 'deletions') {
          const act = log.action.toLowerCase();
          if (!act.includes('deleted') && !act.includes('purged') && !act.includes('removal')) {
            return false;
          }
        } else if (selectedActionType === 'timepieces_all') {
          if (log.category !== 'product') return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchAction = log.action.toLowerCase().includes(q);
          const matchDetails = log.details.toLowerCase().includes(q);
          const matchUser = log.adminUser.toLowerCase().includes(q);
          const matchCategory = log.category.toLowerCase().includes(q);
          const matchTimestamp = log.timestamp.toLowerCase().includes(q);
          if (!matchAction && !matchDetails && !matchUser && !matchCategory && !matchTimestamp) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'desc') {
          return b.id.localeCompare(a.id);
        } else {
          return a.id.localeCompare(b.id);
        }
      });
  }, [logs, selectedCategory, selectedActionType, searchQuery, sortOrder]);

  const handleCopyLog = (log: AuditLogItem) => {
    const text = `[AURELIA AUDIT] ${log.timestamp} | Action: ${log.action} | Admin: ${log.adminUser} | Details: ${log.details}`;
    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Action', 'Category', 'Admin User', 'Details'];
    const rows = filteredLogs.map((log) => [
      `"${log.id}"`,
      `"${log.timestamp}"`,
      `"${log.action.replace(/"/g, '""')}"`,
      `"${log.category}"`,
      `"${log.adminUser}"`,
      `"${log.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aurelia_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExecuteClear = () => {
    clearAuditLogs();
    if (onClearLogs) {
      onClearLogs();
    } else {
      onRefreshLogs();
    }
    setConfirmClearOpen(false);
  };

  // Helper to get action icon and styling
  const getActionDesign = (log: AuditLogItem) => {
    const act = log.action.toLowerCase();
    if (act.includes('added') || act.includes('commission') || act.includes('duplicate')) {
      return {
        badgeText: 'Addition',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-500',
        icon: <Plus className="w-3.5 h-3.5 text-emerald-600" />,
        borderAccent: 'border-l-emerald-500',
      };
    }
    if (act.includes('deleted') || act.includes('purged') || act.includes('removal')) {
      return {
        badgeText: 'Deletion',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
        dotClass: 'bg-rose-500',
        icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
        borderAccent: 'border-l-rose-500',
      };
    }
    if (act.includes('updated') || act.includes('price') || act.includes('stock') || act.includes('feature')) {
      return {
        badgeText: 'Update',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
        dotClass: 'bg-blue-500',
        icon: <Edit3 className="w-3.5 h-3.5 text-blue-600" />,
        borderAccent: 'border-l-blue-500',
      };
    }
    if (log.category === 'security') {
      return {
        badgeText: 'Security',
        badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
        dotClass: 'bg-purple-500',
        icon: <Lock className="w-3.5 h-3.5 text-purple-600" />,
        borderAccent: 'border-l-purple-500',
      };
    }
    return {
      badgeText: log.category,
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
      dotClass: 'bg-[#9A7B38]',
      icon: <Layers className="w-3.5 h-3.5 text-[#9A7B38]" />,
      borderAccent: 'border-l-[#C5A059]',
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 font-sans">
      {/* Top Professional Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-slate-100 text-slate-700">
              <Shield className="w-4 h-4 text-slate-800" />
            </span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
              Security & Audit Register Module
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            {title}
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          <button
            type="button"
            onClick={onRefreshLogs}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Refresh latest log events"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            title="Export filtered log to CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmClearOpen(true)}
            className="px-3 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Clear audit log history"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Clear Trail</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards: Watch Operations Auditing */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <span>Total Events</span>
            <History className="w-4 h-4 text-[#9A7B38]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {stats.total}
          </div>
          <div className="text-[10px] text-slate-500 font-sans">Recorded in security vault</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-sm space-y-1 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            <span>Watch Additions</span>
            <Plus className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            +{stats.additions}
          </div>
          <div className="text-[10px] text-emerald-600 font-sans">Commissioned timepieces</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-200/80 shadow-sm space-y-1 bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex items-center justify-between text-blue-800 text-[11px] font-bold uppercase tracking-wider">
            <span>Watch Updates</span>
            <Edit3 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-mono">
            ✎ {stats.updates}
          </div>
          <div className="text-[10px] text-blue-600 font-sans">Specs, prices & stock updates</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-sm space-y-1 bg-gradient-to-br from-white to-rose-50/30">
          <div className="flex items-center justify-between text-rose-800 text-[11px] font-bold uppercase tracking-wider">
            <span>Watch Deletions</span>
            <Trash2 className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono">
            ✕ {stats.deletions}
          </div>
          <div className="text-[10px] text-rose-600 font-sans">Catalog removals</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-purple-200/80 shadow-sm space-y-1 col-span-2 lg:col-span-1 bg-gradient-to-br from-white to-purple-50/30">
          <div className="flex items-center justify-between text-purple-800 text-[11px] font-bold uppercase tracking-wider">
            <span>Security & Auth</span>
            <Lock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-mono">
            {stats.security}
          </div>
          <div className="text-[10px] text-purple-600 font-sans">Logins, passkeys & timeouts</div>
        </div>
      </div>

      {/* Main Activity Log Box Card with Filtering */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        {/* Card-Specific Heading */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-slate-100 text-slate-700">
              <History className="w-3.5 h-3.5 text-slate-800" />
            </span>
            <h3 className="font-sans text-sm font-bold text-slate-900">
              Operations & Security Audit Ledger
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono font-medium">
            Showing {filteredLogs.length} of {logs.length} logged events
          </span>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by watch name, reference, admin, or action..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#9A7B38] bg-slate-50/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Buttons & Selects */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Action Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs overflow-x-auto">
              {[
                { id: 'all', label: 'All Events' },
                { id: 'timepieces_all', label: 'All Watches' },
                { id: 'additions', label: '+ Additions' },
                { id: 'updates', label: '✎ Updates' },
                { id: 'deletions', label: '✕ Deletions' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setSelectedActionType(btn.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer text-[11px] ${
                    selectedActionType === btn.id
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-[#9A7B38] cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="product">Timepieces (Catalog)</option>
              <option value="order">Client Orders</option>
              <option value="security">Security & Access</option>
              <option value="settings">Site Controls</option>
              <option value="promo">VIP Concessions</option>
            </select>

            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              title={`Sorting: ${sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {/* Status Count Line */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1">
          <span>
            Showing <strong className="text-slate-900">{filteredLogs.length}</strong> of{' '}
            <strong className="text-slate-900">{logs.length}</strong> recorded audit operations
          </span>
          {searchQuery && (
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
              Filtered by: "{searchQuery}"
            </span>
          )}
        </div>

        {/* Audit Log Timeline Entries */}
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-200/60 flex items-center justify-center text-slate-400 mx-auto">
              <History className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">No Audit Activity Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No administrative log entries match the selected filters or search parameters.
              </p>
            </div>
            {(searchQuery || selectedCategory !== 'all' || selectedActionType !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedActionType('all');
                }}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredLogs.map((log) => {
              const design = getActionDesign(log);
              return (
                <div
                  key={log.id}
                  className={`p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-2xs hover:shadow-xs border-l-4 ${design.borderAccent} group flex flex-col sm:flex-row sm:items-start justify-between gap-3`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Action Icon Badge */}
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
                      {design.icon}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      {/* Action Header Line */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs group-hover:text-[#9A7B38] transition-colors">
                          {log.action}
                        </span>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${design.badgeClass}`}>
                          {design.badgeText}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase bg-slate-100 text-slate-500 border border-slate-200">
                          {log.category}
                        </span>
                      </div>

                      {/* Log Details */}
                      <p className="text-xs text-slate-600 leading-relaxed break-words font-sans">
                        {log.details}
                      </p>

                      {/* Meta Information: Timestamp and Admin User */}
                      <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-[#C5A059]" />
                          <span>{log.timestamp}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-700 font-semibold">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>by {log.adminUser}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <div className="flex items-center justify-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyLog(log)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-700 text-xs transition-colors cursor-pointer flex items-center gap-1"
                      title="Copy log entry to clipboard"
                    >
                      {copiedId === log.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px] text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px] hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clearing Audit Logs */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-sans">
                Purge Audit History?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will permanently delete all {logs.length} administrative action log entries from the local audit register. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteClear}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
