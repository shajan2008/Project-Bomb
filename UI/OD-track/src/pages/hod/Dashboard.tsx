import { useState } from 'react';
import { useLocation } from 'react-router';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import StudentInfoCard, { type StudentInfoDetail } from '../../components/StudentInfoCard';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Landmark,
  Check,
  X,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface PendingRequest extends StudentInfoDetail {
  id: string;
  date: string;
  days: number;
  type: 'Internal' | 'External';
}

const pendingRequests: PendingRequest[] = [
  {
    id: 'OD-101', name: 'Rahul Verma', rollNo: 'CSE20044', department: 'CSE', year: '3rd Year', section: 'B',
    attendancePct: 78, odCountToDate: 6, event: 'Internal Review escalation — overdue mentor action',
    proofFileName: 'proof_review.pdf', mentorRecommendation: 'none',
    date: '20 Oct 2024', days: 1, type: 'Internal',
  },
  {
    id: 'OD-102', name: 'Sneha Pillai', rollNo: 'ECE21019', department: 'ECE', year: '2nd Year', section: 'A',
    attendancePct: 91, odCountToDate: 3, event: 'IEEE Paper Contest — certificate pending',
    proofFileName: 'ieee_certificate.pdf', mentorRecommendation: 'approve',
    date: '08 Nov 2024', days: 1, type: 'External',
  },
  {
    id: 'OD-103', name: 'Akhil Thomas', rollNo: 'EEE21027', department: 'EEE', year: '2nd Year', section: 'C',
    attendancePct: 84, odCountToDate: 4, event: 'National Robotics Challenge — duplicate submission flagged',
    mentorRecommendation: 'reject',
    date: '10 Nov 2024', days: 2, type: 'External',
  },
];

const deptSummary = [
  { dept: 'CSE', total: 280, approved: 234, pending: 28, avgTime: '2.1h' },
  { dept: 'ECE', total: 235, approved: 198, pending: 22, avgTime: '3.2h' },
  { dept: 'MECH', total: 175, approved: 145, pending: 18, avgTime: '4.8h' },
  { dept: 'EEE', total: 199, approved: 168, pending: 20, avgTime: '2.9h' },
];

export default function HodDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState<'approvals' | 'tracking'>(
    location.pathname === '/hod/tracking' ? 'tracking' : 'approvals',
  );
  const [actionedIds, setActionedIds] = useState<string[]>([]);

  const pending = pendingRequests.filter((r) => !actionedIds.includes(r.id));

  const tabs = [
    { id: 'approvals' as const, label: `Escalated Requests (${pending.length})`, icon: ClipboardList },
    { id: 'tracking' as const, label: 'Department Tracking', icon: BarChart3 },
  ];

  return (
    <Layout title="HOD Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Escalated Requests" value={pending.length} icon={ClipboardList} color="amber" delta="Needs review" />
        <StatCard label="Approved This Month" value={62} icon={CheckCircle2} color="green" delta="+9" />
        <StatCard label="Avg Response Time" value="2.6h" icon={Clock} color="violet" />
        <StatCard label="Departments Under You" value={1} icon={Landmark} color="blue" />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-[12px] text-[13px] font-semibold transition-all ${
              tab === t.id ? 'bg-linear-to-r from-violet-400 to-violet-500 text-white shadow-sm' : 'bg-white/40 text-[#5A6170] hover:bg-white/60'
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'approvals' && (
        <div className="glass-card p-4 sm:p-6 overflow-visible">
          {pending.length === 0 ? (
            <div className="text-center py-10 text-text-muted">
              <p className="font-medium">No escalated requests right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((req) => (
                <StudentInfoCard key={req.id} detail={req}>
                  <div
                    className="p-4 sm:p-5 rounded-2xl cursor-pointer hover:bg-white/45 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.5)' }}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-300 to-violet-400 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {req.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-[14px] text-text">{req.name}</span>
                          <span className="text-[12px] text-text-muted">{req.rollNo}</span>
                          <span className="text-[11px] text-text-muted">· {req.department}</span>
                        </div>
                        <div className="text-[13px] text-[#5A6170] mt-0.5">{req.event}</div>
                        <div className="flex gap-2 mt-2 items-center flex-wrap">
                          <span className="badge badge-pending">Escalated</span>
                          <span className={`badge ${req.type === 'External' ? 'badge-external' : 'badge-internal'}`}>{req.type}</span>
                          <span className="flex items-center gap-1 text-[12px] text-text-muted">
                            <Calendar size={12} /> {req.date} · {req.days}d
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActionedIds((p) => [...p, req.id]); }}
                          className="btn-success text-[12px] py-1.5 px-3 flex items-center gap-1 flex-1 sm:flex-none justify-center"
                        >
                          <Check size={13} /> Approve
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setActionedIds((p) => [...p, req.id]); }}
                          className="btn-danger text-[12px] py-1.5 px-3 flex items-center gap-1 flex-1 sm:flex-none justify-center"
                        >
                          <X size={13} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </StudentInfoCard>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'tracking' && (
        <div className="glass-card p-2 overflow-x-auto">
          <table className="glass-table min-w-140">
            <thead>
              <tr><th>Dept</th><th>Total</th><th>Approved</th><th>Pending</th><th>Avg Response</th><th>Rate</th></tr>
            </thead>
            <tbody>
              {deptSummary.map((h) => (
                <tr key={h.dept}>
                  <td className="font-bold text-text">{h.dept}</td>
                  <td className="text-center">{h.total}</td>
                  <td><span className="badge badge-approved">{h.approved}</span></td>
                  <td><span className="badge badge-pending">{h.pending}</span></td>
                  <td className="text-center text-[#5A6170]">{h.avgTime}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/40 rounded-full">
                        <div className="h-full rounded-full" style={{ width: `${Math.round((h.approved / h.total) * 100)}%`, background: 'linear-gradient(90deg,#A8C8EC,#6FCF97)' }} />
                      </div>
                      <span className="text-[11px] text-text-muted">{Math.round((h.approved / h.total) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
