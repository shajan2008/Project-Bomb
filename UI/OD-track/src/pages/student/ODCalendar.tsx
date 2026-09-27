import { useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { MONTHS, WEEKDAYS, daysInMonth, firstWeekday, ymd, formatLongDate } from '../../lib/date';

interface ODEvent {
  date: string; // YYYY-MM-DD
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  type: 'Internal' | 'External';
}

const odEvents: ODEvent[] = [
  { date: '2024-09-14', name: 'Smart India Hackathon', status: 'approved', type: 'External' },
  { date: '2024-09-15', name: 'Smart India Hackathon', status: 'approved', type: 'External' },
  { date: '2024-09-16', name: 'Smart India Hackathon', status: 'approved', type: 'External' },
  { date: '2024-09-20', name: 'CSE Symposium', status: 'pending', type: 'Internal' },
  { date: '2024-10-05', name: 'IIT Bombay TechFest', status: 'pending', type: 'External' },
  { date: '2024-10-06', name: 'IIT Bombay TechFest', status: 'pending', type: 'External' },
  { date: '2024-08-28', name: 'Annual Sports Day', status: 'rejected', type: 'Internal' },
  { date: '2024-08-18', name: 'IEEE Student Conference', status: 'approved', type: 'External' },
  { date: '2024-08-19', name: 'IEEE Student Conference', status: 'approved', type: 'External' },
];

const statusDot: Record<string, string> = {
  approved: '#6FCF97',
  pending: '#F5C860',
  rejected: '#F5A8A8',
};

type FilterValue = 'all' | 'internal' | 'external';

export default function ODCalendar() {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(8); // Sep
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>('all');

  const filteredEvents = useMemo(
    () =>
      odEvents.filter((e) => {
        if (filter === 'internal') return e.type === 'Internal';
        if (filter === 'external') return e.type === 'External';
        return true;
      }),
    [filter],
  );

  const days = daysInMonth(year, month);
  const firstDay = firstWeekday(year, month);

  const eventsForDate = (d: number) => {
    const key = ymd(year, month, d);
    return filteredEvents.filter((e) => e.date === key);
  };

  const selectedEvents = selected ? filteredEvents.filter((e) => e.date === selected) : [];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1);
    setSelected(null);
  };

  // Summary counts respect the active filter, same as the grid.
  const summary = useMemo(() => {
    const approved = filteredEvents.filter((e) => e.status === 'approved').length;
    const pending = filteredEvents.filter((e) => e.status === 'pending').length;
    const rejected = filteredEvents.filter((e) => e.status === 'rejected').length;
    return { approved, pending, rejected };
  }, [filteredEvents]);

  return (
    <Layout title="OD Calendar">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="glass-card p-4 sm:p-6 flex-1">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} aria-label="Previous month" className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition-all">
                <ChevronLeft size={16} />
              </button>
              <h3 className="font-display font-semibold text-[16px] sm:text-[18px] text-text">{MONTHS[month]} {year}</h3>
              <button onClick={nextMonth} aria-label="Next month" className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition-all">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Internal / External / All filter */}
            <div className="flex gap-1 p-1 rounded-full" style={{ background: 'rgba(255,255,255,0.35)' }}>
              {([
                { id: 'all', label: 'All' },
                { id: 'internal', label: 'Internal' },
                { id: 'external', label: 'External' },
              ] as { id: FilterValue; label: string }[]).map((f) => (
                <button
                  key={f.id}
                  onClick={() => { setFilter(f.id); setSelected(null); }}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                    filter === f.id ? 'bg-white shadow-sm text-text' : 'text-text-muted hover:bg-white/40'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[10px] sm:text-[11px] font-semibold text-text-muted py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: days }).map((_, i) => {
              const d = i + 1;
              const key = ymd(year, month, d);
              const evs = eventsForDate(d);
              const isSelected = selected === key;

              return (
                <button
                  key={d}
                  onClick={() => setSelected(isSelected ? null : key)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-start p-1 transition-all relative ${
                    isSelected ? 'bg-blue-400/30 ring-2 ring-blue-400/50' : evs.length ? 'bg-white/40 hover:bg-white/60' : 'hover:bg-white/30'
                  }`}
                >
                  <span className="text-[12px] sm:text-[13px] font-medium text-text">{d}</span>
                  {evs.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {evs.slice(0, 3).map((ev, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: statusDot[ev.status],
                            border: ev.type === 'External' ? '1px solid #3A3F4B' : 'none',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/30 flex-wrap">
            {Object.entries(statusDot).map(([s, c]) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                <span className="text-[12px] text-text-muted capitalize">{s}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white" style={{ border: '1px solid #3A3F4B' }} />
              <span className="text-[12px] text-text-muted">External (ringed)</span>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-64 shrink-0">
          {selected ? (
            <div className="glass-card p-5">
              <h4 className="font-display font-semibold text-[15px] text-text mb-4 flex items-center gap-2">
                <CalendarIcon size={15} />
                {formatLongDate(selected)}
              </h4>
              {selectedEvents.length === 0 ? (
                <p className="text-[13px] text-text-muted">No OD events on this day.</p>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((ev, i) => (
                    <div key={i} className="p-3 rounded-[12px]" style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)' }}>
                      <div className="font-medium text-[13px] text-text mb-1">{ev.name}</div>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`badge ${ev.type === 'External' ? 'badge-external' : 'badge-internal'}`}>{ev.type}</span>
                        <span className={`badge ${ev.status === 'approved' ? 'badge-approved' : ev.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
                          {ev.status.charAt(0).toUpperCase() + ev.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-5">
              <p className="text-[13px] text-text-muted">Click any highlighted date to see your OD details for that day.</p>
              <div className="mt-4 space-y-2">
                <div className="font-semibold text-[13px] text-text">This month summary</div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#5A6170]">
                  <CheckCircle2 size={13} className="text-green-500" /> Approved: {summary.approved}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#5A6170]">
                  <Clock size={13} className="text-amber-500" /> Pending: {summary.pending}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#5A6170]">
                  <XCircle size={13} className="text-red-400" /> Rejected: {summary.rejected}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
