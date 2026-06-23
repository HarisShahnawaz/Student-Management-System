/**
 * seedData.js
 * University seed data — 16 Pakistani students per program (BSIT, BSCS, BSSE, BSIET).
 * Loaded automatically when localStorage has no persisted records.
 */

import { PROGRAMS } from './constants';

const STUDENTS_PER_PROGRAM = 16;

const FIRST_NAMES = [
  'Ahmed', 'Ali', 'Hassan', 'Usman', 'Bilal', 'Hamza', 'Omar', 'Faizan', 'Zain', 'Saad',
  'Arslan', 'Danish', 'Fahad', 'Imran', 'Kamran', 'Shahzaib', 'Waqas', 'Yasir', 'Rizwan', 'Tariq',
  'Nabeel', 'Ahsan', 'Farhan', 'Adnan', 'Salman', 'Junaid', 'Kashif', 'Muzammil', 'Haseeb', 'Talha',
  'Ayesha', 'Fatima', 'Zainab', 'Hira', 'Sana', 'Mariam', 'Amna', 'Iqra', 'Kinza', 'Mahnoor',
  'Rabia', 'Sidra', 'Hania', 'Noor', 'Alina', 'Saba', 'Areeba', 'Laiba', 'Eman', 'Nimra',
  'Bushra', 'Saira', 'Mehwish', 'Khadija', 'Urooj', 'Anum', 'Sadia', 'Tehreem', 'Zoya', 'Ifrah',
  'Hamna', 'Wareesha', 'Minahil', 'Aleena', 'Ramsha', 'Shayan', 'Huzaifa', 'Abdullah', 'Moiz', 'Rayyan',
];

const LAST_NAMES = [
  'Khan', 'Malik', 'Ahmed', 'Ali', 'Hussain', 'Raza', 'Sheikh', 'Iqbal', 'Butt', 'Chaudhry',
  'Akram', 'Siddiqui', 'Qureshi', 'Mirza', 'Baig', 'Hashmi', 'Farooq', 'Javed', 'Anwar', 'Aziz',
  'Nadeem', 'Yousaf', 'Aslam', 'Rafiq', 'Saeed', 'Zafar', 'Rehman', 'Shah', 'Tariq', 'Sultan',
  'Bhatti', 'Cheema', 'Rajput', 'Ansari', 'Memon', 'Laghari', 'Khokhar', 'Gondal', 'Rana', 'Abbasi',
  'Warraich', 'Gujjar', 'Awan', 'Khalid', 'Saleem', 'Haider', 'Nawaz', 'Masood', 'Paracha', 'Lodhi',
];

/** Deterministic pseudo-random value (0–1) for consistent seed data. */
function pseudoRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

/** Build a unique list of Pakistani full names. */
function buildPakistaniNames(count) {
  const names = [];
  const used = new Set();
  let i = 0;

  while (names.length < count) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[Math.floor(i / 3) % LAST_NAMES.length];
    const full = `${first} ${last}`;

    if (!used.has(full)) {
      used.add(full);
      names.push(full);
    }
    i++;
  }

  return names;
}

/** Generate varied attendance and marks for demo realism. */
function generateStats(index) {
  const total = 45;
  const presentBase = Math.floor(pseudoRandom(index + 1) * 14) + 28;
  const present = Math.min(presentBase, total);

  // Generate marks mostly in 60-100 range with bias toward higher grades
  // Using 60 + random(0-40) to ensure most students pass with good grades
  const dataStructures = 60 + Math.floor(pseudoRandom(index + 10) * 40);
  const calculus = 60 + Math.floor(pseudoRandom(index + 20) * 40);
  const webDevelopment = 60 + Math.floor(pseudoRandom(index + 30) * 40);

  return {
    attendance: { present, total },
    marks: {
      'Data Structures': Math.min(dataStructures, 100),
      Calculus: Math.min(calculus, 100),
      'Web Development': Math.min(webDevelopment, 100),
    },
  };
}

function createEmail(fullName) {
  const [first, last] = fullName.toLowerCase().split(' ');
  return `${first}.${last}@student.edu.pk`;
}

/** Build the full university student roster. */
function buildSeedStudents() {
  const totalCount = PROGRAMS.length * STUDENTS_PER_PROGRAM;
  const names = buildPakistaniNames(totalCount);
  const students = [];
  let nameIndex = 0;
  let globalId = 1;

  PROGRAMS.forEach((program, programIndex) => {
    for (let seq = 1; seq <= STUDENTS_PER_PROGRAM; seq++) {
      const name = names[nameIndex++];
      const stats = generateStats(globalId);

      students.push({
        id: `UNI${String(globalId).padStart(3, '0')}`,
        name,
        rollNumber: `${program}-24-${String(seq).padStart(3, '0')}`,
        class: program,
        contact: createEmail(name),
        attendance: stats.attendance,
        marks: stats.marks,
        todayStatus: null,
      });

      globalId++;
    }
  });

  return students;
}

export const seedStudents = buildSeedStudents();

export { STUDENTS_PER_PROGRAM };
