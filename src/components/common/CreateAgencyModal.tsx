import React, { useState } from 'react';
import { useAgency, CreateAgencyInput, CreateAdminInput } from '../../context/AgencyContext';
import { X, Building2, User, Mail, Lock, Phone, Globe, MapPin, DollarSign, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export const CreateAgencyModal: React.FC = () => {
  const { isCreateAgencyModalOpen, setIsCreateAgencyModalOpen, createAgency } = useAgency();

  // Agency fields
  const [agencyName, setAgencyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York (EST)');
  const [subscriptionPlan, setSubscriptionPlan] = useState<'Starter' | 'Growth' | 'Enterprise Pro'>('Growth');

  // Admin account fields
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('password123');

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCreateAgencyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agencyName.trim() || !agencyEmail.trim() || !adminName.trim() || !adminEmail.trim()) {
      setError('Please fill in all required fields (Agency Name, Agency Email, Admin Name, Admin Email).');
      return;
    }

    try {
      const agencyData: CreateAgencyInput = {
        name: agencyName.trim(),
        tagline: tagline.trim() || 'Performance Creative & Digital Marketing Agency',
        email: agencyEmail.trim(),
        phone: phone.trim() || '+1 (555) 234-5678',
        website: website.trim() || `https://${agencyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.agency`,
        address: address.trim() || '750 Creative Blvd, Suite 400',
        currency,
        subscriptionPlan,
      };

      const adminData: CreateAdminInput = {
        name: adminName.trim(),
        email: adminEmail.trim().toLowerCase(),
        password: adminPassword.trim() || 'password123',
        phone: phone.trim() || '+1 (555) 234-5678',
      };

      createAgency(agencyData, adminData);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setIsCreateAgencyModalOpen(false);
        // Reset form
        setAgencyName('');
        setTagline('');
        setAgencyEmail('');
        setPhone('');
        setWebsite('');
        setAddress('');
        setAdminName('');
        setAdminEmail('');
        setAdminPassword('password123');
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to create agency workspace.');
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Create New Agency Workspace</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono uppercase">
                  Multi-Tenant
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Instantly provision an isolated workspace for a new marketing agency
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateAgencyModalOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Agency Workspace Provisioned!</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Welcome to <span className="text-white font-semibold">{agencyName}</span>. Your isolated multi-tenant agency database, admin account, and workflow templates have been initialized.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300">
                {error}
              </div>
            )}

            {/* Section 1: Agency Organization Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-zinc-300 font-bold border-b border-zinc-800/80 pb-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>1. Agency Entity Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Agency Name *</label>
                  <input
                    type="text"
                    required
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. Zenith Growth Media"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Tagline / Mission</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. DTC Creative Strategy & Performance Ads"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Agency Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={agencyEmail}
                    onChange={(e) => setAgencyEmail(e.target.value)}
                    placeholder="hello@zenithgrowth.io"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 789-0123"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. zenithgrowth.io"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Office Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 500 Market St, Austin, TX"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Localization & Plan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                  >
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                    <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                    <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                    <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                    <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Subscription Tier</label>
                  <select
                    value={subscriptionPlan}
                    onChange={(e) => setSubscriptionPlan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                  >
                    <option value="Starter">Starter Plan</option>
                    <option value="Growth">Growth Plan (Recommended)</option>
                    <option value="Enterprise Pro">Enterprise Pro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Initial Agency Administrator Account */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2 text-zinc-300 font-bold border-b border-zinc-800/80 pb-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>2. Agency Owner / Admin Account</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Admin Full Name *</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. Jordan Hayes"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 block">Admin Login Email *</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="jordan@zenithgrowth.io"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-zinc-300 block">Initial Password *</label>
                    <span className="text-[10px] text-zinc-500 font-mono">Default: password123</span>
                  </div>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Tenancy Assurance Badge */}
            <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl flex items-center space-x-2 text-indigo-300 text-[11px]">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>
                Data Isolation Guarantee: The new agency will have a completely segregated workspace. Other agencies cannot access its clients, projects, tasks, or invoices.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsCreateAgencyModalOpen(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Provision Agency Workspace</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
