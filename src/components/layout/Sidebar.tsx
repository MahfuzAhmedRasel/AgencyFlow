import React, { useState, useRef, useEffect } from 'react';
import { useAgency, NavigationTab } from '../../context/AgencyContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  UserCheck,
  Calendar,
  FolderArchive,
  Receipt,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  UserCircle,
  Sparkles,
  Layers,
  AlertCircle,
  Clock,
  ChevronDown,
  Building2,
  Check,
  Plus,
  LogOut,
  Globe,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const {
    currentUser,
    currentTab,
    setCurrentTab,
    orgSettings,
    currentAgency,
    logout,
    projects,
    tasks,
    notifications,
    isTaskOverdue,
  } = useAgency();

  // Compute status counts for role
  const unreadNotifs = notifications.filter(
    (n) => n.userId === currentUser.id && !n.isRead
  ).length;

  const overdueCount = tasks.filter(
    (t) =>
      isTaskOverdue(t) &&
      (currentUser.role !== 'employee' || t.assignedEmployeeId === currentUser.id)
  ).length;

  const underReviewProjectsCount = projects.filter(
    (p) =>
      p.status === 'under_review' &&
      (currentUser.role !== 'employee' || p.assignedTo === currentUser.id)
  ).length;

  const myProjectsCount = projects.filter(
    (p) => p.assignedTo === currentUser.id && p.status !== 'completed'
  ).length;

  interface NavItem {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }

  // Generate navigation links based on RBAC
  const getNavItems = (): { section: string; items: NavItem[] }[] => {
    if (currentUser.role === 'admin') {
      return [
        {
          section: 'Main',
          items: [
            { id: 'home', label: 'Public Website', icon: Globe },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'clients', label: 'Clients', icon: Users },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'employees', label: 'Employees & Team', icon: UserCheck },
            { id: 'calendar', label: 'Agency Calendar', icon: Calendar },
            { id: 'assets', label: 'Creative Assets', icon: FolderArchive },
          ],
        },
        {
          section: 'Financials & Insights',
          items: [
            { id: 'invoices', label: 'Invoices', icon: Receipt },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          ],
        },
        {
          section: 'System',
          items: [
            {
              id: 'notifications',
              label: 'Notifications',
              icon: Bell,
              badge: unreadNotifs > 0 ? unreadNotifs : undefined,
              badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
            },
            { id: 'settings', label: 'Agency Settings', icon: Settings },
          ],
        },
      ];
    }

    if (currentUser.role === 'call_center' || currentUser.role === 'manager') {
      return [
        {
          section: 'Call Center',
          items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'clients', label: 'Clients', icon: Users },
          ],
        },
      ];
    }

    // Employee sidebar: ONLY Dashboard and Projects!
    return [
      {
        section: 'Workspace',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          {
            id: 'projects',
            label: 'Projects',
            icon: Briefcase,
            badge: myProjectsCount > 0 ? myProjectsCount : undefined,
            badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
          },
        ],
      },
    ];
  };

  const navSections = getNavItems();

  const handleNavClick = (tabId: NavigationTab) => {
    setCurrentTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-full select-none shrink-0">
      {/* Agency Brand Header */}
      <div className="relative p-3.5 border-b border-zinc-800/80">
        <div className="w-full flex items-center justify-between p-2 rounded-xl text-left">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/25 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0d0e12] rounded-[10px] flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                </div>
              </div>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xs font-bold text-zinc-100 tracking-tight truncate flex items-center gap-1.5">
                <span className="truncate">{currentAgency.name}</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/15 text-orange-400 border border-orange-500/25 font-mono uppercase tracking-wider font-semibold">
                  {currentAgency.subscriptionPlan || 'Workspace'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Pill Banner */}
      <div className="px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              currentUser.role === 'admin'
                ? 'bg-rose-400 shadow-sm shadow-rose-400/50'
                : currentUser.role === 'call_center' || currentUser.role === 'manager'
                ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
            }`}
          />
          <span className="text-zinc-300 font-medium">
            {currentUser.role === 'admin'
              ? 'Admin View'
              : currentUser.role === 'call_center' || currentUser.role === 'manager'
              ? 'Call Center View'
              : 'Employee View'}
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono truncate max-w-[90px]">
          {currentUser.employeeTitle.split(' ')[0]}
        </span>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.section} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              {section.section}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-sm shadow-orange-500/10'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-orange-400' : 'text-zinc-400 group-hover:text-zinc-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${item.badgeColor || 'bg-zinc-800 text-zinc-300'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Live Quick Alerts Widget */}
        {underReviewProjectsCount > 0 && currentUser.role !== 'employee' && (
          <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2 mt-4">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>Agency Pulse</span>
            </div>
            <div
              onClick={() => handleNavClick('projects')}
              className="flex items-center justify-between p-2 rounded-lg bg-purple-950/40 border border-purple-800/40 text-xs cursor-pointer hover:bg-purple-900/40 transition-colors"
            >
              <div className="flex items-center space-x-2 text-purple-300">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Under Review</span>
              </div>
              <span className="font-mono font-bold text-purple-200">{underReviewProjectsCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Profile Info & Logout */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/80 space-y-2">
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-700/50 shrink-0"
            />
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-zinc-200 truncate">{currentUser.name}</div>
              <div className="text-[10px] text-zinc-400 truncate">{currentUser.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
            title="Sign Out / Switch Account"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
