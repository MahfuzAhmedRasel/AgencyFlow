import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import { CreditCard, CheckCircle2, Search, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PaymentsList: React.FC = () => {
  const { payments, invoices, clients, setSelectedInvoiceId } = useAgency();

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <span>Settled Payment Ledger</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              {payments.length} transactions
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Audit trail of client payments, gateway settle receipts, and wire transfers.
          </p>
        </div>

        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center space-x-3">
          <span className="text-xs text-zinc-400">Total Settled:</span>
          <span className="font-mono font-bold text-emerald-400 text-base">
            {formatCurrency(totalCollected)}
          </span>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Transaction Ref #</th>
                <th className="py-3.5 px-4">Client Brand</th>
                <th className="py-3.5 px-4">Invoice</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Amount Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No payment records yet.
                  </td>
                </tr>
              ) : (
                payments.map((pay) => {
                  const client = clients.find((c) => c.id === pay.clientId);
                  const invoice = invoices.find((inv) => inv.id === pay.invoiceId);

                  return (
                    <tr key={pay.id} className="hover:bg-zinc-850/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                        {pay.referenceNo}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-zinc-200">
                        {client?.company || 'Client'}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedInvoiceId(pay.invoiceId)}
                          className="font-mono text-zinc-300 hover:text-indigo-400 underline underline-offset-2"
                        >
                          {invoice?.invoiceNumber || pay.invoiceId}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 capitalize font-mono text-zinc-400">
                        {pay.paymentMethod.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {formatDate(pay.paymentDate)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                        {formatCurrency(pay.amount)}
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
