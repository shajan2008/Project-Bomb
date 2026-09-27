import { useState } from 'react';
import Layout from '../../components/Layout';
import { Search, LayoutGrid, List, Globe, Calendar, Users, Paperclip } from 'lucide-react';

interface ODBoardProps {
  type: 'internal' | 'external';
}

const internalEvents = [
  { id: 1, name: 'CSE Department Tech Symposium', org: 'CSE Dept', date: '22 Oct 2024', seats: 50, filled: 32, category: 'Technical', status: 'open' },
  { id: 2, name: 'Annual Cultural Fest — Utsav 2024', org: 'Student Council', date: '02 Nov 2024', seats: 200, filled: 150, category: 'Cultural', status: 'open' },
  { id: 3, name: 'Inter-Department Coding Contest', org: 'Computer Club', date: '28 Oct 2024', seats: 80, filled: 80, category: 'Technical', status: 'full' },
  { id: 4, name: 'Research Paper Presentation Day', org: 'R&D Cell', date: '15 Nov 2024', seats: 30, filled: 18, category: 'Academic', status: 'open' },
  { id: 5, name: 'Annual Sports Meet', org: 'Sports Dept', date: '20 Nov 2024', seats: 300, filled: 210, category: 'Sports', status: 'open' },
];

const externalEvents = [
  { id: 1, name: 'Smart India Hackathon 2024', org: 'MoE, Govt. of India', date: '11 Dec 2024', seats: 6, filled: 3, category: 'Hackathon', status: 'open' },
  { id: 2, name: 'IIT Bombay TechFest — Axis', org: 'IIT Bombay', date: '21 Dec 2024', seats: 40, filled: 28, category: 'Technical', status: 'open' },
  { id: 3, name: 'ACM ICPC Regional Qualifier', org: 'ACM', date: '25 Oct 2024', seats: 15, filled: 15, category: 'Competitive', status: 'full' },
  { id: 4, name: 'IEEE Student Paper Contest', org: 'IEEE Madras', date: '08 Nov 2024', seats: 20, filled: 9, category: 'Research', status: 'open' },
  { id: 5, name: 'National Robotics Challenge', org: 'IIT Madras', date: '10 Nov 2024', seats: 10, filled: 4, category: 'Robotics', status: 'open' },
  { id: 6, name: 'Entrepreneurship Summit 2024', org: 'IIM Bangalore', date: '30 Nov 2024', seats: 25, filled: 12, category: 'Business', status: 'open' },
];

const categoryColors: Record<string, string> = {
  Technical:    'rgba(123,174,232,0.2)',
  Hackathon:    'rgba(168,200,236,0.25)',
  Cultural:     'rgba(220,180,240,0.2)',
  Sports:       'rgba(168,230,201,0.2)',
  Academic:     'rgba(245,216,150,0.2)',
  Competitive:  'rgba(245,168,168,0.2)',
  Research:     'rgba(200,220,255,0.25)',
  Business:     'rgba(245,200,150,0.2)',
  Robotics:     'rgba(200,245,220,0.2)',
};

function ODBoard({ type }: ODBoardProps) {
  const events = type === 'internal' ? internalEvents : externalEvents;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [applying, setApplying] = useState<number | null>(null);
  const [applicationFiles, setApplicationFiles] = useState<File[]>([]);

  const categories = ['All', ...Array.from(new Set(events.map(e => e.category)))];
  const filtered = events.filter(ev =>
    (filter === 'All' || ev.category === filter) &&
    ev.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title={type === 'internal' ? 'Internal OD Board' : 'External OD Board'}>
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="relative w-full lg:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="glass-input pl-9"
            placeholder={`Search ${type} events…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                filter === c
                  ? 'bg-linear-to-r from-blue-400 to-blue-500 text-white shadow-sm'
                  : 'bg-white/40 text-[#5A6170] hover:bg-white/60'
              }`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 lg:ml-auto">
          <button onClick={() => setView('grid')} aria-label="Grid view"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === 'grid' ? 'bg-white/60 shadow-sm' : 'bg-white/20 hover:bg-white/40'}`}>
            <LayoutGrid size={15} />
          </button>
          <button onClick={() => setView('list')} aria-label="List view"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === 'list' ? 'bg-white/60 shadow-sm' : 'bg-white/20 hover:bg-white/40'}`}>
            <List size={15} />
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ev => (
            <div key={ev.id} className="glass-card glass-card-hover p-5"
              style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.22), ${categoryColors[ev.category] ?? 'rgba(255,255,255,0.1)'})` }}>
              <div className="flex items-start justify-between mb-3 gap-2">
                <span className="badge" style={{ background: categoryColors[ev.category], color: '#3A3F4B' }}>{ev.category}</span>
                {type === 'external' && (
                  <span className="badge badge-external text-[11px] flex items-center gap-1">
                    <Globe size={11} /> External
                  </span>
                )}
              </div>
              <h4 className="font-display font-semibold text-[15px] text-text mb-1 leading-snug">{ev.name}</h4>
              <p className="text-[12px] text-text-muted mb-3">{ev.org}</p>
              <div className="text-[12px] text-[#5A6170] space-y-1 mb-4">
                <div className="flex items-center gap-1.5"><Calendar size={12} /> {ev.date}</div>
                <div className="flex items-center gap-1.5"><Users size={12} /> {ev.filled}/{ev.seats} seats</div>
              </div>
              {/* Seat bar */}
              <div className="h-1.5 bg-white/40 rounded-full mb-4">
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: `${(ev.filled / ev.seats) * 100}%`,
                    background: ev.filled === ev.seats ? 'linear-gradient(90deg,#F5A8A8,#EF8080)' : 'linear-gradient(90deg,#A8C8EC,#6FCF97)',
                  }}
                />
              </div>
              {ev.status === 'full' ? (
                <button disabled className="w-full py-2 rounded-xl text-[13px] font-semibold text-text-muted bg-white/30 cursor-not-allowed">
                  Event Full
                </button>
              ) : (
                <button onClick={() => setApplying(ev.id)} className="btn-primary w-full py-2 text-[13px]">
                  Apply for OD
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-2 overflow-x-auto">
          <table className="glass-table min-w-140">
            <thead>
              <tr>
                <th>Event</th>
                <th>Organiser</th>
                <th>Category</th>
                <th>Date</th>
                <th>Seats</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev.id}>
                  <td className="font-medium text-text">{ev.name}</td>
                  <td className="text-[#5A6170]">{ev.org}</td>
                  <td><span className="badge" style={{ background: categoryColors[ev.category], color: '#3A3F4B' }}>{ev.category}</span></td>
                  <td className="text-[#5A6170]">{ev.date}</td>
                  <td className="text-center">{ev.filled}/{ev.seats}</td>
                  <td>
                    {ev.status === 'full'
                      ? <span className="text-[12px] text-text-muted">Full</span>
                      : <button onClick={() => setApplying(ev.id)} className="btn-primary py-1.5 px-3 text-[12px]">Apply</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply modal */}
      {applying !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card w-full max-w-sm p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(24px)' }}>
            <h3 className="font-display font-bold text-[18px] text-text mb-2">Apply for OD</h3>
            <p className="text-[13px] text-text-muted mb-5">
              {events.find(e => e.id === applying)?.name}
            </p>
            <div className="space-y-3 mb-5">
              <textarea className="glass-input" rows={3} placeholder="State your role or reason for participation…" />
              <label htmlFor="od-application-files" className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/70 bg-white/25 px-4 py-3 transition-colors hover:bg-white/40">
                <Paperclip size={17} className="shrink-0 text-text-muted" />
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-text">Attach supporting files</span>
                  <span className="block text-[11px] text-text-muted">PDF, JPG, or PNG · up to 5 MB each</span>
                </span>
              </label>
              <input
                id="od-application-files"
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={e => setApplicationFiles(Array.from(e.target.files ?? []))}
              />
              {applicationFiles.length > 0 && (
                <ul className="space-y-1">
                  {applicationFiles.map(file => (
                    <li key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-2 rounded-lg bg-white/35 px-3 py-2 text-[12px] text-text">
                      <span className="min-w-0 truncate">{file.name}</span>
                      <span className="shrink-0 text-text-muted">{Math.ceil(file.size / 1024)} KB</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setApplying(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => setApplying(null)} className="btn-primary flex-1">Submit</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

// Named, prop-free wrapper components for use with React Router's
// `Component:` route field (which calls the component with no props).
// This replaces the original routes.ts pattern of calling `ODBoard({ type })`
// as a plain JS function — that ran ODBoard's hooks (useState, several times)
// during the *caller's* render instead of giving ODBoard its own fiber/render
// pass, which breaks React's rules of hooks the moment ODBoard's hook order
// or count ever depends on props/state (it does: multiple useState calls).
// A real JSX wrapper element gives ODBoard a proper component instance.
export function InternalODBoard() {
  return <ODBoard type="internal" />;
}

export function ExternalODBoard() {
  return <ODBoard type="external" />;
}

export default ODBoard;
