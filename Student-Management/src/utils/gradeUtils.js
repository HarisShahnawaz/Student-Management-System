/**
 * gradeUtils.js
 * Shared grade calculation helpers used across Dashboard and Results views.
 */

const SUBJECTS = ['Data Structures', 'Calculus', 'Web Development'];
const MAX_MARKS_PER_SUBJECT = 100;

/** Total possible marks across all subjects (300 by default). */
export const TOTAL_POSSIBLE_MARKS = SUBJECTS.length * MAX_MARKS_PER_SUBJECT;

/**
 * Sum marks across Data Structures, Calculus, and Web Development.
 * @param {Object} marks - Subject-wise mark object
 * @returns {number}
 */
export function getTotalMarks(marks) {
  return SUBJECTS.reduce((sum, subject) => sum + (marks[subject] ?? 0), 0);
}

/**
 * Calculate percentage from total obtained marks.
 * @param {number} totalObtained
 * @returns {number} Percentage rounded to one decimal place
 */
export function getPercentage(totalObtained) {
  return Math.round((totalObtained / TOTAL_POSSIBLE_MARKS) * 1000) / 10;
}

/**
 * Assign letter grade based on percentage.
 * A+ (90+), A (80–89), B (70–79), C (60–69), F (<60)
 * @param {number} percentage
 * @returns {string}
 */
export function getGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  return 'F';
}

/** Returns true when student is failing (grade F). */
export function isFailing(marks) {
  const percentage = getPercentage(getTotalMarks(marks));
  return getGrade(percentage) === 'F';
}

/** Tailwind classes for grade badge styling. */
export function getGradeBadgeClasses(grade) {
  if (grade === 'F') {
    return 'bg-red-100 text-red-700 border-red-200 font-bold';
  }
  if (grade === 'A+' || grade === 'A') {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  }
  if (grade === 'B') {
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  }
  return 'bg-slate-100 text-slate-600 border-slate-200';
}

/** Compute attendance percentage for a single student. */
export function getAttendancePercentage(attendance) {
  if (!attendance?.total) return 0;
  return Math.round((attendance.present / attendance.total) * 1000) / 10;
}

/** Aggregate dashboard statistics from the student list. */
export function computeDashboardStats(students) {
  const totalStudents = students.length;

  const avgAttendance =
    totalStudents === 0
      ? 0
      : Math.round(
          (students.reduce((sum, s) => sum + getAttendancePercentage(s.attendance), 0) /
            totalStudents) *
            10
        ) / 10;

  const failingCount = students.filter((s) => isFailing(s.marks)).length;

  /** Grade distribution buckets for chart rendering. */
  const gradeDistribution = { 'A+': 0, A: 0, B: 0, C: 0, F: 0 };
  students.forEach((s) => {
    const grade = getGrade(getPercentage(getTotalMarks(s.marks)));
    gradeDistribution[grade] += 1;
  });

  return { totalStudents, avgAttendance, failingCount, gradeDistribution };
}

export { SUBJECTS, MAX_MARKS_PER_SUBJECT };
