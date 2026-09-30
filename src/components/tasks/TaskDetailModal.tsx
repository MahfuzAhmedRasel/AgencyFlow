import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  X,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Upload,
  Send,
  ExternalLink,
  Download,
  Trash2,
  FileText,
  Video,
  Palette,
  MessageSquare,
  Sparkles,
  Link as LinkIcon,
  ChevronRight,
} from 'lucide-react';
import { DynamicFieldsView } from '../common/DynamicFieldRenderer';
import { formatDate, formatDateTime, getTaskStatusConfig, getPriorityConfig, ensureAbsoluteUrl } from '../../utils/formatters';
import { TaskStatus } from '../../types';

export const TaskDetailModal: React.FC = () => {
  const {
    selectedTaskId,
    setSelectedTaskId,
    tasks,
    clients,
    projects,
    users,
    currentUser,
    taskTypes,
    comments,
    addTaskComment,
    updateTaskStatus,
    submitDeliverable,
    requestRevision,
    approveTask,
    deleteTask,
    isTaskOverdue,
    canReviewWork,
    canAssignTasks,
  } = useAgency();

  const task = tasks.find((t) => t.id === selectedTaskId);

  // Local state for actions
  const [newComment, setNewComment] = useState('');
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [deliverableFileName, setDeliverableFileName] = useState('');
  const [deliverableFileUrl, setDeliverableFileUrl] = useState('');
  const [deliverableFileSize, setDeliverableFileSize] = useState('24.5 MB');
  const [deliverableFileType, setDeliverableFileType] = useState<'video' | 'image' | 'archive' | 'document' | 'link'>('video');
  const [deliverableNotes, setDeliverableNotes] = useState('');

  if (!task) return null;

  const client = clients.find((c) => c.id === task.clientId);
  const project = projects.find((p) => p.id === task.projectId);
  const assignee = users.find((u) => u.id === task.assignedEmployeeId);
  const assigner = users.find((u) => u.id === task.assignedByUserId);
  const taskType = taskTypes.find((tt) => tt.id === task.taskTypeId);
  const taskComments = comments.filter((c) => c.taskId === task.id);
  const isOverdue = isTaskOverdue(task);
  const statusCfg = getTaskStatusConfig(task.status);
  const priorityCfg = getPriorityConfig(task.priority);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addTaskComment(task.id, newComment.trim());
    setNewComment('');
  };

  const handleConfirmRevision = () => {
    if (!revisionFeedback.trim()) return;
    requestRevision(task.id, revisionFeedback.trim());
    setRevisionFeedback('');
    setIsRevisionModalOpen(false);
  };

  const handleConfirmSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableFileName.trim() || !deliverableFileUrl.trim()) return;

    submitDeliverable(task.id, {
      fileName: deliverableFileName.trim(),
      fileUrl: deliverableFileUrl.trim(),
      fileSize: deliverableFileSize,
      fileType: deliverableFileType,
      notes: deliverableNotes.trim(),
    });

    setDeliverableFileName('');
    setDeliverableFileUrl('');
    setDeliverableNotes('');
    setIsSubmitModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-start justify-between gap-4 bg-zinc-900/60">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {client?.company}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 font-medium">{project?.name}</span>
              <span className="text-zinc-600">•</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${statusCfg.bg}`}
              >
                {statusCfg.label}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${priorityCfg.bg}`}
              >
                {priorityCfg.label}
              </span>
              {task.revisionCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                  Rev #{task.revisionCount}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
              {task.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {canAssignTasks && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(task.id);
                    setSelectedTaskId(null);
                  }
                }}
                className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl border border-transparent hover:border-rose-900/50 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSelectedTaskId(null)}
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Action Approval / Review Bar */}
          {canReviewWork && task.status === 'under_review' && (
            <div className="p-4 bg-purple-950/40 border border-purple-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-bold uppercase text-purple-300 flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Deliverable Ready for Creative Review</span>
                </div>
                <p className="text-xs text-purple-200/80">
                  Creator has submitted work. Review the assets below and sign-off or request revisions.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsRevisionModalOpen(true)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-rose-300 border border-rose-900/60 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Revision</span>
                </button>
                <button
                  onClick={() => approveTask(task.id)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Complete</span>
                </button>
              </div>
            </div>
          )}

          {/* Revision Banner if Revision is Required */}
          {task.status === 'revision_required' && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                <RotateCcw className="w-4 h-4" />
                <span>Revision Requested by Manager</span>
              </div>
              <p className="text-xs text-rose-100 bg-rose-950/70 p-3 rounded-xl border border-rose-900/60 leading-relaxed font-sans">
                {task.latestRevisionFeedback}
              </p>
            </div>
          )}

          {/* Key Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-400">Assigned To</span>
              <div className="flex items-center space-x-2">
                <img
                  src={assignee?.avatar}
                  alt={assignee?.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-zinc-200 truncate">{assignee?.name}</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-400">Assigned By</span>
              <div className="text-xs font-medium text-zinc-200 truncate">{assigner?.name || 'Marcus Reid'}</div>
            </div>

            <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-400">Deadline</span>
              <div
                className={`text-xs font-mono font-medium ${
                  isOverdue ? 'text-red-400 font-bold' : 'text-zinc-200'
                }`}
              >
                {formatDate(task.deadline)}
              </div>
            </div>

            <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-400">Estimated Duration</span>
              <div className="text-xs font-mono font-medium text-zinc-200">
                {task.estimatedHours} hours
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Creative Brief & Objectives
            </h3>
            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
              {task.description}
            </div>
          </div>

          {/* DYNAMIC CUSTOM FIELDS SECTION (Tailored to Video Editor vs Graphic Designer!) */}
          {taskType && taskType.customFields.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dynamic Workflow Specifications ({taskType.name})</span>
                </h3>
              </div>
              <DynamicFieldsView
                fields={taskType.customFields}
                values={task.customFieldValues}
              />
            </div>
          )}

          {/* Deliverables Section (Versions v1, v2, etc.) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                <span>Deliverable Versions & Uploaded Work ({task.deliverables.length})</span>
              </h3>

              {/* Upload Deliverable Trigger */}
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Deliverable</span>
              </button>
            </div>

            {task.deliverables.length === 0 ? (
              <div className="p-6 bg-zinc-900/60 border border-dashed border-zinc-800 rounded-xl text-center text-xs text-zinc-500">
                No deliverables uploaded yet. Click "Upload Deliverable" to submit version 1.
              </div>
            ) : (
              <div className="space-y-2.5">
                {task.deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                          v{del.version}
                        </span>
                        <span className="text-xs font-bold text-zinc-100 font-mono truncate">
                          {del.fileName}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          ({del.fileSize})
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                        <span>Uploaded by {del.uploadedBy}</span>
                        <span>•</span>
                        <span>{formatDateTime(del.uploadedAt)}</span>
                      </div>
                      {del.notes && (
                        <p className="text-xs text-zinc-300 italic pt-1">"{del.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={ensureAbsoluteUrl(del.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview / Play</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments & Activity Stream */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
              <span>Discussion & Feedback ({taskComments.length})</span>
            </h3>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {taskComments.length === 0 ? (
                <div className="text-xs text-zinc-500 italic py-2">
                  No comments yet. Leave a note below.
                </div>
              ) : (
                taskComments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={comm.userAvatar}
                          alt={comm.userName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-zinc-200">{comm.userName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono uppercase">
                          ({comm.userRole})
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {formatDateTime(comm.createdAt)}
                      </span>
                    </div>
                    <p className="text-zinc-300 whitespace-pre-wrap pl-7">{comm.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment or production note..."
                className="flex-1 px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Task ID: {task.id}</span>
          <span>Created {formatDate(task.createdAt)}</span>
        </div>
      </div>

      {/* REQUEST REVISION MODAL OVERLAY */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Request Creative Revision</span>
              </h3>
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Provide clear, actionable feedback for {assignee?.name}. The task status will switch to "Revision Required" and revision count will increase.
            </p>

            <textarea
              rows={4}
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder="e.g. Please replace the audio track at 01:20, fix the headline typo on Slide 3, and darken the background contrast."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevision}
                disabled={!revisionFeedback.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-rose-600/30"
              >
                Submit Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT DELIVERABLE MODAL OVERLAY */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <form
            onSubmit={handleConfirmSubmitDeliverable}
            className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Upload Deliverable (v{(task.deliverables.length || 0) + 1})</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Deliverable File Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex_UGC_Hook_01_v2.mp4 or Luminary_Carousel_Final.fig"
                  value={deliverableFileName}
                  onChange={(e) => setDeliverableFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Deliverable File / Cloud URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="drive.google.com/... or Figma / Frame.io / Cloud link"
                  value={deliverableFileUrl}
                  onChange={(e) => setDeliverableFileUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">File Type</label>
                  <select
                    value={deliverableFileType}
                    onChange={(e) => setDeliverableFileType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200"
                  >
                    <option value="video">Video (MP4, MOV)</option>
                    <option value="image">Image (PNG, JPG)</option>
                    <option value="design_file">Design / Figma File</option>
                    <option value="archive">Archive (ZIP)</option>
                    <option value="document">PDF / Document</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">File Size</label>
                  <input
                    type="text"
                    value={deliverableFileSize}
                    onChange={(e) => setDeliverableFileSize(e.target.value)}
                    placeholder="e.g. 45 MB"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Notes for Reviewer
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain what was edited or any special instructions for review..."
                  value={deliverableNotes}
                  onChange={(e) => setDeliverableNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
              >
                Submit for QA Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
