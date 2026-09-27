import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Plus,
  School,
  Globe,
  Calendar,
  BarChart3,
  ClipboardList,
  Bell,
  User,
  LogOut,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

const icons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  newod: Plus,
  internal: School,
  external: Globe,
  calendar: Calendar,
  tracking: BarChart3,
  reports: ClipboardList,
  notifications: Bell,
  profile: User,
};

// Dean role removed in full (Phase 3) — no dean key, no dean nav items.
const navItems: Record<Role, { label: string; icon: string; to: string }[]> = {
  student: [
    { label: 'Dashboard', icon: 'dashboard', to: '/student' },
    { label: 'New OD Request', icon: 'newod', to: '/student/new' },
    { label: 'Internal OD Board', icon: 'internal', to: '/student/internal' },
    { label: 'External OD Board', icon: 'external', to: '/student/external' },
    { label: 'OD Calendar', icon: 'calendar', to: '/student/calendar' },
    { label: 'Notifications', icon: 'notifications', to: '/student/notifications' },
    { label: 'Profile', icon: 'profile', to: '/student/profile' },
  ],
  mentor: [
    { label: 'Dashboard', icon: 'dashboard', to: '/mentor' },
    { label: 'Class Tracking', icon: 'tracking', to: '/mentor/tracking' },
    { label: 'Calendar', icon: 'calendar', to: '/mentor/calendar' },
    { label: 'Notifications', icon: 'notifications', to: '/mentor/notifications' },
    { label: 'Profile', icon: 'profile', to: '/mentor/profile' },
  ],
  hod: [
    { label: 'Dashboard', icon: 'dashboard', to: '/hod' },
    { label: 'Dept Tracking', icon: 'tracking', to: '/hod/tracking' },
    { label: 'Calendar', icon: 'calendar', to: '/hod/calendar' },
    { label: 'Reports', icon: 'reports', to: '/hod/reports' },
    { label: 'Notifications', icon: 'notifications', to: '/hod/notifications' },
    { label: 'Profile', icon: 'profile', to: '/hod/profile' },
  ],
};

const roleColors: Record<Role, string> = {
  student: 'from-blue-400 to-blue-500',
  mentor: 'from-teal-400 to-teal-500',
  hod: 'from-violet-400 to-violet-500',
};

const roleLabels: Record<Role, string> = {
  student: 'Student',
  mentor: 'Mentor',
  hod: 'HOD',
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { role, name, logout } = useAuth();
  if (!role) return null;

  const items = navItems[role];

  // Sign-out must be a genuine hard redirect (spec: "hard-redirects the user
  // to the /login route"), not just a state clear that the router guard
  // happens to react to. logout() already clears context, sessionStorage,
  // localStorage and cookies; the location.assign forces a full document
  // reload so no leftover component state or in-memory singletons survive.
  const handleSignOut = () => {
    logout();
    window.location.assign('/');
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`glass-sidebar w-60 shrink-0 flex flex-col h-screen fixed lg:sticky top-0 left-0 z-50 lg:z-30 pointer-events-auto
          transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="px-6 py-5 border-b border-white/30 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl bg-linear-to-br ${roleColors[role]} flex items-center justify-center text-white font-bold text-lg font-display shadow-md shrink-0`}
            >
              OD
            </div>
            <div className="min-w-0">
              <div className="font-display font-700 text-[15px] text-text truncate">ODTrack</div>
              <div className="text-[11px] text-text-muted font-medium truncate">{roleLabels[role]} Portal</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:bg-white/30 hover:text-text transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = icons[item.icon];
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === `/${role}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13.5px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white/60 text-text shadow-sm font-semibold'
                      : 'text-[#5A6170] hover:bg-white/30 hover:text-text'
                  }`
                }
              >
                <Icon size={17} strokeWidth={2} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-white/30">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div
              className={`w-8 h-8 rounded-full bg-linear-to-br ${roleColors[role]} flex items-center justify-center text-white text-sm font-semibold shrink-0`}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-text truncate">{name}</div>
              <div className="text-[11px] text-text-muted">{roleLabels[role]}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-[12px] text-text-muted hover:text-red-400 transition-colors text-left px-1"
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
