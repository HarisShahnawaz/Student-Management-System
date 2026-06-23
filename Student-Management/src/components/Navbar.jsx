

import { Menu } from 'lucide-react';
import { NAV_ITEMS } from './Sidebar';

const VIEW_TITLES = Object.fromEntries(
  NAV_ITEMS.map(({ id, label }) => [id, label])
);

export default function Navbar({ activeView, onMenuToggle }) {
  const title = VIEW_TITLES[activeView] ?? 'Dashboard';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger — visible on mobile only */}
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-slate-800 sm:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:inline">
          Welcome, Administrator
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-200 sm:text-sm">
          Admin Active
        </span>
      </div>
    </header>
  );
}
