import Layout from '../../components/Layout';
import AggregatedCalendar, { type AggregatedODEntry } from '../../components/AggregatedCalendar';

const mentorEntries: AggregatedODEntry[] = [
  { date: '2024-10-14', student: 'Arjun Kumar', rollNo: 'CSE21001', event: 'Smart India Hackathon', type: 'External', session: 'Full Day', status: 'approved' },
  { date: '2024-10-14', student: 'Preethi Rajan', rollNo: 'CSE21015', event: 'IEEE Paper Contest', type: 'External', session: 'FN', status: 'pending' },
  { date: '2024-10-15', student: 'Arjun Kumar', rollNo: 'CSE21001', event: 'Smart India Hackathon', type: 'External', session: 'Full Day', status: 'approved' },
  { date: '2024-10-22', student: 'Vikram Singh', rollNo: 'CSE21022', event: 'Dept Symposium', type: 'Internal', session: 'AN', status: 'approved' },
  { date: '2024-10-22', student: 'Ananya Das', rollNo: 'CSE21034', event: 'Dept Symposium', type: 'Internal', session: 'AN', status: 'approved' },
  { date: '2024-11-05', student: 'Arjun Kumar', rollNo: 'CSE21001', event: 'ACM ICPC Prep', type: 'Internal', session: 'FN', status: 'pending' },
  { date: '2024-11-05', student: 'Kavya Suresh', rollNo: 'CSE21058', event: 'ACM ICPC Prep', type: 'Internal', session: 'FN', status: 'approved' },
  { date: '2024-10-08', student: 'Preethi Rajan', rollNo: 'CSE21015', event: 'Placement Drive', type: 'External', session: 'Full Day', status: 'approved' },
  { date: '2024-10-08', student: 'Nikhil Rao', rollNo: 'CSE21063', event: 'Placement Drive', type: 'External', session: 'Full Day', status: 'rejected' },
];

export default function MentorCalendar() {
  return (
    <Layout title="Class OD Calendar">
      <AggregatedCalendar
        title="Class schedule for selected day"
        entries={mentorEntries}
        initialYear={2024}
        initialMonth0={9}
      />
    </Layout>
  );
}
