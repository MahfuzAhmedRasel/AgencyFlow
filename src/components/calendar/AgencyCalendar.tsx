import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Briefcase,
  CheckSquare,
  AlertTriangle,
  Filter,
  Plus,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const AgencyCalendar: React.FC = () => {
  const {
    visibleTasks,
    visibleProjects,
    clients,
    users,
    currentUser,
    setSelectedTaskId,
    setSelectedProjectId,
    setIsCreateProjectOpen,
    isTaskOverdue,
    openCreateTaskWithDate,
    canAssignTasks,
  } = useAgency();

  const [currentDate, setCurrentDate] = useState(new Date('2026-09-27'));
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'projects'>('all');

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-09-27'));
  };

  const handleDateClick = (dateStr: string) => {
    if (canAssignTasks) {
      setIsCreateProjectOpen(true);
    }
  };

  // Month grid calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // First day of month & total days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Calendar cells for Month view
  const daysInGrid = useMemo(() => {
    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const d = new Date(year, month - 1, dayNum);
      cells.push({
        dateStr: d.toISOString().split('T')[0],
        dayNum,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      cells.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill grid
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextMonthYear = month === 11 ? year + 1 : year;
      const nextMonthNum = month === 11 ? 1 : month + 2;
      const dateStr = `${nextMonthYear}-${String(nextMonthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      cells.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [year, month, firstDayIndex, totalDays]);

  // Days for Week view (7 days starting from Sunday)
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const days: { dateStr: string; dayNum: number; dayName: string; isToday: boolean }[] = [];
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNum: d.getDate(),
        dayName: names[i],
        isToday: dateStr === '2026-09-27',
      });
    }
    return days;
  }, [currentDate]);

  // Selected date string for Day view
  const singleDayStr = currentDate.toISOString().split('T')[0];

  // Map events to date strings
  const eventsByDate = useMemo(() => {
    const map: Record<
      string,
      {
        id: string;
        title: string;
        type: 'task' | 'project';
        clientName: string;
        status: string;
        isOverdue?: boolean;
        priority?: string;
      }[]
    > = {};

    if (filterType === 'all' || filterType === 'tasks') {
      visibleTasks.forEach((t) => {
        const dateKey = t.deadline.split('T')[0];
        if (!map[dateKey]) map[dateKey] = [];
        const client = clients.find((c) => c.id === t.clientId);
        map[dateKey].push({
          id: t.id,
          title: t.title,
          type: 'task',
          clientName: client?.company || 'Client',
          status: t.status,
          isOverdue: isTaskOverdue(t),
          priority: t.priority,
        });
      });
    }

    if (filterType === 'all' || filterType === 'projects') {
      visibleProjects.forEach((p) => {
        const dateKey = p.deadline
          ? (p.deadline.includes('T') ? p.deadline.split('T')[0] : p.deadline)
          : (p.endDate || p.startDate || '');
        if (!dateKey) return;
        if (!map[dateKey]) map[dateKey] = [];
        const client = clients.find((c) => c.id === p.clientId);
        map[dateKey].push({
          id: p.id,
          title: `[Project] ${p.name}`,
          type: 'project',
          clientName: client?.company || 'Client',
          status: p.status,
        });
      });
    }

    return map;
  }, [visibleTasks, visibleProjects, clients, filterType, isTaskOverdue]);

  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <span>Agency Production Calendar</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              {currentUser.role === 'employee' ? 'Personal Deadlines' : 'All Agency Deliveries'}
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Monitor creative deadlines, review milestones, and click any date to assign tasks.
          </p>
        </div>

        {/* View Mode & Controls */}
        <div className="flex items-center space-x-3">
          <div className="p-1 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === 'month' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === 'week' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === 'day' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Day
            </button>
          </div>

          {canAssignTasks && (
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-orange-500/30 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Date Click Hint Banner */}
      {canAssignTasks && (
        <div className="px-4 py-2.5 bg-orange-950/20 border border-orange-500/20 rounded-xl flex items-center justify-between text-xs text-orange-300">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              <strong>Click any date cell</strong> to schedule a new project campaign with that delivery deadline.
            </span>
          </div>
          <span className="text-[10px] font-mono text-orange-400/80 uppercase hidden sm:inline">
            Project Scheduling
          </span>
        </div>
      )}

      {/* Navigation Toolbar */}
      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-300"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-300"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300"
          >
            Today
          </button>
        </div>

        <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
          <span>
            {viewMode === 'day'
              ? formatDate(singleDayStr)
              : viewMode === 'week'
              ? `Week of ${formatDate(weekDays[0].dateStr)}`
              : monthName}
          </span>
        </h2>

        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Task</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Project</span>
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Overdue</span>
          </span>
        </div>
      </div>

      {/* VIEW MODE: MONTH GRID */}
      {viewMode === 'month' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Days of week */}
          <div className="grid grid-cols-7 bg-zinc-950 border-b border-zinc-800 text-center py-2.5 text-zinc-400 text-xs font-bold uppercase tracking-wider">
            {weekDayNames.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-zinc-800/60 bg-zinc-950/40">
            {daysInGrid.map((cell, idx) => {
              const events = eventsByDate[cell.dateStr] || [];
              const isToday = cell.dateStr === '2026-09-27';

              return (
                <div
                  key={idx}
                  onClick={() => handleDateClick(cell.dateStr)}
                  className={`min-h-[115px] p-2 flex flex-col justify-between transition-all relative group ${
                    canAssignTasks ? 'cursor-pointer hover:bg-zinc-900/80 hover:ring-1 hover:ring-indigo-500/40' : ''
                  } ${
                    !cell.isCurrentMonth
                      ? 'opacity-30 bg-zinc-950/80'
                      : isToday
                      ? 'bg-indigo-950/20'
                      : 'hover:bg-zinc-900/40'
                  }`}
                  title={canAssignTasks ? `Click to assign task for ${cell.dateStr}` : undefined}
                >
                  {/* Date header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm'
                          : cell.isCurrentMonth
                          ? 'text-zinc-300'
                          : 'text-zinc-600'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    <div className="flex items-center space-x-1">
                      {events.length > 0 && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {events.length}
                        </span>
                      )}

                      {/* Quick Add Task button on hover */}
                      {canAssignTasks && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateClick(cell.dateStr);
                          }}
                          className="w-5 h-5 rounded-md bg-zinc-800 hover:bg-indigo-600 text-zinc-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xs"
                          title={`Assign creative task for ${cell.dateStr}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Event Pills */}
                  <div className="space-y-1 mt-1.5 flex-1 overflow-y-auto max-h-[85px] pr-0.5">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (ev.type === 'task') setSelectedTaskId(ev.id);
                          if (ev.type === 'project') setSelectedProjectId(ev.id);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-medium truncate cursor-pointer transition-all hover:scale-[1.02] shadow-xs ${
                          ev.isOverdue
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                            : ev.type === 'project'
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/70'
                            : ev.status === 'under_review'
                            ? 'bg-purple-950/70 text-purple-300 border border-purple-800/70'
                            : 'bg-zinc-850 text-zinc-200 border border-zinc-700/80 hover:border-indigo-500/50'
                        }`}
                        title={`${ev.title} (${ev.clientName}) - Click to view`}
                      >
                        <div className="truncate font-semibold">{ev.title}</div>
                        <div className="text-[9px] opacity-75 truncate">{ev.clientName}</div>
                      </div>
                    ))}
                  </div>

                  {/* Empty state hover hint */}
                  {events.length === 0 && canAssignTasks && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-indigo-400 font-medium text-center py-1">
                      + Click to assign
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE: WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 divide-x divide-zinc-800 bg-zinc-950/60">
            {weekDays.map((day) => {
              const events = eventsByDate[day.dateStr] || [];

              return (
                <div
                  key={day.dateStr}
                  className={`min-h-[380px] p-3 flex flex-col justify-between transition-colors group ${
                    day.isToday ? 'bg-indigo-950/20' : 'hover:bg-zinc-900/60'
                  }`}
                >
                  {/* Day Column Header */}
                  <div className="space-y-2 pb-2 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        {day.dayName}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold ${
                          day.isToday
                            ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center'
                            : 'text-zinc-200'
                        }`}
                      >
                        {day.dayNum}
                      </span>
                    </div>

                    {canAssignTasks && (
                      <button
                        type="button"
                        onClick={() => handleDateClick(day.dateStr)}
                        className="w-full py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-indigo-600 text-zinc-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Assign Task</span>
                      </button>
                    )}
                  </div>

                  {/* Day Events Column */}
                  <div
                    onClick={() => handleDateClick(day.dateStr)}
                    className={`flex-1 py-2 space-y-1.5 overflow-y-auto ${
                      canAssignTasks ? 'cursor-pointer' : ''
                    }`}
                  >
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (ev.type === 'task') setSelectedTaskId(ev.id);
                          if (ev.type === 'project') setSelectedProjectId(ev.id);
                        }}
                        className={`p-2 rounded-xl text-xs font-medium cursor-pointer transition-all hover:scale-[1.02] border ${
                          ev.isOverdue
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                            : ev.type === 'project'
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/70'
                            : 'bg-zinc-850 text-zinc-200 border-zinc-700/80 hover:border-indigo-500'
                        }`}
                      >
                        <div className="font-semibold truncate">{ev.title}</div>
                        <div className="text-[10px] text-zinc-400 truncate mt-0.5">{ev.clientName}</div>
                      </div>
                    ))}

                    {events.length === 0 && (
                      <div className="h-full flex items-center justify-center text-center text-zinc-600 text-[11px] p-2">
                        No deadlines
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE: DAY VIEW */}
      {viewMode === 'day' && (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-400" />
                <span>{formatDate(singleDayStr)}</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Daily schedule, review milestones, and creative deliveries
              </p>
            </div>

            {canAssignTasks && (
              <button
                type="button"
                onClick={() => handleDateClick(singleDayStr)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Assign Task for this Day</span>
              </button>
            )}
          </div>

          {/* Events for this specific day */}
          <div className="space-y-3">
            {(eventsByDate[singleDayStr] || []).length === 0 ? (
              <div className="p-12 text-center bg-zinc-950/50 rounded-2xl border border-zinc-800/60 space-y-3">
                <CalendarIcon className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 text-xs">No deadlines or deliveries scheduled for this day.</p>
                {canAssignTasks && (
                  <button
                    onClick={() => handleDateClick(singleDayStr)}
                    className="px-4 py-2 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign Task Now</span>
                  </button>
                )}
              </div>
            ) : (
              (eventsByDate[singleDayStr] || []).map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    if (ev.type === 'task') setSelectedTaskId(ev.id);
                    if (ev.type === 'project') setSelectedProjectId(ev.id);
                  }}
                  className="p-4 bg-zinc-950 hover:bg-zinc-850 rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                        {ev.title}
                      </span>
                      {ev.isOverdue && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono uppercase font-bold">
                          Overdue
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400">
                      Client: <strong className="text-zinc-300">{ev.clientName}</strong>
                    </div>
                  </div>

                  <span className="text-xs text-indigo-400 font-medium">View Details →</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
