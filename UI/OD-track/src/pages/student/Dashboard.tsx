import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Hand,
  X,
} from 'lucide-react';

const recentRequests = [
  { id: 'OD-2024-001', event: 'Smart India Hackathon 2024', type: 'External', date: '14 Sep 2024', days: 3, status: 'approved' },
  { id: 'OD-2024-002', event: 'CSE Department Symposium', type: 'Internal', date: '20 Sep 2024', days: 1, status: 'pending' },
  { id: 'OD-2024-003', event: 'IIT Bombay TechFest', type: 'External', date: '05 Oct 2024', days: 2, status: 'pending' },
  { id: 'OD-2024-004', event: 'Annual Sports Day', type: 'Internal', date: '28 Aug 2024', days: 1, status: 'rejected' },
  { id: 'OD-2024-005', event: 'IEEE Student Conference', type: 'External', date: '18 Aug 2024', days: 2, status: 'approved' },
];

const upcomingEvents = [
  { name: 'ACM ICPC Regional', date: '25 Oct 2024', org: 'ACM', type: 'External' },
  { name: 'College Cultural Fest', date: '02 Nov 2024', org: 'Student Council', type: 'Internal' },
  { name: 'National Robotics Challenge', date: '10 Nov 2024', org: 'IIT Madras', type: 'External' },
];

const statusBadge = (s: string) => {
  const cls = s === 'approved' ? 'badge-approved' : s === 'pending' ? 'badge-pending' : 'badge-rejected';
  return <span className={`badge ${cls}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
};

export default function StudentDashboard() {
  const { name } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNewOD, setShowNewOD] = useState(location.pathname === '/student/new');
  const [odForm, setOdForm] = useState({ event: '', date: '', days: '', reason: '', type: 'Internal' });
  const [odFiles, setOdFiles] = useState<File[]>([]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout title="Student Dashboard">
      {/* Greeting */}
      <div
        className="glass-card p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(168,200,236,0.3), rgba(168,230,201,0.2))' }}
      >
        <div>
          <h2 className="font-display font-bold text-[20px] sm:text-[22px] text-text flex items-center gap-2">
            {greeting}, {name}! <Hand size={20} className="text-amber-500" />
          </h2>
          <p className="text-[14px] text-[#5A6170] mt-1">
            You have <strong>2 pending</strong> OD requests awaiting approval.
          </p>
        </div>
        <button className="btn-primary shrink-0" onClick={() => setShowNewOD(true)}>
          + New OD Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Requests" value={12} icon={ClipboardList} color="blue" delta="+2 this month" />
        <StatCard label="Approved" value={8} icon={CheckCircle2} color="green" delta="67%" />
        <StatCard label="Pending" value={2} icon={Clock} color="amber" delta="Active" />
        <StatCard label="Rejected" value={2} icon={XCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent requests */}
        <div className="lg:col-span-2 glass-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-[16px] text-text">Recent Requests</h3>
            <button className="text-[13px] text-blue-500 hover:text-blue-700 font-medium">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="glass-table min-w-140">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Event</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((r) => (
                  <tr key={r.id} className="cursor-pointer">
                    <td className="font-mono text-[12px] text-text-muted">{r.id}</td>
                    <td className="font-medium text-text">{r.event}</td>
                    <td>
                      <span className={`badge ${r.type === 'External' ? 'badge-external' : 'badge-internal'}`}>{r.type}</span>
                    </td>
                    <td className="text-[#5A6170]">{r.date}</td>
                    <td className="text-center">{r.days}</td>
                    <td>{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming events */}
        <div className="glass-card p-5 sm:p-6">
          <h3 className="font-display font-semibold text-[16px] text-text mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((ev) => (
              <div key={ev.name} className="p-3 rounded-[12px] hover:bg-white/30 transition-all cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-[13px] text-text">{ev.name}</div>
                  <span className={`badge ${ev.type === 'External' ? 'badge-external' : 'badge-internal'} shrink-0`}>
                    {ev.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-text-muted mt-1">
                  <Calendar size={12} /> {ev.date} · {ev.org}
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/student/external')} className="btn-secondary w-full text-[13px] mt-2">
              Browse all events →
            </button>
          </div>
        </div>
      </div>

      {/* New OD modal */}
      {showNewOD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto" style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(24px)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-[20px] text-text">New OD Request</h3>
              <button onClick={() => setShowNewOD(false)} className="text-text-muted hover:text-text" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowNewOD(false); }} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Event Name</label>
                <input className="glass-input" placeholder="e.g. Smart India Hackathon" value={odForm.event} onChange={e => setOdForm({ ...odForm, event: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Date</label>
                  <input type="date" className="glass-input" value={odForm.date} onChange={e => setOdForm({ ...odForm, date: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Days</label>
                  <input type="number" min="1" max="30" className="glass-input" placeholder="1" value={odForm.days} onChange={e => setOdForm({ ...odForm, days: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Type</label>
                <select className="glass-input" value={odForm.type} onChange={e => setOdForm({ ...odForm, type: e.target.value })}>
                  <option>Internal</option>
                  <option>External</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Reason</label>
                <textarea className="glass-input" rows={3} placeholder="Brief description of the event and your participation…" value={odForm.reason} onChange={e => setOdForm({ ...odForm, reason: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="od-supporting-files" className="block text-[12px] font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Supporting Files</label>
                <label htmlFor="od-supporting-files" className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/70 bg-white/25 px-4 py-3 transition-colors hover:bg-white/40">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/50 text-text-muted">+</span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-text">Add documents</span>
                    <span className="block text-[11px] text-text-muted">PDF, JPG, or PNG · up to 5 MB each</span>
                  </span>
                </label>
                <input
                  id="od-supporting-files"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  className="sr-only"
                  onChange={e => setOdFiles(Array.from(e.target.files ?? []))}
                />
                {odFiles.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {odFiles.map(file => (
                      <li key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-2 rounded-lg bg-white/35 px-3 py-2 text-[12px] text-text">
                        <span className="min-w-0 truncate">{file.name}</span>
                        <span className="shrink-0 text-text-muted">{Math.ceil(file.size / 1024)} KB</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowNewOD(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
