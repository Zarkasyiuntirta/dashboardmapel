
// New Daily/Entry types
export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Tanpa Keterangan';

export interface DailyAttendance {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface ExamEntry {
    score: number;
    date: string; // YYYY-MM-DD
}

export interface DailyProactiveness {
    date: string; // YYYY-MM-DD
    bertanya: number;
    menjawab: number;
    menambahkan: number;
}

export interface DailyTask {
    date: string; // YYYY-MM-DD
    completed: number;
    total: number;
}


// Updated main interfaces to use daily records
export interface Attendance {
  dailyRecords: DailyAttendance[];
}

export interface ExamScores {
  mid1: ExamEntry;
  final1: ExamEntry;
  mid2: ExamEntry;
  final2: ExamEntry;
}

export interface Proactiveness {
  dailyRecords: DailyProactiveness[];
}

export interface Tasks {
  dailyRecords: DailyTask[];
}

export interface Student {
  id: number;
  name: string;
  nim: string;
  picture: string;
  attendance: Attendance;
  exams: ExamScores;
  proactiveness: Proactiveness;
  tasks: Tasks;
}

export type UserRole = 'teacher' | 'student';

export interface User {
  username: string;
  role: UserRole;
  studentData?: Student;
}

export type MenuType = 'main' | 'absenteeism' | 'exam' | 'proactiveness' | 'task';
