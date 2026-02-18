import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, Filter, X } from 'lucide-react';
import EventForm from './EventForm';
import ConfirmModal from './ConfirmModal';

const EVENT_TYPE_LABELS = {
  adoption_drive: 'Adoption Drive',
  fundraiser: 'Fundraiser',
  vaccination_clinic: 'Vaccination Clinic',
  training: 'Training',
  other: 'Other',
};

const STATUS_COLORS = {
  scheduled: 'bg-blue-600',
  ongoing: 'bg-amber-500',
  completed: 'bg-slate-500',
  cancelled: 'bg-rose-600',
};

export default function EventsTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editEvent, setEditEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => base44.entities.Event.list('-start_date', 200),
  });

  const filtered = events.filter(e => {
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const deleteEvent = useMutation({
    mutationFn: (id) => base44.entities.Event.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setConfirmModal(null);
    },
  });

  const clearFilters = () => {
    setSearch('');
    setFilterStatus('all');
  };

  const activeFilterCount = [filterStatus !== 'all', search].filter(Boolean).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-black text-white">
          Events <span className="text-slate-400 font-normal text-base">({filtered.length} of {events.length})</span>
        </h2>
        <button
          onClick={() => {
            setEditEvent(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-cyan-500/20 p-4 mb-5 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-cyan-500/30 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-500"
            />
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-full transition-colors border border-rose-500/30"
            >
              <X className="w-3.5 h-3.5" /> Clear {activeFilterCount}
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className={`px-3 py-1.5 border rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-slate-800/50 ${
              filterStatus !== 'all'
                ? 'border-cyan-500/50 text-cyan-400'
                : 'border-slate-700 text-slate-300'
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400">Loading events...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No events match your filters</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-cyan-400 hover:text-cyan-300">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(event => (
            <div key={event.id} className="bg-slate-800/40 backdrop-blur-md rounded-xl border border-cyan-500/20 p-4">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{event.title}</h3>
                  <p className="text-xs text-slate-400">
                    {EVENT_TYPE_LABELS[event.event_type]} • {event.location}
                  </p>
                </div>
                <span className={`mt-1 px-2 py-0.5 rounded-full text-xs font-bold text-white flex-shrink-0 ${STATUS_COLORS[event.status]}`}>
                  {event.status}
                </span>
              </div>
              {event.description && (
                <p className="text-sm text-slate-300 mb-3 line-clamp-2">{event.description}</p>
              )}
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setEditEvent(event);
                    setShowForm(true);
                  }}
                  className="flex-1 p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors text-xs font-semibold"
                >
                  <Pencil className="w-4 h-4 inline mr-1" /> Edit
                </button>
                <button
                  onClick={() =>
                    setConfirmModal({
                      title: `Delete ${event.title}?`,
                      message: 'This action cannot be undone.',
                      onConfirm: () => deleteEvent.mutate(event.id),
                    })
                  }
                  className="flex-1 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs font-semibold"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <EventForm
          event={editEvent}
          onClose={() => {
            setShowForm(false);
            setEditEvent(null);
          }}
          onSaved={() => {}}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel="Delete"
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
          isLoading={deleteEvent.isPending}
        />
      )}
    </div>
  );
}