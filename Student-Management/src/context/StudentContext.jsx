/**
 * StudentContext.jsx
 * Global state provider for student records with localStorage persistence.
 * Falls back to seedData on first load when no saved data exists.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { seedStudents } from '../utils/seedData';

const STORAGE_KEY = 'university_students_data';
const DATA_VERSION = 'v4'; // Increment to force data refresh

const StudentContext = createContext(null);

/** Read persisted students or return seeded defaults. */
function loadStudents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem('university_data_version');
    
    if (stored && version === DATA_VERSION) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    
    // Version mismatch or no data - clear and use seed
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem('university_data_version', DATA_VERSION);
  } catch {
    // Corrupted storage — fall through to seed data
  }
  return seedStudents;
}

/** Generate the next sequential student ID (e.g. STU009). */
function generateStudentId(students) {
  const maxNum = students.reduce((max, s) => {
    const num = parseInt(s.id.replace(/\D/g, ''), 10);
    return num > max ? num : max;
  }, 0);
  return `UNI${String(maxNum + 1).padStart(3, '0')}`;
}

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(loadStudents);

  /** Sync state to localStorage whenever students change. */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  /** Register a new student with auto-generated ID and default marks/attendance. */
  const addStudent = useCallback((studentData) => {
    setStudents((prev) => {
      const newStudent = {
        id: generateStudentId(prev),
        name: studentData.name,
        rollNumber: studentData.rollNumber,
        class: studentData.class,
        contact: studentData.contact,
        attendance: { present: 0, total: 0 },
        marks: { 'Data Structures': 0, Calculus: 0, 'Web Development': 0 },
        todayStatus: null,
      };
      return [...prev, newStudent];
    });
  }, []);

  /** Merge partial updates into an existing student record by ID. */
  const updateStudent = useCallback((id, updatedData) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...updatedData } : student
      )
    );
  }, []);

  /** Remove a student record permanently. */
  const deleteStudent = useCallback((id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  }, []);

  /** Mark daily attendance — adjusts present/total counts intelligently. */
  const markAttendance = useCallback((id, status) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;

        const prevStatus = student.todayStatus;
        if (prevStatus === status) return student;

        let { present, total } = student.attendance;

        // Undo previous mark for today
        if (prevStatus === 'present') present--;
        if (prevStatus === 'present' || prevStatus === 'absent') total--;

        // Apply new mark
        if (status === 'present') {
          present++;
          total++;
        } else if (status === 'absent') {
          total++;
        }

        return {
          ...student,
          todayStatus: status,
          attendance: { present, total },
        };
      })
    );
  }, []);

  /** Update subject marks for a student. */
  const updateMarks = useCallback((id, subject, value) => {
    const clamped = Math.max(0, Math.min(100, Number(value) || 0));
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, marks: { ...student.marks, [subject]: clamped } }
          : student
      )
    );
  }, []);

  const value = {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    markAttendance,
    updateMarks,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

/** Custom hook — must be used within StudentProvider. */
export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}
