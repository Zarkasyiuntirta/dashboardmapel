
import { Student, DailyAttendance, AttendanceStatus, DailyProactiveness, DailyTask } from './types';

export const TEACHER_CREDENTIALS = {
  username: 'major',
  password: '123456',
};

// --- Data Generation Helpers ---
const today = new Date();

const generateDailyData = <T>(length: number, factory: (date: string, i: number) => T): T[] => {
    return Array.from({ length }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (length - i - 1));
        return factory(date.toISOString().split('T')[0], i);
    });
};

const createAttendanceData = (izinDays: number[], sakitDays: number[], tkDays: number[]): DailyAttendance[] => {
    return generateDailyData(16, (date, i) => {
        let status: AttendanceStatus = 'Hadir';
        if (izinDays.includes(i)) status = 'Izin';
        if (sakitDays.includes(i)) status = 'Sakit';
        if (tkDays.includes(i)) status = 'Tanpa Keterangan';
        return { date, status };
    });
};

const createProactivenessData = (actions: {day: number, b: number, m: number, a: number}[]): DailyProactiveness[] => {
    const records: DailyProactiveness[] = [];
    actions.forEach(action => {
        const date = new Date();
        date.setDate(today.getDate() - (16 - action.day - 1));
        records.push({ date: date.toISOString().split('T')[0], bertanya: action.b, menjawab: action.m, menambahkan: action.a });
    });
    return records;
};

const createTaskData = (tasks: {day: number, c: number, t: number}[]): DailyTask[] => {
     const records: DailyTask[] = [];
    tasks.forEach(task => {
        const date = new Date();
        date.setDate(today.getDate() - (16 - task.day - 1));
        records.push({ date: date.toISOString().split('T')[0], completed: task.c, total: task.t });
    });
    return records;
}

// --- Initial Student Data ---

export const INITIAL_STUDENTS_DATA: Student[] = [
  {
    id: 1,
    name: 'Budi Santoso',
    nim: '12345',
    picture: 'https://picsum.photos/seed/budi/200',
    attendance: { dailyRecords: createAttendanceData([5], [10], []) },
    exams: { 
        mid1: { score: 85, date: '2023-09-15' }, final1: { score: 90, date: '2023-10-20' }, 
        mid2: { score: 88, date: '2023-11-15' }, final2: { score: 92, date: '2023-12-20' }
    },
    proactiveness: { dailyRecords: createProactivenessData([{day: 2, b:2, m:1, a:0}, {day: 8, b:1, m:2, a:1}]) },
    tasks: { dailyRecords: createTaskData([{day: 7, c: 4, t: 5}, {day: 14, c: 5, t: 5}]) },
  },
  {
    id: 2,
    name: 'Citra Lestari',
    nim: '67890',
    picture: 'https://picsum.photos/seed/citra/200',
    attendance: { dailyRecords: createAttendanceData([], [], []) },
    exams: { 
        mid1: { score: 92, date: '2023-09-15' }, final1: { score: 95, date: '2023-10-20' }, 
        mid2: { score: 90, date: '2023-11-15' }, final2: { score: 98, date: '2023-12-20' }
    },
    proactiveness: { dailyRecords: createProactivenessData([{day: 3, b:3, m:2, a:1}, {day: 9, b:2, m:3, a:1}]) },
    tasks: { dailyRecords: createTaskData([{day: 7, c: 5, t: 5}, {day: 14, c: 5, t: 5}]) },
  },
   {
    id: 3,
    name: 'Dewi Anggraini',
    nim: '54321',
    picture: 'https://picsum.photos/seed/dewi/200',
    attendance: { dailyRecords: createAttendanceData([2, 3], [8, 9], []) },
    exams: { 
        mid1: { score: 78, date: '2023-09-15' }, final1: { score: 80, date: '2023-10-20' }, 
        mid2: { score: 82, date: '2023-11-15' }, final2: { score: 85, date: '2023-12-20' }
    },
    proactiveness: { dailyRecords: createProactivenessData([{day: 5, b:1, m:1, a:0}]) },
    tasks: { dailyRecords: createTaskData([{day: 7, c: 3, t: 5}, {day: 14, c: 5, t: 5}]) },
  },
  // Simplified data for the rest of the students
  ...Array.from({ length: 32 }, (_, i) => i + 4).map(id => {
      const name = `Student ${id}`;
      return {
        id, name, nim: `${12345 + id - 1}`, picture: `https://picsum.photos/seed/${name.replace(' ', '')}/200`,
        attendance: { dailyRecords: createAttendanceData([id % 5], [id % 8], [])},
        exams: {
            mid1: { score: 70 + (id % 30), date: '2023-09-15' }, final1: { score: 72 + (id % 28), date: '2023-10-20' },
            mid2: { score: 71 + (id % 29), date: '2023-11-15' }, final2: { score: 73 + (id % 27), date: '2023-12-20' }
        },
        proactiveness: { dailyRecords: createProactivenessData([{day: id % 10, b:1, m:0, a:0}]) },
        tasks: { dailyRecords: createTaskData([{day: 7, c: 4, t: 5}, {day: 14, c: Math.min(5, 3 + (id % 3)), t: 5}]) },
      };
  })
];
