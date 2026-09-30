import React, { useState } from 'react';
import { AgencyProvider, useAgency } from './context/AgencyContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { MobileNav } from './components/layout/MobileNav';

// Public Homepage with MarketMe Theme
import { MarketmeHomepage } from './components/home/MarketmeHomepage';

// Dashboards
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ManagerDashboard } from './components/dashboard/ManagerDashboard';
import { CallCenterDashboard } from './components/dashboard/CallCenterDashboard';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';

// Modules
import { ClientList } from './components/clients/ClientList';
import { ClientDetailModal } from './components/clients/ClientDetailModal';
import { CreateClientModal } from './components/clients/CreateClientModal';

import { ProjectList } from './components/projects/ProjectList';
import { ProjectDetailModal } from './components/projects/ProjectDetailModal';
import { CreateProjectModal } from './components/projects/CreateProjectModal';

import { AgencyCalendar } from './components/calendar/AgencyCalendar';
import { AssetLibrary } from './components/assets/AssetLibrary';

import { InvoiceList } from './components/finance/InvoiceList';
import { InvoiceDetailModal } from './components/finance/InvoiceDetailModal';
import { CreateInvoiceModal } from './components/finance/CreateInvoiceModal';
import { RecordPaymentModal } from './components/finance/RecordPaymentModal';
import { PaymentsList } from './components/finance/PaymentsList';

import { EmployeeList } from './components/employees/EmployeeList';
import { ReportsView } from './components/reports/ReportsView';
import { AdminSettings } from './components/settings/AdminSettings';
import { UserProfileView } from './components/profile/UserProfileView';
import { NotificationsView } from './components/notifications/NotificationsView';

import { LoginView } from './components/auth/LoginView';

// Common Modals
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { OnboardingTour } from './components/tour/OnboardingTour';
import { CreateAgencyModal } from './components/common/CreateAgencyModal';
import { Zap } from 'lucide-react';

const AgencyAppContent: React.FC = () => {
  const { currentTab, setCurrentTab, currentUser, isAuthenticated } = useAgency();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isShowingLoginModal, setIsShowingLoginModal] = useState(false);

  // If user is not authenticated: show public homepage with instant login access
  if (!isAuthenticated) {
    if (isShowingLoginModal) {
      return (
        <>
          <LoginView onViewWebsite={() => setIsShowingLoginModal(false)} />
          <CreateAgencyModal />
        </>
      );
    }

    return (
      <div className="relative min-h-screen bg-[#0d0e12] text-zinc-100">
        <MarketmeHomepage onOpenLogin={() => setIsShowingLoginModal(true)} />
        {/* Floating Agency Login Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsShowingLoginModal(true)}
            className="px-5 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-2xl shadow-orange-500/50 flex items-center space-x-2 transition-all hover:scale-105 border-2 border-white/20 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-white" />
            <span>Sign In to Agency OS</span>
          </button>
        </div>
        <CreateAgencyModal />
      </div>
    );
  }

  // If user is authenticated and specifically browsing the public homepage:
  if (currentTab === 'home') {
    if (currentUser.role === 'employee') {
      setCurrentTab('dashboard');
      return null;
    }
    return (
      <div className="relative min-h-screen bg-[#0d0e12] text-zinc-100">
        <MarketmeHomepage />
        {/* Floating Switcher to jump back to internal Agency OS */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="px-5 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-2xl shadow-orange-500/50 flex items-center space-x-2 transition-all hover:scale-105 border-2 border-white/20 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-white" />
            <span>Return to Agency OS</span>
          </button>
        </div>
      </div>
    );
  }

  // Render main screen component based on currentTab & user role
  const renderMainContent = () => {
    // Employee access restriction: ONLY Dashboard and Projects are accessible!
    if (currentUser.role === 'employee') {
      if (currentTab === 'projects' || currentTab === 'tasks') {
        return <ProjectList />;
      }
      return <EmployeeDashboard />;
    }

    // Call Center access restriction: ONLY dashboard and clients are accessible
    const isCallCenter = currentUser.role === 'call_center' || currentUser.role === 'manager';
    if (isCallCenter) {
      if (currentTab === 'clients') return <ClientList />;
      return <CallCenterDashboard />;
    }

    switch (currentTab) {
      case 'dashboard':
        if (currentUser.role === 'admin') return <AdminDashboard />;
        return <EmployeeDashboard />;

      case 'clients':
        return <ClientList />;

      case 'projects':
      case 'tasks':
        return <ProjectList />;

      case 'employees':
        return <EmployeeList />;

      case 'calendar':
        return <AgencyCalendar />;

      case 'assets':
        return <AssetLibrary />;

      case 'invoices':
        return <InvoiceList />;

      case 'payments':
        return <PaymentsList />;

      case 'reports':
        return <ReportsView />;

      case 'notifications':
        return <NotificationsView />;

      case 'settings':
        return <AdminSettings />;

      case 'profile':
        return <UserProfileView />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d0e12] text-zinc-100 overflow-hidden font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {/* Main Body Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090a0d]/90">
          <div className="max-w-7xl mx-auto">{renderMainContent()}</div>
        </main>
      </div>

      {/* Global Modals & Dialogs */}
      <ClientDetailModal />
      <CreateClientModal />
      <ProjectDetailModal />
      <CreateProjectModal />
      <InvoiceDetailModal />
      <CreateInvoiceModal />
      <RecordPaymentModal />
      <GlobalSearchModal />
      <OnboardingTour />
      <CreateAgencyModal />
    </div>
  );
};

export default function App() {
  return (
    <AgencyProvider>
      <AgencyAppContent />
    </AgencyProvider>
  );
}
