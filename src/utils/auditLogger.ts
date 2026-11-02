export interface AuditLogItem {
  id: string;
  action: string;
  category: 'product' | 'order' | 'settings' | 'security' | 'promo';
  details: string;
  timestamp: string;
  adminUser: string;
}

const STORAGE_KEY = 'aurelia_admin_audit_log_v1';

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    action: 'Vault Initialization',
    category: 'security',
    details: 'Manufacture subterranean vault system synchronized with Le Brassus server.',
    timestamp: 'Today · 08:00 CET',
    adminUser: 'admin',
  },
  {
    id: 'log-2',
    action: 'Consignment Created',
    category: 'order',
    details: 'Order #AUR-89201-CH allocated from dual-key safe for Lord Sterling Vance.',
    timestamp: 'Yesterday · 14:30 CET',
    adminUser: 'admin',
  },
  {
    id: 'log-3',
    action: 'Calibre Catalog Update',
    category: 'product',
    details: 'Verified COSC chronometer specifications for Symphonie Skeleton Tourbillon.',
    timestamp: 'Oct 21 · 11:15 CET',
    adminUser: 'admin',
  },
];

export function getAuditLogs(): AuditLogItem[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_AUDIT_LOGS;
  } catch (e) {
    return INITIAL_AUDIT_LOGS;
  }
}

export function logAdminAction(
  action: string,
  category: AuditLogItem['category'],
  details: string,
  adminUser: string = 'admin'
): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getAuditLogs();
    const now = new Date();
    const timeStr = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} CET`;
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      category,
      details,
      timestamp: timeStr,
      adminUser,
    };
    const updated = [newLog, ...logs.slice(0, 99)]; // retain last 100 entries
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error logging admin action', e);
  }
}

export function clearAuditLogs(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (e) {}
}
