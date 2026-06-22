/**
 * StudentModal.jsx
 * Reusable modal form for registering or editing university students.
 */

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PROGRAMS } from '../utils/constants';

const EMPTY_FORM = { name: '', rollNumber: '', class: PROGRAMS[0], contact: '' };

export default function StudentModal({ isOpen, onClose, onSubmit, editStudent }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEditing = Boolean(editStudent);

  useEffect(() => {
    if (editStudent) {
      setForm({
        name: editStudent.name,
        rollNumber: editStudent.rollNumber,
        class: editStudent.class,
        contact: editStudent.contact,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editStudent, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.rollNumber.trim() || !form.class.trim()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditing ? 'Edit Student' : 'Register New Student'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Ahmed Khan"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Registration No.
            </label>
            <input
              name="rollNumber"
              value={form.rollNumber}
              onChange={handleChange}
              required
              placeholder="e.g. BSIT-24-017"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Degree Program
            </label>
            <select
              name="class"
              value={form.class}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              {PROGRAMS.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Contact Email
            </label>
            <input
              name="contact"
              type="email"
              value={form.contact}
              onChange={handleChange}
              placeholder="e.g. ahmed.khan@student.edu.pk"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {isEditing ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
