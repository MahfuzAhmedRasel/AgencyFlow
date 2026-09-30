import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  Plus,
  Phone,
  Film,
  Image as ImageIcon,
  Megaphone,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ClientProjectType } from '../../types';

export const CallCenterDashboard: React.FC = () => {
  const {
    currentUser,
    visibleClients,
    setCurrentTab,
    setIsCreateClientOpen,
    setSelectedClientId,
  } = useAgency();

  // Compute key metrics for Call Center
  const totalClientsCount = visibleClients.length;

  const totalRevenue = visibleClients.reduce((sum, c) => sum + (c.totalPrice || 0), 0);
  const totalAdvance = visibleClients.reduce((sum, c) => sum + (c.advance || 0), 0);
  const totalDue = visibleClients.reduce((sum, c) => {
    const dueVal = c.due !== undefined ? c.due : Math.max(0, (c.totalPrice || 0) - (c.advance || 0));
    return sum + dueVal;
  }, 0);

  // Project breakdown
  const videoCount = visibleClients.filter((c) => (c.projectType || 'Video') === 'Video').length;
  const imageCount = visibleClients.filter((c) => c.projectType === 'Image').length;
  const campaignCount = visibleClients.filter((c) => c.projectType === 'Campaign').length;
  const otherCount = visibleClients.filter((c) => c.projectType === 'Other').length;

  // Recent 6 clients
  const recentClients = visibleClients.slice(0, 6);

  const projectBadgeConfig: Record<ClientProjectType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    Video: { label: 'Video', icon: Film, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    Image: { label: 'Image', icon: ImageIcon, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
    Campaign: { label: 'Campaign', icon: Megaphone, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
    Other: { label: 'Other', icon: MoreHorizontal, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900 to-orange-950/30 p-6 rounded-3xl border border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Call Center Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track client acquisition, project type pipelines, and advance payments.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreateClientOpen(true)}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center space-x-2 cursor-pointer hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clients */}
        <div
          onClick={() => setCurrentTab('clients')}
          className="p-5 bg-zinc-900/90 hover:bg-zinc-850 rounded-2xl border border-zinc-800 hover:border-orange-500/40 cursor-pointer transition-all space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>Total Clients</span>
            <Users className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-100 font-mono">
            {totalClientsCount}
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Client directory</span>
            <span className="text-orange-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ChevronRightIcon className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Total Price / Value */}
        <div className="p-5 bg-zinc-900/90 rounded-2xl border border-zinc-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>Total Price</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-100 font-mono">
            ৳ {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500">
            Total deals value
          </div>
        </div>

        {/* Total Advance */}
        <div className="p-5 bg-zinc-900/90 rounded-2xl border border-zinc-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>Total Advance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            ৳ {totalAdvance.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400/80">
            Advance payments received
          </div>
        </div>

        {/* Total Due */}
        <div className="p-5 bg-zinc-900/90 rounded-2xl border border-zinc-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>Total Due</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${totalDue > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
            ৳ {totalDue.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400/80">
            Pending collection
          </div>
        </div>
      </div>

      {/* Project Distribution Mini Bar */}
      <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-2.5">
        <div className="text-xs font-semibold text-zinc-300">
          Projects Breakdown by Category
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-zinc-950/70 rounded-xl border border-purple-500/20 flex items-center justify-between">
            <span className="text-purple-300 font-medium flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" /> Video
            </span>
            <span className="font-mono font-bold text-zinc-100">{videoCount}</span>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-pink-500/20 flex items-center justify-between">
            <span className="text-pink-300 font-medium flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> Image
            </span>
            <span className="font-mono font-bold text-zinc-100">{imageCount}</span>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-orange-500/20 flex items-center justify-between">
            <span className="text-orange-300 font-medium flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5" /> Campaign
            </span>
            <span className="font-mono font-bold text-zinc-100">{campaignCount}</span>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-emerald-500/20 flex items-center justify-between">
            <span className="text-emerald-300 font-medium flex items-center gap-1.5">
              <MoreHorizontal className="w-3.5 h-3.5" /> Other
            </span>
            <span className="font-mono font-bold text-zinc-100">{otherCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Clients Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-100 tracking-tight">Recent Client Leads</h2>
          <button
            onClick={() => setCurrentTab('clients')}
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({visibleClients.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4 text-right">Total Price</th>
                  <th className="py-3 px-4 text-right">Advance</th>
                  <th className="py-3 px-4 text-right">Due</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {recentClients.map((client) => {
                  const projType = (client.projectType || 'Video') as ClientProjectType;
                  const config = projectBadgeConfig[projType] || projectBadgeConfig.Video;
                  const ProjIcon = config.icon;

                  const mobile = client.mobileNumber || client.phone || '';
                  const total = client.totalPrice || 0;
                  const adv = client.advance || 0;
                  const due = client.due !== undefined ? client.due : Math.max(0, total - adv);

                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className="hover:bg-zinc-850/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-semibold text-zinc-100">
                        {client.name || client.company}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-300">
                        {mobile || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.bg} ${config.color}`}>
                          <ProjIcon className="w-3 h-3" />
                          <span>{projType}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-zinc-200">
                        ৳ {total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-400">
                        ৳ {adv.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        <span className={due > 0 ? 'text-amber-400' : 'text-zinc-500'}>
                          ৳ {due.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
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
        </div>
      </div>
    </div>
  );
};

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
