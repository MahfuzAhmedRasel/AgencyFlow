import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Columns,
  List,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Film,
  Palette,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { TaskStatus, TaskPriority } from '../../types';
import { formatDate, getTaskStatusConfig, getPriorityConfig } from '../../utils/formatters';

export const TaskList: React.FC = () => {
  const {
    visibleTasks,
    clients,
    projects,
    users,
    currentUser,
    setSelectedTaskId,
    setIsCreateTaskOpen,
    isTaskOverdue,
    canAssignTasks,
  } = useAgency();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return visibleTasks.filter((t) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description.toLowerCase().includes(query);
        const client = clients.find((c) => c.id === t.clientId);
        const matchesClient = client?.company.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesClient) return false;
      }

      if (statusFilter !== 'all') {
        if (statusFilter === 'overdue') {
          if (!isTaskOverdue(t)) return false;
        } else if (t.status !== statusFilter) {
          return false;
        }
      }

      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (clientFilter !== 'all' && t.clientId !== clientFilter) return false;
      if (employeeFilter !== 'all' && t.assignedEmployeeId !== employeeFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

      return true;
    });
  }, [
    visibleTasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    clientFilter,
    employeeFilter,
    categoryFilter,
    clients,
    isTaskOverdue,
  ]);

  const kanbanColumns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'assigned', title: 'To Do / Assigned', color: 'border-blue-500/40' },
    { id: 'in_progress', title: 'In Production', color: 'border-amber-500/40' },
    { id: 'under_review', title: 'Under Review', color: 'border-purple-500/40' },
    { id: 'revision_required', title: 'Revisions', color: 'border-rose-500/40' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-500/40' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <span>Creative Task Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              {filteredTasks.length} tasks
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage video edits, graphic design assets, client feedback, and revisions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View toggle */}
          <div className="p-1 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Kanban board view"
            >
              <Columns className="w-4 h-4" />
              <span className="hidden md:inline">Board</span>
            </button>
          </div>

          {canAssignTasks && (
            <button
              onClick={() => setIsCreateTaskOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, description, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="overdue">🚨 Overdue Only</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="under_review">Under Review</option>
            <option value="revision_required">Revision Required</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Employee Filter */}
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Team Members</option>
            {users
              .filter((u) => u.role === 'employee')
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.employeeTitle})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* View Rendering */}
      {viewMode === 'list' ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Task / Creative Scope</th>
                  <th className="py-3.5 px-4">Client & Project</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Deliverables</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                      No tasks found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const client = clients.find((c) => c.id === task.clientId);
                    const project = projects.find((p) => p.id === task.projectId);
                    const employee = users.find((u) => u.id === task.assignedEmployeeId);
                    const statusCfg = getTaskStatusConfig(task.status);
                    const priorityCfg = getPriorityConfig(task.priority);
                    const isOverdue = isTaskOverdue(task);
                    const latestDel = task.deliverables[task.deliverables.length - 1];

                    return (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className="hover:bg-zinc-850/60 cursor-pointer transition-colors group"
                      >
                        {/* Title & Category */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors truncate">
                            {task.title}
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono uppercase text-[10px]">
                              {task.category.replace('_', ' ')}
                            </span>
                            {task.revisionCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono">
                                Rev #{task.revisionCount}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Client & Project */}
                        <td className="py-3.5 px-4 truncate">
                          <div className="text-zinc-200 font-medium truncate">
                            {client?.company}
                          </div>
                          <div className="text-zinc-400 text-[11px] truncate">
                            {project?.name}
                          </div>
                        </td>

                        {/* Assignee */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <img
                              src={employee?.avatar}
                              alt={employee?.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                            <div className="truncate">
                              <span className="text-zinc-200 font-medium block truncate">
                                {employee?.name}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusCfg.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                            <span>{statusCfg.label}</span>
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${priorityCfg.bg}`}
                          >
                            {priorityCfg.label}
                          </span>
                        </td>

                        {/* Deadline */}
                        <td className="py-3.5 px-4">
                          <div
                            className={`font-mono text-xs ${
                              isOverdue ? 'text-red-400 font-bold flex items-center gap-1' : 'text-zinc-300'
                            }`}
                          >
                            {isOverdue && <AlertTriangle className="w-3.5 h-3.5" />}
                            <span>{formatDate(task.deadline)}</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            {task.estimatedHours}h est
                          </div>
                        </td>

                        {/* Deliverables */}
                        <td className="py-3.5 px-4">
                          {latestDel ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-indigo-300 font-mono bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded-md">
                              <span>v{latestDel.version}</span>
                              <span className="text-zinc-500">•</span>
                              <span className="truncate max-w-[80px]">{latestDel.fileName}</span>
                            </span>
                          ) : (
                            <span className="text-zinc-400 text-[11px] italic">None yet</span>
                          )}
                        </td>

                        {/* Action Arrow */}
                        <td className="py-3.5 px-4 text-right">
                          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400 transition-colors ml-auto" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => {
              if (col.id === 'assigned') return t.status === 'assigned' || t.status === 'pending';
              if (col.id === 'completed') return t.status === 'completed' || t.status === 'approved';
              return t.status === col.id;
            });

            return (
              <div
                key={col.id}
                className="bg-zinc-900/90 rounded-2xl border border-zinc-800 flex flex-col min-w-[260px] p-3 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-zinc-200">{col.title}</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-zinc-600 text-xs italic">
                      Empty column
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const client = clients.find((c) => c.id === task.clientId);
                      const employee = users.find((u) => u.id === task.assignedEmployeeId);
                      const isOverdue = isTaskOverdue(task);

                      return (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className={`p-3.5 bg-zinc-950 rounded-xl border hover:border-indigo-500/60 cursor-pointer transition-all space-y-2.5 ${col.color}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 truncate max-w-[150px]">
                              {client?.company}
                            </span>
                            {task.revisionCount > 0 && (
                              <span className="px-1.5 py-0.2 text-[9px] rounded bg-rose-500/20 text-rose-300 font-mono">
                                Rev #{task.revisionCount}
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-zinc-100 line-clamp-2">
                            {task.title}
                          </h4>

                          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px]">
                            <div className="flex items-center space-x-1.5">
                              <img
                                src={employee?.avatar}
                                alt={employee?.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="text-zinc-400 truncate max-w-[80px]">
                                {employee?.name.split(' ')[0]}
                              </span>
                            </div>

                            <span
                              className={`font-mono text-[10px] ${
                                isOverdue ? 'text-red-400 font-bold' : 'text-zinc-400'
                              }`}
                            >
                              {formatDate(task.deadline)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
