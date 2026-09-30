import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  X,
  Printer,
  Download,
  CreditCard,
  Receipt,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const InvoiceDetailModal: React.FC = () => {
  const {
    selectedInvoiceId,
    setSelectedInvoiceId,
    invoices,
    clients,
    orgSettings,
    setIsRecordPaymentOpen,
    setPaymentTargetInvoiceId,
    canManageFinances,
  } = useAgency();

  const invoice = invoices.find((inv) => inv.id === selectedInvoiceId);
  if (!invoice) return null;

  const client = clients.find((c) => c.id === invoice.clientId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Action Bar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-indigo-400">{invoice.invoiceNumber}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                invoice.status === 'paid'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : invoice.status === 'partially_paid'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {invoice.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {invoice.dueAmount > 0 && canManageFinances && (
              <button
                onClick={() => {
                  setPaymentTargetInvoiceId(invoice.id);
                  setIsRecordPaymentOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Payment</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl"
              title="Print invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedInvoiceId(null)}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-950 text-zinc-100">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{orgSettings.name}</span>
              </h2>
              <p className="text-xs text-zinc-400">{orgSettings.tagline}</p>
              <p className="text-xs text-zinc-500">{orgSettings.address}</p>
              <p className="text-xs text-zinc-500">{orgSettings.email} • {orgSettings.phone}</p>
            </div>

            <div className="text-right space-y-1">
              <h1 className="text-2xl font-black text-indigo-400 tracking-wider font-mono">INVOICE</h1>
              <div className="text-xs font-mono text-zinc-300 font-bold">{invoice.invoiceNumber}</div>
              <div className="text-xs text-zinc-400 font-mono">Issued: {formatDate(invoice.issueDate)}</div>
              <div className="text-xs text-amber-400 font-mono font-semibold">Due: {formatDate(invoice.dueDate)}</div>
            </div>
          </div>

          {/* Client Billed To */}
          <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Billed To
              </span>
              <h3 className="text-base font-bold text-zinc-100">{client?.company}</h3>
              <p className="text-xs text-zinc-400">{client?.name}</p>
              <p className="text-xs text-zinc-500">{client?.address}</p>
              <p className="text-xs text-zinc-500">{client?.email}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Payment Status
              </span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {invoice.dueAmount === 0 ? 'PAID IN FULL' : `${formatCurrency(invoice.dueAmount)} DUE`}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Rate</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="text-zinc-200">
                    <td className="py-3.5 px-4 font-medium">{item.description}</td>
                    <td className="py-3.5 px-4 text-center font-mono">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-right font-mono">{formatCurrency(item.rate)}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="text-xs text-zinc-400 space-y-1 sm:max-w-xs">
              <span className="font-semibold text-zinc-300 block">Terms & Payment Instructions:</span>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{invoice.notes}</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono text-zinc-200">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discountPercent > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Discount ({invoice.discountPercent}%)</span>
                  <span className="font-mono text-rose-400">
                    -{formatCurrency((invoice.subtotal * invoice.discountPercent) / 100)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Tax ({invoice.taxPercent}%)</span>
                <span className="font-mono text-zinc-200">
                  {formatCurrency(
                    ((invoice.subtotal - (invoice.subtotal * invoice.discountPercent) / 100) *
                      invoice.taxPercent) /
                      100
                  )}
                </span>
              </div>
              <div className="flex justify-between text-zinc-100 font-bold pt-2 border-t border-zinc-800 text-sm">
                <span>Total Invoiced</span>
                <span className="font-mono">{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold font-mono text-xs">
                <span>Paid to Date</span>
                <span>{formatCurrency(invoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-amber-400 font-bold font-mono text-sm pt-1 border-t border-zinc-800">
                <span>Balance Due</span>
                <span>{formatCurrency(invoice.dueAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
