import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Bell, CheckCheck, Trash2, Clock, CheckSquare, RotateCcw, CreditCard } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setSelectedTaskId,
    setCurrentTab,
  } = useAgency();

  const userNotifs = notifications.filter((n) => n.userId === currentUser.id);

  const handleClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.linkEntityType === 'task' && notif.linkEntityId) {
      setSelectedTaskId(notif.linkEntityId);
    } else if (notif.linkEntityType === 'invoice') {
      setCurrentTab('invoices');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <span>Notification Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              {userNotifs.length} alerts
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            System alerts, client feedback, task assignments, and review approvals.
          </p>
        </div>

        {userNotifs.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllNotificationsRead}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-indigo-400 border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={clearNotifications}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-rose-400 border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-zinc-800/60">
        {userNotifs.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-zinc-700" />
            <p>You have no notifications right now.</p>
          </div>
        ) : (
          userNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`p-4 hover:bg-zinc-850/60 cursor-pointer transition-colors flex items-start space-x-3.5 text-xs ${
                !n.isRead ? 'bg-indigo-950/20' : ''
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                  !n.isRead ? 'bg-indigo-400 shadow-sm shadow-indigo-400/50' : 'bg-transparent'
                }`}
              />

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-200">{n.title}</h3>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
