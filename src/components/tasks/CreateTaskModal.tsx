import React, { useState, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { X, Sparkles, CheckSquare, Plus, Clock, Calendar } from 'lucide-react';
import { DynamicFormFields } from '../common/DynamicFieldRenderer';
import { TaskPriority, TaskStatus } from '../../types';

export const CreateTaskModal: React.FC = () => {
  const {
    isCreateTaskOpen,
    setIsCreateTaskOpen,
    createTaskInitialDate,
    setCreateTaskInitialDate,
    clients,
    projects,
    users,
    taskTypes,
    addTask,
    currentUser,
  } = useAgency();

  // Form state
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedTaskTypeId, setSelectedTaskTypeId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-select defaults when opening
  useEffect(() => {
    if (isCreateTaskOpen) {
      if (createTaskInitialDate) {
        setStartDate(createTaskInitialDate);
        setDeadline(createTaskInitialDate);
      } else {
        setStartDate(new Date().toISOString().split('T')[0]);
        setDeadline(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      }

      if (clients.length > 0 && !selectedClientId) {
        setSelectedClientId(clients[0].id);
      }
      if (taskTypes.length > 0 && !selectedTaskTypeId) {
        setSelectedTaskTypeId(taskTypes[0].id);
      }
      if (!selectedEmployeeId) {
        const firstEmp = users.find((u) => u.role === 'employee');
        if (firstEmp) setSelectedEmployeeId(firstEmp.id);
      }
    }
  }, [isCreateTaskOpen, createTaskInitialDate, clients, taskTypes, users]);

  // When client changes, auto select project
  useEffect(() => {
    if (selectedClientId) {
      const clientProjects = projects.filter((p) => p.clientId === selectedClientId);
      if (clientProjects.length > 0) {
        setSelectedProjectId(clientProjects[0].id);
      } else {
        setSelectedProjectId('');
      }
    }
  }, [selectedClientId, projects]);

  // When task type changes, initialize default values for custom fields
  useEffect(() => {
    if (selectedTaskTypeId) {
      const typeDef = taskTypes.find((tt) => tt.id === selectedTaskTypeId);
      if (typeDef) {
        const defaults: Record<string, any> = {};
        typeDef.customFields.forEach((f) => {
          if (f.defaultValue !== undefined) {
            defaults[f.key] = f.defaultValue;
          }
        });
        setCustomFieldValues(defaults);
        if (typeDef.defaultEstimatedHours) {
          setEstimatedHours(typeDef.defaultEstimatedHours);
        }
      }
    }
  }, [selectedTaskTypeId, taskTypes]);

  if (!isCreateTaskOpen) return null;

  const currentTaskType = taskTypes.find((tt) => tt.id === selectedTaskTypeId);
  const filteredProjects = projects.filter((p) => p.clientId === selectedClientId);

  const handleCustomFieldChange = (key: string, value: any) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!selectedClientId) newErrors.clientId = 'Please select a client';
    if (!selectedProjectId) newErrors.projectId = 'Please select a project';
    if (!selectedEmployeeId) newErrors.employeeId = 'Please assign an employee';
    if (!selectedTaskTypeId) newErrors.taskTypeId = 'Please select a task workflow';

    // Validate required custom fields
    if (currentTaskType) {
      currentTaskType.customFields.forEach((f) => {
        if (f.required && (customFieldValues[f.key] === undefined || customFieldValues[f.key] === '')) {
          newErrors[f.key] = `${f.label} is required`;
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addTask({
      clientId: selectedClientId,
      projectId: selectedProjectId,
      assignedEmployeeId: selectedEmployeeId,
      assignedByUserId: currentUser.id,
      taskTypeId: selectedTaskTypeId,
      category: currentTaskType?.category || 'custom',
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'assigned',
      startDate,
      deadline,
      estimatedHours: Number(estimatedHours) || 4,
      customFieldValues,
    });

    setIsCreateTaskOpen(false);
    setCreateTaskInitialDate(null);
    // Reset form
    setTitle('');
    setDescription('');
    setCustomFieldValues({});
    setErrors({});
  };

  const handleClose = () => {
    setIsCreateTaskOpen(false);
    setCreateTaskInitialDate(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-100">Create & Assign Creative Task</h2>
                {createTaskInitialDate && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{createTaskInitialDate}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Configure task type, dynamic specifications, deadline, and assign to creator
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Row 1: Client & Project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Client Organization *
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
              {errors.clientId && <p className="text-xs text-rose-400 mt-1">{errors.clientId}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Campaign / Project *
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                {filteredProjects.length === 0 ? (
                  <option value="">No projects for this client</option>
                ) : (
                  filteredProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))
                )}
              </select>
              {errors.projectId && <p className="text-xs text-rose-400 mt-1">{errors.projectId}</p>}
            </div>
          </div>

          {/* Row 2: Workflow Task Type & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Task Workflow & Category *
              </label>
              <select
                value={selectedTaskTypeId}
                onChange={(e) => setSelectedTaskTypeId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-indigo-500 font-medium"
              >
                {taskTypes.map((tt) => (
                  <option key={tt.id} value={tt.id}>
                    {tt.name}
                  </option>
                ))}
              </select>
              {errors.taskTypeId && (
                <p className="text-xs text-rose-400 mt-1">{errors.taskTypeId}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Assign to Creative Specialist *
              </label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                {users
                  .filter((u) => u.active && u.role === 'employee')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.employeeTitle}
                    </option>
                  ))}
              </select>
              {errors.employeeId && (
                <p className="text-xs text-rose-400 mt-1">{errors.employeeId}</p>
              )}
            </div>
          </div>

          {/* Row 3: Title */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. 5x TikTok UGC Hooks for Winter Leggings Launch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Creative Brief & Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the objective, target audience, brand angles, and key messaging..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* DYNAMIC CUSTOM FIELDS RENDERER (Appears according to task type!) */}
          {currentTaskType && (
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom Workflow Fields ({currentTaskType.name})</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Configured custom fields for this creative workflow type:
              </p>

              <DynamicFormFields
                fields={currentTaskType.customFields}
                values={customFieldValues}
                onChange={handleCustomFieldChange}
                errors={errors}
              />
            </div>
          )}

          {/* Row 5: Priority, Estimated Hours, Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Deadline *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsCreateTaskOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Create & Dispatch Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
