import React, { useState } from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

export default function EventCalendarView({ events, eventTypeLabels, eventTypeColors }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const eventsMap = {};
  events.forEach(event => {
    const date = format(new Date(event.start_date), 'yyyy-MM-dd');
    if (!eventsMap[date]) eventsMap[date] = [];
    eventsMap[date].push(event);
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="px-4 py-2 bg-slate-800/40 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          ← Previous
        </button>
        <h2 className="text-2xl font-black text-white">{format(currentDate, 'MMMM yyyy')}</h2>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="px-4 py-2 bg-slate-800/40 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-700/30 backdrop-blur-md rounded-2xl border border-cyan-500/20 overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-px bg-slate-700/20">
          {weekDays.map(day => (
            <div key={day} className="bg-slate-700/40 border-b border-cyan-500/20 px-4 py-3 text-center font-bold text-slate-300 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-px bg-slate-700/20">
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsMap[dateStr] || [];
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={dateStr}
                className={`min-h-32 p-2 border-b border-r border-cyan-500/10 ${
                  isCurrentMonth ? 'bg-slate-700/15' : 'bg-slate-700/10'
                } ${isToday ? 'bg-cyan-500/15' : ''}`}
              >
                <div className={`text-sm font-bold mb-1 ${isToday ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded truncate font-semibold border ${eventTypeColors[event.event_type]}`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-slate-400 px-2 py-1">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}