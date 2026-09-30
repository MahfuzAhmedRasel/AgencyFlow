import { TaskPriority, TaskStatus, ProjectStatus, InvoiceStatus } from '../types';

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export const getTaskStatusConfig = (status: TaskStatus) => {
  switch (status) {
    case 'pending':
      return { label: 'Pending', bg: 'bg-zinc-800 text-zinc-300 border-zinc-700', dot: 'bg-zinc-400' };
    case 'assigned':
      return { label: 'Assigned', bg: 'bg-blue-950/70 text-blue-300 border-blue-800/80', dot: 'bg-blue-400' };
    case 'in_progress':
      return { label: 'In Progress', bg: 'bg-amber-950/70 text-amber-300 border-amber-800/80', dot: 'bg-amber-400' };
    case 'submitted':
      return { label: 'Submitted', bg: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/80', dot: 'bg-indigo-400' };
    case 'under_review':
      return { label: 'Under Review', bg: 'bg-purple-950/70 text-purple-300 border-purple-800/80', dot: 'bg-purple-400 animate-pulse' };
    case 'revision_required':
      return { label: 'Revision Required', bg: 'bg-rose-950/80 text-rose-300 border-rose-800/90', dot: 'bg-rose-400 animate-ping' };
    case 'approved':
      return { label: 'Approved', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80', dot: 'bg-emerald-400' };
    case 'completed':
      return { label: 'Completed', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80', dot: 'bg-emerald-400' };
    case 'overdue':
      return { label: 'Overdue', bg: 'bg-red-950/80 text-red-300 border-red-800/90', dot: 'bg-red-500 animate-bounce' };
    case 'cancelled':
      return { label: 'Cancelled', bg: 'bg-zinc-900 text-zinc-400 border-zinc-800', dot: 'bg-zinc-500' };
    default:
      return { label: status, bg: 'bg-zinc-800 text-zinc-300 border-zinc-700', dot: 'bg-zinc-400' };
  }
};

export const getPriorityConfig = (priority: TaskPriority) => {
  switch (priority) {
    case 'urgent':
      return { label: 'Urgent', bg: 'bg-red-500/10 text-red-400 border-red-500/30', color: 'text-red-400' };
    case 'high':
      return { label: 'High', bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30', color: 'text-orange-400' };
    case 'medium':
      return { label: 'Medium', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', color: 'text-yellow-400' };
    case 'low':
      return { label: 'Low', bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30', color: 'text-zinc-400' };
  }
};

export const getProjectStatusConfig = (status: ProjectStatus) => {
  switch (status) {
    case 'planning':
      return { label: 'Planning', bg: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    case 'active':
      return { label: 'Active', bg: 'bg-blue-950/70 text-blue-300 border-blue-800/80' };
    case 'in_progress':
      return { label: 'In Progress', bg: 'bg-amber-950/70 text-amber-300 border-amber-800/80' };
    case 'under_review':
      return { label: 'Under Review', bg: 'bg-purple-950/70 text-purple-300 border-purple-800/80' };
    case 'on_hold':
      return { label: 'On Hold', bg: 'bg-zinc-900 text-zinc-400 border-zinc-700' };
    case 'completed':
      return { label: 'Completed', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80' };
    case 'cancelled':
      return { label: 'Cancelled', bg: 'bg-rose-950/70 text-rose-400 border-rose-900/60' };
    default:
      return { label: status, bg: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
  }
};

export const getInvoiceStatusConfig = (status: InvoiceStatus) => {
  switch (status) {
    case 'paid':
      return { label: 'Paid', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80' };
    case 'partially_paid':
      return { label: 'Partially Paid', bg: 'bg-amber-950/70 text-amber-300 border-amber-800/80' };
    case 'unpaid':
      return { label: 'Unpaid', bg: 'bg-rose-950/70 text-rose-300 border-rose-800/80' };
    case 'overdue':
      return { label: 'Overdue', bg: 'bg-red-950/80 text-red-300 border-red-800/90' };
    case 'cancelled':
      return { label: 'Cancelled', bg: 'bg-zinc-900 text-zinc-400 border-zinc-800' };
  }
};

export const ensureAbsoluteUrl = (url?: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

