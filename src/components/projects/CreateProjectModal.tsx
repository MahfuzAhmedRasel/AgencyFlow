import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  X,
  Briefcase,
  Calendar,
  Clock,
  User,
  Tag,
  Video,
  FileText,
  Link2,
  Plus,
  Trash2,
  Monitor,
  Smartphone,
  Upload,
  Image as ImageIcon,
  Check,
  Palette,
  Layers,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { ProjectStatus, TaskPriority, FootageLinkItem, GraphicDesignItem } from '../../types';

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

export const CreateProjectModal: React.FC = () => {
  const {
    isCreateProjectOpen,
    setIsCreateProjectOpen,
    addProject,
    clients,
    users,
    currentUser,
    projectCategories,
    addProjectCategory,
  } = useAgency();

  // Core Requested Fields:
  // 1. Campaign Name
  // 2. Task Category (Default: nothing selected!)
  // 3. Assigned To
  // 4. Priority
  // 5. Assigned Date
  // 6. Status
  // 7. Deadline (Date & Time)*

  const [campaignName, setCampaignName] = useState('');
  const [taskCategory, setTaskCategory] = useState(''); // Default: nothing selected
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [deadline, setDeadline] = useState('');
  const [clientId, setClientId] = useState('');

  // Video Editing specific fields
  const [script, setScript] = useState('');
  const [footageLinks, setFootageLinks] = useState<FootageLinkItem[]>([
    { id: '1', title: 'Main Footage Drive', url: '' },
  ]);
  const [sizes, setSizes] = useState<string[]>(['YouTube', 'Reels']);
  const [logoFileUrl, setLogoFileUrl] = useState<string>('');
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [logoShareLink, setLogoShareLink] = useState<string>('');

  // Graphic Design specific fields
  const [graphicDesignItems, setGraphicDesignItems] = useState<GraphicDesignItem[]>(INITIAL_GRAPHIC_ITEMS);
  const [graphicDesignNotes, setGraphicDesignNotes] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Default client & assigned user setup
  React.useEffect(() => {
    if (clients.length > 0 && !clientId) {
      setClientId(clients[0].id);
    }
  }, [clients, clientId]);

  React.useEffect(() => {
    if (users.length > 0 && !assignedTo) {
      const defaultEmp = users.find((u) => u.role === 'employee') || users[0];
      if (defaultEmp) setAssignedTo(defaultEmp.id);
    }
  }, [users, assignedTo]);

  if (!isCreateProjectOpen) return null;

  const handleAddCustomCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    addProjectCategory(trimmed);
    setTaskCategory(trimmed);
    setCustomCategoryInput('');
    setIsAddingCustomCategory(false);
  };

  const priorityOptions: { value: TaskPriority; label: string; color: string; activeColor: string }[] = [
    { value: 'low', label: 'Low', color: 'text-zinc-400', activeColor: 'bg-zinc-800 border-zinc-600 text-zinc-200' },
    { value: 'medium', label: 'Medium', color: 'text-blue-400', activeColor: 'bg-blue-500/20 border-blue-500 text-blue-300' },
    { value: 'high', label: 'High', color: 'text-amber-400', activeColor: 'bg-amber-500/20 border-amber-500 text-amber-300' },
    { value: 'urgent', label: 'Urgent', color: 'text-rose-400', activeColor: 'bg-rose-500/20 border-rose-500 text-rose-300' },
  ];

  const sizeOptions = [
    { id: 'YouTube', label: 'YouTube', sub: '16:9 Landscape', icon: Monitor },
    { id: 'Facebook', label: 'Facebook', sub: '1:1 Square / 4:5 Feed', icon: Monitor },
    { id: 'Reels', label: 'Reels', sub: '9:16 Vertical / Shorts', icon: Smartphone },
  ];

  const isVideoEditing = taskCategory === 'Video Editing' || taskCategory === 'Video Editor';
  const isGraphicDesign = taskCategory === 'Graphic Designer' || taskCategory === 'Graphic Design';

  const handleToggleSize = (sizeId: string) => {
    if (sizes.includes(sizeId)) {
      setSizes(sizes.filter((s) => s !== sizeId));
    } else {
      setSizes([...sizes, sizeId]);
    }
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

  // Graphic Design handlers
  const handleToggleGraphicItem = (id: string) => {
    setGraphicDesignItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || !deadline.trim() || !taskCategory.trim()) return;

    const assignedUser = users.find((u) => u.id === assignedTo);
    const assignedClient = clients.find((c) => c.id === clientId) || clients[0];

    const validFootageLinks = footageLinks.filter((f) => f.title.trim() || f.url.trim());
    const selectedGraphicItems = graphicDesignItems.filter((item) => item.selected);

    addProject({
      name: campaignName.trim(),
      campaignName: campaignName.trim(),
      taskCategory,
      assignedTo: assignedTo || currentUser.id,
      assignedToName: assignedUser?.name || 'Unassigned',
      priority,
      assignedDate,
      deadline,
      status,
      clientId: assignedClient ? assignedClient.id : 'client-default',
      description: `Campaign: ${campaignName.trim()} | Category: ${taskCategory} | Priority: ${priority.toUpperCase()}`,
      assignedManagerId: currentUser.id,
      startDate: assignedDate,
      endDate: deadline.split('T')[0],
      budget: 0,
      notes: '',
      // Video Editing details
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
      // Graphic Design details
      ...(isGraphicDesign
        ? {
            graphicDesignItems: selectedGraphicItems,
            graphicDesignNotes: graphicDesignNotes.trim(),
          }
        : {}),
    });

    setIsCreateProjectOpen(false);
    // Reset form to pristine state (default category empty!)
    setCampaignName('');
    setTaskCategory('');
    setPriority('medium');
    setDeadline('');
    setAssignedDate(new Date().toISOString().split('T')[0]);
    setScript('');
    setFootageLinks([{ id: '1', title: 'Main Footage Drive', url: '' }]);
    setSizes(['YouTube', 'Reels']);
    setLogoFileUrl('');
    setLogoFileName('');
    setLogoShareLink('');
    setGraphicDesignItems(INITIAL_GRAPHIC_ITEMS);
    setGraphicDesignNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-[#0e1017] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Create New Project / Campaign</h2>
              <p className="text-xs text-zinc-400">Configure campaign details, category, team & deadline</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateProjectOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
          {/* 1. Campaign Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200 block">
              Campaign Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Black Friday TikTok & Meta Ad Blitz"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs transition-colors"
            />
          </div>

          {/* Client Selection */}
          {clients.length > 0 && (
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 block">
                Client / Brand
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500 text-xs transition-colors"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.company} {c.mobileNumber ? `(${c.mobileNumber})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 2. Task Category (Default: Graphic Designer & Video Editor only, plus Custom) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-200 block">
                Task Category <span className="text-rose-400">*</span>
              </label>
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
              <div className="relative">
                <Tag className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
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
                  className={`w-full pl-9 pr-3.5 py-2.5 bg-zinc-950 border rounded-xl text-xs transition-colors focus:outline-none focus:border-orange-500 cursor-pointer ${
                    !taskCategory ? 'text-zinc-500 border-zinc-800' : 'text-zinc-100 border-orange-500/50'
                  }`}
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
              </div>
            )}

            {!taskCategory && !isAddingCustomCategory && (
              <span className="text-[11px] text-zinc-500 block">
                Please select Graphic Designer, Video Editor, or create a Custom Category.
              </span>
            )}
          </div>

          {/* ======================================================== */}
          {/* CONDITIONAL GRAPHIC DESIGNER SECTION                     */}
          {/* ======================================================== */}
          {isGraphicDesign && (
            <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center space-x-2 text-purple-400 pb-2 border-b border-purple-500/20">
                <Palette className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  Graphic Design Specifications
                </span>
              </div>

              {/* Design Type & Quantity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Design Types & Quantities</span>
                  </label>
                  <span className="text-[10px] text-zinc-400">Select required deliverables</span>
                </div>

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
                        {/* Checkbox & Label */}
                        <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleToggleGraphicItem(item.id)}
                            className="w-4 h-4 rounded text-purple-600 bg-zinc-950 border-zinc-700 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                          />
                          <span
                            className={`font-semibold text-xs ${
                              item.selected ? 'text-zinc-100 font-bold' : 'text-zinc-300'
                            }`}
                          >
                            {item.label}
                          </span>
                        </label>

                        {/* Quantity Counter (Only when selected) */}
                        {item.selected && (
                          <div className="flex items-center space-x-2 self-start sm:self-auto">
                            <span className="text-[11px] text-zinc-400 font-medium">Quantity:</span>
                            <div className="flex items-center space-x-1 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-6 h-6 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
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
                                className="w-6 h-6 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delivery Frequency Field (Only if selected AND quantity > 1) */}
                      {item.selected && item.quantity > 1 && (
                        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-1.5 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-semibold text-purple-300 flex items-center gap-1.5">
                              <Repeat className="w-3.5 h-3.5 text-purple-400" />
                              <span>Delivery Frequency (Interval / Schedule)</span>
                              <span className="text-rose-400">*</span>
                            </label>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              Total: {item.quantity} Designs
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <input
                              type="text"
                              required
                              placeholder="e.g. Daily, Every 2 Days, Every Monday & Thursday..."
                              value={item.intervalDays || ''}
                              onChange={(e) => handleIntervalChange(item.id, e.target.value)}
                              className="w-full px-3 py-1.5 bg-zinc-950 border border-purple-800/40 rounded-lg text-purple-200 placeholder-zinc-500 text-xs focus:outline-none focus:border-purple-400 transition-colors"
                            />

                            {/* Quick Presets */}
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
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Custom Design Item Option */}
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
                      placeholder="Design item name (e.g. Brochure, Story, Flyer)..."
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
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
                      className="p-1.5 text-zinc-400 hover:text-zinc-200"
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
                  <span className="text-[10px] text-zinc-400 font-normal">Color codes, fonts & specs</span>
                </label>
                <textarea
                  rows={3}
                  value={graphicDesignNotes}
                  onChange={(e) => setGraphicDesignNotes(e.target.value)}
                  placeholder="Write design guidelines, reference links, color palette, or client instructions here..."
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 text-xs transition-colors leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CONDITIONAL VIDEO EDITING SECTION                        */}
          {/* ======================================================== */}
          {isVideoEditing && (
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

              {/* Size > YouTube, Facebook, Reels */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-200 block">
                  <span>Size</span> <span className="text-[10px] text-zinc-400 font-normal">(Select delivery aspect ratios)</span>
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

          {/* 3. Assigned To & 6. Status in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 3. Assigned To */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-200 block">
                Assigned To <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500 text-xs transition-colors"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.employeeTitle || u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6. Status */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-200 block">
                Status <span className="text-rose-400">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500 text-xs transition-colors"
              >
                <option value="active">Active / In Progress</option>
                <option value="planning">Planning</option>
                <option value="under_review">Under Review</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* 4. Priority */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200 block">
              Priority <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOptions.map((opt) => {
                const isSelected = priority === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`py-2 px-2 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? opt.activeColor + ' ring-1 ring-orange-500/30'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Assigned Date & 7. Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 5. Assigned Date */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-200 block">
                Assigned Date <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="date"
                  required
                  value={assignedDate}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-orange-500 text-xs font-mono transition-colors"
                />
              </div>
            </div>

            {/* 7. Deadline */}
            <div className="space-y-1.5">
              <label className="font-semibold text-amber-300 block flex items-center gap-1">
                <span>Deadline</span>
                <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-950 border border-amber-900/50 rounded-xl text-amber-200 focus:outline-none focus:border-amber-400 text-xs font-mono transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!taskCategory}
              className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-2 cursor-pointer ${
                !taskCategory
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25'
              }`}
            >
              <span>Save Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
