import React, { useState } from 'react';
import {
  Video,
  Palette,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  TrendingUp,
  DollarSign,
  Shield,
  FileCheck,
} from 'lucide-react';

export const WorkspaceShowcaseSection: React.FC = () => {
  const [activeRoleTab, setActiveRoleTab] = useState<'video' | 'design'>('video');

  return (
    <div className="space-y-28 py-24 bg-[#0d0e12] border-t border-zinc-900">
      {/* ======================================================== */}
      {/* 8. EMPLOYEE WORKSPACE SECTION */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Role-Tailored Productivity
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Give Every Team Member a Clear Workspace.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Employees see exactly what they need to work on, when it's due, and what needs attention.
          </p>

          {/* Toggle between Video Editor & Graphic Designer */}
          <div className="flex justify-center pt-2">
            <div className="p-1 bg-[#181920] border border-zinc-800 rounded-2xl flex items-center space-x-1">
              <button
                onClick={() => setActiveRoleTab('video')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeRoleTab === 'video'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Editor Workspace</span>
              </button>
              <button
                onClick={() => setActiveRoleTab('design')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeRoleTab === 'design'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Graphic Designer Workspace</span>
              </button>
            </div>
          </div>
        </div>

        {/* Employee Dashboard Mockup */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#14151a] border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Top Bar with KPI counts specified in prompt: 2 Overdue, 4 In Progress, 3 Under Review, 8 Completed */}
          <div className="border-b border-zinc-800 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>MY TASKS</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                    17 Active Total
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Assigned Creator: Sofia Reyes &bull; Senior Video & Motion Specialist
                </p>
              </div>

              {/* 4 Task Status KPI Pills */}
              <div className="grid grid-cols-4 gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                  <span className="text-[10px] text-rose-400 font-medium block">Overdue</span>
                  <span className="text-sm font-bold text-rose-300 font-mono">2</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <span className="text-[10px] text-amber-400 font-medium block">In Progress</span>
                  <span className="text-sm font-bold text-amber-300 font-mono">4</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <span className="text-[10px] text-purple-400 font-medium block">Under Review</span>
                  <span className="text-sm font-bold text-purple-300 font-mono">3</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-[10px] text-emerald-400 font-medium block">Completed</span>
                  <span className="text-sm font-bold text-emerald-300 font-mono">8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specialized Task Examples Body */}
          {activeRoleTab === 'video' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-orange-400 font-mono uppercase tracking-wider">
                  Video Editor Specialized Task Fields:
                </span>
                <span className="text-zinc-500">Task #TK-2026-089</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d0e12] border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">Q4 High-Conversion Meta & TikTok UGC Hook Edit</h4>
                    <p className="text-xs text-zinc-400">Client: Northwind Retail &bull; Campaign: Autumn Viral Launch</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold w-fit">
                    Under Review (v2)
                  </span>
                </div>

                {/* 6 Specialized Video Attributes from Prompt */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Format Type</span>
                    <span className="font-semibold text-zinc-200">Short Form (9:16)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Content Style</span>
                    <span className="font-semibold text-zinc-200">Long Form B-Roll</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Duration</span>
                    <span className="font-semibold text-zinc-200">0:32 seconds</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Target Platform</span>
                    <span className="font-semibold text-orange-400">TikTok & IG Reels</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Delivery Deadline</span>
                    <span className="font-semibold text-rose-400">28 Sept, 5:00 PM</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Reference Files</span>
                    <span className="font-semibold text-blue-400">Drive Assets (6)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-orange-400 font-mono uppercase tracking-wider">
                  Graphic Designer Specialized Task Fields:
                </span>
                <span className="text-zinc-500">Task #TK-2026-092</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d0e12] border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">Full Omnichannel Ad Creative Package & Brand Kit</h4>
                    <p className="text-xs text-zinc-400">Client: Fernway Coffee &bull; Campaign: Nitro Cold Brew Launch</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold w-fit">
                    In Progress
                  </span>
                </div>

                {/* 7 Specialized Graphic Designer Attributes from Prompt */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Meta Creative</span>
                    <span className="font-semibold text-zinc-200">Facebook Post</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Social Post</span>
                    <span className="font-semibold text-zinc-200">Instagram 1:1</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Display Ad</span>
                    <span className="font-semibold text-zinc-200">Web Banner</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Vector Asset</span>
                    <span className="font-semibold text-zinc-200">Logo Variations</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Video Cover</span>
                    <span className="font-semibold text-orange-400">YouTube Thumb</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Dimensions</span>
                    <span className="font-semibold text-zinc-200">1080x1350px</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Brand Assets</span>
                    <span className="font-semibold text-blue-400">Figma Kit Link</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. AGENCY OWNER SECTION */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Executive Command Center
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Know Exactly What's Happening in Your Agency.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Stop asking your team for constant updates. See your agency's work, workload and progress from one dashboard.
          </p>
        </div>

        {/* Admin Dashboard Mockup with Specific Statistics from Prompt:
            - 24 Active Projects
            - 86 Active Tasks
            - 12 Team Members
            - 7 Overdue Tasks
            - $12,450 Outstanding
        */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#14151a] border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#0d0e12] border border-zinc-800 text-center">
              <span className="text-[11px] text-zinc-400 font-medium block">Active Projects</span>
              <span className="text-3xl font-black text-white mt-1.5 font-mono block">24</span>
              <span className="text-[10px] text-zinc-500 mt-1 block">Across 6 verticals</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0e12] border border-zinc-800 text-center">
              <span className="text-[11px] text-zinc-400 font-medium block">Active Tasks</span>
              <span className="text-3xl font-black text-orange-400 mt-1.5 font-mono block">86</span>
              <span className="text-[10px] text-emerald-400 mt-1 block">+12 this week</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0e12] border border-zinc-800 text-center">
              <span className="text-[11px] text-zinc-400 font-medium block">Team Members</span>
              <span className="text-3xl font-black text-white mt-1.5 font-mono block">12</span>
              <span className="text-[10px] text-zinc-500 mt-1 block">Editors & Designers</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0e12] border border-rose-900/60 text-center">
              <span className="text-[11px] text-rose-400 font-medium block">Overdue Tasks</span>
              <span className="text-3xl font-black text-rose-400 mt-1.5 font-mono block">7</span>
              <span className="text-[10px] text-rose-400/80 mt-1 block">Flagged for Review</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0e12] border border-emerald-900/60 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] text-emerald-400 font-medium block">Outstanding Balance</span>
              <span className="text-3xl font-black text-emerald-300 mt-1.5 font-mono block">$12,450</span>
              <span className="text-[10px] text-emerald-400/80 mt-1 block">3 Invoices Pending</span>
            </div>
          </div>

          {/* Clean Analytics Visualization: Agency Revenue & Task Throughput */}
          <div className="p-5 rounded-2xl bg-[#0d0e12] border border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Monthly Delivery Throughput</span>
                <span className="text-emerald-400 font-mono font-bold">+28% vs last month</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Video Edits Delivered (42 tasks)</span>
                    <span className="text-white font-mono">100% Target Met</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Performance Ad Kits (38 tasks)</span>
                    <span className="text-white font-mono">92% On-Time</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[92%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Agency Financial Health</span>
                <span className="text-orange-400 font-mono font-bold">$82,000 Total Invoiced</span>
              </div>
              <div className="p-3 rounded-xl bg-[#181920] border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400">Total Collected</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">$69,550 Paid</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-400">Accounts Receivable</div>
                  <div className="text-base font-bold text-rose-400 font-mono">$12,450 Due</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
