import React, { useState, useRef, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  ChevronDown,
  Menu,
  Check,
  Shield,
  Briefcase,
  Video,
  Palette,
  ExternalLink,
  Receipt,
  Users,
  CheckSquare,
  Building2,
  LogOut,
  Globe,
  Headphones,
} from 'lucide-react';

interface TopNavbarProps {
  onOpenMobileNav: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobileNav }) => {
  const {
    currentUser,
    users,
    switchUser,
    currentAgency,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsSearchOpen,
    setIsTourOpen,
    setIsCreateTaskOpen,
    setIsCreateClientOpen,
    setIsCreateProjectOpen,
    setIsCreateInvoiceOpen,
    setSelectedTaskId,
    currentTab,
    setCurrentTab,
    canAssignTasks,
    canManageFinances,
  } = useAgency();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setIsCreateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter(
    (n) => n.userId === currentUser.id && !n.isRead
  );

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    setIsNotifDropdownOpen(false);
    if (notif.linkEntityType === 'task' && notif.linkEntityId) {
      setSelectedTaskId(notif.linkEntityId);
    } else if (notif.linkEntityType === 'invoice') {
      setCurrentTab('invoices');
    }
  };

  const getRoleIcon = (userRole: string, title: string) => {
    if (userRole === 'admin') return Shield;
    if (userRole === 'call_center' || userRole === 'manager') return Headphones;
    if (title.toLowerCase().includes('video')) return Video;
    return Palette;
  };

  return (
    <header className="h-16 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger + Global Search */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        {currentUser.role !== 'employee' ? (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center space-x-3 px-3.5 py-1.5 bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 rounded-xl text-sm text-zinc-400 hover:text-zinc-200 transition-all shadow-sm w-44 sm:w-64 md:w-80 group text-left"
          >
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400 transition-colors shrink-0" />
            <span className="truncate flex-1 text-xs">Search tasks, clients, assets...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-800 border border-zinc-700 rounded shadow-xs">
              ⌘K
            </kbd>
          </button>
        ) : (
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300 font-bold">Employee Workspace</span>
          </div>
        )}
      </div>

      {/* Right Controls: Quick Actions, Role Switcher, Notifications, Tour */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Workspace Indicator Pill */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300">
          <Building2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="font-semibold text-zinc-200 truncate max-w-[140px]">{currentAgency.name}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
            {currentAgency.subscriptionPlan || 'Agency'}
          </span>
        </div>

        {/* Public Website Button */}
        {currentUser.role !== 'employee' && (
          <button
            onClick={() => setCurrentTab(currentTab === 'home' ? 'dashboard' : 'home')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'home'
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800'
            }`}
            title="Toggle MarketMe Public Website"
          >
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span>{currentTab === 'home' ? 'Dashboard' : 'Public Site'}</span>
          </button>
        )}

        {/* Quick Tour Button */}
        {currentUser.role !== 'employee' && (
          <button
            onClick={() => setIsTourOpen(true)}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Interactive Tour</span>
          </button>
        )}

        {/* Quick Action Button (Create) */}
        {canAssignTasks && (
          <div className="relative" ref={createMenuRef}>
            <button
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm shadow-orange-500/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Work</span>
              <ChevronDown className="w-3 h-3 text-orange-100" />
            </button>

            {isCreateMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    setIsCreateProjectOpen(true);
                    setIsCreateMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-orange-400" />
                  <span>Create New Project</span>
                </button>
                <button
                  onClick={() => {
                    setIsCreateClientOpen(true);
                    setIsCreateMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Onboard New Client</span>
                </button>
                {canManageFinances && (
                  <button
                    onClick={() => {
                      setIsCreateInvoiceOpen(true);
                      setIsCreateMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3.5 py-2 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors border-t border-zinc-800/80 mt-1 pt-2"
                  >
                    <Receipt className="w-4 h-4 text-purple-400" />
                    <span>Create Invoice</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notifications Dropdown */}
        {currentUser.role !== 'employee' && (
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-zinc-950 animate-pulse" />
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-zinc-100">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-mono">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/60 text-xs">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 text-xs">No notifications yet</div>
                  ) : (
                    notifications
                      .filter((n) => n.userId === currentUser.id)
                      .slice(0, 10)
                      .map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3.5 hover:bg-zinc-800/60 cursor-pointer transition-colors flex items-start space-x-3 ${
                            !notif.isRead ? 'bg-indigo-500/5' : ''
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              !notif.isRead ? 'bg-indigo-500' : 'bg-transparent'
                            }`}
                          />
                          <div className="flex-1">
                            <div className="text-zinc-200 font-medium leading-snug">
                              {notif.title}
                            </div>
                            <div className="text-zinc-400 text-[11px] mt-0.5 leading-snug">
                              {notif.message}
                            </div>
                            <span className="text-[10px] text-zinc-500 mt-1 block font-mono">
                              {new Date(notif.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}


        {/* ROLE SWITCHER DROPDOWN (Direct simulation of all 3 Roles) */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all text-left"
            title="Switch User Role & Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-zinc-200 truncate max-w-[110px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-zinc-400 capitalize flex items-center gap-1">
                <span>{currentUser.role}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50">
              {/* Agency Info Header */}
              <div className="px-3 py-2 border-b border-zinc-800/80 mb-2 bg-zinc-950/60 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-zinc-100 truncate">
                    <Building2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="truncate">{currentAgency.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/15 text-orange-400 border border-orange-500/25 font-mono">
                    {currentAgency.subscriptionPlan || 'Active'}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 flex items-center justify-between">
                  <span>Logged in as: <strong className="text-zinc-200">{currentUser.name}</strong></span>
                  <span className="capitalize text-orange-400 font-semibold">{currentUser.role}</span>
                </div>
              </div>

              <div className="px-3 py-1 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Switch Role in this Agency
                </span>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {users.map((u) => {
                  const isSelected = u.id === currentUser.id;
                  const Icon = getRoleIcon(u.role, u.employeeTitle);

                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500/15 border border-orange-500/30 text-white'
                          : 'hover:bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-zinc-700"
                        />
                        <div className="truncate">
                          <div className="text-xs font-semibold flex items-center gap-1.5 truncate">
                            <span>{u.name}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
                                u.role === 'admin'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : u.role === 'call_center' || u.role === 'manager'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {u.role === 'call_center' || u.role === 'manager' ? 'Call Center' : u.role}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate">
                            {u.employeeTitle}
                          </div>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-orange-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {/* Sign Out Button */}
              <div className="pt-2 mt-2 border-t border-zinc-800/80">
                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
