import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  User,
  Client,
  Project,
  Task,
  TaskType,
  CustomFieldDefinition,
  Asset,
  Invoice,
  Payment,
  NotificationItem,
  ActivityLogItem,
  TaskComment,
  OrganizationSettings,
  Agency,
  TaskStatus,
  DeliverableFile,
  UserRole,
} from '../types';
import {
  initialAgencies,
  initialOrgSettings,
  initialUsers,
  initialClients,
  initialProjects,
  initialTaskTypes,
  initialTasks,
  initialAssets,
  initialInvoices,
  initialPayments,
  initialComments,
  initialActivityLogs,
  initialNotifications,
} from '../data/initialData';
import {
  COLLECTIONS,
  saveDocument,
  deleteDocument,
  fetchOrgDocuments,
} from '../firebase/firestoreService';
import { auth } from '../firebase/config';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export type NavigationTab =
  | 'home'
  | 'dashboard'
  | 'clients'
  | 'projects'
  | 'tasks'
  | 'employees'
  | 'calendar'
  | 'assets'
  | 'invoices'
  | 'payments'
  | 'reports'
  | 'notifications'
  | 'settings'
  | 'profile';

export interface CreateAgencyInput {
  name: string;
  tagline?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  currency?: string;
  subscriptionPlan?: 'Starter' | 'Growth' | 'Enterprise Pro';
}

export interface CreateAdminInput {
  name: string;
  email: string;
  password?: string;
  phone?: string;
}

interface AgencyContextType {
  // Multi-Agency & Tenancy
  agencies: Agency[];
  currentAgency: Agency;
  orgSettings: OrganizationSettings; // Alias for backward compatibility
  switchAgency: (agencyId: string) => void;
  createAgency: (agencyInput: CreateAgencyInput, adminInput: CreateAdminInput, autoLogin?: boolean) => { agency: Agency; admin: User };
  updateOrgSettings: (settings: Partial<OrganizationSettings>) => void;
  updateAgency: (agencyId: string, data: Partial<Agency>) => void;
  resetAllData: () => void;

  // Firebase Database Connection & Sync
  isFirebaseConnected: boolean;
  firebaseProjectId: string;
  firestoreDatabaseId: string;
  firebaseUser: FirebaseUser | null;
  isAuthReady: boolean;
  loginWithGoogle: () => Promise<void>;
  logoutFromGoogle: () => Promise<void>;

  // Authentication & Session
  isAuthenticated: boolean;
  currentUser: User;
  allUsers: User[]; // All users across system for demo/auth lookup
  users: User[]; // STRICTLY scoped to current agency
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  quickDemoLogin: (userId: string) => void;
  switchUser: (userId: string) => void;
  startDemo: () => void;

  // Employee creation & management (Admin only, scoped to agency)
  addUser: (userData: Omit<User, 'id' | 'orgId' | 'joinedDate'>) => User;
  updateUser: (userId: string, data: Partial<User>) => void;
  deactivateUser: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Navigation & Modals
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedInvoiceId: string | null;
  setSelectedInvoiceId: (id: string | null) => void;

  // Modals visibility triggers
  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (open: boolean) => void;
  createTaskInitialDate: string | null;
  setCreateTaskInitialDate: (date: string | null) => void;
  openCreateTaskWithDate: (dateStr: string) => void;
  isCreateClientOpen: boolean;
  setIsCreateClientOpen: (open: boolean) => void;
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;
  isCreateInvoiceOpen: boolean;
  setIsCreateInvoiceOpen: (open: boolean) => void;
  isUploadAssetOpen: boolean;
  setIsUploadAssetOpen: (open: boolean) => void;
  isRecordPaymentOpen: boolean;
  setIsRecordPaymentOpen: (open: boolean) => void;
  paymentTargetInvoiceId: string | null;
  setPaymentTargetInvoiceId: (id: string | null) => void;

  // Search, Tour & Auth Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  isCreateAgencyModalOpen: boolean;
  setIsCreateAgencyModalOpen: (open: boolean) => void;

  // Agency Scoped Entities
  clients: Client[];
  addClient: (clientData: Omit<Client, 'id' | 'orgId' | 'createdAt'>) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  projects: Project[];
  projectCategories: string[];
  addProjectCategory: (categoryName: string) => void;
  addProject: (projectData: Omit<Project, 'id' | 'orgId' | 'createdAt' | 'progress'>) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  tasks: Task[];
  taskTypes: TaskType[];
  addTaskType: (typeData: Omit<TaskType, 'id' | 'orgId'>) => TaskType;
  addCustomFieldToTaskType: (taskTypeId: string, field: Omit<CustomFieldDefinition, 'id' | 'taskTypeId'>) => void;
  deleteCustomField: (taskTypeId: string, fieldId: string) => void;

  addTask: (taskData: Omit<Task, 'id' | 'orgId' | 'createdAt' | 'deliverables' | 'revisionCount'>) => Task;
  updateTask: (taskId: string, data: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  submitDeliverable: (taskId: string, file: Omit<DeliverableFile, 'id' | 'version' | 'uploadedAt' | 'uploadedBy'>) => void;
  requestRevision: (taskId: string, feedback: string) => void;
  approveTask: (taskId: string) => void;
  isTaskOverdue: (task: Task) => boolean;

  comments: TaskComment[];
  addTaskComment: (taskId: string, content: string) => void;

  assets: Asset[];
  addAsset: (assetData: Omit<Asset, 'id' | 'orgId' | 'uploadedAt'>) => Asset;
  deleteAsset: (assetId: string) => void;

  invoices: Invoice[];
  payments: Payment[];
  addInvoice: (invoiceData: Omit<Invoice, 'id' | 'orgId' | 'createdAt' | 'paidAmount' | 'dueAmount' | 'status'>) => Invoice;
  updateInvoice: (invoiceId: string, data: Partial<Invoice>) => void;
  deleteInvoice: (invoiceId: string) => void;
  recordPayment: (paymentData: Omit<Payment, 'id' | 'orgId' | 'createdAt'>) => Payment;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  activityLogs: ActivityLogItem[];
  logActivity: (item: Omit<ActivityLogItem, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => void;

  // Permissions helpers
  canManageTeam: boolean;
  canManageFinances: boolean;
  canAssignTasks: boolean;
  canReviewWork: boolean;
  visibleTasks: Task[];
  visibleProjects: Project[];
  visibleClients: Client[];
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

const STORAGE_KEY = 'omni_agency_clean_v7_empty';

export const AgencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Multi-Agency State
  const [agencies, setAgencies] = useState<Agency[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_agencies`);
    return saved ? JSON.parse(saved) : initialAgencies;
  });

  // All Users across agencies
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // Authenticated user ID (null if logged out)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    // Default to 'user-admin' so initial load is ready and interactive
    return saved !== null ? (saved === 'null' ? null : saved) : 'user-admin';
  });

  // All Entities (Global store holding all tenants' data)
  const [allClients, setAllClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_clients`);
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [allProjects, setAllProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
    return saved ? JSON.parse(saved) : initialProjects;
  });

  // Default Task Categories: Strictly Graphic Designer & Video Editor, plus custom
  const [projectCategories, setProjectCategories] = useState<string[]>(() => {
    const defaultList = ['Graphic Designer', 'Video Editor'];
    const saved = localStorage.getItem(`${STORAGE_KEY}_task_categories`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const combined = Array.from(new Set([...defaultList, ...parsed]));
          return combined;
        }
      } catch {}
    }
    return defaultList;
  });

  const addProjectCategory = (categoryName: string) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    setProjectCategories((prev) => {
      if (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return prev;
      const updated = [...prev, trimmed];
      localStorage.setItem(`${STORAGE_KEY}_task_categories`, JSON.stringify(updated));
      return updated;
    });
  };

  const [allTaskTypes, setAllTaskTypes] = useState<TaskType[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_task_types`);
    return saved ? JSON.parse(saved) : initialTaskTypes;
  });

  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [allAssets, setAllAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assets`);
    return saved ? JSON.parse(saved) : initialAssets;
  });

  const [allInvoices, setAllInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [allPayments, setAllPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [allComments, setAllComments] = useState<TaskComment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_comments`);
    return saved ? JSON.parse(saved) : initialComments;
  });

  const [allActivityLogs, setAllActivityLogs] = useState<ActivityLogItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activity`);
    return saved ? JSON.parse(saved) : initialActivityLogs;
  });

  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Navigation & UI State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskInitialDate, setCreateTaskInitialDate] = useState<string | null>(null);

  const openCreateTaskWithDate = (dateStr: string) => {
    setCreateTaskInitialDate(dateStr);
    setIsCreateTaskOpen(true);
  };

  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isUploadAssetOpen, setIsUploadAssetOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [paymentTargetInvoiceId, setPaymentTargetInvoiceId] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isCreateAgencyModalOpen, setIsCreateAgencyModalOpen] = useState(false);

  // Firebase Firestore & Auth State
  const [isFirebaseConnected] = useState<boolean>(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const firebaseProjectId = firebaseConfig.projectId;
  const firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;

  // On mount: listen to Firebase Auth; only query Firestore when user is authenticated
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      setFirebaseUser(user);
      setIsAuthReady(true);

      if (user) {
        // Authenticated in Firebase: fetch remote data
        try {
          const remoteAgencies = await fetchOrgDocuments<Agency>(COLLECTIONS.AGENCIES);
          if (remoteAgencies && remoteAgencies.length > 0 && isMounted) {
            setAgencies((prev) => {
              const map = new Map(prev.map((a) => [a.id, a]));
              remoteAgencies.forEach((a) => map.set(a.id, a));
              return Array.from(map.values());
            });
          }
        } catch (err) {
          console.warn('Firestore sync note:', err);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_agencies`, JSON.stringify(agencies));
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(allUsers));
      localStorage.setItem(`${STORAGE_KEY}_current_user`, currentUserId ? currentUserId : 'null');
      localStorage.setItem(`${STORAGE_KEY}_clients`, JSON.stringify(allClients));
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(allProjects));
      localStorage.setItem(`${STORAGE_KEY}_task_types`, JSON.stringify(allTaskTypes));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(allTasks));
      localStorage.setItem(`${STORAGE_KEY}_assets`, JSON.stringify(allAssets));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(allInvoices));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(allPayments));
      localStorage.setItem(`${STORAGE_KEY}_comments`, JSON.stringify(allComments));
      localStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(allActivityLogs));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(allNotifications));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [
    agencies,
    allUsers,
    currentUserId,
    allClients,
    allProjects,
    allTaskTypes,
    allTasks,
    allAssets,
    allInvoices,
    allPayments,
    allComments,
    allActivityLogs,
    allNotifications,
  ]);

  // Authenticated user resolution
  const currentUser: User = useMemo(() => {
    if (!currentUserId) return allUsers[0];
    const found = allUsers.find((u) => u.id === currentUserId);
    return found || allUsers[0];
  }, [allUsers, currentUserId]);

  const isAuthenticated = Boolean(currentUserId && allUsers.some((u) => u.id === currentUserId));

  // Current Agency resolution (strictly bound to authenticated user's orgId)
  const currentAgency: Agency = useMemo(() => {
    if (!currentUser || !currentUser.orgId) return agencies[0];
    const found = agencies.find((a) => a.id === currentUser.orgId);
    return found || agencies[0];
  }, [agencies, currentUser]);

  // Alias for backward compatibility
  const orgSettings = currentAgency;

  // ========================================================
  // CRITICAL: STRICT MULTI-TENANCY DATA ISOLATION
  // Under NO circumstances does Agency A receive Agency B records!
  // ========================================================
  const currentAgencyId = currentAgency.id;

  const users = useMemo(() => {
    return allUsers.filter((u) => u.orgId === currentAgencyId);
  }, [allUsers, currentAgencyId]);

  const clients = useMemo(() => {
    return allClients.filter((c) => c.orgId === currentAgencyId);
  }, [allClients, currentAgencyId]);

  const projects = useMemo(() => {
    return allProjects.filter((p) => p.orgId === currentAgencyId);
  }, [allProjects, currentAgencyId]);

  const tasks = useMemo(() => {
    return allTasks.filter((t) => t.orgId === currentAgencyId);
  }, [allTasks, currentAgencyId]);

  const assets = useMemo(() => {
    return allAssets.filter((a) => a.orgId === currentAgencyId);
  }, [allAssets, currentAgencyId]);

  const invoices = useMemo(() => {
    return allInvoices.filter((inv) => inv.orgId === currentAgencyId);
  }, [allInvoices, currentAgencyId]);

  const payments = useMemo(() => {
    return allPayments.filter((pay) => pay.orgId === currentAgencyId);
  }, [allPayments, currentAgencyId]);

  const taskTypes = useMemo(() => {
    const list = allTaskTypes.filter((tt) => tt.orgId === currentAgencyId);
    // If a brand new agency doesn't have custom task types yet, fall back to default template
    if (list.length === 0) {
      return initialTaskTypes.map((tt) => ({ ...tt, orgId: currentAgencyId }));
    }
    return list;
  }, [allTaskTypes, currentAgencyId]);

  const comments = useMemo(() => {
    // Only comments for tasks in this agency
    const agencyTaskIds = new Set(tasks.map((t) => t.id));
    return allComments.filter((c) => agencyTaskIds.has(c.taskId));
  }, [allComments, tasks]);

  const activityLogs = useMemo(() => {
    return allActivityLogs.filter(
      (act) => act.orgId === currentAgencyId || (act.userId && users.some((u) => u.id === act.userId))
    );
  }, [allActivityLogs, currentAgencyId, users]);

  const notifications = useMemo(() => {
    return allNotifications.filter(
      (n) => n.orgId === currentAgencyId && n.userId === currentUser.id
    );
  }, [allNotifications, currentAgencyId, currentUser]);

  // ========================================================
  // AUTHENTICATION FLOWS (Email + Password)
  // ========================================================
  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = allUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.active
    );

    if (!user) {
      return { success: false, error: 'No active account found with this email address.' };
    }

    // Verify password (demo default is 'password123')
    if (user.password && user.password !== password.trim()) {
      return { success: false, error: 'Incorrect password. (Demo password: password123)' };
    }

    setCurrentUserId(user.id);
    if (user.role === 'employee') {
      setCurrentTab('dashboard');
    }
    return { success: true };
  };

  const logout = () => {
    if (auth.currentUser) {
      signOut(auth).catch(() => {});
    }
    setFirebaseUser(null);
    setCurrentUserId(null);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        setFirebaseUser(user);
        const existing = allUsers.find(
          (u) => u.email.toLowerCase() === (user.email || '').toLowerCase()
        );
        if (existing) {
          setCurrentUserId(existing.id);
        } else {
          // Create new Agency & Admin user for this Google account
          const newUserId = `usr_${user.uid.substring(0, 12)}`;
          const newAgencyId = `agency_${user.uid.substring(0, 12)}`;
          const agencyName = user.displayName ? `${user.displayName}'s Agency` : 'Digital Growth Agency';
          const newAgency: Agency = {
            id: newAgencyId,
            name: agencyName,
            tagline: 'High-Impact Performance Creative Agency',
            logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
            email: user.email || 'agency@example.com',
            phone: '+1 (555) 000-0000',
            address: 'Headquarters',
            website: 'https://agency.com',
            currency: 'USD',
            currencySymbol: '$',
            timezone: 'America/New_York (EST)',
            taxRateDefault: 8.0,
            subscriptionPlan: 'Growth',
            subscriptionStatus: 'active',
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
            ownerId: user.uid,
          };
          const newAdmin: User = {
            id: newUserId,
            orgId: newAgencyId,
            name: user.displayName || 'Agency Owner',
            email: user.email || '',
            role: 'admin',
            employeeTitle: 'Founder & CEO',
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
            active: true,
            status: 'active',
            skills: ['Leadership', 'Digital Strategy', 'Creative Direction'],
            joinedDate: new Date().toISOString().split('T')[0],
          };

          setAgencies((prev) => [...prev, newAgency]);
          setAllUsers((prev) => [...prev, newAdmin]);
          setCurrentUserId(newUserId);

          saveDocument(COLLECTIONS.AGENCIES, newAgency);
          saveDocument(COLLECTIONS.USERS, newAdmin);
        }
      }
    } catch (err) {
      console.error('Firebase Google Sign-In error:', err);
      throw err;
    }
  };

  const logoutFromGoogle = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setFirebaseUser(null);
    setCurrentUserId(null);
  };

  const quickDemoLogin = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      if (target.role === 'employee' && currentTab !== 'dashboard' && currentTab !== 'projects') {
        setCurrentTab('dashboard');
      }
    }
  };

  const switchUser = (userId: string) => {
    quickDemoLogin(userId);
  };

  const startDemo = () => {
    const adminUser =
      allUsers.find((u) => u.role === 'admin' && u.orgId === currentAgencyId) ||
      allUsers.find((u) => u.role === 'admin') ||
      allUsers[0];
    if (adminUser) {
      setCurrentUserId(adminUser.id);
    }
    setCurrentTab('dashboard');
  };

  const switchAgency = (agencyId: string) => {
    const targetAgency = agencies.find((a) => a.id === agencyId);
    if (!targetAgency) return;
    // Find admin or first user of that agency
    const agencyUser = allUsers.find((u) => u.orgId === agencyId && u.role === 'admin') ||
      allUsers.find((u) => u.orgId === agencyId);
    if (agencyUser) {
      setCurrentUserId(agencyUser.id);
    }
  };

  // Create brand new Agency with its own isolated workspace
  const createAgency = (
    agencyInput: CreateAgencyInput,
    adminInput: CreateAdminInput,
    autoLogin = true
  ): { agency: Agency; admin: User } => {
    const agencyId = `org-${Date.now()}`;
    const adminId = `user-${Date.now()}`;

    const newAgency: Agency = {
      id: agencyId,
      name: agencyInput.name.trim(),
      tagline: agencyInput.tagline?.trim() || 'Digital Marketing & Creative Agency',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
      email: agencyInput.email.trim(),
      phone: agencyInput.phone?.trim() || '+1 (555) 000-0000',
      address: agencyInput.address?.trim() || 'Headquarters',
      website: agencyInput.website?.trim() || 'https://agency.com',
      currency: agencyInput.currency || 'USD',
      currencySymbol: '$',
      timezone: 'America/New_York (EST)',
      taxRateDefault: 8.0,
      subscriptionPlan: agencyInput.subscriptionPlan || 'Growth',
      subscriptionStatus: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      ownerId: adminId,
      status: 'active',
    };

    const newAdmin: User = {
      id: adminId,
      orgId: agencyId,
      name: adminInput.name.trim(),
      email: adminInput.email.trim().toLowerCase(),
      password: adminInput.password?.trim() || 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      employeeTitle: 'Agency Founder & Principal',
      phone: adminInput.phone?.trim() || '+1 (555) 000-0000',
      active: true,
      status: 'active',
      skills: ['Agency Leadership', 'Client Acquisition', 'Operations'],
      joinedDate: new Date().toISOString().split('T')[0],
    };

    // Duplicate standard task types for this agency
    const defaultAgencyTypes: TaskType[] = initialTaskTypes.map((tt) => ({
      ...tt,
      id: `task-type-${agencyId}-${tt.category}`,
      orgId: agencyId,
    }));

    setAgencies((prev) => [...prev, newAgency]);
    setAllUsers((prev) => [...prev, newAdmin]);
    setAllTaskTypes((prev) => [...prev, ...defaultAgencyTypes]);

    // Persist to Firestore
    saveDocument(COLLECTIONS.AGENCIES, newAgency);
    saveDocument(COLLECTIONS.USERS, newAdmin);
    defaultAgencyTypes.forEach((tt) => saveDocument(COLLECTIONS.TASK_TYPES, tt));

    // Automatically switch to the newly created agency if autoLogin is true
    if (autoLogin) {
      setCurrentUserId(newAdmin.id);
    }

    return { agency: newAgency, admin: newAdmin };
  };

  const updateOrgSettings = (settings: Partial<OrganizationSettings>) => {
    setAgencies((prev) => {
      const updated = prev.map((a) => (a.id === currentAgencyId ? { ...a, ...settings } : a));
      const target = updated.find((a) => a.id === currentAgencyId);
      if (target) saveDocument(COLLECTIONS.AGENCIES, target);
      return updated;
    });
  };

  const updateAgency = (agencyId: string, data: Partial<Agency>) => {
    setAgencies((prev) => {
      const updated = prev.map((a) => (a.id === agencyId ? { ...a, ...data } : a));
      const target = updated.find((a) => a.id === agencyId);
      if (target) saveDocument(COLLECTIONS.AGENCIES, target);
      return updated;
    });
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_agencies`);
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    localStorage.removeItem(`${STORAGE_KEY}_clients`);
    localStorage.removeItem(`${STORAGE_KEY}_projects`);
    localStorage.removeItem(`${STORAGE_KEY}_task_types`);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_assets`);
    localStorage.removeItem(`${STORAGE_KEY}_invoices`);
    localStorage.removeItem(`${STORAGE_KEY}_payments`);
    localStorage.removeItem(`${STORAGE_KEY}_comments`);
    localStorage.removeItem(`${STORAGE_KEY}_activity`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);

    setAgencies(initialAgencies);
    setAllUsers(initialUsers);
    setCurrentUserId('user-admin');
    setAllClients(initialClients);
    setAllProjects(initialProjects);
    setAllTaskTypes(initialTaskTypes);
    setAllTasks(initialTasks);
    setAllAssets(initialAssets);
    setAllInvoices(initialInvoices);
    setAllPayments(initialPayments);
    setAllComments(initialComments);
    setAllActivityLogs(initialActivityLogs);
    setAllNotifications(initialNotifications);
  };

  // Permissions helpers within agency
  const canManageTeam = currentUser.role === 'admin';
  const canManageFinances = currentUser.role === 'admin';
  const canAssignTasks = currentUser.role === 'admin' || currentUser.role === 'call_center' || currentUser.role === 'manager';
  const canReviewWork = currentUser.role === 'admin' || currentUser.role === 'call_center' || currentUser.role === 'manager';

  const isTaskOverdue = (task: Task): boolean => {
    if (task.status === 'completed' || task.status === 'approved' || task.status === 'cancelled') {
      return false;
    }
    const deadlineTime = new Date(task.deadline).getTime();
    return deadlineTime < Date.now();
  };

  // RBAC Scoped within the Authenticated Agency
  const visibleTasks = useMemo(() => {
    if (currentUser.role === 'admin' || currentUser.role === 'manager') return tasks;
    return tasks.filter((t) => t.assignedEmployeeId === currentUser.id);
  }, [tasks, currentUser]);

  const visibleProjects = useMemo(() => {
    if (currentUser.role === 'admin' || currentUser.role === 'manager') return projects;
    // For employee: ONLY projects created by admin that are assigned to this employee
    return projects.filter((p) => p.assignedTo === currentUser.id);
  }, [projects, currentUser]);

  const visibleClients = useMemo(() => {
    if (currentUser.role === 'admin' || currentUser.role === 'call_center' || currentUser.role === 'manager') return clients;
    const myProjectClientIds = new Set(visibleProjects.map((p) => p.clientId));
    return clients.filter((c) => myProjectClientIds.has(c.id));
  }, [clients, visibleProjects, currentUser]);

  // Log activity helper (scoped with currentAgencyId)
  const logActivity = (item: Omit<ActivityLogItem, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => {
    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orgId: currentAgencyId,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      ...item,
    };
    setAllActivityLogs((prev) => [newLog, ...prev]);
  };

  // Users management (Admin creates employee accounts for their agency)
  const addUser = (userData: Omit<User, 'id' | 'orgId' | 'joinedDate'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      orgId: currentAgencyId, // STRICTLY scoped to the current agency!
      password: userData.password || 'password123',
      active: true,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setAllUsers((prev) => [...prev, newUser]);
    saveDocument(COLLECTIONS.USERS, newUser);
    logActivity({
      entityType: 'system',
      entityId: newUser.id,
      action: 'Team Member Added',
      details: `Added ${newUser.name} as ${newUser.employeeTitle} (${newUser.role}) to ${currentAgency.name}`,
    });
    return newUser;
  };

  const updateUser = (userId: string, data: Partial<User>) => {
    setAllUsers((prev) => {
      const updated = prev.map((u) => (u.id === userId ? { ...u, ...data } : u));
      const target = updated.find((u) => u.id === userId);
      if (target) saveDocument(COLLECTIONS.USERS, target);
      return updated;
    });
  };

  const deactivateUser = (userId: string) => {
    setAllUsers((prev) => {
      const updated = prev.map((u) => (u.id === userId ? { ...u, active: false, status: 'inactive' as const } : u));
      const target = updated.find((u) => u.id === userId);
      if (target) saveDocument(COLLECTIONS.USERS, target);
      return updated;
    });
    logActivity({
      entityType: 'system',
      entityId: userId,
      action: 'User Deactivated',
      details: `Deactivated user account`,
    });
  };

  const deleteUser = (userId: string) => {
    // Unassign tasks assigned to this user
    setAllTasks((prev) =>
      prev.map((t) => (t.assignedEmployeeId === userId ? { ...t, assignedEmployeeId: '', status: 'pending' } : t))
    );
    // Remove user from allUsers
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    deleteDocument(COLLECTIONS.USERS, userId);
    logActivity({
      entityType: 'system',
      entityId: userId,
      action: 'Team Member Deleted',
      details: `Deleted team member from ${currentAgency.name}`,
    });
  };

  // Clients
  const addClient = (clientData: Omit<Client, 'id' | 'orgId' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      orgId: currentAgencyId,
      createdAt: new Date().toISOString(),
    };
    setAllClients((prev) => [newClient, ...prev]);
    saveDocument(COLLECTIONS.CLIENTS, newClient);
    logActivity({
      entityType: 'client',
      entityId: newClient.id,
      action: 'Client Onboarded',
      details: `Added new client ${newClient.company} (${newClient.name})`,
    });
    return newClient;
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    setAllClients((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...data } : c));
      const target = updated.find((c) => c.id === id);
      if (target) saveDocument(COLLECTIONS.CLIENTS, target);
      return updated;
    });
  };

  const deleteClient = (id: string) => {
    setAllClients((prev) => prev.filter((c) => c.id !== id));
    deleteDocument(COLLECTIONS.CLIENTS, id);
  };

  // Projects
  const addProject = (projectData: Omit<Project, 'id' | 'orgId' | 'createdAt' | 'progress'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      orgId: currentAgencyId,
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    setAllProjects((prev) => [newProject, ...prev]);
    saveDocument(COLLECTIONS.PROJECTS, newProject);
    logActivity({
      entityType: 'project',
      entityId: newProject.id,
      action: 'Project Created',
      details: `Created campaign "${newProject.name}"${newProject.budget ? ` with budget $${newProject.budget.toLocaleString()}` : ''}`,
    });
    return newProject;
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setAllProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...data } : p));
      const target = updated.find((p) => p.id === id);
      if (target) saveDocument(COLLECTIONS.PROJECTS, target);
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    setAllProjects((prev) => prev.filter((p) => p.id !== id));
    deleteDocument(COLLECTIONS.PROJECTS, id);
  };

  const refreshProjectProgress = (projectId: string, currentTasks: Task[]) => {
    const projectTasks = currentTasks.filter((t) => t.projectId === projectId);
    if (projectTasks.length === 0) return;
    const completedTasks = projectTasks.filter(
      (t) => t.status === 'completed' || t.status === 'approved'
    ).length;
    const progress = Math.round((completedTasks / projectTasks.length) * 100);
    setAllProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, progress } : p)));
  };

  // Task Types & Custom Field Builder
  const addTaskType = (typeData: Omit<TaskType, 'id' | 'orgId'>) => {
    const newType: TaskType = {
      ...typeData,
      id: `task-type-${Date.now()}`,
      orgId: currentAgencyId,
    };
    setAllTaskTypes((prev) => [...prev, newType]);
    logActivity({
      entityType: 'system',
      entityId: newType.id,
      action: 'Task Type Created',
      details: `Configured new custom task workflow: ${newType.name}`,
    });
    return newType;
  };

  const addCustomFieldToTaskType = (
    taskTypeId: string,
    field: Omit<CustomFieldDefinition, 'id' | 'taskTypeId'>
  ) => {
    const newField: CustomFieldDefinition = {
      ...field,
      id: `cf-${Date.now()}`,
      taskTypeId,
    };
    setAllTaskTypes((prev) =>
      prev.map((tt) => {
        if (tt.id === taskTypeId) {
          return {
            ...tt,
            customFields: [...tt.customFields, newField],
          };
        }
        return tt;
      })
    );
    logActivity({
      entityType: 'system',
      entityId: taskTypeId,
      action: 'Custom Field Added',
      details: `Added dynamic field "${newField.label}" to task configuration`,
    });
  };

  const deleteCustomField = (taskTypeId: string, fieldId: string) => {
    setAllTaskTypes((prev) =>
      prev.map((tt) => {
        if (tt.id === taskTypeId) {
          return {
            ...tt,
            customFields: tt.customFields.filter((cf) => cf.id !== fieldId),
          };
        }
        return tt;
      })
    );
  };

  // Tasks
  const addTask = (taskData: Omit<Task, 'id' | 'orgId' | 'createdAt' | 'deliverables' | 'revisionCount'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      orgId: currentAgencyId,
      deliverables: [],
      revisionCount: 0,
      createdAt: new Date().toISOString(),
    };

    setAllTasks((prev) => {
      const updated = [newTask, ...prev];
      refreshProjectProgress(newTask.projectId, updated);
      return updated;
    });
    saveDocument(COLLECTIONS.TASKS, newTask);

    logActivity({
      entityType: 'task',
      entityId: newTask.id,
      action: 'Task Assigned',
      details: `Assigned "${newTask.title}" to ${allUsers.find((u) => u.id === newTask.assignedEmployeeId)?.name}`,
    });

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      orgId: currentAgencyId,
      userId: newTask.assignedEmployeeId,
      type: 'task_assigned',
      title: 'New Creative Task Assigned',
      message: `You were assigned "${newTask.title}". Deadline: ${new Date(newTask.deadline).toLocaleDateString()}`,
      linkEntityType: 'task',
      linkEntityId: newTask.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setAllNotifications((prev) => [newNotif, ...prev]);

    return newTask;
  };

  const updateTask = (taskId: string, data: Partial<Task>) => {
    setAllTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, ...data } : t));
      const target = updated.find((t) => t.id === taskId);
      if (target) {
        refreshProjectProgress(target.projectId, updated);
        saveDocument(COLLECTIONS.TASKS, target);
      }
      return updated;
    });
  };

  const deleteTask = (taskId: string) => {
    const target = allTasks.find((t) => t.id === taskId);
    setAllTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      if (target) {
        refreshProjectProgress(target.projectId, updated);
      }
      return updated;
    });
    deleteDocument(COLLECTIONS.TASKS, taskId);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setAllTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const isDone = status === 'completed' || status === 'approved';
          return {
            ...t,
            status,
            completedAt: isDone ? new Date().toISOString() : t.completedAt,
          };
        }
        return t;
      });
      const target = updated.find((t) => t.id === taskId);
      if (target) {
        refreshProjectProgress(target.projectId, updated);
        saveDocument(COLLECTIONS.TASKS, target);
      }
      return updated;
    });

    logActivity({
      entityType: 'task',
      entityId: taskId,
      action: `Status Changed to ${status.replace('_', ' ')}`,
      details: `Task status updated by ${currentUser.name}`,
    });
  };

  const submitDeliverable = (
    taskId: string,
    file: Omit<DeliverableFile, 'id' | 'version' | 'uploadedAt' | 'uploadedBy'>
  ) => {
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) return;

    const nextVersion = (task.deliverables.length || 0) + 1;
    const newDeliverable: DeliverableFile = {
      ...file,
      id: `del-${Date.now()}`,
      version: nextVersion,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.name,
    };

    const updatedTask: Task = {
      ...task,
      status: 'under_review',
      deliverables: [...task.deliverables, newDeliverable],
    };

    setAllTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    // Also add to global Assets library with orgId
    const newAsset: Asset = {
      id: `asset-${Date.now()}`,
      orgId: currentAgencyId,
      clientId: task.clientId,
      projectId: task.projectId,
      taskId: task.id,
      uploaderId: currentUser.id,
      fileName: file.fileName,
      fileType: file.fileType === 'link' ? 'document' : file.fileType,
      category: 'deliverable',
      fileSize: file.fileSize || '15 MB',
      url: file.fileUrl,
      thumbnailUrl: file.fileType === 'image' ? file.fileUrl : undefined,
      uploadedAt: new Date().toISOString(),
      version: nextVersion,
    };
    setAllAssets((prev) => [newAsset, ...prev]);

    logActivity({
      entityType: 'task',
      entityId: taskId,
      action: `Uploaded Deliverable v${nextVersion}`,
      details: `${currentUser.name} uploaded ${file.fileName} for review`,
    });

    const managerRecipientId = task.assignedByUserId || 'user-manager';
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      orgId: currentAgencyId,
      userId: managerRecipientId,
      type: 'deliverable_submitted',
      title: `Deliverable v${nextVersion} Submitted`,
      message: `${currentUser.name} submitted work for "${task.title}". Needs creative review.`,
      linkEntityType: 'task',
      linkEntityId: task.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setAllNotifications((prev) => [notif, ...prev]);
  };

  const requestRevision = (taskId: string, feedback: string) => {
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      status: 'revision_required',
      revisionCount: task.revisionCount + 1,
      latestRevisionFeedback: feedback,
    };

    setAllTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    addTaskComment(taskId, `⚠️ REVISION REQUESTED by ${currentUser.name}:\n"${feedback}"`);

    logActivity({
      entityType: 'task',
      entityId: taskId,
      action: `Revision Requested (Rev #${task.revisionCount + 1})`,
      details: `${currentUser.name} requested changes on "${task.title}": ${feedback.substring(0, 80)}...`,
    });

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      orgId: currentAgencyId,
      userId: task.assignedEmployeeId,
      type: 'revision_requested',
      title: `Revision Requested on "${task.title}"`,
      message: `${currentUser.name}: ${feedback}`,
      linkEntityType: 'task',
      linkEntityId: task.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setAllNotifications((prev) => [notif, ...prev]);
  };

  const approveTask = (taskId: string) => {
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) return;

    setAllTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'completed' as TaskStatus,
            completedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      refreshProjectProgress(task.projectId, updated);
      return updated;
    });

    addTaskComment(taskId, `🎉 APPROVED by ${currentUser.name}! Excellent delivery.`);

    logActivity({
      entityType: 'task',
      entityId: taskId,
      action: 'Task Approved & Completed',
      details: `${currentUser.name} approved the final deliverable for "${task.title}"`,
    });

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      orgId: currentAgencyId,
      userId: task.assignedEmployeeId,
      type: 'task_approved',
      title: `Task Approved & Completed! 🏆`,
      message: `Your deliverable for "${task.title}" has been approved by ${currentUser.name}.`,
      linkEntityType: 'task',
      linkEntityId: task.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setAllNotifications((prev) => [notif, ...prev]);
  };

  const addTaskComment = (taskId: string, content: string) => {
    const newComment: TaskComment = {
      id: `comm-${Date.now()}`,
      taskId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content,
      createdAt: new Date().toISOString(),
    };
    setAllComments((prev) => [...prev, newComment]);
    saveDocument(COLLECTIONS.COMMENTS, newComment);
  };

  // Assets
  const addAsset = (assetData: Omit<Asset, 'id' | 'orgId' | 'uploadedAt'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: `asset-${Date.now()}`,
      orgId: currentAgencyId,
      uploadedAt: new Date().toISOString(),
    };
    setAllAssets((prev) => [newAsset, ...prev]);
    saveDocument(COLLECTIONS.ASSETS, newAsset);
    logActivity({
      entityType: 'system',
      entityId: newAsset.id,
      action: 'Asset Uploaded',
      details: `${currentUser.name} uploaded ${newAsset.fileName} (${newAsset.category})`,
    });
    return newAsset;
  };

  const deleteAsset = (assetId: string) => {
    setAllAssets((prev) => prev.filter((a) => a.id !== assetId));
    deleteDocument(COLLECTIONS.ASSETS, assetId);
  };

  // Invoices & Payments
  const addInvoice = (
    invoiceData: Omit<Invoice, 'id' | 'orgId' | 'createdAt' | 'paidAmount' | 'dueAmount' | 'status'>
  ) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      orgId: currentAgencyId,
      paidAmount: 0,
      dueAmount: invoiceData.totalAmount,
      status: 'unpaid',
      createdAt: new Date().toISOString(),
    };
    setAllInvoices((prev) => [newInvoice, ...prev]);
    saveDocument(COLLECTIONS.INVOICES, newInvoice);
    logActivity({
      entityType: 'invoice',
      entityId: newInvoice.id,
      action: 'Invoice Created',
      details: `Generated invoice ${newInvoice.invoiceNumber} for $${newInvoice.totalAmount.toLocaleString()}`,
    });
    return newInvoice;
  };

  const updateInvoice = (invoiceId: string, data: Partial<Invoice>) => {
    setAllInvoices((prev) => {
      const updated = prev.map((inv) => (inv.id === invoiceId ? { ...inv, ...data } : inv));
      const target = updated.find((inv) => inv.id === invoiceId);
      if (target) saveDocument(COLLECTIONS.INVOICES, target);
      return updated;
    });
  };

  const deleteInvoice = (invoiceId: string) => {
    setAllInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
    deleteDocument(COLLECTIONS.INVOICES, invoiceId);
  };

  const recordPayment = (paymentData: Omit<Payment, 'id' | 'orgId' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      orgId: currentAgencyId,
      createdAt: new Date().toISOString(),
    };
    setAllPayments((prev) => [newPayment, ...prev]);
    saveDocument(COLLECTIONS.PAYMENTS, newPayment);

    setAllInvoices((prev) => {
      const updated = prev.map((inv) => {
        if (inv.id === paymentData.invoiceId) {
          const newPaid = inv.paidAmount + paymentData.amount;
          const newDue = Math.max(0, inv.totalAmount - newPaid);
          const newStatus =
            newDue === 0 ? 'paid' : newPaid > 0 ? 'partially_paid' : inv.status;
          const updatedInv = {
            ...inv,
            paidAmount: newPaid,
            dueAmount: newDue,
            status: newStatus,
          };
          saveDocument(COLLECTIONS.INVOICES, updatedInv);
          return updatedInv;
        }
        return inv;
      });
      return updated;
    });

    logActivity({
      entityType: 'invoice',
      entityId: paymentData.invoiceId,
      action: 'Payment Recorded',
      details: `Received $${paymentData.amount.toLocaleString()} via ${paymentData.paymentMethod.replace('_', ' ')} (Ref: ${paymentData.referenceNo})`,
    });

    // Notify agency admin
    const agencyAdmin = users.find((u) => u.role === 'admin') || currentUser;
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      orgId: currentAgencyId,
      userId: agencyAdmin.id,
      type: 'payment_received',
      title: `Payment Recorded ($${paymentData.amount.toLocaleString()})`,
      message: `Payment of $${paymentData.amount.toLocaleString()} confirmed for invoice.`,
      linkEntityType: 'invoice',
      linkEntityId: paymentData.invoiceId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setAllNotifications((prev) => [notif, ...prev]);

    return newPayment;
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setAllNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.orgId === currentAgencyId && n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
  };

  const clearNotifications = () => {
    setAllNotifications((prev) =>
      prev.filter((n) => !(n.orgId === currentAgencyId && n.userId === currentUser.id))
    );
  };

  const value: AgencyContextType = {
    // Multi-Agency
    agencies,
    currentAgency,
    orgSettings,
    switchAgency,
    createAgency,
    updateOrgSettings,
    updateAgency,
    resetAllData,

    // Firebase Database & Auth
    isFirebaseConnected,
    firebaseProjectId,
    firestoreDatabaseId,
    firebaseUser,
    isAuthReady,
    loginWithGoogle,
    logoutFromGoogle,

    // Authentication
    isAuthenticated,
    currentUser,
    allUsers,
    users,
    login,
    logout,
    quickDemoLogin,
    switchUser,
    startDemo,

    // Users
    addUser,
    updateUser,
    deactivateUser,
    deleteUser,

    // Navigation & Modals
    currentTab,
    setCurrentTab,
    selectedTaskId,
    setSelectedTaskId,
    selectedClientId,
    setSelectedClientId,
    selectedProjectId,
    setSelectedProjectId,
    selectedInvoiceId,
    setSelectedInvoiceId,

    isCreateTaskOpen,
    setIsCreateTaskOpen,
    createTaskInitialDate,
    setCreateTaskInitialDate,
    openCreateTaskWithDate,
    isCreateClientOpen,
    setIsCreateClientOpen,
    isCreateProjectOpen,
    setIsCreateProjectOpen,
    isCreateInvoiceOpen,
    setIsCreateInvoiceOpen,
    isUploadAssetOpen,
    setIsUploadAssetOpen,
    isRecordPaymentOpen,
    setIsRecordPaymentOpen,
    paymentTargetInvoiceId,
    setPaymentTargetInvoiceId,

    isSearchOpen,
    setIsSearchOpen,
    isTourOpen,
    setIsTourOpen,
    isCreateAgencyModalOpen,
    setIsCreateAgencyModalOpen,

    // Agency Scoped Entities
    clients,
    addClient,
    updateClient,
    deleteClient,

    projects,
    projectCategories,
    addProjectCategory,
    addProject,
    updateProject,
    deleteProject,

    tasks,
    taskTypes,
    addTaskType,
    addCustomFieldToTaskType,
    deleteCustomField,

    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    submitDeliverable,
    requestRevision,
    approveTask,
    isTaskOverdue,

    comments,
    addTaskComment,

    assets,
    addAsset,
    deleteAsset,

    invoices,
    payments,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    recordPayment,

    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    activityLogs,
    logActivity,

    // Permissions
    canManageTeam,
    canManageFinances,
    canAssignTasks,
    canReviewWork,
    visibleTasks,
    visibleProjects,
    visibleClients,
  };

  return <AgencyContext.Provider value={value}>{children}</AgencyContext.Provider>;
};

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
};
