import { useState } from 'react';
import { useLocation } from 'react-router';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import {
  Clock,
  CheckCircle2,
  GraduationCap,
  Zap,
  ClipboardList,
  BarChart3,
  PartyPopper,
  Check,
  X,
  Calendar,
  List,
} from 'lucide-react';

const pendingApprovals = [
  { id: 'OD-001', student: 'Arjun Kumar', rollNo: 'CSE21001', event: 'Smart India Hackathon', date: '11 Dec 2024', days: 3, type: 'External', submitted: '2 hrs ago' },
  { id: 'OD-002', student: 'Preethi Rajan', rollNo: 'CSE21015', event: 'IEEE Paper Contest', date: '08 Nov 2024', days: 1, type: 'External', submitted: '5 hrs ago' },
  { id: 'OD-003', student: 'Vikram Singh', rollNo: 'CSE21022', event: 'Dept Symposium', date: '22 Oct 2024', days: 1, type: 'Internal', submitted: '1 day ago' },
  { id: 'OD-004', student: 'Ananya Das', rollNo: 'CSE21034', event: 'ACM ICPC', date: '25 Oct 2024', days: 1, type: 'External', submitted: '1 day ago' },
];

const classStudents = [
  { name: 'Arjun Kumar',   rollNo: 'CSE21001', approved: 8, pending: 2, rejected: 1 },
  { name: 'Preethi Rajan', rollNo: 'CSE21015', approved: 5, pending: 1, rejected: 0 },
  { name: 'Vikram Singh',  rollNo: 'CSE21022', approved: 3, pending: 1, rejected: 2 },
  { name: 'Ananya Das',    rollNo: 'CSE21034', approved: 6, pending: 1, rejected: 0 },
  { name: 'Rohit Menon',   rollNo: 'CSE21041', approved: 2, pending: 0, rejected: 1 },
  { name: 'Kavya Suresh',  rollNo: 'CSE21058', approved: 7, pending: 0, rejected: 0 },
  { name: 'Nikhil Rao',    rollNo: 'CSE21063', approved: 4, pending: 2, rejected: 1 },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const classODDates: Record<string, string[]> = {
  '2024-10-14': ['Arjun Kumar', 'Preethi Rajan'],
  '2024-10-15': ['Arjun Kumar'],
  '2024-10-22': ['Vikram Singh', 'Ananya Das'],
  '2024-11-05': ['Arjun Kumar', 'Kavya Suresh'],
  '2024-10-08': ['Preethi Rajan', 'Nikhil Rao'],
};

export default function MentorDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState<'approvals' | 'tracking'>(location.pathname === '/mentor/tracking' ? 'tracking' : 'approvals');
  const [trackView, setTrackView] = useState<'list' | 'calendar'>('list');
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [actionedIds, setActionedIds] = useState<string[]>([]);
  const [year] = useState(2024);
  const [month] = useState(9);

  const pending = pendingApprovals.filter(a => !actionedIds.includes(a.id));

  const days = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const studentsOnDate = (d: number) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return classODDates[key] ?? [];
  };

  const tabs = [
    { id: 'approvals' as const, label: `Pending Approvals (${pending.length})`, icon: ClipboardList },
    { id: 'tracking' as const, label: 'Class OD Tracking', icon: BarChart3 },
  ];

  return (
    <Layout title="Mentor Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Approvals" value={pending.length} icon={Clock} color="amber" delta="Urgent" />
        <StatCard label="Approved This Month" value={18} icon={CheckCircle2} color="green" delta="+4" />
        <StatCard label="Students Assigned" value={42} icon={GraduationCap} color="blue" />
        <StatCard label="Avg Response Time" value="2.4h" icon={Zap} color="violet" delta="Fast" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-[12px] text-[13px] font-semibold transition-all ${
              tab === t.id ? 'bg-linear-to-r from-teal-400 to-teal-500 text-white shadow-sm' : 'bg-white/40 text-[#5A6170] hover:bg-white/60'
            }`}>
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'approvals' && (
        <div className="glass-card p-4 sm:p-6">
          {pending.length === 0 ? (
            <div className="text-center py-10 text-text-muted">
              <PartyPopper size={34} className="mx-auto mb-3 text-amber-400" />
              <p className="font-medium">All caught up! No pending approvals.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map(req => (
                <div key={req.id} className="p-4 sm:p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-300 to-teal-400 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {req.student.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-[14px] text-text">{req.student}</span>
                        <span className="text-[12px] text-text-muted">{req.rollNo}</span>
                        <span className="text-[11px] text-text-muted">· {req.submitted}</span>
                      </div>
                      <div className="text-[13px] text-[#5A6170] mt-0.5">{req.event}</div>
                      <div className="flex gap-2 mt-2 items-center flex-wrap">
                        <span className="badge badge-pending">Pending</span>
                        <span className={`badge ${req.type === 'External' ? 'badge-external' : 'badge-internal'}`}>{req.type}</span>
                        <span className="flex items-center gap-1 text-[12px] text-text-muted">
                          <Calendar size={12} /> {req.date} · {req.days}d
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                      <button onClick={() => setActionedIds(p => [...p, req.id])} className="btn-success text-[12px] py-1.5 px-3 flex items-center gap-1 flex-1 sm:flex-none justify-center">
                        <Check size={13} /> Approve
                      </button>
                      <button onClick={() => setActionedIds(p => [...p, req.id])} className="btn-danger text-[12px] py-1.5 px-3 flex items-center gap-1 flex-1 sm:flex-none justify-center">
                        <X size={13} /> Reject
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <input
                      className="glass-input text-[13px] py-2"
                      placeholder="Add remarks (optional)…"
                      value={remarks[req.id] ?? ''}
                      onChange={e => setRemarks(r => ({ ...r, [req.id]: e.target.value }))}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'tracking' && (
        <div>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setTrackView('list')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-[10px] text-[13px] font-medium transition-all ${
                trackView === 'list' ? 'bg-white/60 shadow-sm text-text' : 'bg-white/30 text-[#5A6170] hover:bg-white/50'
              }`}>
              <List size={14} /> List View
            </button>
            <button onClick={() => setTrackView('calendar')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-[10px] text-[13px] font-medium transition-all ${
                trackView === 'calendar' ? 'bg-white/60 shadow-sm text-text' : 'bg-white/30 text-[#5A6170] hover:bg-white/50'
              }`}>
              <Calendar size={14} /> Calendar View
            </button>
          </div>

          {trackView === 'list' && (
            <div className="glass-card p-2 overflow-x-auto">
              <table className="glass-table min-w-140">
                <thead>
                  <tr>
                    <th>Student</th><th>Roll No</th><th>Approved</th><th>Pending</th><th>Rejected</th><th>Total OD Days</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map(s => (
                    <tr key={s.rollNo}>
                      <td className="font-medium text-text">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-linear-to-br from-teal-200 to-teal-300 flex items-center justify-center text-[11px] font-bold text-teal-700 shrink-0">
                            {s.name.charAt(0)}
                          </div>
                          {s.name}
                        </div>
                      </td>
                      <td className="font-mono text-[12px] text-text-muted">{s.rollNo}</td>
                      <td><span className="badge badge-approved">{s.approved}</span></td>
                      <td><span className="badge badge-pending">{s.pending}</span></td>
                      <td><span className="badge badge-rejected">{s.rejected}</span></td>
                      <td className="font-semibold text-text">{s.approved + s.pending + s.rejected}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {trackView === 'calendar' && (
            <div className="glass-card p-4 sm:p-6 max-w-2xl">
              <h4 className="font-display font-semibold text-[16px] text-text mb-4">{MONTHS[month]} {year} — Class OD Overview</h4>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(d => <div key={d} className="text-center text-[10px] sm:text-[11px] font-semibold text-text-muted py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: days }).map((_, i) => {
                  const d = i + 1;
                  const names = studentsOnDate(d);
                  return (
                    <div key={d} className={`aspect-square rounded-xl flex flex-col items-center justify-start p-1 relative ${names.length ? 'bg-teal-100/40' : ''}`}>
                      <span className="text-[11px] sm:text-[12px] text-text">{d}</span>
                      {names.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                          {names.slice(0, 3).map((_, idx) => (
                            <div key={idx} className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          ))}
                          {names.length > 3 && <span className="text-[9px] text-teal-600">+{names.length - 3}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[12px] text-text-muted mt-4">
                For Internal/External filtering, exact FN/AN session slots, and clash detection, see the full{' '}
                <span className="font-medium text-text">Calendar</span> page in the sidebar.
              </p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
