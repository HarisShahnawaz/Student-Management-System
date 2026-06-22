/**
 * StudentList.jsx
 * Full student registry with search, class filter, and CRUD actions.
 */

import { useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, UserCircle } from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import { getAttendancePercentage } from '../utils/gradeUtils';
import StudentModal from '../components/StudentModal';

export default function StudentList() {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  /** Unique class list for the filter dropdown. */
  const classes = useMemo(() => {
    const set = new Set(students.map((s) => s.class));
    return ['all', ...Array.from(set).sort()];
  }, [students]);

  /** Filtered student rows based on search query and class selection. */
  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return students.filter((s) => {
      const matchesSearch =
        !query ||
        s.name.toLowerCase().includes(query) ||
        s.rollNumber.toLowerCase().includes(query);
      const matchesClass = classFilter === 'all' || s.class === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [students, search, classFilter]);

  const handleAdd = (formData) => {
    addStudent(formData);
  };

  const handleEdit = (formData) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    }
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingStudent(null);
    setModalOpen(true);
  };

  const handleDelete = (student) => {
    if (window.confirm(`Delete ${student.name}? This action cannot be undone.`)) {
      deleteStudent(student.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar: search, filter, add button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or registration number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Class filter */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:w-40"
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls === 'all' ? 'All Programs' : cls}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus size={18} />
          Add New Student
        </button>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        Showing {filtered.length} of {students.length} students
      </p>

      {/* Responsive table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Reg. No.</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Program</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Contact</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Attendance</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <UserCircle className="mx-auto mb-2 h-10 w-10 opacity-40" />
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => {
                  const attPct = getAttendancePercentage(student.attendance);
                  const attColor =
                    attPct >= 75
                      ? 'text-emerald-600'
                      : attPct >= 60
                        ? 'text-slate-600'
                        : 'text-red-600';

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {student.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{student.rollNumber}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          {student.class}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{student.contact}</td>
                      <td className={`px-4 py-3 font-semibold ${attColor}`}>
                        {attPct}%
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(student)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(student)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={16} />
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

      <StudentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={editingStudent ? handleEdit : handleAdd}
        editStudent={editingStudent}
      />
    </div>
  );
}
