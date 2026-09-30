import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { X, UserPlus, Phone, Briefcase, DollarSign, Sparkles, CheckCircle2, Film, Image as ImageIcon, Megaphone, MoreHorizontal } from 'lucide-react';
import { ClientProjectType } from '../../types';

export const CreateClientModal: React.FC = () => {
  const { isCreateClientOpen, setIsCreateClientOpen, addClient, currentUser } = useAgency();

  // The exact fields requested by user:
  // 1. Client Name
  // 2. Mobile Number
  // 3. Main Business Assets
  // 4. Project: Video | Image | Campaign | Other
  // 5. Total Price
  // 6. Advance
  // 7. Due
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mainBusinessAssets, setMainBusinessAssets] = useState('');
  const [projectType, setProjectType] = useState<ClientProjectType>('Video');
  const [totalPrice, setTotalPrice] = useState<number | ''>('');
  const [advance, setAdvance] = useState<number | ''>('');
  const [customDue, setCustomDue] = useState<number | null>(null);

  // Auto-calculated Due: Total Price - Advance
  const calculatedDue = Math.max(0, (Number(totalPrice) || 0) - (Number(advance) || 0));
  const effectiveDue = customDue !== null ? customDue : calculatedDue;

  if (!isCreateClientOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobileNumber.trim()) return;

    const numTotalPrice = Number(totalPrice) || 0;
    const numAdvance = Number(advance) || 0;
    const finalDue = customDue !== null ? customDue : Math.max(0, numTotalPrice - numAdvance);

    addClient({
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
      phone: mobileNumber.trim(),
      mainBusinessAssets: mainBusinessAssets.trim() || 'Brand Assets, Product Details',
      projectType,
      totalPrice: numTotalPrice,
      advance: numAdvance,
      due: finalDue,
      company: name.trim(), // for backward compatibility
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}@client.com`,
      address: 'Client Location',
      website: '',
      industry: `${projectType} Services`,
      assignedManagerId: currentUser.id,
      status: 'active',
      notes: `Project: ${projectType}. Advance: ${numAdvance}, Due: ${finalDue}.`,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    });

    setIsCreateClientOpen(false);
    // Reset form
    setName('');
    setMobileNumber('');
    setMainBusinessAssets('');
    setProjectType('Video');
    setTotalPrice('');
    setAdvance('');
    setCustomDue(null);
  };

  const projectOptions: { type: ClientProjectType; label: string; icon: React.ElementType; color: string; activeColor: string }[] = [
    { type: 'Video', label: 'Video', icon: Film, color: 'text-purple-400', activeColor: 'bg-purple-500/20 border-purple-500 text-purple-300' },
    { type: 'Image', label: 'Image', icon: ImageIcon, color: 'text-pink-400', activeColor: 'bg-pink-500/20 border-pink-500 text-pink-300' },
    { type: 'Campaign', label: 'Campaign', icon: Megaphone, color: 'text-orange-400', activeColor: 'bg-orange-500/20 border-orange-500 text-orange-300' },
    { type: 'Other', label: 'Other', icon: MoreHorizontal, color: 'text-emerald-400', activeColor: 'bg-emerald-500/20 border-emerald-500 text-emerald-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Add New Client</h2>
              <p className="text-xs text-zinc-400">Call Center Client Acquisition & Payment</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateClientOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* 1. Client Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200 block">
              Client Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahim Chowdhury / Apex Brands"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors"
            />
          </div>

          {/* 2. Mobile Number */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200 block">
              Mobile Number <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="tel"
                required
                placeholder="e.g. +880 1700-000000 / 01712-345678"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors"
              />
            </div>
          </div>

          {/* 3. Main Business Assets */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200 block">
              Main Business Assets
            </label>
            <input
              type="text"
              placeholder="e.g. Brand Logo, Raw Videos, Catalog Link, Product Photos"
              value={mainBusinessAssets}
              onChange={(e) => setMainBusinessAssets(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors"
            />
          </div>

          {/* 4. Project (Video | Image | Campaign | Other) */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200 block">
              Project Type <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {projectOptions.map((opt) => {
                const isSelected = projectType === opt.type;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setProjectType(opt.type)}
                    className={`py-2 px-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? opt.activeColor + ' ring-1 ring-orange-500/40'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? '' : opt.color}`} />
                    <span className="text-[11px] font-semibold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Total Price & 6. Advance & 7. Due */}
          <div className="p-3.5 bg-zinc-950/80 rounded-2xl border border-zinc-800/80 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300 block">
                  Total Price (৳ / $)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-zinc-500 font-semibold text-xs">৳</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={totalPrice}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setTotalPrice(val);
                      setCustomDue(null);
                    }}
                    className="w-full pl-7 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300 block">
                  Advance Paid (৳ / $)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-zinc-500 font-semibold text-xs">৳</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={advance}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setAdvance(val);
                      setCustomDue(null);
                    }}
                    className="w-full pl-7 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-emerald-400 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-xs font-mono font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 7. Due display & editable override */}
            <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
              <div>
                <span className="text-zinc-400 text-[11px] block">Due Amount:</span>
                <span className="text-[10px] text-zinc-500">Auto-calculated (Total - Advance)</span>
              </div>
              <div className="text-right">
                <span className={`text-base font-bold font-mono ${effectiveDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  ৳ {effectiveDue.toLocaleString()}
                </span>
                {effectiveDue === 0 && Number(totalPrice) > 0 && (
                  <span className="block text-[10px] text-emerald-400 font-semibold">Fully Paid</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsCreateClientOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Save Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
