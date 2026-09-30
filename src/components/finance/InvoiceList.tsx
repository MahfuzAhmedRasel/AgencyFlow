import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Eye,
  Trash2,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency, formatDate, getInvoiceStatusConfig } from '../../utils/formatters';

export const InvoiceList: React.FC = () => {
  const {
    invoices,
    clients,
    deleteInvoice,
    setSelectedInvoiceId,
    setIsCreateInvoiceOpen,
    setIsRecordPaymentOpen,
    setPaymentTargetInvoiceId,
    canManageFinances,
  } = useAgency();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // KPI Calculations
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.dueAmount, 0);
  const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length;

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesNum = inv.invoiceNumber.toLowerCase().includes(q);
        const client = clients.find((c) => c.id === inv.clientId);
        const matchesClient = client?.company.toLowerCase().includes(q);
        if (!matchesNum && !matchesClient) return false;
      }
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      return true;
    });
  }, [invoices, searchQuery, statusFilter, clients]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <span>Invoices & Agency Billing</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              {filteredInvoices.length} invoices
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Track client retainers, project milestone billings, tax calculations, and cash flow.
          </p>
        </div>

        {canManageFinances && (
          <button
            onClick={() => setIsCreateInvoiceOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        )}
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-medium">
            <span>Total Invoiced</span>
            <Receipt className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono mt-2">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Across all brand accounts</div>
        </div>

        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-medium">
            <span>Collected Cash</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-2">
            {formatCurrency(totalPaid)}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            {totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0}% collection rate
          </div>
        </div>

        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-medium">
            <span>Outstanding Due</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-2">
            {formatCurrency(totalOutstanding)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Pending client settlement</div>
        </div>

        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-medium">
            <span>Overdue Amount</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-2">
            {overdueCount} invoices
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">Requires follow-up</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by invoice number or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Payment Statuses</option>
          <option value="paid">Paid</option>
          <option value="partially_paid">Partially Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Paid</th>
                <th className="py-3.5 px-4">Due Balance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const client = clients.find((c) => c.id === inv.clientId);
                  const statusCfg = getInvoiceStatusConfig(inv.status);

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-zinc-850/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedInvoiceId(inv.id)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-100 group-hover:text-indigo-300">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-200">{client?.company}</div>
                        <div className="text-[11px] text-zinc-400">{client?.name}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-400">{formatDate(inv.issueDate)}</td>
                      <td className="py-3.5 px-4 font-mono text-zinc-300">{formatDate(inv.dueDate)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-100">
                        {formatCurrency(inv.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400">
                        {formatCurrency(inv.paidAmount)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-400 font-semibold">
                        {formatCurrency(inv.dueAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${statusCfg.bg}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {inv.dueAmount > 0 && canManageFinances && (
                            <button
                              onClick={() => {
                                setPaymentTargetInvoiceId(inv.id);
                                setIsRecordPaymentOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-medium transition-colors"
                              title="Record payment"
                            >
                              Pay
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoiceId(inv.id)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800"
                            title="View / Print Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {canManageFinances && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                                  deleteInvoice(inv.id);
                                }
                              }}
                              className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30"
                              title="Delete invoice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
    </div>
  );
};
