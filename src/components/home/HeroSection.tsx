import React from 'react';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Briefcase,
  FileCheck,
  Video,
  Palette,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface HeroSectionProps {
  onStartFree: () => void;
  onStartDemo: () => void;
  onBookDemo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartFree,
  onStartDemo,
  onBookDemo,
}) => {
  const handleDemoClick = onStartDemo || onBookDemo || onStartFree;
  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-[#0d0e12]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-orange-600/15 via-amber-500/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header copy */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Trust badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#181920] border border-orange-500/30 text-xs font-semibold text-orange-300 shadow-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Built for modern digital marketing agencies.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] sm:leading-[1.1]">
            Run Your Entire Digital Agency{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              From One Powerful Platform.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Manage clients, employees, creative tasks, projects, deadlines, approvals,
            assets, invoices, and payments — all from one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/30 transition-all hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#181920] hover:bg-[#22242e] text-zinc-200 hover:text-white font-semibold text-sm border border-zinc-700/80 transition-all hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-orange-400 fill-orange-400/40" />
              <span>Start Demo</span>
            </button>
          </div>

          <div className="pt-2 text-xs text-zinc-500 font-medium">
            No credit card required &bull; 14-day full agency trial &bull; 2-minute setup
          </div>
        </div>

        {/* HERO VISUAL: Realistic, High-Quality SaaS Dashboard Mockup */}
        <div className="mt-14 sm:mt-20 relative max-w-6xl mx-auto">
          {/* FLOATING CARD 1: Task Assigned (Top Left) */}
          <div className="hidden lg:flex absolute -top-8 -left-8 z-30 items-center space-x-3 p-3.5 bg-[#181920]/95 backdrop-blur-md rounded-2xl border border-zinc-700/80 shadow-2xl animate-bounce duration-1000">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Task Assigned</div>
              <div className="text-xs font-bold text-white">IG Reels Hook Edit &bull; Daniel K.</div>
            </div>
          </div>

          {/* FLOATING CARD 2: Video Submitted (Top Right) */}
          <div className="hidden lg:flex absolute -top-6 -right-6 z-30 items-center space-x-3 p-3.5 bg-[#181920]/95 backdrop-blur-md rounded-2xl border border-zinc-700/80 shadow-2xl">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Video Submitted</div>
              <div className="text-xs font-bold text-white">v3_Final_4K_Export.mp4</div>
            </div>
          </div>

          {/* FLOATING CARD 3: Revision Requested (Bottom Left) */}
          <div className="hidden lg:flex absolute -bottom-6 -left-6 z-30 items-center space-x-3 p-3.5 bg-[#181920]/95 backdrop-blur-md rounded-2xl border border-amber-500/40 shadow-2xl">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Revision Requested</div>
              <div className="text-xs font-bold text-white">Adjust audio ducking at 0:14s</div>
            </div>
          </div>

          {/* FLOATING CARD 4: Task Approved (Bottom Right) */}
          <div className="hidden lg:flex absolute -bottom-6 -right-6 z-30 items-center space-x-3 p-3.5 bg-[#181920]/95 backdrop-blur-md rounded-2xl border border-emerald-500/40 shadow-2xl">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Task Approved</div>
              <div className="text-xs font-bold text-white">Client Approved &bull; Ready to Publish</div>
            </div>
          </div>

          {/* Main Dashboard Container Mockup */}
          <div className="rounded-3xl border border-zinc-700/80 bg-[#121318] shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Mockup Window Chrome */}
            <div className="px-5 py-3.5 bg-[#16171e] border-b border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-[11px] text-zinc-500">app.agencyos.io/omniagency/overview</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-zinc-300">OmniAgency OS Live</span>
              </div>
            </div>

            {/* Mockup Dashboard Content */}
            <div className="p-4 sm:p-7 space-y-6">
              {/* 5 Real KPI Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-4 rounded-2xl bg-[#181920] border border-zinc-800/80">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Total Clients</span>
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-1.5 font-mono">18</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+3 this month</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#181920] border border-zinc-800/80">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Active Projects</span>
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-1.5 font-mono">24</div>
                  <div className="text-[10px] text-zinc-500 mt-1">across 6 retainers</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#181920] border border-zinc-800/80">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Pending Tasks</span>
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-1.5 font-mono">14</div>
                  <div className="text-[10px] text-amber-400/90 mt-1">4 under client review</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#181920] border border-zinc-800/80">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Completed Tasks</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-1.5 font-mono">142</div>
                  <div className="text-[10px] text-emerald-400 mt-1">98.4% on-time rate</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#181920] border border-rose-900/40 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Overdue Tasks</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-rose-400 mt-1.5 font-mono">3</div>
                  <div className="text-[10px] text-rose-400/80 mt-1">Needs attention</div>
                </div>
              </div>

              {/* Two Column Layout inside Dashboard: Workload + Upcoming Deliverables */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Creative Production Stream */}
                <div className="lg:col-span-7 bg-[#16171e] rounded-2xl border border-zinc-800/80 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      <span>Live Production Pipeline</span>
                    </span>
                    <span className="text-[11px] text-orange-400 font-medium">8 tasks in flight</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#1e2029] border border-zinc-700/60 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-100">Q4 E-Commerce UGC TikTok Ad Suite</div>
                          <div className="text-[10px] text-zinc-400">Northwind Retail &bull; Assigned to Sofia R.</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                        Under Review
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#1e2029] border border-zinc-700/60 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                          <Palette className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-100">Performance Meta Carousel (6 Frames)</div>
                          <div className="text-[10px] text-zinc-400">Fernway Coffee &bull; Assigned to Daniel K.</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                        In Progress
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#1e2029] border border-zinc-700/60 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <FileCheck className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-100">YouTube Long-Form Case Study Cut</div>
                          <div className="text-[10px] text-zinc-400">Halo Fitness &bull; Assigned to Amara O.</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                        Approved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Employee Workload & Recent Activity */}
                <div className="lg:col-span-5 bg-[#16171e] rounded-2xl border border-zinc-800/80 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800">
                    <span className="font-bold text-white">Employee Workload</span>
                    <span className="text-[11px] text-zinc-400">4 Specialists</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-zinc-200">Sofia R. (Senior Video Editor)</span>
                        <span className="font-mono text-orange-400 font-bold">85% Capacity</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full w-[85%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-zinc-200">Daniel K. (Graphic & Brand Designer)</span>
                        <span className="font-mono text-amber-400 font-bold">60% Capacity</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[60%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-zinc-200">Amara O. (Motion Designer)</span>
                        <span className="font-mono text-emerald-400 font-bold">40% Capacity</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[40%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
