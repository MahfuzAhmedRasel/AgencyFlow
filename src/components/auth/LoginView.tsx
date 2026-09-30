import React, { useState } from 'react';
import { useAgency, CreateAgencyInput, CreateAdminInput } from '../../context/AgencyContext';
import { Lock, Mail, ArrowRight, Building, User, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onViewWebsite?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onViewWebsite }) => {
  const { login, createAgency, setCurrentTab, loginWithGoogle, startDemo } = useAgency();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up state (New User / New Agency)
  const [fullName, setFullName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your work email and password.');
      return;
    }

    const res = login(email.trim(), password.trim());
    if (!res.success) {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    if (!fullName.trim() || !agencyName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError('Please complete all required fields to register your workspace.');
      return;
    }

    if (signupPassword.trim().length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    try {
      const agencyData: CreateAgencyInput = {
        name: agencyName.trim(),
        tagline: 'High-Impact Performance Creative Agency',
        email: signupEmail.trim().toLowerCase(),
        phone: '+1 (555) 000-0000',
        website: `https://${agencyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        address: 'Agency Headquarters',
        currency: 'USD',
        subscriptionPlan: 'Growth',
      };

      const adminData: CreateAdminInput = {
        name: fullName.trim(),
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword.trim(),
        phone: '+1 (555) 000-0000',
      };

      // Create agency in database without auto-logging in
      createAgency(agencyData, adminData, false);

      // Pre-fill the sign-in email with the registered email
      setEmail(signupEmail.trim().toLowerCase());
      setPassword('');

      // Clear sign-up inputs
      setFullName('');
      setAgencyName('');
      setSignupEmail('');
      setSignupPassword('');

      // Switch to sign-in view and display success confirmation
      setMode('signin');
      setSuccessNotice('Your agency workspace was created successfully! Please sign in with your password to continue.');
    } catch (err: any) {
      setError(err?.message || 'Failed to create agency account.');
    }
  };

  const handleGoToWebsite = () => {
    if (onViewWebsite) {
      onViewWebsite();
    } else {
      setCurrentTab('home');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0e12] flex flex-col justify-center items-center p-4 sm:p-6 text-zinc-100 relative overflow-hidden font-sans">
      {/* Background Glows matching MarketMe warm palette */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-md bg-[#14151a]/95 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur-md">
        {/* Top bar with Clickable Brand Logo to return Home (no button on right) */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
          <button
            type="button"
            onClick={handleGoToWebsite}
            className="flex items-center space-x-2.5 text-zinc-300 hover:text-white transition-all cursor-pointer group"
            title="Click to go to Homepage"
          >
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors">
                marketme
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono font-medium">
                AgencyOS
              </span>
            </div>
          </button>

          <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Cloud</span>
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={handleGoToWebsite}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 mx-auto shadow-lg shadow-orange-500/20 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            title="Go to Homepage"
          >
            <div className="w-full h-full bg-[#0d0e12] rounded-[14px] flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
              </div>
            </div>
          </button>

          <h1 className="text-2xl font-black tracking-tight text-white">
            marketme <span className="text-orange-400 font-medium">AgencyOS</span>
          </h1>
          <p className="text-xs text-zinc-400">
            {mode === 'signin'
              ? 'Sign in to access your digital agency workspace'
              : 'Create a new agency workspace in seconds'}
          </p>
        </div>

        {/* Mode Selector Tabs (Sign In / Sign Up) */}
        <div className="flex p-1 bg-[#0d0e12] rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
              mode === 'signin'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
              setSuccessNotice(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
              mode === 'signup'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs animate-fade-in flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success message banner (e.g. after sign up) */}
        {successNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-start space-x-2.5 animate-fade-in shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-semibold text-emerald-300">Registration Successful!</div>
              <div className="text-[11px] text-emerald-400/90">{successNotice}</div>
            </div>
          </div>
        )}

        {/* Instant Start Demo Button - No Login or Sign Up Required */}
        <button
          type="button"
          onClick={() => startDemo()}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 text-xs shadow-lg shadow-orange-500/25 cursor-pointer hover:scale-[1.01]"
        >
          <span>Start Demo (No Sign In Needed)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Google Cloud Sign-In Button */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={async () => {
              setError(null);
              setSuccessNotice(null);
              setIsGoogleLoading(true);
              try {
                await loginWithGoogle();
              } catch (err: any) {
                if (err?.code !== 'auth/popup-closed-by-user') {
                  setError(err?.message || 'Google Sign-In failed.');
                }
              } finally {
                setIsGoogleLoading(false);
              }
            }}
            className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-100 font-medium rounded-xl transition-all flex items-center justify-center space-x-2.5 text-xs shadow-sm cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-zinc-800"></div>
            <span className="bg-[#14151a] px-3 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold absolute">
              or continue with email
            </span>
          </div>
        </div>

        {/* SIGN IN FORM */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 block">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0d0e12] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-zinc-300 block">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0d0e12] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer hover:shadow-orange-500/35"
            >
              <span>Sign In to Agency Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch to sign up */}
            <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-800/60">
              Don't have an agency account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessNotice(null);
                }}
                className="text-orange-400 hover:text-orange-300 font-bold ml-1 cursor-pointer underline underline-offset-2"
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          /* SIGN UP FORM (FOR NEW WORKSPACES) */
          <form onSubmit={handleSignUp} className="space-y-3.5 text-xs animate-fade-in">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Vance"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0d0e12] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Agency Name *</label>
              <div className="relative">
                <Building className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="e.g. Apex Growth Studio"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0d0e12] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Work Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@apexstudio.io"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0d0e12] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0d0e12] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer hover:shadow-orange-500/35"
            >
              <span>Create Agency Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Back to sign in callout */}
            <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-800/60">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSuccessNotice(null);
                }}
                className="text-orange-400 hover:text-orange-300 font-bold ml-1 cursor-pointer underline underline-offset-2"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
