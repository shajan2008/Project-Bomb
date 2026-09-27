import Layout from '../components/Layout';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <Layout title={title}>
      <div className="glass-card p-10 text-center text-text-muted">
        <p className="text-[14px]">{title} is coming soon.</p>
      </div>
    </Layout>
  );
}
