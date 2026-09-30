export type UserRole = 'admin' | 'call_center' | 'manager' | 'employee';

export type ClientProjectType = 'Video' | 'Image' | 'Campaign' | 'Other';

export type EmployeeTypeCategory =
  | 'video_editor'
  | 'graphic_designer'
  | 'motion_designer'
  | 'social_media_designer'
  | 'content_creator'
  | 'advertising_specialist'
  | 'custom';

export interface User {
  id: string;
  orgId: string;
  name: string;
  email: string;
  password?: string; // Credentials for authentication
  avatar: string;
  role: UserRole;
  employeeTypeId?: EmployeeTypeCategory;
  employeeTitle: string; // e.g. "Senior Video Editor", "Call Center Executive"
  phone?: string;
  hourlyRate?: number;
  active: boolean;
  status?: 'active' | 'inactive';
  skills: string[];
  joinedDate: string;
}

export interface Client {
  id: string;
  orgId: string;
  name: string; // Client Name
  company: string; // Company / Brand (synced with name)
  mobileNumber?: string; // Mobile Number
  phone: string; // Mobile Number (synced)
  mainBusinessAssets?: string; // Main Business Assets
  projectType?: ClientProjectType; // Project: Video | Image | Campaign | Other
  totalPrice?: number; // Total Price
  advance?: number; // Advance
  due?: number; // Due
  email: string;
  address?: string;
  website?: string;
  industry?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
  };
  assignedManagerId?: string;
  status?: 'active' | 'inactive' | 'lead';
  notes?: string;
  avatar?: string;
  createdAt?: string;
}

export type ProjectStatus = 'planning' | 'active' | 'in_progress' | 'under_review' | 'on_hold' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface FootageLinkItem {
  id: string;
  title: string;
  url: string;
}

export interface GraphicDesignItem {
  id: string;
  type: string; // 'logo' | 'facebook_post' | 'cover' | 'banner' | string
  label: string; // 'Logo', 'Facebook Post', 'Cover Banner', etc.
  selected: boolean;
  quantity: number; // e.g. 1, 2, 3...
  intervalDays?: string; // Delivery frequency/interval (e.g. 'Every 2 Days', 'Weekly', etc.)
}

export interface ProjectUpdateItem {
  id: string;
  status: ProjectStatus;
  note?: string;
  updatedBy: string;
  updatedByName: string;
  updatedByRole: UserRole;
  timestamp: string; // ISO string
}

export interface Project {
  id: string;
  orgId: string;
  clientId: string;
  name: string; // Campaign Name
  campaignName?: string; // Campaign Name (synced with name)
  taskCategory?: string; // Task Category (e.g. Video Editing, Graphic Design, etc.)
  assignedTo?: string; // Assigned To (User ID)
  assignedToName?: string; // Assigned To (User Name)
  priority?: TaskPriority; // Priority: Low, Medium, High, Urgent
  assignedDate?: string; // Assigned Date (YYYY-MM-DD)
  deadline?: string; // Deadline (Date & Time)*
  description?: string;
  assignedManagerId?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status: ProjectStatus;
  progress?: number; // 0 - 100
  notes?: string;
  createdAt?: string;

  // Work start and completion tracking
  startedAt?: string; // ISO string when employee started work
  startedBy?: string;
  startedByName?: string;
  completedAt?: string;
  completedByName?: string;
  updates?: ProjectUpdateItem[]; // Timeline of progress and status updates

  // Video Editing specific fields (Shown when taskCategory is Video Editing)
  script?: string;
  footageLinks?: FootageLinkItem[];
  sizes?: string[]; // YouTube, Facebook, Reels
  logoFileUrl?: string; // Uploaded logo file preview data
  logoFileName?: string;
  logoShareLink?: string; // Shared cloud drive link

  // Graphic Design specific fields (Shown when taskCategory is Graphic Designer / Graphic Design)
  graphicDesignItems?: GraphicDesignItem[];
  graphicDesignNotes?: string;
}

export type TaskStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'revision_required'
  | 'approved'
  | 'completed'
  | 'overdue'
  | 'cancelled';

export type CustomFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'textarea'
  | 'date'
  | 'url'
  | 'multiselect'
  | 'boolean';

export interface CustomFieldDefinition {
  id: string;
  taskTypeId: string; // links to task type (e.g. 'video_editing', 'graphic_design')
  label: string;
  key: string;
  type: CustomFieldType;
  options?: string[]; // for select / multiselect
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  helpText?: string;
}

export interface TaskType {
  id: string;
  orgId: string;
  name: string;
  category: string; // 'video_editing' | 'graphic_design' | 'social_media' | 'branding' | 'advertising' | 'custom'
  description: string;
  iconName: string;
  defaultEstimatedHours?: number;
  customFields: CustomFieldDefinition[];
}

export interface DeliverableFile {
  id: string;
  version: number;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  fileType: 'video' | 'image' | 'archive' | 'document' | 'link' | 'design_file';
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
  reviewComment?: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
  isInternalOnly?: boolean;
}

export interface ActivityLogItem {
  id: string;
  orgId?: string;
  entityType: 'task' | 'project' | 'client' | 'invoice' | 'system';
  entityId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface Task {
  id: string;
  orgId: string;
  clientId: string;
  projectId: string;
  assignedEmployeeId: string;
  assignedByUserId: string;
  taskTypeId: string;
  category: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  deadline: string; // ISO date string or YYYY-MM-DDTHH:mm
  estimatedHours: number;
  actualHours?: number;
  customFieldValues: Record<string, any>;
  attachmentUrls?: string[];
  referenceLinks?: string[];
  deliverables: DeliverableFile[];
  revisionCount: number;
  latestRevisionFeedback?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  orgId: string;
  clientId?: string;
  projectId?: string;
  taskId?: string;
  uploaderId: string;
  fileName: string;
  fileType: 'image' | 'video' | 'document' | 'design_file' | 'archive' | 'audio';
  category: 'brand_asset' | 'raw_footage' | 'deliverable' | 'reference' | 'script' | 'contract';
  fileSize: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  version?: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export type InvoiceStatus = 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  orgId: string;
  clientId: string;
  projectId?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxPercent: number;
  discountPercent: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orgId: string;
  invoiceId: string;
  clientId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'stripe' | 'bank_transfer' | 'credit_card' | 'paypal' | 'wire' | 'cash';
  referenceNo: string;
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  orgId: string;
  userId: string; // Target recipient
  type:
    | 'task_assigned'
    | 'deadline_approaching'
    | 'task_overdue'
    | 'deliverable_submitted'
    | 'revision_requested'
    | 'task_approved'
    | 'invoice_created'
    | 'payment_received'
    | 'comment_added'
    | 'client_created';
  title: string;
  message: string;
  linkEntityType?: 'task' | 'project' | 'invoice' | 'client';
  linkEntityId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface OrganizationSettings {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  taxRateDefault: number;
  subscriptionPlan: 'Starter' | 'Growth' | 'Enterprise Pro';
  subscriptionStatus: 'active' | 'trial' | 'past_due';
  createdAt: string;
  ownerId: string;
  status: 'active' | 'suspended';
}

export type Agency = OrganizationSettings;
