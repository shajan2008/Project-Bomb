import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { MONTHS, WEEKDAYS, daysInMonth, firstWeekday, ymd, formatLongDate } from '../lib/date';

export type ODType = 'Internal' | 'External';
export type Session = 'FN' | 'AN' | 'Full Day';
export type ODStatus = 'approved' | 'pending' | 'rejected';

export interface AggregatedODEntry {
  date: string; // YYYY-MM-DD
  student: string;
  rollNo: string;
  event: string;
  type: ODType;
  session: Session;
  status: ODStatus;
}

const statusColor: Record<ODStatus, string> = {
  approved: '#6FCF97',
  pending: '#F5C860',
  rejected: '#F5A8A8',
};

type FilterValue = 'all' | 'internal' | 'external';

export default function AggregatedCalendar({
  title,
  entries,
  initialYear,
  initialMonth0,
}: {
  title: string;
  entries: AggregatedODEntry[];
  initialYear: number;
  initialMonth0: number;
}) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth0);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filteredEntries = useMemo(
    () =>
      entries.filter((e) => {
        if (filter === 'internal') return e.type === 'Internal';
        if (filter === 'external') return e.type === 'External';
        return true;
      }),
    [entries, filter],
  );

  const entriesByDate = useMemo(() => {
    const map = new Map<string, AggregatedODEntry[]>();
    filteredEntries.forEach((e) => {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [filteredEntries]);

  const days = daysInMonth(year, month);
  const firstDay = firstWeekday(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1);
    setSelected(null);
  };

  const selectedEntries = selected ? (entriesByDate.get(selected) ?? []) : [];

  // A conflict here means two or more students are booked for the same
  // session slot on the same day — the thing a mentor/HOD actually needs to
  // know about (a clash of coverage), not just "more than one OD that day".
  const hasConflict = (dayEntries: AggregatedODEntry[]) => {
    const seen = new Set<string>();
    for (const e of dayEntries) {
      const key = e.session === 'Full Day' ? 'Full Day' : e.session;
      if (seen.has(key) || seen.has('Full Day')) return true;
      seen.add(key);
    }
    return false;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="glass-card p-4 sm:p-6 flex-1">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} aria-label="Previous month" className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition-all">
              <ChevronLeft size={16} />
            </button>
            <h3 className="font-display font-semibold text-[16px] sm:text-[18px] text-text">{MONTHS[month]} {year}</h3>
            <button onClick={nextMonth} aria-label="Next month" className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition-all">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Internal / External / All segmented filter */}
          <div className="flex gap-1 p-1 rounded-full" style={{ background: 'rgba(255,255,255,0.35)' }}>
            {([
              { id: 'all', label: 'All' },
              { id: 'internal', label: 'Internal' },
              { id: 'external', label: 'External' },
            ] as { id: FilterValue; label: string }[]).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  filter === f.id ? 'bg-white shadow-sm text-text' : 'text-text-muted hover:bg-white/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[10px] sm:text-[11px] font-semibold text-text-muted py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const d = i + 1;
            const key = ymd(year, month, d);
            const dayEntries = entriesByDate.get(key) ?? [];
            const isSelected = selected === key;
            const conflict = dayEntries.length > 1 && hasConflict(dayEntries);

            return (
              <button
                key={d}
                onClick={() => setSelected(isSelected ? null : key)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-start p-1 transition-all relative ${
                  isSelected ? 'bg-blue-400/30 ring-2 ring-blue-400/50' : dayEntries.length ? 'bg-white/40 hover:bg-white/60' : 'hover:bg-white/30'
                }`}
              >
                {conflict && (
                  <AlertTriangle size={10} className="absolute top-0.5 right-0.5 text-amber-500" />
                )}
                <span className="text-[12px] sm:text-[13px] font-medium text-text">{d}</span>
                {dayEntries.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                    {dayEntries.slice(0, 4).map((e, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: statusColor[e.status],
                          border: e.type === 'External' ? '1px solid #3A3F4B' : 'none',
                        }}
                      />
                    ))}
                    {dayEntries.length > 4 && <span className="text-[9px] text-text-muted">+{dayEntries.length - 4}</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/30 flex-wrap">
          {Object.entries(statusColor).map(([s, c]) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              <span className="text-[12px] text-text-muted capitalize">{s}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white" style={{ border: '1px solid #3A3F4B' }} />
            <span className="text-[12px] text-text-muted">External (ringed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={12} className="text-amber-500" />
            <span className="text-[12px] text-text-muted">Session clash</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 shrink-0">
        <h4 className="font-display font-semibold text-[14px] text-text mb-3">{title}</h4>
        {selected ? (
          <div className="glass-card p-5">
            <h4 className="font-display font-semibold text-[15px] text-text mb-4">{formatLongDate(selected)}</h4>
            {selectedEntries.length === 0 ? (
              <p className="text-[13px] text-text-muted">No OD records for this filter on this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedEntries.map((e, i) => (
                  <div key={i} className="p-3 rounded-[12px]" style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)' }}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-[13px] text-text">{e.student}</span>
                      <span className="text-[11px] text-text-muted font-mono">{e.rollNo}</span>
                    </div>
                    <div className="text-[12px] text-[#5A6170] mb-2">{e.event}</div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`badge ${e.type === 'External' ? 'badge-external' : 'badge-internal'}`}>{e.type}</span>
                      <span className="badge" style={{ background: 'rgba(168,200,236,0.25)', color: '#2E6DA8' }}>{e.session}</span>
                      <span className={`badge ${e.status === 'approved' ? 'badge-approved' : e.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
                        {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-5">
            <p className="text-[13px] text-text-muted">Click a highlighted date to see every student on OD that day, their exact session slot, and any clashes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
