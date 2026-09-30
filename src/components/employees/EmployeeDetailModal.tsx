import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { User, TaskStatus } from '../../types';
import {
  X,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Briefcase,
  ChevronRight,
  Shield,
  Layers,
  Check,
  Edit3,
  Trash2,
} from 'lucide-react';
import { formatDate, getTaskStatusConfig } from '../../utils/formatters';

interface EmployeeDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const {
    tasks,
    clients,
    projects,
    setSelectedTaskId,
    isTaskOverdue,
    switchUser,
    deactivateUser,
    deleteUser,
    updateUser,
    currentUser,
    canManageTeam,
    setIsCreateTaskOpen,
  } = useAgency();

  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'pending' | 'completed' | 'overdue'>('all');

  if (!isOpen || !user) return null;

  // Filter tasks assigned to this employee
  const userTasks = tasks.filter((t) => t.assignedEmployeeId === user.id);

  const activeTasks = userTasks.filter(
    (t) =>
      t.status === 'in_progress' ||
      t.status === 'assigned' ||
      t.status === 'under_review' ||
      t.status === 'revision_required' ||
      t.status === 'submitted'
  );

  const pendingTasks = userTasks.filter((t) => t.status === 'pending');

  const completedTasks = userTasks.filter(
    (t) => t.status === 'completed' || t.status === 'approved'
  );

  const overdueTasks = userTasks.filter((t) => isTaskOverdue(t));

  const filteredTasks = userTasks.filter((t) => {
    if (taskFilter === 'active') {
      return (
        t.status === 'in_progress' ||
        t.status === 'assigned' ||
        t.status === 'under_review' ||
        t.status === 'revision_required' ||
        t.status === 'submitted'
      );
    }
    if (taskFilter === 'pending') {
      return t.status === 'pending';
    }
    if (taskFilter === 'completed') {
      return t.status === 'completed' || t.status === 'approved';
    }
    if (taskFilter === 'overdue') {
      return isTaskOverdue(t);
    }
    return true;
  });

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    onClose();
  };

  const handleSwitchToUser = () => {
    switchUser(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-zinc-900/90 border-b border-zinc-800 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-zinc-700 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-lg font-bold text-zinc-100">{user.name}</h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    user.role === 'admin'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : user.role === 'call_center' || user.role === 'manager'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {user.role === 'call_center' || user.role === 'manager' ? 'Call Center' : user.role}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    user.active
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                      : 'bg-rose-950/60 text-rose-400 border border-rose-800/80'
                  }`}
                >
                  {user.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs font-medium text-zinc-300 mt-0.5">{user.employeeTitle}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{user.email}</span>
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{user.phone}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Joined {formatDate(user.joinedDate)}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Workload KPI Stats (Active, Pending, Completed, Overdue) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              onClick={() => setTaskFilter('active')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                taskFilter === 'active'
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-sm'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px] font-medium">Active Tasks</span>
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-indigo-300 mt-1">
                {activeTasks.length}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">In Progress & Review</div>
            </div>

            <div
              onClick={() => setTaskFilter('pending')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                taskFilter === 'pending'
                  ? 'bg-amber-950/40 border-amber-500/50 shadow-sm'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px] font-medium">Pending Tasks</span>
                <Layers className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-amber-300 mt-1">
                {pendingTasks.length}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Awaiting Start</div>
            </div>

            <div
              onClick={() => setTaskFilter('completed')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                taskFilter === 'completed'
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px] font-medium">Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-emerald-300 mt-1">
                {completedTasks.length}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Approved & Delivered</div>
            </div>

            <div
              onClick={() => setTaskFilter('overdue')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                taskFilter === 'overdue'
                  ? 'bg-rose-950/40 border-rose-500/50 shadow-sm'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px] font-medium">Overdue</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl font-bold text-rose-300 mt-1">
                {overdueTasks.length}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Past Deadline</div>
            </div>
          </div>


          {/* Assigned Tasks Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-zinc-100">
                  Assigned Creative Tasks
                </span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono text-[10px]">
                  {userTasks.length} total
                </span>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-[11px] overflow-x-auto">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    taskFilter === 'all'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All ({userTasks.length})
                </button>
                <button
                  onClick={() => setTaskFilter('active')}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    taskFilter === 'active'
                      ? 'bg-indigo-900/60 text-indigo-200'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Active ({activeTasks.length})
                </button>
                <button
                  onClick={() => setTaskFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    taskFilter === 'pending'
                      ? 'bg-amber-900/60 text-amber-200'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Pending ({pendingTasks.length})
                </button>
                <button
                  onClick={() => setTaskFilter('completed')}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    taskFilter === 'completed'
                      ? 'bg-emerald-900/60 text-emerald-200'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Completed ({completedTasks.length})
                </button>
              </div>
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800/60 space-y-2">
                <p className="text-zinc-400 text-xs">No {taskFilter !== 'all' ? taskFilter : ''} tasks assigned to this employee.</p>
                {canManageTeam && (
                  <button
                    onClick={() => {
                      onClose();
                      setIsCreateTaskOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 mt-2"
                  >
                    <span>Assign Creative Task</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredTasks.map((task) => {
                  const client = clients.find((c) => c.id === task.clientId);
                  const project = projects.find((p) => p.id === task.projectId);
                  const statusCfg = getTaskStatusConfig(task.status);
                  const overdue = isTaskOverdue(task);

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      className="p-3.5 bg-zinc-900/70 hover:bg-zinc-850 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-1 overflow-hidden pr-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors truncate">
                            {task.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${statusCfg.bg}`}
                          >
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusCfg.dot} mr-1`} />
                            {statusCfg.label}
                          </span>
                          {overdue && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono uppercase font-bold">
                              Overdue
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                          {client && (
                            <span className="flex items-center gap-1">
                              <span className="text-zinc-500">Client:</span>
                              <strong className="text-zinc-300 font-medium">{client.company}</strong>
                            </span>
                          )}
                          {project && (
                            <span className="flex items-center gap-1">
                              <span className="text-zinc-500">Project:</span>
                              <strong className="text-zinc-300 font-medium">{project.name}</strong>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <span className="text-zinc-500">Deadline:</span>
                            <span className={overdue ? 'text-rose-400 font-semibold' : 'text-zinc-300'}>
                              {formatDate(task.deadline)}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium hidden sm:inline">
                          View Task
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            {/* Quick Switch to User Role */}
            <button
              onClick={handleSwitchToUser}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium flex items-center gap-1.5 transition-colors"
              title="Test the platform as this team member"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simulate Role</span>
            </button>

            {canManageTeam && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit?.(user)}
                  className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-orange-500/20"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Member</span>
                </button>

                {user.id !== currentUser.id && (
                  <button
                    type="button"
                    onClick={() => onDelete?.(user)}
                    className="px-3.5 py-2 rounded-xl border border-rose-800/80 bg-rose-950/30 text-rose-300 hover:bg-rose-950/60 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Member</span>
                  </button>
                )}
              </>
            )}

            {canManageTeam && user.id !== currentUser.id && (
              <button
                onClick={() => {
                  if (user.active) {
                    deactivateUser(user.id);
                  } else {
                    updateUser(user.id, { active: true });
                  }
                }}
                className={`px-3.5 py-2 rounded-xl border font-medium transition-colors ${
                  user.active
                    ? 'border-zinc-700 bg-zinc-850 text-zinc-400 hover:text-zinc-200'
                    : 'border-emerald-800/80 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/60'
                }`}
              >
                {user.active ? 'Deactivate' : 'Reactivate'}
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
