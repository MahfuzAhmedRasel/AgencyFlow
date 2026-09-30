import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Sparkles, Check, ChevronRight, ChevronLeft, X, Layers, Briefcase, CheckSquare, Calendar, Plus } from 'lucide-react';

export const OnboardingTour: React.FC = () => {
  const { isTourOpen, setIsTourOpen, setCurrentTab } = useAgency();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isTourOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to OmniAgency OS',
      subtitle: 'All-in-One Digital Marketing Agency Operating System',
      description:
        'This is your centralized command center. From here, agency admins, creative managers, and editors track clients, workloads, revenue pipelines, and creative velocity.',
      icon: Sparkles,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      actionHint: 'Notice the top Role Switcher: you can test the system as Admin, Manager, or Employee anytime!',
    },
    {
      title: 'Active Campaigns & Projects',
      subtitle: 'Client retainers and delivery pipelines',
      description:
        'Track multi-phase marketing deliverables, production sprint budgets, and completion percentages in real-time as tasks are signed off.',
      icon: Briefcase,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      actionHint: 'Projects automatically calculate their % completion based on approved deliverables.',
    },
    {
      title: 'Creative Task Engine & Dynamic Fields',
      subtitle: 'Video editing & Graphic design workflows',
      description:
        'Tasks feature tailored dynamic specifications (Aspect ratio, Raw footage cloud links, Dynamic captions, Canvas px dimensions, and Figma kits) configured specifically for each creative role.',
      icon: CheckSquare,
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      actionHint: 'Try opening a video editing task to inspect its versioned deliverables and review queue!',
    },
    {
      title: 'Agency Production Calendar',
      subtitle: 'Deadlines, deliveries, and client milestones',
      description:
        'Use the centralized agency calendar to monitor upcoming deliveries, review meetings, and overdue tasks in Monthly, Weekly, and Daily views.',
      icon: Calendar,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      actionHint: 'Role filtering ensures employees only see their assigned deadlines while Admins see everything.',
    },
    {
      title: 'Instant Task Creation & Dispatch',
      subtitle: 'Quick actions and workflow builder',
      description:
        'Easily dispatch creative tasks with custom fields, attach brand assets, set deadlines, and trigger automatic creator notifications with a single click.',
      icon: Plus,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      actionHint: 'Admin can also create new custom fields without touching code in Agency Settings.',
    },
  ];

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsTourOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
        {/* Progress Dots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-indigo-500'
                    : idx < currentStep
                    ? 'w-2 bg-indigo-800'
                    : 'w-2 bg-zinc-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setIsTourOpen(false);
              setCurrentStep(0);
            }}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${step.iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">{step.title}</h2>
            <h3 className="text-xs text-zinc-400 font-medium mt-0.5">{step.subtitle}</h3>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            {step.description}
          </p>

          <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-xs text-zinc-400 flex items-start space-x-2">
            <span className="text-indigo-400 font-bold shrink-0">Pro Tip:</span>
            <span>{step.actionHint}</span>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
          <button
            onClick={() => {
              setIsTourOpen(false);
              setCurrentStep(0);
            }}
            className="text-xs text-zinc-400 hover:text-zinc-200 font-medium"
          >
            Skip Tour
          </button>

          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-semibold flex items-center gap-1 border border-zinc-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Got it! Launch Dashboard' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
