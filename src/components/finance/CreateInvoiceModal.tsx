import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { X, Receipt, Plus, Trash2 } from 'lucide-react';
import { InvoiceItem } from '../../types';

export const CreateInvoiceModal: React.FC = () => {
  const { isCreateInvoiceOpen, setIsCreateInvoiceOpen, addInvoice, clients, orgSettings } = useAgency();

  const [clientId, setClientId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-2026-${String(Math.floor(1000 + Math.random() * 9000))}`
  );
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [taxPercent, setTaxPercent] = useState(orgSettings.taxRateDefault || 8.5);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState('Payment terms: Net 14. Thank you for your partnership.');

  const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    {
      description: 'Monthly Performance Creative Retainer (Video Hooks + Ad Variations)',
      quantity: 1,
      rate: 7500,
      amount: 7500,
    },
  ]);

  // Set default client if needed
  React.useEffect(() => {
    if (clients.length > 0 && !clientId) {
      setClientId(clients[0].id);
    }
  }, [clients, clientId]);

  if (!isCreateInvoiceOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        description: 'Creative Production Add-on',
        quantity: 1,
        rate: 1500,
        amount: 1500,
      },
    ]);
  };

  const handleItemChange = (
    index: number,
    field: 'description' | 'quantity' | 'rate',
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = Number(updated.quantity) * Number(updated.rate);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + (it.amount || 0), 0);
  const discountAmount = (subtotal * Number(discountPercent)) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * Number(taxPercent)) / 100;
  const totalAmount = taxableAmount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || items.length === 0) return;

    addInvoice({
      clientId,
      invoiceNumber,
      issueDate,
      dueDate,
      items: items.map((it, idx) => ({ ...it, id: `item-${Date.now()}-${idx}` })),
      subtotal,
      taxPercent: Number(taxPercent),
      discountPercent: Number(discountPercent),
      totalAmount,
      notes,
    });

    setIsCreateInvoiceOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Create Client Invoice</h2>
              <p className="text-xs text-zinc-400">
                Generate itemized invoice with automated tax, discounts, and payment terms
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateInvoiceOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {/* Top row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="font-semibold text-zinc-300 block mb-1">Client Organization *</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Invoice Number *</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Due Date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 font-mono"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-zinc-300 uppercase tracking-wider text-[11px]">
                Itemized Services & Deliverables
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 bg-zinc-850 hover:bg-zinc-800 text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 p-3 bg-zinc-900 rounded-xl border border-zinc-800 items-center"
                >
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Service or deliverable description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 font-mono text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Rate ($)"
                      value={item.rate}
                      onChange={(e) => handleItemChange(idx, 'rate', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 font-mono"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="font-mono text-zinc-200 font-bold">
                      ${item.amount.toLocaleString()}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-zinc-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Tax */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Invoice Notes / Terms</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
              />
            </div>

            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono text-zinc-200 font-semibold">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Discount (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-16 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-right font-mono"
                />
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Tax Rate (%)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-16 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-right font-mono"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800 font-bold text-sm text-zinc-100">
                <span>Total Amount Due</span>
                <span className="font-mono text-emerald-400">${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsCreateInvoiceOpen(false)}
              className="px-4 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30"
            >
              Issue Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
