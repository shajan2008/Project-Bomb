import Layout from '../../components/Layout';
import AggregatedCalendar, { type AggregatedODEntry } from '../../components/AggregatedCalendar';

const deptEntries: AggregatedODEntry[] = [
  { date: '2024-10-14', student: 'Arjun Kumar', rollNo: 'CSE21001', event: 'Smart India Hackathon', type: 'External', session: 'Full Day', status: 'approved' },
  { date: '2024-10-14', student: 'Rahul Verma', rollNo: 'CSE20044', event: 'Internal Review', type: 'Internal', session: 'FN', status: 'pending' },
  { date: '2024-10-22', student: 'Vikram Singh', rollNo: 'CSE21022', event: 'Dept Symposium', type: 'Internal', session: 'AN', status: 'approved' },
  { date: '2024-10-22', student: 'Sneha Pillai', rollNo: 'ECE21019', event: 'Dept Symposium', type: 'Internal', session: 'AN', status: 'approved' },
  { date: '2024-11-05', student: 'Kavya Suresh', rollNo: 'CSE21058', event: 'ACM ICPC Prep', type: 'Internal', session: 'FN', status: 'approved' },
  { date: '2024-11-10', student: 'Akhil Thomas', rollNo: 'EEE21027', event: 'National Robotics Challenge', type: 'External', session: 'Full Day', status: 'pending' },
];

export default function HodCalendar() {
  return (
    <Layout title="Department OD Calendar">
      <AggregatedCalendar
        title="Department schedule for selected day"
        entries={deptEntries}
        initialYear={2024}
        initialMonth0={9}
      />
    </Layout>
  );
}
