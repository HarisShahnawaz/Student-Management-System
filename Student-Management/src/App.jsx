/**
 * App.jsx
 * Root layout orchestrating sidebar navigation, navbar, and view routing.
 */

import { useState } from 'react';
import { StudentProvider } from './context/StudentContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import StudentList from './views/StudentList';
import Attendance from './views/Attendance';
import Results from './views/Results';

const VIEWS = {
  dashboard: Dashboard,
  students: StudentList,
  attendance: Attendance,
  results: Results,
};

function AppLayout() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ActiveComponent = VIEWS[activeView] ?? Dashboard;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          activeView={activeView}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StudentProvider>
      <AppLayout />
    </StudentProvider>
  );
}
