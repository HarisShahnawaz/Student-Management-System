/**
 * Results.jsx
 * Grade book with real-time mark entry, percentage, and grade calculation.
 */

import { useMemo, useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import {
  SUBJECTS,
  getTotalMarks,
  getPercentage,
  getGrade,
  getGradeBadgeClasses,
} from '../utils/gradeUtils';

function MarkInput({ value, onChange }) {
  return (
    <input
      type="number"
      min={0}
      max={100}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
    />
  );
}

function StudentResultRow({ student, updateMarks }) {
  const total = getTotalMarks(student.marks);
  const percentage = getPercentage(total);
  const grade = getGrade(percentage);
  const badgeClasses = getGradeBadgeClasses(grade);

  return (
    <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
      <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
      <td className="px-4 py-3 text-slate-500">{student.rollNumber}</td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {student.class}
        </span>
      </td>
      {SUBJECTS.map((subject) => (
        <td key={subject} className="px-4 py-3">
          <MarkInput
            value={student.marks[subject]}
            onChange={(val) => updateMarks(student.id, subject, val)}
          />
        </td>
      ))}
      <td className="px-4 py-3 font-semibold text-slate-800">{total}</td>
      <td className="px-4 py-3 font-semibold text-slate-700">{percentage}%</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClasses}`}
        >
          {grade}
        </span>
      </td>
    </tr>
  );
}

export default function Results() {
  const { students, updateMarks } = useStudents();
  const [selectedClass, setSelectedClass] = useState('all');

  const classes = useMemo(() => {
    const set = new Set(students.map((s) => s.class));
    return ['all', ...Array.from(set).sort()];
  }, [students]);

  const filtered = useMemo(() => {
    if (selectedClass === 'all') return students;
    return students.filter((s) => s.class === selectedClass);
  }, [students, selectedClass]);

  const classAverage = useMemo(() => {
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce(
      (acc, s) => acc + getPercentage(getTotalMarks(s.marks)),
      0
    );
    return Math.round((sum / filtered.length) * 10) / 10;
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-100 p-2.5">
            <BookOpen className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">
              Enter marks (0–100 per subject). Totals, percentages, and grades
              update instantly.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Grading: A+ (90+), A (80–89), B (70–79), C (60–69), F (&lt;60)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span className="text-slate-500">Program Avg: </span>
            <span className="font-bold text-emerald-600">{classAverage}%</span>
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
      </div>

      {/* Grade book table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Reg.</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Program</th>
                {SUBJECTS.map((s) => (
                  <th key={s} className="px-4 py-3 font-semibold text-slate-600">
                    {s}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold text-slate-600">Total</th>
                <th className="px-4 py-3 font-semibold text-slate-600">%</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Grade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <GraduationCap className="mx-auto mb-2 h-10 w-10 opacity-40" />
                    No students to display.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <StudentResultRow
                    key={student.id}
                    student={student}
                    updateMarks={updateMarks}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
