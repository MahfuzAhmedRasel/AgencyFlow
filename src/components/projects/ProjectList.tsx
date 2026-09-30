import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  AlertCircle,
  Filter,
  ChevronRight,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { ProjectStatus, TaskPriority } from '../../types';

export const ProjectList: React.FC = () => {
  const {
    visibleProjects,
    clients,
    users,
    currentUser,
    setSelectedProjectId,
    setIsCreateProjectOpen,
    canAssignTasks,
    projectCategories,
  } = useAgency();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return visibleProjects.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (p.campaignName || p.name || '').toLowerCase().includes(q);
        const matchesCat = (p.taskCategory || '').toLowerCase().includes(q);
        const matchesAssigned = (p.assignedToName || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesAssigned) return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (categoryFilter !== 'all') {
        const pCat = (p.taskCategory || '').toLowerCase();
        const fCat = categoryFilter.toLowerCase();
        const matchesCategory =
          pCat === fCat ||
          (fCat === 'video editor' && pCat === 'video editing') ||
          (fCat === 'graphic designer' && pCat === 'graphic design');
        if (!matchesCategory) return false;
      }
      return true;
    });
  }, [visibleProjects, searchQuery, statusFilter, categoryFilter]);

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

  const formatDeadlineDisplay = (deadlineStr?: string) => {
    if (!deadlineStr) return '—';
    try {
      if (deadlineStr.includes('T')) {
        const [d] = deadlineStr.split('T');
        return d;
      }
      return deadlineStr;
    } catch {
      return deadlineStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <span>{currentUser.role === 'employee' ? 'My Assigned Projects' : 'Projects & Campaigns'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              {filteredProjects.length} total
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {currentUser.role === 'employee'
              ? 'Creative campaigns and deliverables assigned to you by admin.'
              : 'Manage campaign tasks, assignees, priorities, schedules, and delivery deadlines.'}
          </p>
        </div>

        {currentUser.role !== 'employee' && (
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center space-x-2 shrink-0 cursor-pointer hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by campaign name, category, or assigned member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-orange-500"
        >
          <option value="all">All Categories</option>
          {projectCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-orange-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="planning">Planning</option>
          <option value="under_review">Under Review</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      {/* Projects Table */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800/80 space-y-3">
          <Briefcase className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">No projects found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : currentUser.role === 'employee'
              ? 'You do not have any projects assigned by the admin yet. Newly assigned campaigns will appear here.'
              : 'Create your first project to start tracking campaign tasks and deadlines.'}
          </p>
          {currentUser.role !== 'employee' && (
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              + Create New Project
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-zinc-900/80 rounded-2xl border border-zinc-800 shadow-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Campaign Name</th>
                <th className="py-3.5 px-4">Task Category</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Assigned Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProjects.map((project) => {
                const assignedUser = users.find((u) => u.id === project.assignedTo) ||
                  users.find((u) => u.id === project.assignedManagerId);
                const assignedName = assignedUser?.name || project.assignedToName || 'Unassigned';

                const priority = (project.priority || 'medium') as TaskPriority;
                const priorityCfg = priorityBadgeConfig[priority] || priorityBadgeConfig.medium;

                const statusCfg = statusBadgeConfig[project.status] || {
                  label: project.status,
                  bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                };

                const campaignName = project.campaignName || project.name;
                const taskCategory = project.taskCategory || 'General Deliverable';
                const assignedDate = project.assignedDate || project.startDate || '—';
                const deadlineDisplay = formatDeadlineDisplay(project.deadline || project.endDate);

                return (
                  <tr
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className="hover:bg-zinc-850/60 transition-colors cursor-pointer group"
                  >
                    {/* 1. Campaign Name */}
                    <td className="py-3.5 px-4 font-bold text-zinc-100 group-hover:text-orange-400 transition-colors">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center shrink-0 border border-orange-500/20">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="truncate max-w-[220px] sm:max-w-none">
                          {campaignName}
                        </span>
                      </div>
                    </td>

                    {/* 2. Task Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                        <Tag className="w-3 h-3 text-orange-400" />
                        <span>{taskCategory}</span>
                      </span>
                    </td>

                    {/* 3. Assigned To */}
                    <td className="py-3.5 px-4 text-zinc-300">
                      <div className="flex items-center space-x-2">
                        {assignedUser?.avatar ? (
                          <img
                            src={assignedUser.avatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[10px] font-bold">
                            {assignedName.charAt(0)}
                          </div>
                        )}
                        <span className="truncate max-w-[130px] font-medium">{assignedName}</span>
                      </div>
                    </td>

                    {/* 4. Priority */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${priorityCfg.bg}`}>
                        {priorityCfg.label}
                      </span>
                    </td>

                    {/* 5. Assigned Date */}
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                      {assignedDate}
                    </td>

                    {/* 6. Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${statusCfg.bg}`}>
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* 7. Deadline */}
                    <td className="py-3.5 px-4 font-mono text-amber-300 font-medium">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{deadlineDisplay}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProjectId(project.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-orange-500 text-zinc-300 hover:text-white transition-all text-[11px] font-semibold cursor-pointer"
                      >
                        Details
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
