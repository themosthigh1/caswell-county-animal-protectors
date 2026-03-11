import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Calendar, List, MapPin, Clock, Users } from 'lucide-react';
import EventCalendarView from '../components/events/EventCalendarView';
import EventListView from '../components/events/EventListView';

const EVENT_TYPE_LABELS = {
  adoption_drive: 'Adoption Drive',
  fundraiser: 'Fundraiser',
  vaccination_clinic: 'Vaccination Clinic',
  training: 'Training',
  other: 'Other',
};

const EVENT_TYPE_COLORS = {
  adoption_drive: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  fundraiser: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
  vaccination_clinic: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  training: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  other: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

export default function Events() {
  const [view, setView] = useState('calendar');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.filter({ status: ['scheduled', 'ongoing'] }, '-start_date', 100),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-white text-sm font-black mb-3">
            <Calendar className="w-4 h-4" /> UPCOMING EVENTS
          </div>
          <h1 className="text-5xl font-black mb-4">Events & Activities</h1>
          <p className="text-white text-xl max-w-2xl mx-auto font-semibold">
            Join us for adoption drives, fundraisers, vaccination clinics, and training sessions in Caswell County.
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex gap-3">
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              view === 'calendar'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" /> Calendar
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              view === 'list'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {isLoading ? (
          <div className="text-center py-20 text-gray-700 text-lg font-semibold">Loading events...</div>
        ) : view === 'calendar' ? (
          <EventCalendarView events={events} eventTypeLabels={EVENT_TYPE_LABELS} eventTypeColors={EVENT_TYPE_COLORS} />
        ) : (
          <EventListView events={events} eventTypeLabels={EVENT_TYPE_LABELS} eventTypeColors={EVENT_TYPE_COLORS} />
        )}
      </div>
    </div>
  );
}