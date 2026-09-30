import React, { useState, useEffect, useRef } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Search,
  X,
  CheckSquare,
  Briefcase,
  Users,
  FolderArchive,
  Receipt,
  User,
  ArrowRight,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    tasks,
    clients,
    projects,
    users,
    invoices,
    assets,
    setSelectedTaskId,
    setSelectedClientId,
    setSelectedProjectId,
    setSelectedInvoiceId,
    setCurrentTab,
  } = useAgency();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened & setup keyboard listener (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchingClients = q
    ? clients.filter((c) => (c.name || c.company || '').toLowerCase().includes(q) || (c.mobileNumber || c.phone || '').toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchingProjects = q
    ? projects.filter((p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q) || (p.campaignName || '').toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchingEmployees = q
    ? users.filter((u) => u.name.toLowerCase().includes(q) || u.employeeTitle.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchingInvoices = q
    ? invoices.filter((inv) => inv.invoiceNumber.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchingAssets = q
    ? assets.filter((a) => a.fileName.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const totalResults =
    matchingTasks.length +
    matchingClients.length +
    matchingProjects.length +
    matchingEmployees.length +
    matchingInvoices.length +
    matchingAssets.length;

  return (
    <div className="fixed inset-0 z-70 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-zinc-800 flex items-center space-x-3 bg-zinc-900/60">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search across tasks, clients, projects, invoices, team..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-zinc-300 text-xs"
            >
              Clear
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {!q ? (
            <div className="py-12 text-center text-zinc-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-zinc-700" />
              <p>Type keywords to search across the entire agency workspace.</p>
              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-zinc-400">
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">"Apex"</span>
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">"UGC Video"</span>
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">"INV-2026"</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tasks */}
              {matchingTasks.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2">
                    Tasks
                  </div>
                  {matchingTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTaskId(t.id);
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-zinc-900 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-zinc-200 font-medium truncate">{t.title}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono capitalize">
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Clients */}
              {matchingClients.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2">
                    Clients
                  </div>
                  {matchingClients.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedClientId(c.id);
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-zinc-900 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Users className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-zinc-200 font-medium truncate">{c.company}</span>
                        <span className="text-zinc-500 text-[11px]">({c.name})</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{c.industry}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {matchingProjects.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2">
                    Campaigns
                  </div>
                  {matchingProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-zinc-900 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-zinc-200 font-medium truncate">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        {p.progress}%
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Invoices */}
              {matchingInvoices.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2">
                    Invoices
                  </div>
                  {matchingInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => {
                        setSelectedInvoiceId(inv.id);
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-zinc-900 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Receipt className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="text-zinc-200 font-mono font-bold">{inv.invoiceNumber}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        ${inv.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
