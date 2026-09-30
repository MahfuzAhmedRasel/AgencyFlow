import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import { UserCircle, Mail, Phone, Calendar, Clock, CheckCircle2, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const UserProfileView: React.FC = () => {
  const { currentUser, tasks, isTaskOverdue } = useAgency();

  const myTasks = tasks.filter((t) => t.assignedEmployeeId === currentUser.id);
  const completed = myTasks.filter((t) => t.status === 'completed' || t.status === 'approved').length;
  const inProgress = myTasks.filter((t) => t.status === 'in_progress').length;
  const overdue = myTasks.filter((t) => isTaskOverdue(t)).length;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/40"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-zinc-100">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">{currentUser.employeeTitle}</p>
            <div className="text-[11px] text-zinc-500 flex items-center space-x-3 pt-1">
              <span>Member since {formatDate(currentUser.joinedDate)}</span>
              {currentUser.hourlyRate && (
                <span>• Base rate: ${currentUser.hourlyRate}/hr</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 text-center text-xs">
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">In Production</span>
            <span className="text-lg font-bold text-amber-400 font-mono mt-0.5 block">{inProgress}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Approved Work</span>
            <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5 block">{completed}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Overdue</span>
            <span className="text-lg font-bold text-red-400 font-mono mt-0.5 block">{overdue}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] mb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>{currentUser.email}</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{currentUser.phone || '+1 (555) 000-0000'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
