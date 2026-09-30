import React, { useState } from 'react';
import {
  ChevronDown,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface FaqAndFooterSectionProps {
  onStartFree: () => void;
  onStartDemo?: () => void;
  onBookDemo?: () => void;
  onLogin: () => void;
}

export const FaqAndFooterSection: React.FC<FaqAndFooterSectionProps> = ({
  onStartFree,
  onStartDemo,
  onBookDemo,
  onLogin,
}) => {
  const handleDemoClick = onStartDemo || onBookDemo || onStartFree;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '1. What is this platform?',
      a: 'AgencyOS is a purpose-built B2B operating platform for digital marketing and creative agencies. It unifies client retainers, project campaigns, video editing and design task pipelines, proofing feedback, employee workloads, invoices, and executive reporting in one secure workspace.',
    },
    {
      q: '2. Is it designed specifically for digital marketing agencies?',
      a: 'Yes. Unlike generic project management software, AgencyOS features built-in fields for video durations, aspect ratios (9:16, 1:1, 16:9), format exports, graphic design dimensions, timecoded revision loops, and retainer billing designed around creative agency workflows.',
    },
    {
      q: '3. Can I add my employees?',
      a: 'Yes. You can add video editors, graphic designers, motion artists, content creators, media buyers, and project managers to your agency roster with ease.',
    },
    {
      q: '4. Can employees have their own login?',
      a: 'Yes. Every team member receives individual credentials and a specialized workspace displaying only their assigned tasks, deadlines, and deliverables without clutter.',
    },
    {
      q: '5. Can I manage multiple clients?',
      a: 'Yes. You can organize an unlimited number of client companies, store brand assets, track contacts, and review historical deliverables for every brand you service.',
    },
    {
      q: '6. Can I assign tasks to designers and video editors?',
      a: 'Yes. You can assign creative tasks directly to specific team members with clear priority levels, estimated hours, deadlines, reference links, and creative guidelines.',
    },
    {
      q: '7. Can I track deadlines?',
      a: 'Yes. AgencyOS provides real-time deadline monitoring, automated overdue task alerts, and an interactive agency-wide calendar to ensure no client delivery is ever delayed.',
    },
    {
      q: '8. Can I manage invoices and payments?',
      a: 'Yes. Generate professional itemized invoices, record client payments, track accounts receivable, and view total outstanding balances at a glance.',
    },
    {
      q: '9. Is each agency’s data separated?',
      a: 'Yes. Our platform uses multi-tenant data isolation. Each agency operates in its own private workspace, ensuring that client information, briefs, deliverables, and financials remain 100% confidential and secure.',
    },
    {
      q: '10. Can I add different types of employees?',
      a: 'Yes. You can assign role types such as Video Editor, Graphic Designer, Motion Designer, Content Creator, Ad Specialist, Manager, or Admin with role-tailored permissions.',
    },
  ];

  return (
    <div className="bg-[#090a0d] border-t border-zinc-900">
      {/* ======================================================== */}
      {/* 14. CTA SECTION */}
      {/* ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-8 sm:p-16 text-white overflow-hidden shadow-2xl shadow-orange-500/20 text-center space-y-6">
          {/* Subtle background graphics */}
          <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-black/15 blur-2xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-black/20 text-white font-mono text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              Instant Agency Setup
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Run Your Agency Smarter?
            </h2>
            <p className="text-sm sm:text-lg text-orange-100 max-w-2xl mx-auto leading-relaxed">
              Bring your clients, team, projects and creative workflow into one powerful platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-black hover:bg-zinc-900 text-white font-bold text-sm shadow-xl transition-all hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Start Your Free Workspace</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </button>
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-md transition-all hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer border border-white/30"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Demo</span>
            </button>
          </div>

          <div className="text-xs text-orange-100/80 pt-2">
            Free 14-day trial &bull; Unlimited team members &bull; Cancel anytime
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 15. FAQ SECTION */}
      {/* ======================================================== */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Everything you need to know about the product and how it organizes your agency.
          </p>
        </div>

        {/* 10 FAQ Accordion Items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#14151a] border border-zinc-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-orange-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-orange-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60 animate-fade-in font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 16. FINAL FOOTER */}
      {/* ======================================================== */}
      <footer className="border-t border-zinc-800/80 bg-[#0d0e12] pt-16 pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Column 1: Brand Info */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-[#0d0e12] rounded-[9px] flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    </div>
                  </div>
                </div>
                <span className="text-base font-bold text-white tracking-tight">Agency<span className="text-orange-400">OS</span></span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                The all-in-one operating platform engineered specifically for digital marketing agencies, performance studios, and creative teams.
              </p>
              <div className="text-[11px] text-zinc-500 font-mono">
                Multi-Tenant Enterprise Architecture &bull; ISO-compliant security
              </div>
            </div>

            {/* Column 2: PRODUCT */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                PRODUCT
              </h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#features" className="hover:text-orange-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-orange-400 transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-orange-400 transition-colors">How It Works</a></li>
                <li>
                  <button onClick={onLogin} className="hover:text-orange-400 transition-colors cursor-pointer">
                    Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: COMPANY */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                COMPANY
              </h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#features" className="hover:text-orange-400 transition-colors">About</a></li>
                <li>
                  <button onClick={onStartDemo || handleDemoClick} className="hover:text-orange-400 transition-colors cursor-pointer">
                    Start Demo
                  </button>
                </li>
                <li><a href="#features" className="hover:text-orange-400 transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Column 4: RESOURCES */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                RESOURCES
              </h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#faq" className="hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#for-agencies" className="hover:text-orange-400 transition-colors">Documentation</a></li>
                <li><a href="#how-it-works" className="hover:text-orange-400 transition-colors">Tutorials</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div>
              &copy; 2026 AgencyOS. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#faq" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
              <a href="#faq" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
