import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, CheckCircle, Mail, X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const STATUS_OPTIONS = ['all', 'new', 'read', 'replied'];
const TYPE_OPTIONS = ['all', 'general', 'adoption', 'volunteer', 'spay_neuter', 'donation', 'lost_found'];
const PAGE_SIZE = 15;

export default function MessagesTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => base44.entities.ContactMessage.list('-created_date', 200),
  });

  const updateMsg = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContactMessage.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const deleteMsg = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-messages'] }); setConfirmModal(null); },
  });

  const filtered = useMemo(() => {
    return messages.filter(m => {
      if (filterStatus !== 'all' && m.status !== filterStatus) return false;
      if (filterType !== 'all' && m.inquiry_type !== filterType) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!m.name?.toLowerCase().includes(q) && !m.email?.toLowerCase().includes(q) && !m.message?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [messages, filterStatus, filterType, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = [filterStatus !== 'all', filterType !== 'all'].filter(Boolean).length;

  const clearFilters = () => { setFilterStatus('all'); setFilterType('all'); setSearch(''); setPage(1); };

  const STATUS_BADGE = {
    new: 'bg-green-100 text-green-700 font-bold',
    read: 'bg-gray-100 text-gray-500',
    replied: 'bg-blue-100 text-blue-700',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-black text-gray-900">
          Messages <span className="text-gray-400 font-normal text-base">({filtered.length} of {messages.length})</span>
        </h2>
        <span className="text-sm text-rose-600 font-semibold">{messages.filter(m => m.status === 'new').length} unread</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 mb-5 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or message…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors">
              <X className="w-3.5 h-3.5" /> Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className={`px-3 py-1.5 border rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-300 ${filterStatus !== 'all' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}
            className={`px-3 py-1.5 border rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-300 ${filterType !== 'all' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
            {TYPE_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Types' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold">No messages match your filters</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-green-600 hover:underline">Clear all filters</button>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map(msg => {
            const isExpanded = expandedId === msg.id;
            return (
              <div key={msg.id} className={`bg-white rounded-xl shadow-sm ring-1 transition-all ${msg.status === 'new' ? 'ring-green-200 border-l-4 border-l-green-500' : 'ring-gray-100'}`}>
                {/* Header row */}
                <div
                  className="flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : msg.id);
                    if (msg.status === 'new') updateMsg.mutate({ id: msg.id, data: { status: 'read' } });
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-800">{msg.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{msg.inquiry_type?.replace('_', ' ')}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[msg.status] || 'bg-gray-100 text-gray-500'}`}>{msg.status?.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{msg.email}{msg.phone && ` • ${msg.phone}`}</p>
                    {msg.subject && <p className="text-sm font-semibold text-gray-700 mt-1 truncate">{msg.subject}</p>}
                    {!isExpanded && <p className="text-sm text-gray-500 mt-0.5 truncate">{msg.message}</p>}
                  </div>
                  <div className="flex-shrink-0 text-gray-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.status !== 'replied' && (
                        <button
                          onClick={() => updateMsg.mutate({ id: msg.id, data: { status: 'replied' } })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Replied
                        </button>
                      )}
                      {msg.status !== 'read' && msg.status !== 'replied' && (
                        <button
                          onClick={() => updateMsg.mutate({ id: msg.id, data: { status: 'read' } })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                      <a
                        href={`mailto:${msg.email}${msg.subject ? `?subject=Re: ${encodeURIComponent(msg.subject)}` : ''}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded-full transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-3.5 h-3.5" /> Reply via Email
                      </a>
                      <button
                        onClick={() => setConfirmModal({
                          title: `Delete message from ${msg.name}?`,
                          message: 'This will permanently remove this message. This action cannot be undone.',
                          onConfirm: () => deleteMsg.mutate(msg.id),
                        })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel="Delete"
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
          isLoading={deleteMsg.isPending}
        />
      )}
    </div>
  );
}