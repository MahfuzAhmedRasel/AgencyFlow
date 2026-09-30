import React, { useState } from 'react';
import {
  Clock,
  MessageSquareOff,
  HelpCircle,
  EyeOff,
  Users,
  Briefcase,
  CheckSquare,
  DollarSign,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ProblemAndSolutionSection: React.FC = () => {
  const [activeSolutionTab, setActiveSolutionTab] = useState<'clients' | 'projects' | 'team' | 'finance'>('projects');

  const problems = [
    {
      icon: Clock,
      title: 'Missed Deadlines',
      description: 'Tasks get buried in chats and spreadsheets, making deadlines easy to miss.',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: MessageSquareOff,
      title: 'Lost Client Feedback',
      description: 'Important revisions and feedback disappear inside conversations.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: HelpCircle,
      title: 'Employee Confusion',
      description: "Team members don't always know what they should work on next.",
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: EyeOff,
      title: 'No Clear Overview',
      description: 'Agency owners struggle to see projects, workloads and deadlines in one place.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  const solutionTabs = [
    {
      id: 'clients' as const,
      label: 'CLIENTS',
      title: 'Manage every client from one place.',
      desc: 'Centralize brand guidelines, client contacts, portal access, contracts, active retainers, and asset repositories.',
      icon: Users,
      stats: '18 Active Retainers &bull; 99.8% Client Satisfaction',
    },
    {
      id: 'projects' as const,
      label: 'PROJECTS & CAMPAIGNS',
      title: 'Keep every campaign and project organized.',
      desc: 'Structure monthly campaigns, video deliverables, social packages, and ad launches under unified project boards.',
      icon: Briefcase,
      stats: '24 Active Campaigns &bull; Milestone Tracking',
    },
    {
      id: 'team' as const,
      label: 'TEAM',
      title: 'Know exactly who is working on what.',
      desc: 'Live workload balancing for video editors, motion designers, graphic artists, and media buyers to prevent burnout.',
      icon: Layers,
      stats: 'Zero Confusion &bull; Automated Task Allocation',
    },
    {
      id: 'finance' as const,
      label: 'FINANCE',
      title: 'Track invoices, payments and outstanding balances.',
      desc: 'Send professional agency invoices, record client payments, automate receipt generation, and track accounts receivable.',
      icon: DollarSign,
      stats: '$82,000 Invoiced &bull; Real-time Cash Flow',
    },
  ];

  const activeTabDetails = solutionTabs.find((t) => t.id === activeSolutionTab) || solutionTabs[1];

  return (
    <div className="space-y-28 py-20 bg-[#0d0e12] border-t border-zinc-900">
      {/* ======================================================== */}
      {/* 4. PROBLEM SECTION */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            The Digital Agency Struggle
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your Agency Shouldn't Run on Spreadsheets, Chats & Sticky Notes.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            When creative production scales across multiple clients, fragmented communication leads to dropped balls and frustrated clients.
          </p>
        </div>

        {/* 4 Clean Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {problems.map((prob, i) => {
            const Icon = prob.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#14151a] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 group hover:-translate-y-1 shadow-lg"
              >
                <div className={`w-12 h-12 rounded-2xl ${prob.bg} border flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${prob.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                  {prob.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  "{prob.description}"
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. SOLUTION SECTION */}
      {/* ======================================================== */}
      <section id="for-agencies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            The Unified Solution
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            One Platform. Your Entire Agency.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Bring your clients, team, projects, creative workflow and finances together in one organized workspace.
          </p>
        </div>

        {/* Interactive Solution Tabs and Split Visual Showcase */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Solution Selector Pills */}
          <div className="lg:col-span-5 space-y-3">
            {solutionTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeSolutionTab;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveSolutionTab(tab.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#181920] border-orange-500/60 shadow-lg shadow-orange-500/10 scale-[1.02]'
                      : 'bg-[#121318] border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-orange-500 text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-mono font-bold tracking-wider uppercase ${
                          isActive ? 'text-orange-400' : 'text-zinc-500'
                        }`}>
                          {tab.label}
                        </span>
                        {isActive && <ChevronRight className="w-4 h-4 text-orange-400" />}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{tab.title}</h4>
                      {isActive && (
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed animate-fade-in">
                          {tab.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Mockup Card representing selected dimension */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#14151a] border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                    <activeTabDetails.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{activeTabDetails.title}</h3>
                    <p className="text-xs text-zinc-400" dangerouslySetInnerHTML={{ __html: activeTabDetails.stats }} />
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-semibold">
                  Live View
                </span>
              </div>

              {/* Dynamic Mockup Body */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#0d0e12] border border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">Creative Production Flow</span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Synced to Workspace</span>
                    </span>
                  </div>

                  {/* Sample records in clean table style */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                      <div>
                        <div className="font-bold text-white">Northwind Retail &bull; Q4 Meta UGC Ads</div>
                        <div className="text-[10px] text-zinc-400">Assigned: Sofia R. &bull; Deadline: 28 Sept 2026</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                        Under Review
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                      <div>
                        <div className="font-bold text-white">Fernway Coffee &bull; Brand Identity Guidelines</div>
                        <div className="text-[10px] text-zinc-400">Assigned: Daniel K. &bull; Deadline: 30 Sept 2026</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                        In Progress
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181920] border border-zinc-800">
                      <div>
                        <div className="font-bold text-white">Halo Fitness &bull; Retainer Invoice #INV-2026-004</div>
                        <div className="text-[10px] text-zinc-400">Total: $4,500 &bull; Net 15 Due 05 Oct 2026</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                        Paid ($4,500)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#0d0e12] border border-zinc-800/80">
                    <span className="text-zinc-400 block text-[11px]">Role Permissioning</span>
                    <span className="font-bold text-white text-xs mt-1 block">Admin, Manager & Employee Roles</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#0d0e12] border border-zinc-800/80">
                    <span className="text-zinc-400 block text-[11px]">Automated Hand-off</span>
                    <span className="font-bold text-orange-400 text-xs mt-1 block">Zero Manual Email Follow-ups</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
