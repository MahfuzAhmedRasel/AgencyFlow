import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  X,
  Phone,
  DollarSign,
  Briefcase,
  Trash2,
  Edit3,
  Check,
  Film,
  Image as ImageIcon,
  Megaphone,
  MoreHorizontal,
  ExternalLink,
  MessageCircle,
  Copy,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ClientProjectType } from '../../types';

export const ClientDetailModal: React.FC = () => {
  const {
    selectedClientId,
    setSelectedClientId,
    clients,
    updateClient,
    deleteClient,
    currentUser,
  } = useAgency();

  const client = clients.find((c) => c.id === selectedClientId);

  const [isEditing, setIsEditing] = useState(false);
  const [copiedMobile, setCopiedMobile] = useState(false);

  // Edit form state
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mainBusinessAssets, setMainBusinessAssets] = useState('');
  const [projectType, setProjectType] = useState<ClientProjectType>('Video');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [due, setDue] = useState<number>(0);

  if (!client) return null;

  const startEdit = () => {
    setName(client.name || client.company || '');
    setMobileNumber(client.mobileNumber || client.phone || '');
    setMainBusinessAssets(client.mainBusinessAssets || '');
    setProjectType(client.projectType || 'Video');
    setTotalPrice(client.totalPrice || 0);
    setAdvance(client.advance || 0);
    setDue(client.due !== undefined ? client.due : Math.max(0, (client.totalPrice || 0) - (client.advance || 0)));
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const numTotal = Number(totalPrice) || 0;
    const numAdvance = Number(advance) || 0;
    const numDue = Number(due) >= 0 ? Number(due) : Math.max(0, numTotal - numAdvance);

    updateClient(client.id, {
      name: name.trim(),
      company: name.trim(),
      mobileNumber: mobileNumber.trim(),
      phone: mobileNumber.trim(),
      mainBusinessAssets: mainBusinessAssets.trim(),
      projectType,
      totalPrice: numTotal,
      advance: numAdvance,
      due: numDue,
    });
    setIsEditing(false);
  };

  const copyPhone = () => {
    const p = client.mobileNumber || client.phone || '';
    if (p) {
      navigator.clipboard.writeText(p);
      setCopiedMobile(true);
      setTimeout(() => setCopiedMobile(false), 2000);
    }
  };

  const projectBadgeConfig: Record<ClientProjectType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    Video: { label: 'Video', icon: Film, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    Image: { label: 'Image', icon: ImageIcon, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
    Campaign: { label: 'Campaign', icon: Megaphone, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
    Other: { label: 'Other', icon: MoreHorizontal, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  };

  const currentProj = (client.projectType && projectBadgeConfig[client.projectType]) || projectBadgeConfig.Video;
  const ProjectIcon = currentProj.icon;

  const currentDue = client.due !== undefined ? client.due : Math.max(0, (client.totalPrice || 0) - (client.advance || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-[#0e1017] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800/80 bg-zinc-900/60 flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-lg font-bold text-orange-400">
                {(client.name || client.company || 'C').charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-zinc-100">{client.name || client.company}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border flex items-center gap-1 ${currentProj.bg} ${currentProj.color}`}>
                  <ProjectIcon className="w-3 h-3" />
                  <span>{client.projectType || 'Video'}</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                {client.mobileNumber || client.phone || 'No mobile added'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={startEdit}
                className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
                title="Edit Client"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${client.name || client.company}?`)) {
                  deleteClient(client.id);
                  setSelectedClientId(null);
                }
              }}
              className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
              title="Delete Client"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedClientId(null)}
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Client Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Mobile Number *</label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Main Business Assets</label>
              <input
                type="text"
                value={mainBusinessAssets}
                onChange={(e) => setMainBusinessAssets(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Project Type</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Video', 'Image', 'Campaign', 'Other'] as ClientProjectType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProjectType(type)}
                    className={`py-2 px-2 rounded-xl border text-center font-semibold cursor-pointer ${
                      projectType === type
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300 block">Total Price (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={totalPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setTotalPrice(val);
                    setDue(Math.max(0, val - advance));
                  }}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 font-mono text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300 block">Advance (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={advance}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setAdvance(val);
                    setDue(Math.max(0, totalPrice - val));
                  }}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300 block">Due (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={due}
                  onChange={(e) => setDue(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-400 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 sm:p-6 space-y-5 text-xs">
            {/* Quick Contact & Action Buttons */}
            <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-zinc-200 font-semibold font-mono text-sm">
                  {client.mobileNumber || client.phone || 'N/A'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={copyPhone}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                >
                  {copiedMobile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMobile ? 'Copied!' : 'Copy'}</span>
                </button>

                {(client.mobileNumber || client.phone) && (
                  <>
                    <a
                      href={`tel:${client.mobileNumber || client.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center gap-1.5 transition-colors text-[11px]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${(client.mobileNumber || client.phone).replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors text-[11px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-zinc-950/70 rounded-2xl border border-zinc-800/80">
                <div className="text-[11px] text-zinc-400 font-medium">Total Price</div>
                <div className="text-base sm:text-lg font-bold text-zinc-100 font-mono mt-1">
                  ৳ {(client.totalPrice || 0).toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 bg-zinc-950/70 rounded-2xl border border-emerald-950/60 bg-emerald-950/10">
                <div className="text-[11px] text-emerald-400 font-medium">Advance Paid</div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-1">
                  ৳ {(client.advance || 0).toLocaleString()}
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border ${currentDue > 0 ? 'bg-amber-950/15 border-amber-900/40 text-amber-300' : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-400'}`}>
                <div className="text-[11px] font-medium">Due Amount</div>
                <div className={`text-base sm:text-lg font-bold font-mono mt-1 ${currentDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  ৳ {currentDue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Main Business Assets */}
            <div className="p-4 bg-zinc-950/70 rounded-2xl border border-zinc-800/80 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-orange-400" />
                <span>Main Business Assets</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-850">
                {client.mainBusinessAssets || 'No assets specified yet.'}
              </p>
            </div>

            {/* Project Details */}
            <div className="p-4 bg-zinc-950/70 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-400 block font-medium">Project Scope:</span>
                <span className="text-sm font-bold text-zinc-200">{client.projectType || 'Video'}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-zinc-400 block font-medium">Status:</span>
                <span className={`text-xs font-semibold ${currentDue === 0 && (client.totalPrice || 0) > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {currentDue === 0 && (client.totalPrice || 0) > 0 ? 'Fully Paid' : 'Due Pending'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
