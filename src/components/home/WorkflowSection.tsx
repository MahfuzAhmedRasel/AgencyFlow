import React from 'react';
import {
  FileText,
  PlusCircle,
  UserCheck,
  Hammer,
  UploadCloud,
  Eye,
  RotateCcw,
  CheckCircle,
  Send,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    { title: 'CLIENT BRIEF', desc: 'Requirements & assets received', icon: FileText },
    { title: 'TASK CREATED', desc: 'Custom fields & specs set', icon: PlusCircle },
    { title: 'ASSIGNED', desc: 'To Designer / Editor', icon: UserCheck },
    { title: 'IN PROGRESS', desc: 'Active editing & rendering', icon: Hammer },
    { title: 'SUBMITTED', desc: 'V1 cut uploaded to cloud', icon: UploadCloud },
    { title: 'REVIEW', desc: 'Creative manager review', icon: Eye },
    { title: 'REVISION', desc: 'Pinpoint timecode feedback', icon: RotateCcw },
    { title: 'APPROVED', desc: 'Client sign-off achieved', icon: CheckCircle },
    { title: 'DELIVERED', desc: 'Final 4K export & archive', icon: Send },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#090a0d] border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Creative Lifecycle
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            From Brief to Final Delivery — Without the Chaos.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Built around the real workflow of modern digital marketing agencies. No missed feedback, no version confusion, and seamless client approvals.
          </p>
        </div>

        {/* Desktop Horizontal Connected Timeline */}
        <div className="hidden xl:block">
          <div className="relative">
            {/* Connecting Track Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500/20 via-orange-500 to-emerald-500/80 -translate-y-1/2 z-0" />

            <div className="grid grid-cols-9 gap-2 relative z-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#181920] border-2 border-orange-500/50 flex items-center justify-center text-orange-400 shadow-lg shadow-black group hover:scale-110 hover:border-orange-400 transition-all bg-gradient-to-b from-[#1c1d25] to-[#121318]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider block">
                        {step.title}
                      </span>
                      <span className="text-[9px] text-zinc-400 block leading-tight max-w-[90px]">
                        {step.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tablet & Mobile Connected Vertical Flow */}
        <div className="xl:hidden max-w-md mx-auto space-y-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full p-4 rounded-2xl bg-[#14151a] border border-zinc-800 flex items-center space-x-3.5 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase font-mono">{step.title}</h4>
                      <span className="text-[10px] text-orange-400 font-mono">0{idx + 1}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
                {!isLast && (
                  <div className="my-1 text-orange-500/70">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
