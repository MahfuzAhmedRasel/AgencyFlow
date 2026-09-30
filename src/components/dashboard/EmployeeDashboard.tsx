import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Briefcase,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Tag,
  User,
  ExternalLink,
} from 'lucide-react';
import { TaskPriority } from '../../types';

export const EmployeeDashboard: React.FC = () => {
  const {
    currentUser,
    projects,
    clients,
    notifications,
    setSelectedProjectId,
    setCurrentTab,
  } = useAgency();

  // Employee only tracks projects / campaigns created by admin and assigned to them
  const myProjects = projects.filter((p) => p.assignedTo === currentUser.id);

  const activeProjects = myProjects.filter((p) => p.status === 'active' || p.status === 'in_progress');
  const underReview = myProjects.filter((p) => p.status === 'under_review');
  const completed = myProjects.filter((p) => p.status === 'completed');
  const planning = myProjects.filter((p) => p.status === 'planning');

  // Deadlines sorted
  const myDeadlines = [...myProjects]
    .filter((p) => p.status !== 'completed' && p.status !== 'cancelled')
    .sort((a, b) => {
      const dateA = new Date(a.deadline || a.endDate || '').getTime() || 0;
      const dateB = new Date(b.deadline || b.endDate || '').getTime() || 0;
      return dateA - dateB;
    })
    .slice(0, 6);

  const priorityBadgeConfig: Record<TaskPriority, { label: string; color: string; bg: string }> = {
    low: { label: 'Low', color: 'text-zinc-400', bg: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
    medium: { label: 'Medium', color: 'text-blue-400', bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
    high: { label: 'High', color: 'text-amber-400', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    urgent: { label: 'Urgent', color: 'text-rose-400', bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
  };

  const statusBadgeConfig: Record<string, { label: string; bg: string }> = {
    active: { label: 'Active', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    in_progress: { label: 'In Progress', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    planning: { label: 'Planning', bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
    under_review: { label: 'Under Review', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
    completed: { label: 'Completed', bg: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
    on_hold: { label: 'On Hold', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900 to-orange-950/30 p-6 rounded-2xl border border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Workspace</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Welcome back, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {currentUser.employeeTitle} • Focus on your assigned project deliverables and deadlines.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('projects')}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/30 transition-all flex items-center space-x-2 self-start md:self-auto cursor-pointer"
        >
          <Briefcase className="w-4 h-4" />
          <span>My Projects ({myProjects.length})</span>
        </button>
      </div>

      {/* Review Alert Banner */}
      {underReview.length > 0 && (
        <div className="p-4 bg-purple-950/30 border border-purple-800/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Deliverables In Review ({underReview.length})
              </span>
              <p className="text-xs text-zinc-300 mt-0.5">
                {underReview[0].campaignName || underReview[0].name} is currently awaiting QA and director signoff.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedProjectId(underReview[0].id)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
          >
            View Project
          </button>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assigned */}
        <div
          onClick={() => setCurrentTab('projects')}
          className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-orange-500/40 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>My Projects</span>
            <Briefcase className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{myProjects.length}</div>
          <div className="text-[11px] text-zinc-500">Total assigned campaigns</div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => setCurrentTab('projects')}
          className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-emerald-500/40 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{activeProjects.length}</div>
          <div className="text-[11px] text-emerald-400/80">Active deliverables</div>
        </div>

        {/* Under Review */}
        <div
          onClick={() => setCurrentTab('projects')}
          className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-purple-500/40 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>Under Review</span>
            <Clock className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">{underReview.length}</div>
          <div className="text-[11px] text-purple-400/80">Director QA signoff</div>
        </div>

        {/* Completed */}
        <div
          onClick={() => setCurrentTab('projects')}
          className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-zinc-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-zinc-300 font-mono">{completed.length}</div>
          <div className="text-[11px] text-zinc-500">Delivered & approved</div>
        </div>
      </div>

      {/* Projects Table / Deadlines */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>My Project Deliverables & Deadlines</span>
          </h2>
          <button
            onClick={() => setCurrentTab('projects')}
            className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myDeadlines.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 text-xs text-zinc-400">
            No active project deliverables assigned at the moment.
          </div>
        ) : (
          <div className="overflow-x-auto bg-zinc-900/80 rounded-2xl border border-zinc-800 shadow-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Campaign Name</th>
                  <th className="py-3 px-4">Task Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {myDeadlines.map((p) => {
                  const priority = (p.priority || 'medium') as TaskPriority;
                  const priorityCfg = priorityBadgeConfig[priority] || priorityBadgeConfig.medium;
                  const statusCfg = statusBadgeConfig[p.status] || {
                    label: p.status,
                    bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                  };

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className="hover:bg-zinc-850/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-bold text-zinc-100 group-hover:text-orange-400 transition-colors">
                        {p.campaignName || p.name}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                          <Tag className="w-3 h-3 text-orange-400" />
                          <span>{p.taskCategory || 'Deliverable'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${priorityCfg.bg}`}>
                          {priorityCfg.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                        {p.assignedDate || p.startDate || '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${statusCfg.bg}`}>
                          {statusCfg.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-amber-300 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{(p.deadline || p.endDate)?.split('T')[0] || '—'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProjectId(p.id);
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
    </div>
  );
};
