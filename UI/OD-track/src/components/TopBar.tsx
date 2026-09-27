import { useState } from 'react';
import { Menu, Search, Bell, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

const roleColors: Record<Role, string> = {
  student: 'from-blue-400 to-blue-500',
  mentor: 'from-teal-400 to-teal-500',
  hod: 'from-violet-400 to-violet-500',
};

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export default function TopBar({ title, onMenuClick }: TopBarProps) {
  const { role, name } = useAuth();
  const [query, setQuery] = useState('');

  return (
    <header className="glass-topbar sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl glass-card hover:bg-white/40 transition-all shrink-0"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <h1 className="font-display font-semibold text-[16px] sm:text-[18px] text-text truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="topbar-search hidden sm:flex">
          <Search size={15} className="shrink-0 text-text-muted" aria-hidden="true" />
          <input
            type="text"
            aria-label="Search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-text outline-none placeholder:text-text-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="shrink-0 rounded-full p-0.5 text-text-muted transition-colors hover:bg-black/5 hover:text-text"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button className="sm:hidden p-2 rounded-xl glass-card hover:bg-white/40 transition-all" aria-label="Search">
          <Search size={17} />
        </button>

        <button className="relative p-2 rounded-xl glass-card hover:bg-white/40 transition-all" aria-label="Notifications">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
        </button>

        {role && (
          <div
            className={`w-8 h-8 rounded-full bg-linear-to-br ${roleColors[role]} flex items-center justify-center text-white text-sm font-semibold cursor-pointer shrink-0`}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
