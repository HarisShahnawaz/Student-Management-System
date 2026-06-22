/**
 * Dashboard.jsx
 * Analytics overview with stat cards and Recharts performance visualizations.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { Users, TrendingUp, AlertTriangle, BarChart3, PieChartIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useStudents } from '../context/StudentContext';
import { computeDashboardStats, getAttendancePercentage } from '../utils/gradeUtils';

function StatCard({ title, value, subtitle, icon: Icon, accent = 'neutral' }) {
  const accents = {
    neutral: {
      bg: 'bg-white',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      valueColor: 'text-slate-900',
    },
    success: {
      bg: 'bg-white',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-600',
    },
    danger: {
      bg: 'bg-white',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      valueColor: 'text-red-600',
    },
  };

  const style = accents[accent];

  return (
    <div
      className={`${style.bg} rounded-2xl border border-slate-200 p-5 shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`mt-1 text-3xl font-bold ${style.valueColor}`}>{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${style.iconBg}`}>
          <Icon className={`h-6 w-6 ${style.iconColor}`} />
        </div>
      </div>
    </div>
  );
}

const GRADE_COLORS = {
  'A+': '#059669',
  A: '#10b981',
  B: '#34d399',
  C: '#94a3b8',
  F: '#dc2626',
};

function GradeDistributionChart({ distribution }) {
  const chartData = ['A+', 'A', 'B', 'C', 'F'].map((grade) => ({
    grade,
    count: distribution[grade] ?? 0,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-slate-600" />
        <h2 className="text-lg font-semibold text-slate-800">
          Performance — Grade Distribution
        </h2>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="grade" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
              }}
              formatter={(value) => [`${value} students`, 'Count']}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AttendanceChart({ students }) {
  const chartData = useMemo(() => {
    const classMap = {};
    students.forEach((s) => {
      if (!classMap[s.class]) classMap[s.class] = [];
      classMap[s.class].push(getAttendancePercentage(s.attendance));
    });

    return Object.entries(classMap)
      .map(([cls, percentages]) => ({
        class: cls,
        attendance: Math.round(
          (percentages.reduce((a, b) => a + b, 0) / percentages.length) * 10
        ) / 10,
      }))
      .sort((a, b) => a.class.localeCompare(b.class));
  }, [students]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <PieChartIcon className="h-5 w-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-slate-800">
          Attendance by Program
        </h2>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="attendance"
              nameKey="class"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ class: cls, attendance }) => `${cls}: ${attendance}%`}
              labelLine={{ stroke: '#94a3b8' }}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={index % 2 === 0 ? '#059669' : '#10b981'}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
              }}
              formatter={(value) => [`${value}%`, 'Avg Attendance']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { students } = useStudents();
  const { totalStudents, avgAttendance, failingCount, gradeDistribution } =
    computeDashboardStats(students);

  return (
    <div className="space-y-6">
      {/* Stat cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Registered in the system"
          icon={Users}
          accent="neutral"
        />
        <StatCard
          title="Average Attendance"
          value={`${avgAttendance}%`}
          subtitle="Across all enrolled students"
          icon={TrendingUp}
          accent="success"
        />
        <StatCard
          title="Low Performance"
          value={failingCount}
          subtitle="Students with failing grades (F)"
          icon={AlertTriangle}
          accent="danger"
        />
      </div>

      {/* Recharts analytics row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GradeDistributionChart distribution={gradeDistribution} />
        <AttendanceChart students={students} />
      </div>
    </div>
  );
}
