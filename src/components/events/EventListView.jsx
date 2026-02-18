import React from 'react';
import { Clock, MapPin, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function EventListView({ events, eventTypeLabels, eventTypeColors }) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  return (
    <div className="space-y-4">
      {sortedEvents.length > 0 ? (
        sortedEvents.map(event => {
          const startDate = new Date(event.start_date);
          const endDate = new Date(event.end_date);
          const isSameDay = startDate.toDateString() === endDate.toDateString();

          return (
            <div key={event.id} className="bg-white backdrop-blur-md rounded-2xl border border-cyan-200 p-6 hover:border-cyan-500/50 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Left: Title & Type */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black text-white">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${eventTypeColors[event.event_type]}`}>
                      {eventTypeLabels[event.event_type]}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-slate-300 text-sm leading-relaxed">{event.description}</p>
                  )}
                </div>

                {/* Right: Event Details */}
                <div className="flex-shrink-0 space-y-2 lg:text-right">
                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-slate-300 text-sm lg:justify-end">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>
                      {format(startDate, 'MMM d, yyyy')}
                      {!isSameDay && ` - ${format(endDate, 'MMM d, yyyy')}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300 text-sm lg:justify-end">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>
                      {format(startDate, 'h:mm a')}
                      {isSameDay && ` - ${format(endDate, 'h:mm a')}`}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-slate-300 text-sm lg:justify-end">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{event.location}</span>
                  </div>

                  {/* Attendees */}
                  {event.max_attendees && (
                    <div className="flex items-center gap-2 text-slate-300 text-sm lg:justify-end">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>Max {event.max_attendees} attendees</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-20 text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No upcoming events scheduled.</p>
        </div>
      )}
    </div>
  );
}