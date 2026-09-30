import React from 'react';
import {
  Users,
  CheckSquare,
  Sparkles,
  Calendar,
  FolderArchive,
  CreditCard,
  UserCheck,
  BarChart3,
  Video,
  Palette,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'CLIENT MANAGEMENT',
      description: 'Keep client information, projects, files and activity organized.',
      icon: Users,
      highlight: 'Dedicated Client Portals',
    },
    {
      title: 'SMART TASK MANAGEMENT',
      description: 'Create, assign, prioritize and track every task.',
      icon: CheckSquare,
      highlight: 'Dynamic Custom Fields',
    },
    {
      title: 'CREATIVE WORKFLOW',
      description: 'Built for graphic designers, video editors and creative teams.',
      icon: Video,
      highlight: 'Revision Loops & Proofing',
    },
    {
      title: 'AGENCY CALENDAR',
      description: 'Track deadlines, meetings and upcoming deliveries.',
      icon: Calendar,
      highlight: 'Interactive Gantt & Schedule',
    },
    {
      title: 'ASSET MANAGEMENT',
      description: 'Keep client assets, raw footage, designs and final deliverables organized.',
      icon: FolderArchive,
      highlight: 'Centralized Cloud Storage',
    },
    {
      title: 'INVOICES & PAYMENTS',
      description: 'Manage invoices, payments and outstanding balances.',
      icon: CreditCard,
      highlight: 'Automated Billing & Receipts',
    },
    {
      title: 'TEAM MANAGEMENT',
      description: 'Give every employee a clear workspace and workload.',
      icon: UserCheck,
      highlight: 'Capacity & Time Tracking',
    },
    {
      title: 'REPORTS & ANALYTICS',
      description: 'Understand project performance, team workload and agency activity.',
      icon: BarChart3,
      highlight: 'Executive Export (CSV/Excel)',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#0d0e12] border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Agency Infrastructure
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Everything Your Agency Needs to Stay Organized.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Engineered exclusively for creative agencies, growth marketers, and video studios — not generic software teams.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-[#14151a] border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 space-y-4 group hover:-translate-y-1 shadow-lg shadow-black/40"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#803300] to-[#401900] border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-orange-400" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-orange-400/90 uppercase block">
                    {feat.title}
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                  <span>{feat.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
