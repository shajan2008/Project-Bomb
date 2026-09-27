import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FileText, ThumbsUp, ThumbsDown, MinusCircle } from 'lucide-react';

export interface StudentInfoDetail {
  name: string;
  rollNo: string;
  department: string;
  year: string;
  section: string;
  attendancePct: number;
  odCountToDate: number;
  event: string;
  proofFileName?: string;
  mentorRecommendation: 'approve' | 'reject' | 'none';
}

const recommendationMeta: Record<StudentInfoDetail['mentorRecommendation'], { label: string; icon: typeof ThumbsUp; color: string }> = {
  approve: { label: 'Mentor recommends approval', icon: ThumbsUp, color: '#1E7D4F' },
  reject: { label: 'Mentor recommends rejection', icon: ThumbsDown, color: '#C0392B' },
  none: { label: 'No mentor recommendation yet', icon: MinusCircle, color: '#8A8F99' },
};

const HOVER_OPEN_DELAY_MS = 400;

/**
 * Wraps its children (a table row / list item trigger) with a popover that
 * opens on hover after a short delay (to avoid jitter while scanning a
 * list), and locks open on click so it stays put for inspection — including
 * on touch devices, where there is no hover state to begin with.
 */
export default function StudentInfoCard({ detail, children }: { detail: StudentInfoDetail; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scheduleOpen = () => {
    if (locked) return;
    hoverTimer.current = setTimeout(() => setOpen(true), HOVER_OPEN_DELAY_MS);
  };

  const cancelScheduledOpen = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const handleMouseLeave = () => {
    cancelScheduledOpen();
    if (!locked) setOpen(false);
  };

  const handleClick = () => {
    cancelScheduledOpen();
    setLocked((prev) => {
      const next = !prev;
      setOpen(next);
      return next;
    });
  };

  useEffect(() => {
    if (!locked) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setLocked(false);
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [locked]);

  const rec = recommendationMeta[detail.mentorRecommendation];
  const RecIcon = rec.icon;

  return (
    <div
      ref={containerRef}
      className="relative inline-block w-full"
      onMouseEnter={scheduleOpen}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}

      {open && (
        <div
          className="absolute z-40 left-0 top-full mt-2 w-72 max-w-[90vw] glass-card p-4 text-left"
          style={{ background: 'rgba(255,255,255,0.97)', boxShadow: '0 12px 32px rgba(0,0,0,0.18)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-display font-semibold text-[14px] text-text mb-0.5">{detail.name}</div>
          <div className="text-[12px] text-text-muted font-mono mb-3">{detail.rollNo}</div>

          <div className="grid grid-cols-2 gap-2 text-[12px] mb-3">
            <div><span className="text-text-muted">Dept</span><div className="font-medium text-text">{detail.department}</div></div>
            <div><span className="text-text-muted">Year</span><div className="font-medium text-text">{detail.year}</div></div>
            <div><span className="text-text-muted">Section</span><div className="font-medium text-text">{detail.section}</div></div>
            <div><span className="text-text-muted">Attendance</span><div className="font-medium text-text">{detail.attendancePct}%</div></div>
          </div>

          <div className="text-[12px] text-text-muted mb-1">OD count to date</div>
          <div className="font-semibold text-[15px] text-text mb-3">{detail.odCountToDate}</div>

          <div className="text-[12px] text-text-muted mb-1">Event</div>
          <div className="text-[13px] text-text mb-3">{detail.event}</div>

          {detail.proofFileName && (
            <div className="flex items-center gap-1.5 text-[12px] text-blue-600 mb-3">
              <FileText size={13} /> {detail.proofFileName}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[12px] font-medium pt-2 border-t border-black/5" style={{ color: rec.color }}>
            <RecIcon size={14} /> {rec.label}
          </div>
        </div>
      )}
    </div>
  );
}
