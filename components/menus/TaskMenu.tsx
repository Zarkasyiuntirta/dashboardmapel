
import React, { useState, useEffect, useMemo } from 'react';
import { Student } from '../../types';
import Table3D, { TableRow3D, TableCell } from '../common/Table3D';
import Modal from '../common/Modal';
import { calculateTaskScore, getTaskTotals, getTodayDateString } from '../../utils/calculations';
import { CalendarIcon } from '../Icons';

interface TaskMenuProps {
  students: Student[];
  onUpdateStudents: (updatedStudents: Student[]) => void;
}

const TaskMenu: React.FC<TaskMenuProps> = ({ students, onUpdateStudents }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateInput, setDateInput] = useState<string>(getTodayDateString());
  const [filteredDate, setFilteredDate] = useState<string | null>(null);
  
  useEffect(() => {
    setLocalStudents(JSON.parse(JSON.stringify(students)));
  }, [students]);
  
  const handleTaskChange = (studentId: number, field: 'completed' | 'total', value: string) => {
    if (!filteredDate) return;
    const numericValue = parseInt(value, 10) || 0;

    setLocalStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
            const newDailyRecords = [...student.tasks.dailyRecords];
            const recordIndex = newDailyRecords.findIndex(rec => rec.date === filteredDate);
            
            if (recordIndex > -1) {
                const record = { ...newDailyRecords[recordIndex] };
                if (field === 'completed') {
                    record.completed = Math.max(0, Math.min(numericValue, record.total));
                } else { // field === 'total'
                    record.total = Math.max(0, numericValue);
                    record.completed = Math.min(record.completed, record.total); // Ensure completed is not > total
                }
                newDailyRecords[recordIndex] = record;
            } else {
                const newRecord = { date: filteredDate, completed: 0, total: 0 };
                if (field === 'completed') newRecord.completed = Math.max(0, numericValue);
                if (field === 'total') newRecord.total = Math.max(0, numericValue);
                newDailyRecords.push(newRecord);
                newDailyRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            }
            return { ...student, tasks: { ...student.tasks, dailyRecords: newDailyRecords } };
        }
        return student;
      })
    );
  };

  const handleConfirmSubmit = () => {
    onUpdateStudents(localStudents);
    setIsEditing(false);
    setIsModalOpen(false);
  };
  
  const handleFilter = () => setFilteredDate(dateInput);
  const handleClearFilter = () => {
    setFilteredDate(null);
    setIsEditing(false);
  };

  const summaryData = useMemo(() => {
    return localStudents.map(student => {
      const totals = getTaskTotals(student.tasks.dailyRecords);
      return {
        ...student,
        summary: {
          ...totals,
          incomplete: totals.total - totals.completed,
          score: calculateTaskScore(student.tasks),
        },
      };
    });
  }, [localStudents]);

  const dailyHeaders = ['Name', 'NIM', 'Completed Tasks', 'Total Tasks'];
  const summaryHeaders = ['Name', 'NIM', 'Completed Tasks', 'Incomplete Task', 'Total Tasks', 'Task Score'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">Tugas</h1>
        <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800/50 rounded-lg px-3 py-2 border border-cyan-500/30">
                <CalendarIcon className="w-5 h-5 text-cyan-400 mr-2" />
                <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="bg-transparent text-white focus:outline-none text-sm"/>
            </div>
            {filteredDate ? (
                <button onClick={handleClearFilter} className="px-4 py-2 font-bold text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all">Show Summary</button>
            ) : (
                <button onClick={handleFilter} className="px-4 py-2 font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg hover:from-blue-400 hover:to-indigo-400 transition-all">Filter by Date</button>
            )}
            {!isEditing && <button disabled={!filteredDate} onClick={() => setIsEditing(true)} className="px-4 py-2 font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:from-yellow-400 hover:to-orange-400 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">Revise</button>}
            {isEditing && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-400 hover:to-blue-400 transform hover:scale-105 transition-all">Submit</button>}
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-cyan-400/20 overflow-hidden p-1">
        <Table3D headers={filteredDate ? dailyHeaders : summaryHeaders}>
            {filteredDate ? (
              // Daily View
              localStudents.map(student => {
                  const record = student.tasks.dailyRecords.find(r => r.date === filteredDate) || { completed: 0, total: 0 };
                  return (
                      <TableRow3D key={student.id}>
                          <TableCell><p className="text-gray-400">{student.name}</p></TableCell>
                          <TableCell><p className="text-gray-400">{student.nim}</p></TableCell>
                          <TableCell>{isEditing ? <input type="number" value={record.completed} onChange={e => handleTaskChange(student.id, 'completed', e.target.value)} className="w-20 bg-gray-700/50 p-1 rounded text-white" min={0}/> : <p className="text-gray-400">{record.completed}</p>}</TableCell>
                          <TableCell>{isEditing ? <input type="number" value={record.total} onChange={e => handleTaskChange(student.id, 'total', e.target.value)} className="w-20 bg-gray-700/50 p-1 rounded text-white" min={0}/> : <p className="text-gray-400">{record.total}</p>}</TableCell>
                      </TableRow3D>
                  );
              })
            ) : (
              // Summary View
              summaryData.map(student => (
                  <TableRow3D key={student.id}>
                      <TableCell><p className="text-gray-400">{student.name}</p></TableCell>
                      <TableCell><p className="text-gray-400">{student.nim}</p></TableCell>
                      <TableCell><p className="text-gray-400">{student.summary.completed}</p></TableCell>
                      <TableCell><p className="text-gray-400">{student.summary.incomplete}</p></TableCell>
                      <TableCell><p className="text-gray-400">{student.summary.total}</p></TableCell>
                      <TableCell><p className="font-bold text-lg text-cyan-300">{student.summary.score}</p></TableCell>
                  </TableRow3D>
              ))
            )}
        </Table3D>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSubmit} title="Confirm Changes">
        <p>Are you sure you want to save task records for {filteredDate}? This will update student scores.</p>
      </Modal>
    </div>
  );
};

export default TaskMenu;
