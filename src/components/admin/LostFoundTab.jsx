import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, CheckCircle, X, ChevronDown, ChevronUp, Filter, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const PAGE_SIZE = 15;

export default function LostFoundTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['admin-lf'],
    queryFn: () => base44.entities.LostFoundReport.list('-created_date', 200),
  });

  const resolveReport = useMutation({
    mutationFn: (id) => base44.entities.LostFoundReport.update(id, { status: 'resolved' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-lf'] }),
  });

  const reopenReport = useMutation({
    mutationFn: (id) => base44.entities.LostFoundReport.update(id, { status: 'active' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-lf'] }),
  });

  const deleteReport = useMutation({
    mutationFn: (id) => base44.entities.LostFoundReport.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-lf'] }); setConfirmModal(null); },
  });

  const filtered = useMemo(() => {
    return reports.filter(r => {
      if (filterType !== 'all' && r.type !== filterType) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (filterSpecies !== 'all' && r.species !== filterSpecies) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.pet_name?.toLowerCase().includes(q) &&
          !r.location?.toLowerCase().includes(q) &&
          !r.contact_name?.toLowerCase().includes(q) &&
          !r.breed?.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [reports, filterType, filterStatus, filterSpecies, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = [filterType !== 'all', filterStatus !== 'all', filterSpecies !== 'all'].filter(Boolean).length;
  const clearFilters = () => { setFilterType('all'); setFilterStatus('active'); setFilterSpecies('all'); setSearch(''); setPage(1); };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-black text-gray-900">
          Lost & Found <span className="text-gray-400 font-normal text-base">({filtered.length} of {reports.length})</span>
        </h2>
        <span className="text-sm text-rose-600 font-semibold">{reports.filter(r => r.status === 'active').length} active</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 mb-5 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, breed, location, or contact…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors">
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}
            className={`px-3 py-1.5 border rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-300 ${filterType !== 'all' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
            <option value="all">Lost & Found</option>
            <option value="lost">Lost Only</option>
            <option value="found">Found Only</option>
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className={`px-3 py-1.5 border rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-300 ${filterStatus !== 'all' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={filterSpecies} onChange={e => { setFilterSpecies(e.target.value); setPage(1); }}
            className={`px-3 py-1.5 border rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-300 ${filterSpecies !== 'all' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
            {['all', 'dog', 'cat', 'rabbit', 'bird', 'other', 'unknown'].map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Species' : s.charAt(0).toUpperCase() + s.slice(1) + 's'}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold">No reports match your filters</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-green-600 hover:underline">Clear all filters</button>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map(r => {
            const isExpanded = expandedId === r.id;
            return (
              <div key={r.id} className={`bg-white rounded-xl shadow-sm ring-1 transition-all ${r.type === 'lost' ? 'ring-rose-100' : 'ring-amber-100'} ${r.status === 'resolved' ? 'opacity-60' : ''}`}>
                {/* Header */}
                <div
                  className="flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                >
                  {r.photo_url && (
                    <img src={r.photo_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${r.type === 'lost' ? 'bg-rose-600' : 'bg-amber-600'}`}>{r.type?.toUpperCase()}</span>
                      <span className="font-bold text-gray-800">{r.pet_name || `${r.species} (unnamed)`}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {r.location}
                      {r.date_occurred && <><span className="text-gray-300">•</span><Calendar className="w-3 h-3" /> {r.date_occurred}</>}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      {r.contact_name} <span className="text-gray-300">•</span> {r.contact_phone}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-gray-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1.5 text-sm">
                        {r.breed && <p><span className="text-gray-400">Breed:</span> <span className="font-medium text-gray-700">{r.breed}</span></p>}
                        {r.age_description && <p><span className="text-gray-400">Age:</span> <span className="font-medium text-gray-700">{r.age_description}</span></p>}
                        {r.color_markings && <p><span className="text-gray-400">Color/Markings:</span> <span className="font-medium text-gray-700">{r.color_markings}</span></p>}
                        {r.collar_description && <p><span className="text-gray-400">Collar:</span> <span className="font-medium text-gray-700">{r.collar_description}</span></p>}
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> <a href={`tel:${r.contact_phone}`} className="font-medium text-green-700 hover:underline">{r.contact_phone}</a></p>
                        {r.contact_email && <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> <a href={`mailto:${r.contact_email}`} className="font-medium text-green-700 hover:underline">{r.contact_email}</a></p>}
                        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> <span className="text-gray-700">{r.location}</span></p>
                      </div>
                    </div>
                    {r.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-3 bg-gray-50 rounded-lg p-3">{r.description}</p>
                    )}
                    {r.photo_url && (
                      <img src={r.photo_url} alt="" className="w-32 h-32 rounded-xl object-cover mb-3" />
                    )}
                    <div className="flex flex-wrap gap-2">
                      {r.status === 'active' ? (
                        <button
                          onClick={() => resolveReport.mutate(r.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded-full transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                        </button>
                      ) : (
                        <button
                          onClick={() => reopenReport.mutate(r.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full transition-colors"
                        >
                          Reopen Report
                        </button>
                      )}
                      {r.contact_email && (
                        <a
                          href={`mailto:${r.contact_email}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" /> Email Contact
                        </a>
                      )}
                      <button
                        onClick={() => setConfirmModal({
                          title: `Delete this report?`,
                          message: 'This will permanently remove the lost/found report. This action cannot be undone.',
                          onConfirm: () => deleteReport.mutate(r.id),
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
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-40 transition-colors">
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-40 transition-colors">
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
          isLoading={deleteReport.isPending}
        />
      )}
    </div>
  );
}