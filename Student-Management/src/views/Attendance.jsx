/**
 * Attendance.jsx
 * Daily attendance roster with Present/Absent toggle buttons per student.
 */

import { useMemo, useState } from 'react';
import { CheckCircle, XCircle, Users } from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import { getAttendancePercentage } from '../utils/gradeUtils';

export default function Attendance() {
  const { students, markAttendance } = useStudents();
  const [selectedClass, setSelectedClass] = useState('all');

  const classes = useMemo(() => {
    const set = new Set(students.map((s) => s.class));
    return ['all', ...Array.from(set).sort()];
  }, [students]);

  const filtered = useMemo(() => {
    if (selectedClass === 'all') return students;
    return students.filter((s) => s.class === selectedClass);
  }, [students, selectedClass]);

  const markedToday = filtered.filter(
    (s) => s.todayStatus === 'present' || s.todayStatus === 'absent'
  ).length;

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Mark today&apos;s attendance for each student. Changes persist automatically.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {markedToday} of {filtered.length} marked in current view
          </p>
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:w-44"
        >
          {classes.map((cls) => (
            <option key={cls} value={cls}>
                {cls === 'all' ? 'All Programs' : cls}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance roster */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-600">Reg. No.</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Program</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Overall</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Today</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    <Users className="mx-auto mb-2 h-10 w-10 opacity-40" />
                    No students in this program.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => {
                  const attPct = getAttendancePercentage(student.attendance);
                  const isPresent = student.todayStatus === 'present';
                  const isAbsent = student.todayStatus === 'absent';

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-3 text-slate-600">{student.rollNumber}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {student.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {student.class}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${attPct >= 75 ? 'text-emerald-600' : attPct >= 60 ? 'text-slate-600' : 'text-red-600'}`}
                        >
                          {attPct}%
                        </span>
                        <span className="ml-1 text-xs text-slate-400">
                          ({student.attendance.present}/{student.attendance.total})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => markAttendance(student.id, 'present')}
                            className={`
                              flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold
                              transition-all duration-200
                              ${
                                isPresent
                                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                                  : 'border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600'
                              }
                            `}
                          >
                            <CheckCircle size={14} />
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(student.id, 'absent')}
                            className={`
                              flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold
                              transition-all duration-200
                              ${
                                isAbsent
                                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/25'
                                  : 'border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600'
                              }
                            `}
                          >
                            <XCircle size={14} />
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
}
