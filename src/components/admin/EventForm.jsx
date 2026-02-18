import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

export default function EventForm({ event, onClose, onSaved }) {
  const [form, setForm] = useState(event || {
    title: '',
    description: '',
    event_type: 'adoption_drive',
    start_date: '',
    end_date: '',
    location: '',
    max_attendees: '',
    status: 'scheduled',
    featured: false,
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) =>
      event?.id ? base44.entities.Event.update(event.id, data) : base44.entities.Event.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      onSaved();
      onClose();
    },
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-800/60 backdrop-blur-md rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 border border-cyan-500/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-black text-white">{event ? 'Edit Event' : 'Add New Event'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Title *</label>
            <input
              required
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-500"
              placeholder="Event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Type *</label>
              <select
                required
                value={form.event_type}
                onChange={e => set('event_type', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {['adoption_drive', 'fundraiser', 'vaccination_clinic', 'training', 'other'].map(t => (
                  <option key={t} value={t}>
                    {t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {['scheduled', 'ongoing', 'completed', 'cancelled'].map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea
              value={form.description || ''}
              onChange={e => set('description', e.target.value)}
              rows={3}
              placeholder="Event details..."
              className="w-full px-3 py-2.5 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Start Date & Time *</label>
              <input
                required
                type="datetime-local"
                value={form.start_date}
                onChange={e => set('start_date', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">End Date & Time *</label>
              <input
                required
                type="datetime-local"
                value={form.end_date}
                onChange={e => set('end_date', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Location *</label>
              <input
                required
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="Event location"
                className="w-full px-3 py-2.5 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Max Attendees</label>
              <input
                type="number"
                min="0"
                value={form.max_attendees || ''}
                onChange={e => set('max_attendees', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2.5 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={e => set('featured', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-300">Feature on homepage</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-600 rounded-full font-semibold text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-all text-sm"
            >
              {mutation.isPending ? 'Saving…' : event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}