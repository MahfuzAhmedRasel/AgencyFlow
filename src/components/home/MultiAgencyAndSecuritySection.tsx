import React from 'react';
import {
  Building2,
  Shield,
  KeyRound,
  Lock,
  Server,
  Layers,
  CheckCircle2,
  ArrowDown,
  UserCheck,
} from 'lucide-react';

export const MultiAgencyAndSecuritySection: React.FC = () => {
  const securityFeatures = [
    {
      title: 'ROLE-BASED ACCESS',
      description: 'Give every team member the right level of access.',
      sub: 'Granular admin, project manager, and creative employee permissions.',
      icon: UserCheck,
    },
    {
      title: 'PRIVATE WORKSPACES',
      description: 'Each agency operates inside its own workspace.',
      sub: 'Complete isolation of clients, tasks, briefs, deliverables, and invoices.',
      icon: Building2,
    },
    {
      title: 'INDIVIDUAL ACCOUNTS',
      description: 'Every admin, manager and employee gets their own secure login.',
      sub: 'Individual credentials, customizable passwords, and active session control.',
      icon: KeyRound,
    },
    {
      title: 'CONTROLLED ACCESS',
      description: 'Keep clients, projects, files and financial information protected.',
      sub: 'Financial balances and contract rates stay restricted to agency leadership.',
      icon: Lock,
    },
  ];

  return (
    <div className="space-y-28 py-24 bg-[#090a0d] border-t border-zinc-900">
      {/* ======================================================== */}
      {/* 10. MULTI-AGENCY SAAS SECTION */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Multi-Tenant Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            One Platform. Every Agency Gets Its Own Workspace.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Every agency gets its own private workspace, team, clients, projects and data.
          </p>
        </div>

        {/* Visual Multi-Tenant Flow Representation */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Master SaaS Platform Box */}
          <div className="p-6 rounded-3xl bg-[#14151a] border-2 border-orange-500/50 shadow-2xl text-center space-y-2 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto font-bold">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight">YOUR SAAS PLATFORM</h3>
            <p className="text-xs text-zinc-400">Centralized Cloud Infrastructure & Secure Multi-Tenant Core</p>
          </div>

          {/* Connector Arrow */}
          <div className="flex justify-center text-orange-500/80">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>

          {/* 3 Isolated Agency Workspaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#121318] border border-zinc-800 hover:border-orange-500/40 transition-all space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-[11px] font-bold">
                  AGENCY A
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Isolated</span>
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">OmniAgency Creative OS</h4>
              <p className="text-xs text-zinc-400">Private Workspace &bull; 18 Clients &bull; 12 Team Members</p>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                100% Encrypted & Independent Data
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#121318] border border-zinc-800 hover:border-orange-500/40 transition-all space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-[11px] font-bold">
                  AGENCY B
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Isolated</span>
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">Vanguard Performance Media</h4>
              <p className="text-xs text-zinc-400">Private Workspace &bull; 24 Clients &bull; 16 Team Members</p>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                100% Encrypted & Independent Data
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#121318] border border-zinc-800 hover:border-orange-500/40 transition-all space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-mono text-[11px] font-bold">
                  AGENCY C
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Isolated</span>
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">Apex Growth Studio</h4>
              <p className="text-xs text-zinc-400">Private Workspace &bull; 9 Clients &bull; 6 Team Members</p>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                100% Encrypted & Independent Data
              </div>
            </div>
          </div>

          {/* 5 Highlights Bullet List from Prompt */}
          <div className="p-5 rounded-2xl bg-[#14151a] border border-zinc-800 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-zinc-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Independent agency workspace</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Individual employee accounts</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Role-based access</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Agency-level data isolation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Private clients and projects</span>
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11. SECURITY SECTION */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Enterprise Governance
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your Agency Data Stays Yours.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Safeguard client deliverables, raw creative footage, financial retainers, and employee permissions.
          </p>
        </div>

        {/* 4 Security Cards from Prompt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-[#14151a] border border-zinc-800 hover:border-orange-500/40 transition-all space-y-4 shadow-lg group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                    {sec.title}
                  </h4>
                  <p className="text-xs font-semibold text-zinc-300 mt-2">
                    "{sec.description}"
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                    {sec.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
