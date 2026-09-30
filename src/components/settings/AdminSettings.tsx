import React, { useState, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Settings,
  Building,
  Building2,
  Sparkles,
  Shield,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  Save,
  X,
  ExternalLink,
  Users,
  Briefcase,
  CheckSquare,
  Globe,
  Clock,
  DollarSign,
  Copy,
  ArrowRight,
  Database,
} from 'lucide-react';
import { CustomFieldType, Agency } from '../../types';

export const AdminSettings: React.FC = () => {
  const {
    currentAgency,
    orgSettings,
    updateOrgSettings,
    allUsers,
    users,
    clients,
    projects,
    tasks,
    invoices,
    taskTypes,
    addTaskType,
    addCustomFieldToTaskType,
    deleteCustomField,
    resetAllData,
    isFirebaseConnected,
    firebaseProjectId,
    firestoreDatabaseId,
  } = useAgency();

  const [activeTab, setActiveTab] = useState<'org' | 'fields' | 'permissions'>('org');

  // Org form state
  const [name, setName] = useState(orgSettings.name);
  const [tagline, setTagline] = useState(orgSettings.tagline);
  const [logo, setLogo] = useState(orgSettings.logo);
  const [email, setEmail] = useState(orgSettings.email);
  const [phone, setPhone] = useState(orgSettings.phone);
  const [address, setAddress] = useState(orgSettings.address);
  const [website, setWebsite] = useState(orgSettings.website || '');
  const [timezone, setTimezone] = useState(orgSettings.timezone || 'America/New_York (EST)');
  const [currency, setCurrency] = useState(orgSettings.currency);
  const [taxRateDefault, setTaxRateDefault] = useState(orgSettings.taxRateDefault);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'Starter' | 'Growth' | 'Enterprise Pro'>(
    orgSettings.subscriptionPlan || 'Enterprise Pro'
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'trial' | 'past_due'>(
    orgSettings.subscriptionStatus || 'active'
  );
  const [status, setStatus] = useState<'active' | 'suspended'>(orgSettings.status || 'active');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Sync state when switching agency
  useEffect(() => {
    setName(orgSettings.name);
    setTagline(orgSettings.tagline);
    setLogo(orgSettings.logo);
    setEmail(orgSettings.email);
    setPhone(orgSettings.phone);
    setAddress(orgSettings.address);
    setWebsite(orgSettings.website || '');
    setTimezone(orgSettings.timezone || 'America/New_York (EST)');
    setCurrency(orgSettings.currency);
    setTaxRateDefault(orgSettings.taxRateDefault);
    setSubscriptionPlan(orgSettings.subscriptionPlan || 'Enterprise Pro');
    setSubscriptionStatus(orgSettings.subscriptionStatus || 'active');
    setStatus(orgSettings.status || 'active');
  }, [orgSettings]);

  // Custom Field Builder State
  const [selectedTaskTypeId, setSelectedTaskTypeId] = useState(
    taskTypes.length > 0 ? taskTypes[0].id : ''
  );
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  // New Workflow Type Modal
  const [isAddWorkflowOpen, setIsAddWorkflowOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowCategory, setNewWorkflowCategory] = useState('social_media');
  const [newWorkflowDesc, setNewWorkflowDesc] = useState('');

  const currentTaskType = taskTypes.find((tt) => tt.id === selectedTaskTypeId);

  const agencyAdminUser = allUsers.find(
    (u) => u.orgId === orgSettings.id && (u.role === 'admin' || u.id === orgSettings.ownerId)
  ) || users.find((u) => u.role === 'admin');

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgSettings({
      name,
      tagline,
      logo,
      email,
      phone,
      address,
      website,
      timezone,
      currency,
      taxRateDefault: Number(taxRateDefault),
      subscriptionPlan,
      subscriptionStatus,
      status,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(orgSettings.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleAddFieldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim() || !selectedTaskTypeId) return;

    const generatedKey =
      newFieldKey.trim() ||
      newFieldLabel
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_');

    const optionsArray =
      newFieldType === 'select' || newFieldType === 'multiselect'
        ? newFieldOptions.split(',').map((o) => o.trim()).filter(Boolean)
        : undefined;

    addCustomFieldToTaskType(selectedTaskTypeId, {
      label: newFieldLabel.trim(),
      key: generatedKey,
      type: newFieldType,
      options: optionsArray,
      placeholder: newFieldPlaceholder.trim() || undefined,
      required: newFieldRequired,
    });

    setIsAddFieldModalOpen(false);
    setNewFieldLabel('');
    setNewFieldKey('');
    setNewFieldOptions('');
    setNewFieldPlaceholder('');
    setNewFieldRequired(false);
  };

  const handleAddWorkflowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflowName.trim()) return;

    addTaskType({
      name: newWorkflowName.trim(),
      category: newWorkflowCategory,
      description: newWorkflowDesc.trim() || 'Custom creative deliverable workflow',
      iconName: 'Sparkles',
      defaultEstimatedHours: 6,
      customFields: [],
    });

    setIsAddWorkflowOpen(false);
    setNewWorkflowName('');
    setNewWorkflowDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <span>Agency Settings & Multi-Tenancy</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage your agency entity, isolated workspace parameters, custom workflow fields, and RBAC matrix.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              if (confirm('Reset all demo agency data to original state?')) {
                resetAllData();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800 flex space-x-6 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('org')}
          className={`py-3 font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'org'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Agency Entity & Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('fields')}
          className={`py-3 font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'fields'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Dynamic Custom Fields Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`py-3 font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'permissions'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>RBAC Permissions Matrix</span>
        </button>
      </div>

      {/* Tab 1: Organization & Agency Entity Settings Form */}
      {activeTab === 'org' && (
        <form onSubmit={handleSaveOrg} className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-6 text-xs max-w-4xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>Agency Organization Entity</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  {currentAgency.name}
                </span>
              </h2>
              <p className="text-zinc-400 text-[11px]">
                Agency metadata, branding, localization, and administrative ownership
              </p>
            </div>
            {savedSuccess && (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Saved successfully</span>
              </span>
            )}
          </div>

          {/* Agency ID & Tenant Key (Read-Only) */}
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Isolated Agency Tenant ID
              </div>
              <div className="font-mono text-zinc-200 text-xs mt-0.5 flex items-center gap-2">
                <span>{orgSettings.id}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-zinc-400 hover:text-indigo-400 transition-colors p-1"
                  title="Copy Agency ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-zinc-300 font-mono">
                Created: {orgSettings.createdAt}
              </span>
              <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono uppercase font-semibold">
                Status: {orgSettings.status || 'Active'}
              </span>
            </div>
          </div>

          {/* Firebase Cloud Database Status Banner */}
          <div className="p-4 bg-gradient-to-r from-zinc-950 via-zinc-950 to-orange-950/20 rounded-xl border border-orange-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-100">Firebase Firestore Database</span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Connected & Live
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Project: <strong className="text-zinc-300 font-mono">{firebaseProjectId}</strong></span>
                  <span className="hidden sm:inline text-zinc-600">•</span>
                  <span>Database: <strong className="text-zinc-300 font-mono text-[10px]">{firestoreDatabaseId.substring(0, 24)}...</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[10px] px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
                Realtime Sync Active
              </span>
            </div>
          </div>

          {/* Agency Name, Tagline & Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Agency Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="font-semibold text-zinc-300 block mb-1">Agency Logo URL</label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="e.g. images.unsplash.com/... or logo image URL"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Logo Preview</label>
              <div className="h-10 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center space-x-2">
                <img
                  src={logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80'}
                  alt="Logo"
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="text-[11px] text-zinc-400 truncate">Branding badge</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Operations Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Website URL</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. omniagency.io"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-zinc-300 block mb-1">Office Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Localization & Billing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100"
              >
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT)</option>
                <option value="Australia/Sydney (AEST)">Australia/Sydney (AEST)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Billing Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100"
              >
                <option value="USD">USD ($) United States Dollar</option>
                <option value="EUR">EUR (€) Euro</option>
                <option value="GBP">GBP (£) British Pound</option>
                <option value="CAD">CAD ($) Canadian Dollar</option>
                <option value="AUD">AUD ($) Australian Dollar</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Default Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRateDefault}
                onChange={(e) => setTaxRateDefault(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 font-mono"
              />
            </div>
          </div>

          {/* Subscription & Account Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-800/80">
            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Subscription Tier</label>
              <select
                value={subscriptionPlan}
                onChange={(e) => setSubscriptionPlan(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100"
              >
                <option value="Starter">Starter Plan</option>
                <option value="Growth">Growth Plan</option>
                <option value="Enterprise Pro">Enterprise Pro</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Subscription Status</label>
              <select
                value={subscriptionStatus}
                onChange={(e) => setSubscriptionStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100"
              >
                <option value="active">Active</option>
                <option value="trial">Free Trial</option>
                <option value="past_due">Past Due</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1">Agency Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100"
              >
                <option value="active">Active Workspace</option>
                <option value="suspended">Suspended Workspace</option>
              </select>
            </div>
          </div>

          {/* Owner / Primary Admin Info Card */}
          {agencyAdminUser && (
            <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={agencyAdminUser.avatar}
                  alt={agencyAdminUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <div className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                    <span>{agencyAdminUser.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono uppercase font-semibold">
                      Primary Admin / Owner
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {agencyAdminUser.email} • {agencyAdminUser.employeeTitle}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Agency Entity Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Dynamic Custom Fields Builder */}
      {activeTab === 'fields' && (
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-zinc-900 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Dynamic Custom Field Schemas by Creative Type</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Define unique field inputs for Video Editors, Graphic Designers, Motion Designers, and Content Creators.
              </p>
            </div>
            <button
              onClick={() => setIsAddWorkflowOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>New Deliverable Type</span>
            </button>
          </div>

          {/* Workflow Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {taskTypes.map((tt) => {
              const isSelected = tt.id === selectedTaskTypeId;
              return (
                <button
                  key={tt.id}
                  onClick={() => setSelectedTaskTypeId(tt.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{tt.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-indigo-700 text-indigo-200' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {tt.customFields.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Task Type Custom Fields View */}
          {currentTaskType && (
            <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <span>{currentTaskType.name}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full font-mono uppercase">
                      Category: {currentTaskType.category}
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{currentTaskType.description}</p>
                </div>
                <button
                  onClick={() => setIsAddFieldModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dynamic Field</span>
                </button>
              </div>

              {/* Fields List */}
              <div className="space-y-2">
                {currentTaskType.customFields.map((field) => (
                  <div
                    key={field.id}
                    className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-zinc-200">{field.label}</span>
                        {field.required && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded font-mono font-bold">
                            REQUIRED
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded font-mono">
                          {field.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center space-x-3">
                        <span className="font-mono">key: {field.key}</span>
                        {field.options && field.options.length > 0 && (
                          <span>options: {field.options.join(', ')}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteCustomField(currentTaskType.id, field.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                      title="Delete Field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: RBAC Granular Permissions Matrix */}
      {activeTab === 'permissions' && (
        <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Role-Based Access Control (RBAC) System</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Strict access levels enforced across navigation, database views, and API operations.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Permission Capability</th>
                  <th className="py-3 px-4 text-center">Admin</th>
                  <th className="py-3 px-4 text-center">Manager</th>
                  <th className="py-3 px-4 text-center">Creative Employee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-3 px-4 font-medium">Cross-Agency Data Isolation</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓ Own Agency Only</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓ Own Agency Only</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓ Own Agency Only</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">View All Agency Clients & Projects</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Full</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Full</td>
                  <td className="py-3 px-4 text-center text-zinc-600">Assigned Only</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Create & Assign Creative Tasks</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Yes</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Yes</td>
                  <td className="py-3 px-4 text-center text-zinc-600">—</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">QA Review & Approve / Request Revisions</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Yes</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Yes</td>
                  <td className="py-3 px-4 text-center text-zinc-600">—</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Upload Completed Deliverables (v1, v2)</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Yes</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Yes</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Financial Invoices & Payment Ledger</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Full Access</td>
                  <td className="py-3 px-4 text-center text-zinc-600">Restricted</td>
                  <td className="py-3 px-4 text-center text-zinc-600">Hidden</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Agency Settings & Custom Fields Builder</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Full Access</td>
                  <td className="py-3 px-4 text-center text-zinc-600">Restricted</td>
                  <td className="py-3 px-4 text-center text-zinc-600">Hidden</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">User Account Provisioning & Roles</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓ Full Access</td>
                  <td className="py-3 px-4 text-center text-zinc-600">—</td>
                  <td className="py-3 px-4 text-center text-zinc-600">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD CUSTOM FIELD MODAL OVERLAY */}
      {isAddFieldModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <form
            onSubmit={handleAddFieldSubmit}
            className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Dynamic Field ({currentTaskType?.name})</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddFieldModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Field Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aspect Ratio, Audio Stems, Color Grade LUT"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Field Key (optional)</label>
                  <input
                    type="text"
                    placeholder="auto-generated from label"
                    value={newFieldKey}
                    onChange={(e) => setNewFieldKey(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Field Type *</label>
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as CustomFieldType)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                  >
                    <option value="text">Single Line Text</option>
                    <option value="number">Number</option>
                    <option value="select">Dropdown Select</option>
                    <option value="textarea">Multiline Text / Copy</option>
                    <option value="url">URL / Drive Link</option>
                    <option value="boolean">Toggle / Checkbox</option>
                  </select>
                </div>
              </div>

              {(newFieldType === 'select' || newFieldType === 'multiselect') && (
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">
                    Options (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9:16 Reels, 16:9 Landscape, 1:1 Square"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Placeholder Help Text</label>
                <input
                  type="text"
                  placeholder="e.g. Enter direct Google Drive raw footage link"
                  value={newFieldPlaceholder}
                  onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="req_field"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="req_field" className="text-zinc-300 font-medium">
                  Mark this field as mandatory for task completion
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsAddFieldModalOpen(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
              >
                Save Dynamic Field
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE WORKFLOW TYPE MODAL */}
      {isAddWorkflowOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <form
            onSubmit={handleAddWorkflowSubmit}
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Create Custom Deliverable Type</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddWorkflowOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Deliverable Type Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TikTok Spark Ad, 3D Product Render"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Category</label>
                <select
                  value={newWorkflowCategory}
                  onChange={(e) => setNewWorkflowCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                >
                  <option value="video_editing">Video Editing</option>
                  <option value="graphic_design">Graphic Design</option>
                  <option value="motion_designer">Motion Design</option>
                  <option value="social_media">Social Media Creative</option>
                  <option value="advertising">Paid Ad Production</option>
                  <option value="custom">Other Custom Service</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the workflow requirements..."
                  value={newWorkflowDesc}
                  onChange={(e) => setNewWorkflowDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsAddWorkflowOpen(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
              >
                Create Workflow Type
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
