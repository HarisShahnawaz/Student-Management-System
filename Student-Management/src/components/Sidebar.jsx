
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  GraduationCap,
  X,
  BookOpen,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Student List', icon: Users },
  { id: 'attendance', label: 'Attendance', icon: CheckSquare },
  { id: 'results', label: 'Results', icon: GraduationCap },
];

export default function Sidebar({ activeView, onNavigate, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-white
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-400" />
            <span className="text-lg font-bold tracking-wide text-white">
              UniPortal
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id;
            return (
              <button
                key={id}
                onClick={() => {
                  onNavigate(id);
                  onClose();
                }}
                className={`
                  flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }
                `}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer credit */}
        <div className="border-t border-slate-800 p-4">
          <p className="text-xs text-slate-500">University Management v1.0</p>
        </div>
      </aside>
    </>
  );
}

export { NAV_ITEMS };
