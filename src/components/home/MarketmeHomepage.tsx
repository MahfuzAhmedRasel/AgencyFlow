import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { ProblemAndSolutionSection } from './ProblemAndSolutionSection';
import { FeaturesSection } from './FeaturesSection';
import { WorkflowSection } from './WorkflowSection';
import { WorkspaceShowcaseSection } from './WorkspaceShowcaseSection';
import { MultiAgencyAndSecuritySection } from './MultiAgencyAndSecuritySection';
import { HowItWorksAndSocialProof } from './HowItWorksAndSocialProof';
import { FaqAndFooterSection } from './FaqAndFooterSection';

interface MarketmeHomepageProps {
  onOpenLogin?: () => void;
}

export const MarketmeHomepage: React.FC<MarketmeHomepageProps> = ({ onOpenLogin }) => {
  const { setCurrentTab, startDemo } = useAgency();

  const handleStartDemo = () => {
    startDemo();
  };

  const handleLogin = () => {
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      setCurrentTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 font-sans antialiased selection:bg-orange-500 selection:text-white relative overflow-x-hidden">
      {/* Linear / Vercel Deep Dark Luxury Background System */}
      <div className="fixed inset-0 bg-[#07080c] pointer-events-none -z-30" />
      <div className="fixed inset-0 bg-tech-dots opacity-40 pointer-events-none -z-20" />
      <div className="fixed inset-0 glow-mesh pointer-events-none -z-10" />

      {/* 3. STICKY NAVIGATION BAR */}
      <LandingNavbar
        onLogin={handleLogin}
        onStartFree={handleStartDemo}
        onStartDemo={handleStartDemo}
      />

      {/* 2. HERO SECTION */}
      <HeroSection
        onStartFree={handleStartDemo}
        onStartDemo={handleStartDemo}
      />

      {/* 4. PROBLEM & 5. SOLUTION SECTIONS */}
      <ProblemAndSolutionSection />

      {/* 6. FEATURES SECTION */}
      <FeaturesSection />

      {/* 7. CREATIVE WORKFLOW SECTION */}
      <WorkflowSection />

      {/* 8. EMPLOYEE WORKSPACE & 9. AGENCY OWNER SECTIONS */}
      <WorkspaceShowcaseSection />

      {/* 10. MULTI-AGENCY SAAS & 11. SECURITY SECTIONS */}
      <MultiAgencyAndSecuritySection />

      {/* 12. HOW IT WORKS & 13. SOCIAL PROOF SECTIONS */}
      <HowItWorksAndSocialProof />

      {/* 14. CTA, 15. FAQ & 16. FINAL FOOTER SECTIONS */}
      <FaqAndFooterSection
        onStartFree={handleStartDemo}
        onStartDemo={handleStartDemo}
        onLogin={handleLogin}
      />
    </div>
  );
};
