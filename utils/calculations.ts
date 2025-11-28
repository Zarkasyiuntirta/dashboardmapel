
import { Student, DailyAttendance, ExamScores, Proactiveness, Tasks, AttendanceStatus } from '../types';

// Helper function to get today's date in YYYY-MM-DD format
export const getTodayDateString = () => new Date().toISOString().split('T')[0];

// --- New calculations based on daily records ---

export const getAttendanceTotals = (dailyRecords: DailyAttendance[]) => {
    return dailyRecords.reduce(
        (acc, record) => {
            if (record.status === 'Hadir') acc.hadir++;
            if (record.status === 'Izin') acc.izin++;
            if (record.status === 'Sakit') acc.sakit++;
            if (record.status === 'Tanpa Keterangan') acc.tanpaKeterangan++;
            return acc;
        },
        { hadir: 0, izin: 0, sakit: 0, tanpaKeterangan: 0 }
    );
};

export const calculateAbsensiScore = (attendance: Student['attendance']): number => {
    const totals = getAttendanceTotals(attendance.dailyRecords);
    const totalMeetings = attendance.dailyRecords.length;
    if (totalMeetings === 0) return 100;
    return Math.round((totals.hadir / totalMeetings) * 100);
};

export const calculateExamAverage = (scores: ExamScores): number => {
    const examValues = [scores.mid1.score, scores.final1.score, scores.mid2.score, scores.final2.score];
    const total = examValues.reduce((sum, score) => sum + score, 0);
    return Math.round(total / examValues.length);
};

export const getProactivenessTotals = (dailyRecords: Proactiveness['dailyRecords']) => {
    return dailyRecords.reduce(
        (acc, record) => {
            acc.bertanya += record.bertanya;
            acc.menjawab += record.menjawab;
            acc.menambahkan += record.menambahkan;
            return acc;
        },
        { bertanya: 0, menjawab: 0, menambahkan: 0 }
    );
};

export const calculateProactivenessScore = (proactiveness: Proactiveness, totalMeetings: number): number => {
    const totals = getProactivenessTotals(proactiveness.dailyRecords);
    const totalProactive = totals.bertanya + totals.menjawab + totals.menambahkan;
    if (totalMeetings === 0) return 50;
    return totalProactive > totalMeetings ? 100 : 50;
};

export const getTaskTotals = (dailyRecords: Tasks['dailyRecords']) => {
    return dailyRecords.reduce(
        (acc, record) => {
            acc.completed += record.completed;
            acc.total += record.total;
            return acc;
        },
        { completed: 0, total: 0 }
    );
};

export const calculateTaskScore = (tasks: Tasks): number => {
    const totals = getTaskTotals(tasks.dailyRecords);
    if (totals.total === 0) return 100;
    return Math.round((totals.completed / totals.total) * 100);
};

export const calculateSummaryScore = (student: Student): number => {
    const totalMeetings = student.attendance.dailyRecords.length;
    
    const absensiValue = calculateAbsensiScore(student.attendance);
    const examValue = calculateExamAverage(student.exams);
    const proactivenessValue = calculateProactivenessScore(student.proactiveness, totalMeetings);
    const taskValue = calculateTaskScore(student.tasks);

    const summary = 
        (absensiValue * 0.10) +
        (examValue * 0.40) +
        (proactivenessValue * 0.20) +
        (taskValue * 0.30);
    
    return Math.round(summary);
};
