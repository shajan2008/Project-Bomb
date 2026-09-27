import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon; // pass the component itself, e.g. icon={FileText}
  color: 'blue' | 'green' | 'amber' | 'red' | 'violet';
  delta?: string;
}

const colorMap = {
  blue:   { bg: 'rgba(168,200,236,0.25)', icon: 'rgba(123,174,232,0.3)', text: '#2E6DA8' },
  green:  { bg: 'rgba(168,230,201,0.25)', icon: 'rgba(111,207,151,0.35)', text: '#1E7D4F' },
  amber:  { bg: 'rgba(245,216,150,0.25)', icon: 'rgba(245,196,96,0.35)', text: '#B8860B' },
  red:    { bg: 'rgba(245,168,168,0.25)', icon: 'rgba(239,128,128,0.35)', text: '#C0392B' },
  violet: { bg: 'rgba(200,180,240,0.25)', icon: 'rgba(160,130,220,0.35)', text: '#6B21A8' },
};

export default function StatCard({ label, value, icon: Icon, color, delta }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className="glass-card glass-card-hover p-5 sm:p-6 min-w-0"
      style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.1))` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: c.icon }}
        >
          <Icon size={20} strokeWidth={2.2} style={{ color: c.text }} />
        </div>
        {delta && (
          <span
            className="text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
            style={{ background: c.bg, color: c.text }}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="font-display font-bold text-[24px] sm:text-[28px] text-text leading-none mb-1 truncate">
        {value}
      </div>
      <div className="text-[13px] text-text-muted font-medium truncate">{label}</div>
    </div>
  );
}
