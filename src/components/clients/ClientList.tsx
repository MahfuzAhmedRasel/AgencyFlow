import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Users,
  Plus,
  Search,
  Phone,
  Briefcase,
  DollarSign,
  Film,
  Image as ImageIcon,
  Megaphone,
  MoreHorizontal,
  MessageCircle,
  Copy,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ClientProjectType } from '../../types';

export const ClientList: React.FC = () => {
  const {
    visibleClients,
    setSelectedClientId,
    setIsCreateClientOpen,
  } = useAgency();

  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [dueFilter, setDueFilter] = useState<'all' | 'due' | 'paid'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    return visibleClients.filter((c) => {
      // Search by name, mobile, or assets
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (c.name || c.company || '').toLowerCase().includes(q);
        const mobileMatch = (c.mobileNumber || c.phone || '').toLowerCase().includes(q);
        const assetsMatch = (c.mainBusinessAssets || '').toLowerCase().includes(q);
        if (!nameMatch && !mobileMatch && !assetsMatch) return false;
      }

      // Filter by Project
      if (projectFilter !== 'all') {
        const clientProj = c.projectType || 'Video';
        if (clientProj.toLowerCase() !== projectFilter.toLowerCase()) return false;
      }

      // Filter by Due
      const effectiveDue = c.due !== undefined ? c.due : Math.max(0, (c.totalPrice || 0) - (c.advance || 0));
      if (dueFilter === 'due' && effectiveDue <= 0) return false;
      if (dueFilter === 'paid' && effectiveDue > 0) return false;

      return true;
    });
  }, [visibleClients, searchQuery, projectFilter, dueFilter]);

  const handleCopyPhone = (id: string, phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const projectBadgeConfig: Record<ClientProjectType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    Video: { label: 'Video', icon: Film, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    Image: { label: 'Image', icon: ImageIcon, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
    Campaign: { label: 'Campaign', icon: Megaphone, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
    Other: { label: 'Other', icon: MoreHorizontal, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <span>Clients</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              {filteredClients.length} total
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Call Center Client Directory, Project Type & Payment Status
          </p>
        </div>

        <button
          onClick={() => setIsCreateClientOpen(true)}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center space-x-2 shrink-0 cursor-pointer hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by client name, mobile number, or business assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Project Type Filter */}
        <div className="flex items-center space-x-2 shrink-0">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Projects</option>
            <option value="Video">Video</option>
            <option value="Image">Image</option>
            <option value="Campaign">Campaign</option>
            <option value="Other">Other</option>
          </select>

          {/* Due Status Filter */}
          <select
            value={dueFilter}
            onChange={(e) => setDueFilter(e.target.value as any)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Payments</option>
            <option value="due">Due Pending</option>
            <option value="paid">Fully Paid</option>
          </select>
        </div>
      </div>

      {/* Clients Table / Cards */}
      {filteredClients.length === 0 ? (
        <div className="p-12 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800/80 space-y-3">
          <Users className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">No clients found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {searchQuery || projectFilter !== 'all' || dueFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Add your first client to start tracking contacts, project types, and payments.'}
          </p>
          <button
            onClick={() => setIsCreateClientOpen(true)}
            className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            + Add New Client
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-zinc-900/80 rounded-2xl border border-zinc-800 shadow-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4">Mobile Number</th>
                <th className="py-3.5 px-4">Main Business Assets</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4 text-right">Total Price</th>
                <th className="py-3.5 px-4 text-right">Advance</th>
                <th className="py-3.5 px-4 text-right">Due</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredClients.map((client) => {
                const clientProjType = (client.projectType || 'Video') as ClientProjectType;
                const projConfig = projectBadgeConfig[clientProjType] || projectBadgeConfig.Video;
                const ProjIcon = projConfig.icon;

                const mobile = client.mobileNumber || client.phone || '';
                const totalPriceVal = client.totalPrice || 0;
                const advanceVal = client.advance || 0;
                const dueVal = client.due !== undefined ? client.due : Math.max(0, totalPriceVal - advanceVal);

                return (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className="hover:bg-zinc-850/60 transition-colors cursor-pointer group"
                  >
                    {/* 1. Client Name */}
                    <td className="py-3.5 px-4 font-bold text-zinc-100 group-hover:text-orange-400 transition-colors">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center shrink-0 border border-orange-500/20">
                          {(client.name || client.company || 'C').charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[160px] sm:max-w-none">
                          {client.name || client.company}
                        </span>
                      </div>
                    </td>

                    {/* 2. Mobile Number */}
                    <td className="py-3.5 px-4 text-zinc-300 font-mono">
                      {mobile ? (
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <span>{mobile}</span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyPhone(client.id, mobile, e)}
                            className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
                            title="Copy number"
                          >
                            {copiedId === client.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={`https://wa.me/${mobile.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-zinc-500 hover:text-emerald-400 transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-zinc-600">N/A</span>
                      )}
                    </td>

                    {/* 3. Main Business Assets */}
                    <td className="py-3.5 px-4 text-zinc-400 max-w-[200px] truncate" title={client.mainBusinessAssets}>
                      {client.mainBusinessAssets || '—'}
                    </td>

                    {/* 4. Project (Video | Image | Campaign | Other) */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${projConfig.bg} ${projConfig.color}`}>
                        <ProjIcon className="w-3.5 h-3.5" />
                        <span>{clientProjType}</span>
                      </span>
                    </td>

                    {/* 5. Total Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-zinc-200">
                      ৳ {totalPriceVal.toLocaleString()}
                    </td>

                    {/* 6. Advance */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-400">
                      ৳ {advanceVal.toLocaleString()}
                    </td>

                    {/* 7. Due */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={dueVal > 0 ? 'text-amber-400' : 'text-zinc-500'}>
                        ৳ {dueVal.toLocaleString()}
                      </span>
                      {dueVal === 0 && totalPriceVal > 0 && (
                        <span className="block text-[10px] text-emerald-400 font-sans font-medium">
                          Paid
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClientId(client.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-orange-500 text-zinc-300 hover:text-white transition-all text-[11px] font-semibold cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
