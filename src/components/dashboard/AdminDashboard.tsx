import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Users,
  Briefcase,
  Clock,
  AlertTriangle,
  Receipt,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText,
  Activity,
  UserCheck,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const {
    clients,
    projects,
    users,
    invoices,
    activityLogs,
    setSelectedProjectId,
    setSelectedClientId,
    setCurrentTab,
    setIsCreateProjectOpen,
    setIsCreateClientOpen,
  } = useAgency();

  // Metrics calculations
  const totalClients = clients.length;
  const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'in_progress').length;
  const totalEmployees = users.filter((u) => u.active && u.role === 'employee').length;

  const planningProjects = projects.filter((p) => p.status === 'planning').length;
  const reviewProjects = projects.filter((p) => p.status === 'under_review').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const onHoldProjects = projects.filter((p) => p.status === 'on_hold').length;

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const outstandingAmount = invoices.reduce((acc, inv) => acc + inv.dueAmount, 0);

  // Employee team overview
  const employeeList = users
    .filter((u) => u.role === 'employee')
    .map((emp) => {
      const assignedProjCount = projects.filter(
        (p) => (p.assignedTo === emp.id || p.assignedManagerId === emp.id) && p.status !== 'completed'
      ).length;
      return {
        ...emp,
        assignedProjCount,
      };
    })
    .sort((a, b) => b.assignedProjCount - a.assignedProjCount);

  // Upcoming project deadlines
  const upcomingDeadlines = [...projects]
    .filter((p) => p.status !== 'completed' && p.status !== 'cancelled')
    .sort((a, b) => {
      const dateA = new Date(a.deadline || a.endDate || '').getTime() || 0;
      const dateB = new Date(b.deadline || b.endDate || '').getTime() || 0;
      return dateA - dateB;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Agency Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-orange-950/30 p-6 rounded-2xl border border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Command Center</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Agency Operations Overview
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Monitor client pipelines, campaign deliverables, team capacity, and financial health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/30 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>New Project</span>
          </button>
          <button
            onClick={() => setIsCreateClientOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Row 1: Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clients */}
        <div
          onClick={() => setCurrentTab('clients')}
          className="p-5 bg-zinc-900/90 hover:bg-zinc-850 rounded-2xl border border-zinc-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Total Clients
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-100 mt-2">{totalClients}</div>
          <div className="flex items-center text-[11px] text-emerald-400 mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Active client accounts</span>
          </div>
        </div>

        {/* Active Campaigns */}
        <div
          onClick={() => setCurrentTab('projects')}
          className="p-5 bg-zinc-900/90 hover:bg-zinc-850 rounded-2xl border border-zinc-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Active Campaigns
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-100 mt-2">{activeProjects}</div>
          <div className="flex items-center text-[11px] text-orange-400 mt-1">
            <span>{projects.length} total campaigns</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div
          onClick={() => setCurrentTab('invoices')}
          className="p-5 bg-zinc-900/90 hover:bg-zinc-850 rounded-2xl border border-zinc-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Collected Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-100 mt-2">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="flex items-center text-[11px] text-zinc-400 mt-1">
            <span>Due: {formatCurrency(outstandingAmount)}</span>
          </div>
        </div>

        {/* Team Members */}
        <div
          onClick={() => setCurrentTab('employees')}
          className="p-5 bg-zinc-900/90 hover:bg-zinc-850 rounded-2xl border border-zinc-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Active Team
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-100 mt-2">{totalEmployees}</div>
          <div className="flex items-center text-[11px] text-purple-400 mt-1">
            <span>Creative employees & staff</span>
          </div>
        </div>
      </div>

      {/* Row 2: Campaign & Project Pipeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>Campaign & Project Pipeline</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                  {projects.length} Total
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Current stages of all client marketing campaigns & deliverables
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('projects')}
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Distribution Bar */}
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden flex">
            {activeProjects > 0 && (
              <div
                style={{ width: `${(activeProjects / (projects.length || 1)) * 100}%` }}
                className="bg-emerald-500 h-full"
                title={`Active: ${activeProjects}`}
              />
            )}
            {planningProjects > 0 && (
              <div
                style={{ width: `${(planningProjects / (projects.length || 1)) * 100}%` }}
                className="bg-blue-500 h-full"
                title={`Planning: ${planningProjects}`}
              />
            )}
            {reviewProjects > 0 && (
              <div
                style={{ width: `${(reviewProjects / (projects.length || 1)) * 100}%` }}
                className="bg-purple-500 h-full"
                title={`Under Review: ${reviewProjects}`}
              />
            )}
            {completedProjects > 0 && (
              <div
                style={{ width: `${(completedProjects / (projects.length || 1)) * 100}%` }}
                className="bg-zinc-600 h-full"
                title={`Completed: ${completedProjects}`}
              />
            )}
            {onHoldProjects > 0 && (
              <div
                style={{ width: `${(onHoldProjects / (projects.length || 1)) * 100}%` }}
                className="bg-amber-500 h-full"
                title={`On Hold: ${onHoldProjects}`}
              />
            )}
          </div>

          {/* Status Mini Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
            <div
              onClick={() => setCurrentTab('projects')}
              className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 cursor-pointer hover:border-emerald-500/40 transition-colors"
            >
              <div className="text-[10px] font-semibold text-zinc-400 uppercase">Active</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">{activeProjects}</div>
            </div>

            <div
              onClick={() => setCurrentTab('projects')}
              className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 cursor-pointer hover:border-blue-500/40 transition-colors"
            >
              <div className="text-[10px] font-semibold text-zinc-400 uppercase">Planning</div>
              <div className="text-lg font-bold text-blue-400 mt-1">{planningProjects}</div>
            </div>

            <div
              onClick={() => setCurrentTab('projects')}
              className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 cursor-pointer hover:border-purple-500/40 transition-colors"
            >
              <div className="text-[10px] font-semibold text-zinc-400 uppercase">Reviewing</div>
              <div className="text-lg font-bold text-purple-400 mt-1">{reviewProjects}</div>
            </div>

            <div
              onClick={() => setCurrentTab('projects')}
              className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 cursor-pointer hover:border-amber-500/40 transition-colors"
            >
              <div className="text-[10px] font-semibold text-zinc-400 uppercase">On Hold</div>
              <div className="text-lg font-bold text-amber-400 mt-1">{onHoldProjects}</div>
            </div>

            <div
              onClick={() => setCurrentTab('projects')}
              className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 cursor-pointer hover:border-zinc-500/40 transition-colors"
            >
              <div className="text-[10px] font-semibold text-zinc-400 uppercase">Completed</div>
              <div className="text-lg font-bold text-zinc-300 mt-1">{completedProjects}</div>
            </div>
          </div>
        </div>

        {/* Employee Workload Meter */}
        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-400" />
              <span>Team Distribution</span>
            </h2>
            <button
              onClick={() => setCurrentTab('employees')}
              className="text-xs text-orange-400 hover:text-orange-300 cursor-pointer"
            >
              All Team
            </button>
          </div>

          <div className="space-y-3">
            {employeeList.slice(0, 5).map((emp) => {
              return (
                <div key={emp.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-200 font-medium truncate max-w-[140px]">
                      {emp.name}
                    </span>
                    <span className="font-mono text-zinc-400 text-[11px]">
                      {emp.assignedProjCount} projects
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (emp.assignedProjCount / 4) * 100)}%` }}
                      className="h-full bg-orange-500 rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Deadlines & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Campaign Deadlines */}
        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Upcoming Campaign Deadlines</span>
            </h2>
            <button
              onClick={() => setCurrentTab('projects')}
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-800/80">
            {upcomingDeadlines.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-500">
                No upcoming campaign deadlines on schedule
              </div>
            ) : (
              upcomingDeadlines.map((p) => {
                const client = clients.find((c) => c.id === p.clientId);
                const assignedUser = users.find((u) => u.id === p.assignedTo) ||
                  users.find((u) => u.id === p.assignedManagerId);

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className="py-3 flex items-center justify-between hover:bg-zinc-850/50 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="space-y-1 truncate pr-3">
                      <div className="text-xs font-semibold text-zinc-200 truncate">
                        {p.campaignName || p.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                        <span className="text-orange-400 font-medium">{client?.company || client?.name}</span>
                        <span>•</span>
                        <span>{assignedUser?.name || 'Unassigned'}</span>
                        <span>•</span>
                        <span className="text-zinc-500">{p.taskCategory || 'General'}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-medium text-amber-300">
                        {(p.deadline || p.endDate)?.split('T')[0] || '—'}
                      </div>
                      <div className="text-[10px] text-zinc-400 uppercase font-mono">
                        {p.priority || 'medium'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Agency Activity Feed */}
        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Activity Audit Trail</span>
            </h2>
            <span className="text-[11px] text-zinc-400 font-mono">Synced</span>
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-start space-x-3 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-zinc-200">{log.action}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-[10px] font-mono text-zinc-400">{log.userName}</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] truncate">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
