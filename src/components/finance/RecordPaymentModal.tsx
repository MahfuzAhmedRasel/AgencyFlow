import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { X, CreditCard, DollarSign } from 'lucide-react';
import { Payment } from '../../types';

export const RecordPaymentModal: React.FC = () => {
  const {
    isRecordPaymentOpen,
    setIsRecordPaymentOpen,
    paymentTargetInvoiceId,
    invoices,
    recordPayment,
  } = useAgency();

  const invoice = invoices.find((inv) => inv.id === paymentTargetInvoiceId);

  const [amount, setAmount] = useState<number>(invoice ? invoice.dueAmount : 0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<Payment['paymentMethod']>('stripe');
  const [referenceNo, setReferenceNo] = useState(
    `PAY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
  );
  const [notes, setNotes] = useState('Payment confirmed by client');

  React.useEffect(() => {
    if (invoice) {
      setAmount(invoice.dueAmount);
    }
  }, [invoice]);

  if (!isRecordPaymentOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    recordPayment({
      invoiceId: invoice.id,
      clientId: invoice.clientId,
      amount: Number(amount),
      paymentDate,
      paymentMethod,
      referenceNo: referenceNo.trim() || 'REF-DIRECT',
      notes,
    });

    setIsRecordPaymentOpen(false);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Record Client Payment</h3>
              <p className="text-[11px] text-zinc-400">Invoice: {invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={() => setIsRecordPaymentOpen(false)}
            className="p-1 text-zinc-400 hover:text-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
            <span className="text-zinc-400">Total Invoice Balance Due:</span>
            <span className="font-mono font-bold text-amber-400">${invoice.dueAmount.toLocaleString()}</span>
          </div>

          <div>
            <label className="font-semibold text-zinc-300 block mb-1">
              Payment Amount Received ($ USD) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              max={invoice.dueAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 font-mono text-sm font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
              >
                <option value="stripe">Stripe / Merchant</option>
                <option value="bank_transfer">Bank Wire / ACH</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cash">Cash / Check</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-zinc-300 block mb-1">
              Transaction Reference / Trace ID *
            </label>
            <input
              type="text"
              required
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-300 block mb-1">Payment Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsRecordPaymentOpen(false)}
              className="px-3.5 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/30"
            >
              Confirm & Settle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
