import React, { useState } from 'react';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';

interface LandingNavbarProps {
  onLogin: () => void;
  onStartFree: () => void;
  onStartDemo?: () => void;
  onBookDemo?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onLogin,
  onStartFree,
  onStartDemo,
  onBookDemo,
}) => {
  const handleDemoAction = onStartDemo || onStartFree;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Agencies', href: '#for-agencies' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0d0e12]/90 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Product Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d0e12] rounded-[10px] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                </div>
              </div>
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Agency<span className="text-orange-400">OS</span></span>
              <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">B2B SaaS</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-zinc-300">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-orange-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3.5 text-xs font-semibold">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={handleDemoAction}
              className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-105 flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Start Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#14151a] border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogin();
              }}
              className="w-full py-2.5 rounded-xl bg-zinc-900 text-zinc-200 font-semibold text-xs border border-zinc-800"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDemoAction();
              }}
              className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/30 flex items-center justify-center space-x-1.5"
            >
              <span>Start Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
