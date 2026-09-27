import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  title: string;
  children: ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="page-bg min-h-screen flex">
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">
        <TopBar title={title} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
