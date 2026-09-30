import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  X,
  Briefcase,
  Calendar,
  Clock,
  User,
  Tag,
  Trash2,
  Edit3,
  Video,
  FileText,
  Link2,
  Plus,
  Monitor,
  Smartphone,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Check,
  Palette,
  Layers,
  Repeat,
  Play,
  CheckCircle2,
  Activity,
  Send,
} from 'lucide-react';
import { ProjectStatus, TaskPriority, FootageLinkItem, GraphicDesignItem, ProjectUpdateItem } from '../../types';
import { ensureAbsoluteUrl, formatDateTime, getProjectStatusConfig } from '../../utils/formatters';

const INITIAL_GRAPHIC_ITEMS: GraphicDesignItem[] = [
  { id: 'logo', type: 'logo', label: 'Logo', selected: false, quantity: 1, intervalDays: 'Every 3 Days' },
  { id: 'facebook_post', type: 'facebook_post', label: 'Facebook Post', selected: false, quantity: 1, intervalDays: 'Daily' },
  { id: 'cover', type: 'cover', label: 'Cover Banner', selected: false, quantity: 1, intervalDays: 'Weekly' },
  { id: 'banner', type: 'banner', label: 'Web / Ad Banner', selected: false, quantity: 1, intervalDays: 'Weekly' },
];

const INTERVAL_PRESETS = [
  'Daily',
  'Every 2 Days',
  'Every 3 Days',
  'Weekly',
  'Bi-Weekly (15 Days)',
];

export const ProjectDetailModal: React.FC = () => {
  const {
    selectedProjectId,
    setSelectedProjectId,
    projects,
    clients,
    users,
    updateProject,
    deleteProject,
    canManageTeam,
    currentUser,
    logActivity,
    projectCategories,
    addProjectCategory,
  } = useAgency();

  const project = projects.find((p) => p.id === selectedProjectId);

  const [isEditing, setIsEditing] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [newUpdateNote, setNewUpdateNote] = useState('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const isEmployee = currentUser.role === 'employee';
  const canEditProject = !isEmployee && canManageTeam;

  // Edit fields matching the core fields
  const [campaignName, setCampaignName] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedDate, setAssignedDate] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [deadline, setDeadline] = useState('');

  // Video Editing specific fields
  const [script, setScript] = useState('');
  const [footageLinks, setFootageLinks] = useState<FootageLinkItem[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [logoFileUrl, setLogoFileUrl] = useState<string>('');
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [logoShareLink, setLogoShareLink] = useState<string>('');

  // Graphic Design specific fields
  const [graphicDesignItems, setGraphicDesignItems] = useState<GraphicDesignItem[]>(INITIAL_GRAPHIC_ITEMS);
  const [graphicDesignNotes, setGraphicDesignNotes] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  if (!project) return null;

  const client = clients.find((c) => c.id === project.clientId);
  const assignedUser = users.find((u) => u.id === project.assignedTo) ||
    users.find((u) => u.id === project.assignedManagerId);

  const startEdit = () => {
    if (isEmployee) return;
    setCampaignName(project.campaignName || project.name || '');
    setTaskCategory(project.taskCategory || '');
    setAssignedTo(project.assignedTo || project.assignedManagerId || '');
    setPriority((project.priority || 'medium') as TaskPriority);
    setAssignedDate(project.assignedDate || project.startDate || '');
    setStatus(project.status || 'active');
    const rawDeadline = project.deadline || project.endDate || '';
    setDeadline(rawDeadline.includes('T') ? rawDeadline.split('T')[0] : rawDeadline);

    // Video editing specifics
    setScript(project.script || '');
    setFootageLinks(
      project.footageLinks && project.footageLinks.length > 0
        ? project.footageLinks
        : [{ id: '1', title: 'Main Footage Drive', url: '' }]
    );
    setSizes(project.sizes || ['YouTube', 'Reels']);
    setLogoFileUrl(project.logoFileUrl || '');
    setLogoFileName(project.logoFileName || '');
    setLogoShareLink(project.logoShareLink || '');

    // Graphic Design specifics
    if (project.graphicDesignItems && project.graphicDesignItems.length > 0) {
      // Merge with default items so unselected ones remain selectable
      const existingIds = new Set(project.graphicDesignItems.map((i) => i.id));
      const remainingDefaults = INITIAL_GRAPHIC_ITEMS.filter((i) => !existingIds.has(i.id));
      setGraphicDesignItems([...project.graphicDesignItems, ...remainingDefaults]);
    } else {
      setGraphicDesignItems(INITIAL_GRAPHIC_ITEMS);
    }
    setGraphicDesignNotes(project.graphicDesignNotes || '');

    setIsEditing(true);
  };

  const handleAddFootageLink = () => {
    setFootageLinks([
      ...footageLinks,
      { id: Date.now().toString(), title: `Footage Option ${footageLinks.length + 1}`, url: '' },
    ]);
  };

  const handleUpdateFootageLink = (id: string, field: 'title' | 'url', val: string) => {
    setFootageLinks(footageLinks.map((f) => (f.id === id ? { ...f, [field]: val } : f)));
  };

  const handleRemoveFootageLink = (id: string) => {
    if (footageLinks.length <= 1) {
      setFootageLinks([{ id: Date.now().toString(), title: '', url: '' }]);
      return;
    }
    setFootageLinks(footageLinks.filter((f) => f.id !== id));
  };

  const handleToggleSize = (sizeId: string) => {
    if (sizes.includes(sizeId)) {
      setSizes(sizes.filter((s) => s !== sizeId));
    } else {
      setSizes([...sizes, sizeId]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogoFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Graphic Design edit handlers
  const handleToggleGraphicItem = (id: string) => {
    setGraphicDesignItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleQuantityChange = (id: string, newQty: number) => {
    const safeQty = Math.max(1, newQty);
    setGraphicDesignItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: safeQty,
            intervalDays: safeQty > 1 && !item.intervalDays ? 'Every 2 Days' : item.intervalDays,
          };
        }
        return item;
      })
    );
  };

  const handleIntervalChange = (id: string, val: string) => {
    setGraphicDesignItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, intervalDays: val } : item))
    );
  };

  const handleAddCustomGraphicItem = () => {
    if (!customItemName.trim()) return;
    const newItem: GraphicDesignItem = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      label: customItemName.trim(),
      selected: true,
      quantity: 1,
      intervalDays: 'Every 3 Days',
    };
    setGraphicDesignItems([...graphicDesignItems, newItem]);
    setCustomItemName('');
    setIsAddingCustom(false);
  };

  const handleStatusChange = (newStatus: ProjectStatus, noteText?: string) => {
    const isStartingWork = newStatus === 'in_progress' && !project.startedAt;
    const isFinishing = newStatus === 'completed' && !project.completedAt;

    const startedAt = isStartingWork ? new Date().toISOString() : project.startedAt;
    const startedBy = isStartingWork ? currentUser.id : project.startedBy;
    const startedByName = isStartingWork ? currentUser.name : project.startedByName;

    const completedAt = isFinishing ? new Date().toISOString() : project.completedAt;
    const completedByName = isFinishing ? currentUser.name : project.completedByName;

    const updateItem: ProjectUpdateItem = {
      id: `upd-${Date.now()}`,
      status: newStatus,
      note: noteText?.trim() || (isStartingWork ? 'Started working on campaign' : undefined),
      updatedBy: currentUser.id,
      updatedByName: currentUser.name,
      updatedByRole: currentUser.role,
      timestamp: new Date().toISOString(),
    };

    const updatedList = [...(project.updates || []), updateItem];

    updateProject(project.id, {
      status: newStatus,
      ...(isStartingWork ? { startedAt, startedBy, startedByName } : {}),
      ...(isFinishing ? { completedAt, completedByName } : {}),
      updates: updatedList,
    });

    logActivity({
      entityType: 'project',
      entityId: project.id,
      action: `Status: ${newStatus.replace('_', ' ').toUpperCase()}`,
      details: `${currentUser.name} updated project "${project.campaignName || project.name}" status to ${newStatus.replace('_', ' ')} ${noteText ? `— "${noteText}"` : ''}`,
    });
  };

  const handlePostNoteOnly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateNote.trim()) return;

    const updateItem: ProjectUpdateItem = {
      id: `upd-${Date.now()}`,
      status: project.status,
      note: newUpdateNote.trim(),
      updatedBy: currentUser.id,
      updatedByName: currentUser.name,
      updatedByRole: currentUser.role,
      timestamp: new Date().toISOString(),
    };

    const updatedList = [...(project.updates || []), updateItem];

    updateProject(project.id, {
      updates: updatedList,
    });

    logActivity({
      entityType: 'project',
      entityId: project.id,
      action: 'Project Work Note',
      details: `${currentUser.name} posted an update on "${project.campaignName || project.name}": "${newUpdateNote.trim()}"`,
    });

    setNewUpdateNote('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const assigned = users.find((u) => u.id === assignedTo);
    const validFootageLinks = footageLinks.filter((f) => f.title.trim() || f.url.trim());
    const isVideoEditing = taskCategory === 'Video Editing';
    const isGraphicDesign = taskCategory === 'Graphic Designer' || taskCategory === 'Graphic Design';
    const selectedGraphicItems = graphicDesignItems.filter((i) => i.selected);

    updateProject(project.id, {
      name: campaignName.trim(),
      campaignName: campaignName.trim(),
      taskCategory,
      assignedTo,
      assignedToName: assigned?.name || 'Unassigned',
      priority,
      assignedDate,
      status,
      deadline,
      endDate: deadline.includes('T') ? deadline.split('T')[0] : deadline,
      ...(isVideoEditing
        ? {
            script: script.trim(),
            footageLinks: validFootageLinks,
            sizes,
            logoFileUrl,
            logoFileName,
            logoShareLink: logoShareLink.trim(),
          }
        : {}),
      ...(isGraphicDesign
        ? {
            graphicDesignItems: selectedGraphicItems,
            graphicDesignNotes: graphicDesignNotes.trim(),
          }
        : {}),
    });
    setIsEditing(false);
  };

  const handleCopyScript = () => {
    if (!project.script) return;
    navigator.clipboard.writeText(project.script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleAddCustomCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    addProjectCategory(trimmed);
    setTaskCategory(trimmed);
    setCustomCategoryInput('');
    setIsAddingCustomCategory(false);
  };

  const sizeOptions = [
    { id: 'YouTube', label: 'YouTube', sub: '16:9 Landscape', icon: Monitor },
    { id: 'Facebook', label: 'Facebook', sub: '1:1 Square / 4:5 Feed', icon: Monitor },
    { id: 'Reels', label: 'Reels', sub: '9:16 Vertical / Shorts', icon: Smartphone },
  ];

  const priorityBadgeConfig: Record<TaskPriority, { label: string; color: string; bg: string }> = {
    low: { label: 'Low', color: 'text-zinc-400', bg: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
    medium: { label: 'Medium', color: 'text-blue-400', bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
    high: { label: 'High', color: 'text-amber-400', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    urgent: { label: 'Urgent', color: 'text-rose-400', bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
  };

  const currentPriority = (project.priority || 'medium') as TaskPriority;
  const priorityCfg = priorityBadgeConfig[currentPriority] || priorityBadgeConfig.medium;
  const statusCfg = getProjectStatusConfig(project.status);

  const isVideoEditingCurrent = project.taskCategory === 'Video Editing' || project.taskCategory === 'Video Editor';
  const isGraphicDesignCurrent =
    project.taskCategory === 'Graphic Designer' ||
    project.taskCategory === 'Graphic Design' ||
    (project.graphicDesignItems && project.graphicDesignItems.length > 0);

  const editIsVideo = taskCategory === 'Video Editing' || taskCategory === 'Video Editor';
  const editIsGraphic = taskCategory === 'Graphic Designer' || taskCategory === 'Graphic Design';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#0e1017] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800/80 bg-zinc-900/60 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                {client?.name || client?.company || 'Agency Campaign'}
              </span>
              <span className="text-zinc-600">•</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${priorityCfg.bg}`}>
                Priority: {priorityCfg.label}
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-100">{project.campaignName || project.name}</h2>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing && canEditProject && (
              <button
                onClick={startEdit}
                className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
                title="Edit Project Configuration"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {canManageTeam && (
              <button
                onClick={() => {
                  if (confirm(`Delete project "${project.campaignName || project.name}"?`)) {
                    deleteProject(project.id);
                    setSelectedProjectId(null);
                  }
                }}
                className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSelectedProjectId(null)}
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isEditing ? (
          <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
            {/* 1. Campaign Name */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Campaign Name *</label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* 2. Task Category */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-zinc-300 block">Task Category *</label>
                {!isAddingCustomCategory && (
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomCategory(true)}
                    className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Custom Category</span>
                  </button>
                )}
              </div>

              {isAddingCustomCategory ? (
                <div className="p-3 bg-zinc-900 border border-orange-500/40 rounded-xl space-y-2 animate-in fade-in">
                  <span className="text-[11px] text-orange-300 font-semibold block">
                    Add New Custom Task Category:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. Motion Designer, 3D Artist, UI/UX..."
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomCategory();
                        } else if (e.key === 'Escape') {
                          setIsAddingCustomCategory(false);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      disabled={!customCategoryInput.trim()}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCustomCategory(false);
                        setCustomCategoryInput('');
                      }}
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <select
                  required
                  value={taskCategory}
                  onChange={(e) => {
                    if (e.target.value === '__add_custom__') {
                      setIsAddingCustomCategory(true);
                    } else {
                      setTaskCategory(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500 text-xs cursor-pointer"
                >
                  <option value="">-- Select Task Category --</option>
                  {projectCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__add_custom__" className="text-orange-400 font-semibold">
                    + Add Custom Category...
                  </option>
                </select>
              )}
            </div>

            {/* CONDITIONAL GRAPHIC DESIGNER EDIT SECTION */}
            {editIsGraphic && (
              <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center space-x-2 text-purple-400 pb-2 border-b border-purple-500/20">
                  <Palette className="w-4 h-4" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    Graphic Design Specifications
                  </span>
                </div>

                {/* Design Type & Quantity */}
                <div className="space-y-2">
                  <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Design Types & Quantities</span>
                  </label>

                  <div className="space-y-2.5">
                    {graphicDesignItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border transition-all ${
                          item.selected
                            ? 'bg-zinc-900/90 border-purple-500/40 shadow-sm'
                            : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={() => handleToggleGraphicItem(item.id)}
                              className="w-4 h-4 rounded text-purple-600 bg-zinc-950 border-zinc-700 focus:ring-purple-500 cursor-pointer"
                            />
                            <span
                              className={`font-semibold text-xs ${
                                item.selected ? 'text-zinc-100 font-bold' : 'text-zinc-300'
                              }`}
                            >
                              {item.label}
                            </span>
                          </label>

                          {item.selected && (
                            <div className="flex items-center space-x-2 self-start sm:self-auto">
                              <span className="text-[11px] text-zinc-400 font-medium">Quantity:</span>
                              <div className="flex items-center space-x-1 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs cursor-pointer"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                  className="w-10 text-center bg-transparent text-purple-300 font-mono font-bold text-xs focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Delivery Frequency Field (When selected & quantity > 1) */}
                        {item.selected && item.quantity > 1 && (
                          <div className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-1.5 animate-in fade-in">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-semibold text-purple-300 flex items-center gap-1.5">
                                <Repeat className="w-3.5 h-3.5 text-purple-400" />
                                <span>Delivery Frequency (Interval / Schedule)</span>
                              </label>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                Total: {item.quantity} Designs
                              </span>
                            </div>

                            <input
                              type="text"
                              placeholder="e.g. Daily, Every 2 Days, Mondays & Thursdays..."
                              value={item.intervalDays || ''}
                              onChange={(e) => handleIntervalChange(item.id, e.target.value)}
                              className="w-full px-3 py-1.5 bg-zinc-950 border border-purple-800/40 rounded-lg text-purple-200 placeholder-zinc-500 text-xs focus:outline-none focus:border-purple-400"
                            />

                            <div className="flex flex-wrap gap-1">
                              {INTERVAL_PRESETS.map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => handleIntervalChange(item.id, preset)}
                                  className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                                    item.intervalDays === preset
                                      ? 'bg-purple-600 text-white font-semibold'
                                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                                  }`}
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Item */}
                  {!isAddingCustom ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustom(true)}
                      className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom Design Item</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                      <input
                        type="text"
                        placeholder="Design item name..."
                        value={customItemName}
                        onChange={(e) => setCustomItemName(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomGraphicItem}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Add Item
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingCustom(false)}
                        className="p-1.5 text-zinc-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>Design Notes & Creative Guidelines</span>
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={graphicDesignNotes}
                    onChange={(e) => setGraphicDesignNotes(e.target.value)}
                    placeholder="Write color codes, fonts, references, or special design notes here..."
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 text-xs leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* CONDITIONAL VIDEO EDITING EDIT SECTION */}
            {editIsVideo && (
              <div className="p-4 bg-orange-950/20 border border-orange-500/30 rounded-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center space-x-2 text-orange-400 pb-2 border-b border-orange-500/20">
                  <Video className="w-4 h-4" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    Video Editing Specifications
                  </span>
                </div>

                {/* Script */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-orange-400" />
                      <span>Script</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">Hook, voiceover, or timestamps</span>
                  </label>
                  <textarea
                    rows={3}
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Paste or write the video script, lines, hook, timestamps, or director notes here..."
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors leading-relaxed"
                  />
                </div>

                {/* Footage Link(s) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Footage Links</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddFootageLink}
                      className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Link</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {footageLinks.map((item) => (
                      <div key={item.id} className="p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Option title (e.g. A-Roll Drive, B-Roll, Drone Clips)"
                            value={item.title}
                            onChange={(e) => handleUpdateFootageLink(item.id, 'title', e.target.value)}
                            className="flex-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 text-[11px] focus:outline-none focus:border-orange-500 font-medium"
                          />
                          {footageLinks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFootageLink(item.id)}
                              className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Remove this link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="relative">
                          <Link2 className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2" />
                          <input
                            type="text"
                            placeholder="Paste footage cloud link (Google Drive, Dropbox, WeTransfer)..."
                            value={item.url}
                            onChange={(e) => handleUpdateFootageLink(item.id, 'url', e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 text-[11px] focus:outline-none focus:border-orange-500 font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-200 block">
                    <span>Size</span> <span className="text-[10px] text-zinc-400 font-normal">(Delivery aspect ratios)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {sizeOptions.map((opt) => {
                      const isSelected = sizes.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleSize(opt.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-orange-500/15 border-orange-500 text-orange-200 ring-1 ring-orange-500/30'
                              : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{opt.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-400" />}
                          </div>
                          <div className="text-[10px] opacity-75 mt-0.5 truncate">{opt.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Logo (File Upload & Share Link) */}
                <div className="space-y-2">
                  <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Logo (File Upload & Share Link)</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Option 1: File Upload */}
                    <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
                      <span className="text-[10px] font-semibold text-zinc-400 block uppercase tracking-wider">
                        Option A: Upload File
                      </span>

                      {logoFileUrl ? (
                        <div className="flex items-center space-x-2.5 p-2 bg-zinc-900 rounded-lg border border-zinc-750">
                          <img
                            src={logoFileUrl}
                            alt="Logo Preview"
                            className="w-8 h-8 rounded object-contain bg-zinc-950 border border-zinc-700"
                          />
                          <div className="flex-1 truncate">
                            <p className="text-[11px] font-bold text-zinc-200 truncate">{logoFileName || 'logo.png'}</p>
                            <span className="text-[9px] text-emerald-400 font-mono">Uploaded</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setLogoFileUrl('');
                              setLogoFileName('');
                            }}
                            className="p-1 text-zinc-400 hover:text-rose-400"
                            title="Remove file"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-3 border border-dashed border-zinc-700 hover:border-orange-500/50 rounded-xl cursor-pointer hover:bg-zinc-900/40 transition-all text-center">
                          <Upload className="w-4 h-4 text-zinc-400 mb-1" />
                          <span className="text-[10px] text-zinc-300 font-medium">Click to upload logo</span>
                          <span className="text-[9px] text-zinc-500">PNG, SVG, JPG, Vector</span>
                          <input
                            type="file"
                            accept="image/*,.ai,.eps,.svg"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Option 2: Share Link */}
                    <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
                      <span className="text-[10px] font-semibold text-zinc-400 block uppercase tracking-wider">
                        Option B: Share Link
                      </span>
                      <div className="relative mt-1">
                        <Link2 className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          placeholder="Google Drive, Dropbox or Figma logo link..."
                          value={logoShareLink}
                          onChange={(e) => setLogoShareLink(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 text-[11px] focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>
                      <span className="text-[9px] text-zinc-500 block">
                        Direct cloud storage link for original high-res logo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Assigned To & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300 block">Assigned To *</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.employeeTitle || u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300 block">Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
                >
                  <option value="active">Active</option>
                  <option value="planning">Planning</option>
                  <option value="under_review">Under Review</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* 4. Priority */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Priority *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* 5. Assigned Date & 7. Deadline */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300 block">Assigned Date *</label>
                <input
                  type="date"
                  required
                  value={assignedDate}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-amber-300 block">Deadline *</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-amber-900/50 rounded-xl text-amber-200 font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 sm:p-6 space-y-5 text-xs overflow-y-auto">
            {/* Core Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Task Category */}
              <div className="p-4 bg-zinc-950/70 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-400" />
                  <span>Task Category</span>
                </span>
                <div className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <span>{project.taskCategory || 'General Marketing'}</span>
                  {isVideoEditingCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      Video Deliverable
                    </span>
                  )}
                  {isGraphicDesignCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Graphic Design Kit
                    </span>
                  )}
                </div>
              </div>

              {/* Assigned To */}
              <div className="p-4 bg-zinc-950/70 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Assigned To</span>
                </span>
                <div className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  {assignedUser?.avatar && (
                    <img
                      src={assignedUser.avatar}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <span>{assignedUser?.name || project.assignedToName || 'Unassigned'}</span>
                </div>
              </div>

              {/* Assigned Date */}
              <div className="p-4 bg-zinc-950/70 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Assigned Date</span>
                </span>
                <div className="text-sm font-bold font-mono text-zinc-200">
                  {project.assignedDate || project.startDate || '—'}
                </div>
              </div>

              {/* Deadline */}
              <div className="p-4 bg-amber-950/15 rounded-2xl border border-amber-900/40 space-y-1">
                <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Deadline</span>
                </span>
                <div className="text-sm font-bold font-mono text-amber-300">
                  {(project.deadline || project.endDate)?.split('T')[0] || 'No deadline specified'}
                </div>
              </div>
            </div>

            {/* Interactive Current Status & Work Tracking Card */}
            <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400 font-medium">Current Status:</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border ${statusCfg.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'in_progress' ? 'bg-amber-400 animate-pulse' : 'bg-current'}`} />
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Interactive Status Selector for both Employee and Admin */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <select
                        value={project.status}
                        onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
                        className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-xl text-xs text-zinc-100 font-medium focus:outline-none focus:border-orange-500 cursor-pointer transition-colors"
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Active (Ready to Work)</option>
                        <option value="in_progress">In Progress (Started Working)</option>
                        <option value="under_review">Under Review (Submitted)</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Quick Work Action Buttons */}
                    {project.status !== 'in_progress' && project.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange('in_progress')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Start Working</span>
                      </button>
                    )}

                    {project.status === 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange('under_review')}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                      >
                        <Check className="w-3 h-3" />
                        <span>Submit for Review</span>
                      </button>
                    )}

                    {(project.status === 'under_review' || project.status === 'in_progress') && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange('completed')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Mark Completed</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-zinc-400 block font-medium">Priority Level:</span>
                  <span className={`text-xs font-bold uppercase font-mono px-2 py-0.5 rounded border inline-block mt-0.5 ${priorityCfg.bg}`}>
                    {priorityCfg.label}
                  </span>
                </div>
              </div>

              {/* Work Started & Completion Timing Display ("kokhon start korche") */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  project.startedAt
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400'
                }`}>
                  <Clock className={`w-4 h-4 shrink-0 ${project.startedAt ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <div>
                    <span className="font-semibold block text-[11px]">
                      {project.startedAt ? 'Work Started Time:' : 'Work Not Started:'}
                    </span>
                    <span className="font-mono text-xs">
                      {project.startedAt ? (
                        <>
                          <strong>{formatDateTime(project.startedAt)}</strong>
                          {project.startedByName && (
                            <span className="text-zinc-300 ml-1 font-sans">by {project.startedByName}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-zinc-500 italic">Click "Start Working" to log time</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  project.completedAt
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${project.completedAt ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <div>
                    <span className="font-semibold block text-[11px]">
                      {project.completedAt ? 'Completed Date & Time:' : 'Progress State:'}
                    </span>
                    <span className="font-mono text-xs">
                      {project.completedAt ? (
                        <>
                          <strong>{formatDateTime(project.completedAt)}</strong>
                          {project.completedByName && (
                            <span className="text-zinc-300 ml-1 font-sans">by {project.completedByName}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-zinc-500 italic">{project.status === 'completed' ? 'Completed' : 'Working / In Review'}</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* GRAPHIC DESIGNER DETAILS VIEW BLOCK                      */}
            {/* ======================================================== */}
            {isGraphicDesignCurrent && (
              <div className="p-5 bg-gradient-to-br from-zinc-950 via-zinc-950 to-purple-950/20 border border-purple-500/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-2 text-purple-400">
                    <Palette className="w-4 h-4" />
                    <h3 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">
                      Graphic Design Specifications
                    </h3>
                  </div>
                  <span className="text-[10px] text-purple-300 font-mono">Creative Deliverables</span>
                </div>

                {/* Design Types & Quantities */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Design Types, Quantity & Delivery Schedule</span>
                  </span>

                  {project.graphicDesignItems && project.graphicDesignItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {project.graphicDesignItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-100 text-xs">{item.label}</span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-mono font-bold">
                              Quantity: {item.quantity}
                            </span>
                          </div>

                          {item.quantity > 1 && item.intervalDays && (
                            <div className="flex items-center space-x-1.5 text-[11px] text-amber-300 bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-800/40">
                              <Repeat className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="font-medium">
                                Delivery Frequency: <strong>{item.intervalDays}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">No specific design deliverables selected.</p>
                  )}
                </div>

                {/* Notes */}
                {project.graphicDesignNotes && (
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>Design Notes & Creative Guidelines</span>
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {project.graphicDesignNotes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* VIDEO EDITING DETAILS VIEW BLOCK                         */}
            {/* ======================================================== */}
            {isVideoEditingCurrent && (
              <div className="p-5 bg-gradient-to-br from-zinc-950 via-zinc-950 to-orange-950/20 border border-orange-500/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-2 text-orange-400">
                    <Video className="w-4 h-4" />
                    <h3 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">
                      Video Editing Specifications
                    </h3>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Production Kit</span>
                </div>

                {/* 1. SCRIPT */}
                <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-orange-400" />
                      <span>Script & Directing Notes</span>
                    </span>
                    {project.script && (
                      <button
                        type="button"
                        onClick={handleCopyScript}
                        className="text-[10px] text-zinc-400 hover:text-orange-400 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedScript ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {project.script ? (
                    <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/80 text-zinc-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                      {project.script}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">No script entered for this video.</p>
                  )}
                </div>

                {/* 2. FOOTAGE LINKS */}
                <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2">
                  <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Footage Links</span>
                  </span>

                  {project.footageLinks && project.footageLinks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.footageLinks.map((item, idx) => {
                        const hasUrl = item.url && item.url.trim().length > 0;
                        return (
                          <div
                            key={item.id || idx}
                            className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between gap-2"
                          >
                            <div className="truncate">
                              <span className="text-[11px] font-bold text-zinc-200 block truncate">
                                {item.title || `Footage Link #${idx + 1}`}
                              </span>
                              <span className="text-[10px] text-zinc-500 truncate block font-mono">
                                {hasUrl ? item.url : 'No URL provided'}
                              </span>
                            </div>

                            {hasUrl && (
                              <a
                                href={ensureAbsoluteUrl(item.url)}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-semibold flex items-center gap-1 shrink-0 transition-colors"
                              >
                                <span>Open</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">No footage links provided.</p>
                  )}
                </div>

                {/* 3. SIZE & 4. LOGO ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Size */}
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-purple-400" />
                      <span>Delivery Sizes</span>
                    </span>

                    {project.sizes && project.sizes.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {project.sizes.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 text-orange-400" />
                            <span>{s}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic">YouTube, Facebook & Reels</p>
                    )}
                  </div>

                  {/* Logo */}
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Brand Logo</span>
                    </span>

                    <div className="space-y-1.5">
                      {project.logoFileUrl && (
                        <div className="flex items-center space-x-2 p-1.5 bg-zinc-950 rounded-lg border border-zinc-800">
                          <img
                            src={project.logoFileUrl}
                            alt="Logo"
                            className="w-7 h-7 rounded object-contain bg-zinc-900 p-0.5 border border-zinc-700"
                          />
                          <div className="flex-1 truncate">
                            <span className="text-[10px] font-medium text-zinc-200 block truncate">
                              {project.logoFileName || 'Brand Logo File'}
                            </span>
                          </div>
                          <a
                            href={project.logoFileUrl}
                            download={project.logoFileName || 'logo.png'}
                            className="text-[9px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono"
                          >
                            Download
                          </a>
                        </div>
                      )}

                      {project.logoShareLink && (
                        <div className="flex items-center justify-between p-1.5 bg-zinc-950 rounded-lg border border-zinc-800">
                          <div className="truncate mr-2">
                            <span className="text-[10px] text-zinc-400 truncate block">Cloud Drive Link</span>
                            <span className="text-[9px] font-mono text-zinc-500 truncate block">
                              {project.logoShareLink}
                            </span>
                          </div>
                          <a
                            href={ensureAbsoluteUrl(project.logoShareLink)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1 shrink-0"
                          >
                            <span>Drive</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {!project.logoFileUrl && !project.logoShareLink && (
                        <p className="text-xs text-zinc-500 italic">No brand logo uploaded or linked.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {project.description && (
              <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-[11px] text-zinc-400 font-medium">Details & Notes:</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* ======================================================== */}
            {/* PROJECT ACTIVITY & WORK UPDATES TIMELINE ("project ar update") */}
            {/* ======================================================== */}
            <div className="p-5 bg-zinc-950/70 rounded-2xl border border-zinc-800 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center space-x-2 text-orange-400">
                  <Activity className="w-4 h-4" />
                  <h3 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">
                    Project Work Updates & Timeline
                  </h3>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {(project.updates?.length || 0) + 1} logged updates
                </span>
              </div>

              {/* Add Progress Note / Work Update Input */}
              <form onSubmit={handlePostNoteOnly} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a progress note or project update for Admin..."
                  value={newUpdateNote}
                  onChange={(e) => setNewUpdateNote(e.target.value)}
                  className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={!newUpdateNote.trim()}
                  className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Update</span>
                </button>
              </form>

              {/* Chronological Updates List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {/* Initial Project Assignment */}
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold uppercase">
                        Assigned
                      </span>
                      <span className="font-bold text-zinc-200">
                        Campaign allocated to {assignedUser?.name || project.assignedToName || 'Employee'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Category: {project.taskCategory || 'General'} • Priority: {priorityCfg.label}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {project.assignedDate || project.startDate || 'Initial'}
                  </span>
                </div>

                {/* Logged Updates */}
                {project.updates && project.updates.map((upd) => {
                  const updCfg = getProjectStatusConfig(upd.status);
                  return (
                    <div
                      key={upd.id}
                      className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${updCfg.bg}`}>
                            {updCfg.label}
                          </span>
                          <span className="font-semibold text-zinc-200">
                            {upd.updatedByName}{' '}
                            <span className="text-[10px] text-zinc-500 font-normal">
                              ({upd.updatedByRole === 'admin' ? 'Admin' : 'Employee'})
                            </span>
                          </span>
                        </div>
                        {upd.note && (
                          <p className="text-[11px] text-zinc-300 bg-zinc-950/60 px-2.5 py-1.5 rounded-lg border border-zinc-800/80">
                            {upd.note}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                        {formatDateTime(upd.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
