import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  UserCheck,
  Plus,
  Search,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  Palette,
  Shield,
  Briefcase,
  X,
  Layers,
  ChevronRight,
  ExternalLink,
  Edit3,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { User, UserRole, EmployeeTypeCategory } from '../../types';
import { EmployeeDetailModal } from './EmployeeDetailModal';

const JOB_TITLE_OPTIONS: { id: EmployeeTypeCategory; label: string; defaultSkills: string[] }[] = [
  {
    id: 'video_editor',
    label: 'Video Editor',
    defaultSkills: ['Video Editing', 'Color Grading', 'Audio Sync', 'Premiere Pro'],
  },
  {
    id: 'graphic_designer',
    label: 'Graphic Designer',
    defaultSkills: ['Brand Design', 'Thumbnails', 'Photoshop', 'Illustrator'],
  },
  {
    id: 'motion_designer',
    label: 'Motion Designer',
    defaultSkills: ['Motion Graphics', 'After Effects', 'Kinetic Typography', '3D Animation'],
  },
  {
    id: 'social_media_designer',
    label: 'Social Media Designer',
    defaultSkills: ['Reels & TikTok Formats', 'Carousel Design', 'Visual Aesthetics'],
  },
  {
    id: 'content_creator',
    label: 'Content Creator',
    defaultSkills: ['Content Strategy', 'Copywriting', 'Short-form UGC', 'Visual Storytelling'],
  },
  {
    id: 'advertising_specialist',
    label: 'Ad Specialist',
    defaultSkills: ['Meta Ad Creatives', 'TikTok Ad Copy', 'Conversion Optimization', 'Performance Analytics'],
  },
];

export const EmployeeList: React.FC = () => {
  const {
    users,
    addUser,
    updateUser,
    deactivateUser,
    deleteUser,
    projects,
    tasks,
    currentUser,
    canManageTeam,
  } = useAgency();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);

  // Edit member state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('employee');
  const [editEmployeeTypeId, setEditEmployeeTypeId] = useState<EmployeeTypeCategory>('video_editor');
  const [editActive, setEditActive] = useState(true);

  // Delete confirmation state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // New user form state (no separate job title or skills fields!)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [employeeTypeId, setEmployeeTypeId] = useState<EmployeeTypeCategory>('video_editor');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  );

  const filteredUsers = users.filter((u) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = u.name.toLowerCase().includes(q);
      const matchesEmail = u.email.toLowerCase().includes(q);
      const matchesTitle = u.employeeTitle.toLowerCase().includes(q);
      if (!matchesName && !matchesEmail && !matchesTitle) return false;
    }
    if (roleFilter !== 'all') {
      if (roleFilter === 'call_center' || roleFilter === 'manager') {
        if (u.role !== 'call_center' && u.role !== 'manager') return false;
      } else if (u.role !== roleFilter) {
        return false;
      }
    }
    return true;
  });

  // Handle Add Member submit
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const matchedJob = JOB_TITLE_OPTIONS.find((j) => j.id === employeeTypeId) || JOB_TITLE_OPTIONS[0];

    const computedTitle =
      role === 'admin'
        ? 'Agency Admin'
        : role === 'call_center' || role === 'manager'
        ? 'Call Center Representative'
        : matchedJob.label;

    addUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      avatar,
      role,
      employeeTypeId: role === 'employee' ? employeeTypeId : undefined,
      employeeTitle: computedTitle,
      active: true,
      skills: matchedJob.defaultSkills,
    });

    setIsAddUserModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setRole('employee');
    setEmployeeTypeId('video_editor');
  };

  // Open Edit Modal
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditRole(user.role);
    setEditEmployeeTypeId(user.employeeTypeId || 'video_editor');
    setEditActive(user.active);
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim() || !editEmail.trim()) return;

    const matchedJob = JOB_TITLE_OPTIONS.find((j) => j.id === editEmployeeTypeId) || JOB_TITLE_OPTIONS[0];

    const computedTitle =
      editRole === 'admin'
        ? 'Agency Admin'
        : editRole === 'call_center' || editRole === 'manager'
        ? 'Call Center Representative'
        : matchedJob.label;

    updateUser(editingUser.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim() || undefined,
      role: editRole,
      employeeTypeId: editRole === 'employee' ? editEmployeeTypeId : undefined,
      employeeTitle: computedTitle,
      active: editActive,
      skills: matchedJob.defaultSkills,
    });

    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  // Open Delete Confirmation
  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  // Handle Confirm Delete
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteUser(userToDelete.id);
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
    if (selectedUserForDetail?.id === userToDelete.id) {
      setSelectedUserForDetail(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <span>Creative Roster & Team Members</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-orange-400 font-mono border border-orange-500/20">
              {users.length} members
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage creative specialists, role permissions, active workloads, and task progress.
          </p>
        </div>

        {canManageTeam && (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, role, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-orange-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="call_center">Call Center</option>
          <option value="employee">Creative Employees</option>
        </select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((user) => {
          const userProjects = projects.filter(
            (p) => p.assignedTo === user.id || p.assignedManagerId === user.id
          );
          const activeProjectsCount = userProjects.filter(
            (p) => p.status === 'active' || p.status === 'in_progress' || p.status === 'under_review'
          ).length;
          const planningProjectsCount = userProjects.filter((p) => p.status === 'planning').length;
          const completedProjectsCount = userProjects.filter((p) => p.status === 'completed').length;

          return (
            <div
              key={user.id}
              onClick={() => setSelectedUserForDetail(user)}
              className={`p-5 bg-zinc-900 rounded-2xl border transition-all space-y-4 cursor-pointer group hover:scale-[1.01] hover:shadow-xl hover:shadow-orange-500/5 ${
                user.active
                  ? 'border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-850/80'
                  : 'border-zinc-800/40 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-zinc-800 group-hover:ring-orange-500/50 transition-all"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                      <span>{user.name}</span>
                    </h3>
                    <p className="text-xs text-orange-400/90 font-medium">{user.employeeTitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      user.role === 'admin'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : user.role === 'call_center' || user.role === 'manager'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {user.role === 'call_center' || user.role === 'manager' ? 'Call Center' : user.role}
                  </span>

                  {/* Quick Edit & Delete Actions in Header */}
                  {canManageTeam && (
                    <div className="flex items-center space-x-1 ml-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(user);
                        }}
                        className="p-1 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-zinc-800 transition-colors"
                        title="Edit Member"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {user.id !== currentUser.id && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDelete(user);
                          }}
                          className="p-1 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Workload Metrics */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-800/60 text-center text-xs">
                <div className="p-1 rounded-lg">
                  <span className="text-[10px] text-zinc-400 block font-medium">Active</span>
                  <span className="font-bold text-orange-400 text-sm">{activeProjectsCount}</span>
                </div>
                <div className="p-1 rounded-lg">
                  <span className="text-[10px] text-zinc-400 block font-medium">Planning</span>
                  <span className="font-bold text-blue-400 text-sm">{planningProjectsCount}</span>
                </div>
                <div className="p-1 rounded-lg">
                  <span className="text-[10px] text-zinc-400 block font-medium">Completed</span>
                  <span className="font-bold text-emerald-400 text-sm">{completedProjectsCount}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
                <span className="truncate max-w-[130px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {user.email}
                </span>

                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  {canManageTeam && user.id !== currentUser.id && (
                    <button
                      onClick={() => {
                        if (user.active) {
                          deactivateUser(user.id);
                        } else {
                          updateUser(user.id, { active: true });
                        }
                      }}
                      className={`text-[11px] font-medium transition-colors ${
                        user.active ? 'text-zinc-500 hover:text-zinc-300' : 'text-emerald-400 hover:text-emerald-300'
                      }`}
                    >
                      {user.active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  )}

                  <span
                    onClick={() => setSelectedUserForDetail(user)}
                    className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Employee Details Modal */}
      <EmployeeDetailModal
        user={selectedUserForDetail}
        isOpen={!!selectedUserForDetail}
        onClose={() => setSelectedUserForDetail(null)}
        onEdit={(u) => {
          setSelectedUserForDetail(null);
          handleOpenEdit(u);
        }}
        onDelete={(u) => {
          setSelectedUserForDetail(null);
          handleOpenDelete(u);
        }}
      />

      {/* ======================================================== */}
      {/* ADD TEAM MEMBER MODAL (No separate job title or skills inputs!) */}
      {/* ======================================================== */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <form
            onSubmit={handleAddUserSubmit}
            className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-orange-400" />
                <span>Add Creative Team Member</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@agency.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Access Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                  >
                    <option value="employee">Creative Employee</option>
                    <option value="call_center">Call Center</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Job Title Dropdown (previously titled Specialization Type) */}
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Job Title *</label>
                  <select
                    value={employeeTypeId}
                    onChange={(e) => setEmployeeTypeId(e.target.value as EmployeeTypeCategory)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                  >
                    {JOB_TITLE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md shadow-orange-500/25 cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT TEAM MEMBER MODAL */}
      {/* ======================================================== */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <form
            onSubmit={handleEditSubmit}
            className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-400" />
                <span>Edit Team Member</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Access Role *</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                  >
                    <option value="employee">Creative Employee</option>
                    <option value="call_center">Call Center</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Job Title Dropdown */}
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Job Title *</label>
                  <select
                    value={editEmployeeTypeId}
                    onChange={(e) => setEditEmployeeTypeId(e.target.value as EmployeeTypeCategory)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                  >
                    {JOB_TITLE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Account Status</label>
                <select
                  value={editActive ? 'active' : 'inactive'}
                  onChange={(e) => setEditActive(e.target.value === 'active')}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                >
                  <option value="active">Active (Can log in & receive tasks)</option>
                  <option value="inactive">Inactive / Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md shadow-orange-500/25 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ======================================================== */}
      {isDeleteConfirmOpen && userToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-zinc-950 border border-rose-900/60 rounded-3xl p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center space-x-3 text-rose-400 border-b border-zinc-800/80 pb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">Delete Team Member?</h3>
                <p className="text-[11px] text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800/80 flex items-center space-x-3">
              <img
                src={userToDelete.avatar}
                alt={userToDelete.name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700"
              />
              <div className="truncate">
                <h4 className="font-bold text-zinc-100 truncate">{userToDelete.name}</h4>
                <p className="text-[11px] text-orange-400">{userToDelete.employeeTitle}</p>
                <p className="text-[10px] text-zinc-500 truncate">{userToDelete.email}</p>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed text-xs">
              Are you sure you want to permanently delete <strong>{userToDelete.name}</strong> from your agency workspace?
              Any tasks currently assigned to this member will be unassigned so they can be reassigned to other creators.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setUserToDelete(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
