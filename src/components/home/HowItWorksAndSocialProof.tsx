import React from 'react';
import {
  Building2,
  UserPlus,
  Briefcase,
  PlayCircle,
  Star,
  Quote,
} from 'lucide-react';

export const HowItWorksAndSocialProof: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Agency',
      description: 'Create your agency workspace and admin account.',
      icon: Building2,
    },
    {
      number: '02',
      title: 'Add Your Team',
      description: 'Invite managers, designers, editors and other employees.',
      icon: UserPlus,
    },
    {
      number: '03',
      title: 'Add Clients & Projects',
      description: 'Organize your clients, campaigns and projects.',
      icon: Briefcase,
    },
    {
      number: '04',
      title: 'Run Your Agency',
      description: 'Assign tasks, track deadlines, review work and manage payments.',
      icon: PlayCircle,
    },
  ];

  /*
   * IMPORTANT: The following 3 testimonials are marked internally as [Placeholder Testimonial]
   * so they can be easily identified and replaced with verified agency reviews.
   */
  const testimonials = [
    {
      id: 'test-01',
      isPlaceholder: true,
      quote:
        'Managing 16 client retainers across 8 video editors used to be a nightmare of missed Slack messages. AgencyOS unified our briefs, revisions, and invoices into one clear dashboard.',
      author: 'Marcus Vance',
      role: 'Founder & Managing Director',
      agency: 'Vance Digital Studio',
      rating: 5,
    },
    {
      id: 'test-02',
      isPlaceholder: true,
      quote:
        'Our creative proofing cycle was cut in half. The specialized task fields for video ratios and design dimensions ensure our creators get it right on V1 every single time.',
      author: 'Elena Rostova',
      role: 'Head of Creative Operations',
      agency: 'Lumina Media Group',
      rating: 5,
    },
    {
      id: 'test-03',
      isPlaceholder: true,
      quote:
        'The multi-tenant workspace separation gives our agency leadership peace of mind. We have full financial visibility into overdue invoices while our designers focus purely on creating.',
      author: 'David Chen',
      role: 'Partner & Chief Growth Officer',
      agency: 'Apex Performance Media',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-28 py-24 bg-[#0d0e12] border-t border-zinc-900">
      {/* ======================================================== */}
      {/* 12. HOW IT WORKS */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Simple 4-Step Onboarding
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Get Your Agency Organized in Minutes.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Zero complicated configuration. Import your clients, invite your creators, and start running campaigns immediately.
          </p>
        </div>

        {/* 4 Large Numbered Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#14151a] border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 space-y-5 relative overflow-hidden group hover:-translate-y-1 shadow-lg"
              >
                {/* Big subtle watermark number */}
                <div className="absolute -right-4 -top-6 text-7xl font-black text-zinc-800/40 select-none group-hover:text-orange-500/10 transition-colors font-mono pointer-events-none">
                  {step.number}
                </div>

                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-orange-400">Step {step.number}</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 13. SOCIAL PROOF SECTION */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Agency Testimonials
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Built for Teams That Create.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Discover why high-performing marketing agencies trust AgencyOS for their day-to-day operations.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-[#14151a] border border-zinc-800 hover:border-zinc-700 transition-all space-y-6 flex flex-col justify-between shadow-xl relative"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80">
                <div className="font-bold text-white text-xs">{t.author}</div>
                <div className="text-[11px] text-zinc-400">
                  {t.role} &bull; <span className="text-orange-400">{t.agency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
