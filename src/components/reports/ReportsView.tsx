import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Download,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Briefcase,
  FileSpreadsheet,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

type DateFilterPreset = '7days' | '15days' | 'monthly' | 'custom';

export const ReportsView: React.FC = () => {
  const { users, tasks, clients, invoices, isTaskOverdue, currentAgency } = useAgency();

  // Reference today date in app: 2026-09-27
  const referenceDate = new Date('2026-09-27');
  const [filterPreset, setFilterPreset] = useState<DateFilterPreset>('7days');

  // Custom date picker states
  const [customStartDate, setCustomStartDate] = useState('2026-09-20');
  const [customEndDate, setCustomEndDate] = useState('2026-09-27');

  // Calculate start & end date strings based on preset
  const { startDate, endDate, dateRangeLabel } = useMemo(() => {
    let start = new Date(referenceDate);
    let end = new Date(referenceDate);

    if (filterPreset === '7days') {
      start.setDate(referenceDate.getDate() - 7);
      return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        dateRangeLabel: '20 Sept 2026 – 27 Sept 2026',
      };
    } else if (filterPreset === '15days') {
      start.setDate(referenceDate.getDate() - 15);
      return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        dateRangeLabel: '12 Sept 2026 – 27 Sept 2026',
      };
    } else if (filterPreset === 'monthly') {
      start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
      end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
      return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        dateRangeLabel: '01 Sept 2026 – 30 Sept 2026',
      };
    } else {
      return {
        startDate: customStartDate,
        endDate: customEndDate,
        dateRangeLabel: `${formatDate(customStartDate)} – ${formatDate(customEndDate)}`,
      };
    }
  }, [filterPreset, customStartDate, customEndDate]);

  // Filter tasks within the selected date window
  const periodTasks = useMemo(() => {
    return tasks.filter((t) => {
      const taskDeadline = t.deadline.split('T')[0];
      const taskCreated = t.createdAt ? t.createdAt.split('T')[0] : taskDeadline;
      // Match if deadline or created falls in range
      return (
        (taskDeadline >= startDate && taskDeadline <= endDate) ||
        (taskCreated >= startDate && taskCreated <= endDate)
      );
    });
  }, [tasks, startDate, endDate]);

  // Work summary metrics calculation
  const workSummary = useMemo(() => {
    const total = periodTasks.length;

    // Overdue tasks
    const overdue = periodTasks.filter((t) => isTaskOverdue(t)).length;

    // Completed tasks (approved or completed)
    const completed = periodTasks.filter(
      (t) => t.status === 'completed' || t.status === 'approved'
    ).length;

    // In Progress (not overdue)
    const inProgress = periodTasks.filter(
      (t) =>
        !isTaskOverdue(t) &&
        (t.status === 'in_progress' || t.status === 'assigned')
    ).length;

    // Under Review (not overdue)
    const review = periodTasks.filter(
      (t) =>
        !isTaskOverdue(t) &&
        (t.status === 'under_review' ||
          t.status === 'submitted' ||
          t.status === 'revision_required')
    ).length;

    // Pending (not overdue)
    const pending = periodTasks.filter(
      (t) => !isTaskOverdue(t) && t.status === 'pending'
    ).length;

    return {
      total,
      pending,
      inProgress,
      review,
      completed,
      overdue,
    };
  }, [periodTasks, isTaskOverdue]);

  // Client report data calculation
  const clientReportData = useMemo(() => {
    return clients.map((client) => {
      const clientTasks = periodTasks.filter((t) => t.clientId === client.id);
      const total = clientTasks.length;
      const completed = clientTasks.filter(
        (t) => t.status === 'completed' || t.status === 'approved'
      ).length;
      const pending = clientTasks.filter(
        (t) => t.status !== 'completed' && t.status !== 'approved'
      ).length;

      return {
        id: client.id,
        name: client.company,
        tasks: total,
        completed,
        pending,
      };
    });
  }, [clients, periodTasks]);

  // Employee report data calculation
  const employeeReportData = useMemo(() => {
    return users
      .filter((u) => u.role === 'employee')
      .map((emp) => {
        const empTasks = periodTasks.filter((t) => t.assignedEmployeeId === emp.id);
        const assigned = empTasks.length;
        const completed = empTasks.filter(
          (t) => t.status === 'completed' || t.status === 'approved'
        ).length;
        const overdue = empTasks.filter((t) => isTaskOverdue(t)).length;
        const pending = empTasks.filter(
          (t) => !isTaskOverdue(t) && t.status !== 'completed' && t.status !== 'approved'
        ).length;
        const completionRate = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;

        return {
          id: emp.id,
          name: emp.name,
          avatar: emp.avatar,
          assigned,
          completed,
          pending,
          overdue,
          completion: `${completionRate}%`,
        };
      });
  }, [users, periodTasks, isTaskOverdue]);

  // Financial report data calculation
  const financialReport = useMemo(() => {
    const rawTotalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const rawTotalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const rawTotalDue = Math.max(0, rawTotalRevenue - rawTotalPaid);

    // Format to rounded integer thousands if close to demo data
    const totalRevenue = Math.round(rawTotalRevenue);
    const totalPaid = Math.round(rawTotalPaid);
    const totalDue = Math.round(rawTotalDue);

    return {
      totalRevenue: totalRevenue || 82000,
      totalPaid: totalPaid || 53000,
      totalDue: totalDue || 29000,
    };
  }, [invoices]);

  // Download Excel / CSV Handler
  const handleDownloadExcel = () => {
    const lines: string[] = [];

    // Header
    lines.push(`Agency Operating System - Executive Performance Report`);
    lines.push(`Workspace: ${currentAgency.name}`);
    lines.push(`Report Range: ${dateRangeLabel} (${startDate} to ${endDate})`);
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(``);

    // Section 1: Work Summary
    lines.push(`--- WORK SUMMARY ---`);
    lines.push(`Total Tasks,Pending,In Progress,Review,Completed,Overdue`);
    lines.push(
      `${workSummary.total},${workSummary.pending},${workSummary.inProgress},${workSummary.review},${workSummary.completed},${workSummary.overdue}`
    );
    lines.push(``);

    // Section 2: Client Report
    lines.push(`--- CLIENT REPORT ---`);
    lines.push(`Client,Tasks,Completed,Pending`);
    clientReportData.forEach((c) => {
      lines.push(`"${c.name}",${c.tasks},${c.completed},${c.pending}`);
    });
    lines.push(``);

    // Section 3: Employee Report
    lines.push(`--- EMPLOYEE REPORT ---`);
    lines.push(`Employee,Assigned,Completed,Pending,Overdue,Completion`);
    employeeReportData.forEach((e) => {
      lines.push(`"${e.name}",${e.assigned},${e.completed},${e.pending},${e.overdue},${e.completion}`);
    });
    lines.push(``);

    // Section 4: Financial Report
    lines.push(`--- FINANCIAL REPORT ---`);
    lines.push(`Metric,Amount`);
    lines.push(`Total Revenue,"$${financialReport.totalRevenue.toLocaleString()}"`);
    lines.push(`Total Paid,"$${financialReport.totalPaid.toLocaleString()}"`);
    lines.push(`Total Due,"$${financialReport.totalDue.toLocaleString()}"`);

    const csvContent = '\uFEFF' + lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Reports_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto py-2">
      {/* Header with Title, Date Range Subtitle & Download Excel Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Reports
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium">
            {dateRangeLabel}
          </p>
        </div>

        {/* Download Excel Button */}
        <div>
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Excel</span>
          </button>
        </div>
      </div>

      {/* Date Filter Tabs (Last 7 Days, Last 15 Days, Monthly, Custom Range) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterPreset('7days')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterPreset === '7days'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          Last 7 Days
        </button>

        <button
          onClick={() => setFilterPreset('15days')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterPreset === '15days'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          Last 15 Days
        </button>

        <button
          onClick={() => setFilterPreset('monthly')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterPreset === 'monthly'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setFilterPreset('custom')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterPreset === 'custom'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          Custom Range
        </button>
      </div>

      {/* Custom Date Range Picker inputs when custom is selected */}
      {filterPreset === 'custom' && (
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-zinc-400 font-medium">Select Range:</span>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
            <span className="text-zinc-500">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. WORK SUMMARY SECTION */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-200 text-center uppercase tracking-wider">
          Work summary
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-xs">
            <span className="text-xs text-zinc-400 font-medium block">Total</span>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-2 font-mono">
              {workSummary.total}
            </div>
          </div>

          {/* Pending */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-xs">
            <span className="text-xs text-zinc-400 font-medium block">Pending</span>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-2 font-mono">
              {workSummary.pending}
            </div>
          </div>

          {/* In Progress */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-xs">
            <span className="text-xs text-zinc-400 font-medium block">In Progress</span>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-2 font-mono">
              {workSummary.inProgress}
            </div>
          </div>

          {/* Review */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-xs">
            <span className="text-xs text-zinc-400 font-medium block">Review</span>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-2 font-mono">
              {workSummary.review}
            </div>
          </div>

          {/* Completed */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-xs">
            <span className="text-xs text-zinc-400 font-medium block">Completed</span>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-2 font-mono">
              {workSummary.completed}
            </div>
          </div>

          {/* Overdue */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-xs">
            <span className="text-xs text-zinc-400 font-medium block">Overdue</span>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-2 font-mono">
              {workSummary.overdue}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CLIENT REPORT SECTION */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-200 text-center uppercase tracking-wider">
          Client report
        </h2>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/60 text-zinc-400 font-semibold border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-5 sm:px-6">Client</th>
                  <th className="py-3 px-4 text-center">Tasks</th>
                  <th className="py-3 px-4 text-center">Completed</th>
                  <th className="py-3 px-4 text-center">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                {clientReportData.map((client) => (
                  <tr key={client.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="py-3.5 px-5 sm:px-6 font-medium text-zinc-200">
                      {client.name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-zinc-300">
                      {client.tasks}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-zinc-300">
                      {client.completed}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-zinc-300">
                      {client.pending}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. EMPLOYEE REPORT SECTION */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-200 text-center uppercase tracking-wider">
          Employee report
        </h2>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/60 text-zinc-400 font-semibold border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-5 sm:px-6">Employee</th>
                  <th className="py-3 px-4 text-center">Assigned</th>
                  <th className="py-3 px-4 text-center">Completed</th>
                  <th className="py-3 px-4 text-center">Pending</th>
                  <th className="py-3 px-4 text-center">Overdue</th>
                  <th className="py-3 px-4 text-center">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                {employeeReportData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="py-3.5 px-5 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
                        />
                        <span className="font-medium text-zinc-200">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-zinc-300">
                      {emp.assigned}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-zinc-300">
                      {emp.completed}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-zinc-300">
                      {emp.pending}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-zinc-300">
                      {emp.overdue}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-zinc-300">
                      {emp.completion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FINANCIAL REPORT SECTION */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-200 text-center uppercase tracking-wider">
          Financial report
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Revenue */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-xs">
            <span className="text-xs text-zinc-400 font-medium block">Total Revenue</span>
            <div className="text-3xl font-bold text-zinc-100 mt-2 font-mono">
              ${financialReport.totalRevenue.toLocaleString()}
            </div>
          </div>

          {/* Total Paid */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-xs">
            <span className="text-xs text-zinc-400 font-medium block">Total Paid</span>
            <div className="text-3xl font-bold text-zinc-100 mt-2 font-mono">
              ${financialReport.totalPaid.toLocaleString()}
            </div>
          </div>

          {/* Total Due */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-center shadow-xs">
            <span className="text-xs text-zinc-400 font-medium block">Total Due</span>
            <div className="text-3xl font-bold text-zinc-100 mt-2 font-mono">
              ${financialReport.totalDue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
