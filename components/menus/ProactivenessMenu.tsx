
import React, { useState, useEffect, useMemo } from 'react';
import { Student } from '../../types';
import Table3D, { TableRow3D, TableCell } from '../common/Table3D';
import Modal from '../common/Modal';
import { calculateProactivenessScore, getProactivenessTotals, getTodayDateString } from '../../utils/calculations';
import { CalendarIcon } from '../Icons';

interface ProactivenessMenuProps {
  students: Student[];
  onUpdateStudents: (updatedStudents: Student[]) => void;
}

const ProactivenessMenu: React.FC<ProactivenessMenuProps> = ({ students, onUpdateStudents }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateInput, setDateInput] = useState<string>(getTodayDateString());
  const [filteredDate, setFilteredDate] = useState<string | null>(null);

  useEffect(() => {
    setLocalStudents(JSON.parse(JSON.stringify(students)));
  }, [students]);

  const handleInputChange = (studentId: number, field: 'bertanya' | 'menjawab' | 'menambahkan', value: string) => {
    if (!filteredDate) return;
    const numericValue = parseInt(value, 10) || 0;

    setLocalStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
          const newDailyRecords = [...student.proactiveness.dailyRecords];
          const recordIndex = newDailyRecords.findIndex(rec => rec.date === filteredDate);
          
          if (recordIndex > -1) {
            newDailyRecords[recordIndex][field] = numericValue;
          } else {
            const newRecord = { date: filteredDate, bertanya: 0, menjawab: 0, menambahkan: 0 };
            newRecord[field] = numericValue;
            newDailyRecords.push(newRecord);
            newDailyRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          }
          return { ...student, proactiveness: { ...student.proactiveness, dailyRecords: newDailyRecords } };
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
      const totals = getProactivenessTotals(student.proactiveness.dailyRecords);
      const totalMeetings = student.attendance.dailyRecords.length;
      return {
        ...student,
        summary: {
          ...totals,
          totalProactive: totals.bertanya + totals.menjawab + totals.menambahkan,
          totalMeetings,
          score: calculateProactivenessScore(student.proactiveness, totalMeetings),
        },
      };
    });
  }, [localStudents]);
  
  const dailyHeaders = ['Name', 'NIM', 'Bertanya', 'Menjawab', 'Menambahkan'];
  const summaryHeaders = ['Name', 'NIM', 'Bertanya', 'Menjawab', 'Menambahkan', 'Total Proactive', 'Jumlah Pertemuan', 'Score'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">Proaktif</h1>
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
              const record = student.proactiveness.dailyRecords.find(r => r.date === filteredDate) || { bertanya: 0, menjawab: 0, menambahkan: 0 };
              return (
                <TableRow3D key={student.id}>
                  <TableCell><p className="text-gray-400">{student.name}</p></TableCell>
                  <TableCell><p className="text-gray-400">{student.nim}</p></TableCell>
                  <TableCell>{isEditing ? <input type="number" value={record.bertanya} onChange={e => handleInputChange(student.id, 'bertanya', e.target.value)} className="w-20 bg-gray-700/50 p-1 rounded text-white"/> : <p className="text-gray-400">{record.bertanya}</p>}</TableCell>
                  <TableCell>{isEditing ? <input type="number" value={record.menjawab} onChange={e => handleInputChange(student.id, 'menjawab', e.target.value)} className="w-20 bg-gray-700/50 p-1 rounded text-white"/> : <p className="text-gray-400">{record.menjawab}</p>}</TableCell>
                  <TableCell>{isEditing ? <input type="number" value={record.menambahkan} onChange={e => handleInputChange(student.id, 'menambahkan', e.target.value)} className="w-20 bg-gray-700/50 p-1 rounded text-white"/> : <p className="text-gray-400">{record.menambahkan}</p>}</TableCell>
                </TableRow3D>
              );
            })
          ) : (
            // Summary View
            summaryData.map(student => (
              <TableRow3D key={student.id}>
                <TableCell><p className="text-gray-400">{student.name}</p></TableCell>
                <TableCell><p className="text-gray-400">{student.nim}</p></TableCell>
                <TableCell><p className="text-gray-400">{student.summary.bertanya}</p></TableCell>
                <TableCell><p className="text-gray-400">{student.summary.menjawab}</p></TableCell>
                <TableCell><p className="text-gray-400">{student.summary.menambahkan}</p></TableCell>
                <TableCell><p className="text-gray-400">{student.summary.totalProactive}</p></TableCell>
                <TableCell><p className="text-gray-400">{student.summary.totalMeetings}</p></TableCell>
                <TableCell><p className="font-bold text-lg text-cyan-300">{student.summary.score}</p></TableCell>
              </TableRow3D>
            ))
          )}
        </Table3D>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSubmit} title="Confirm Changes">
        <p>Are you sure you want to save proactiveness records for {filteredDate}? This will update student scores.</p>
      </Modal>
    </div>
  );
};

export default ProactivenessMenu;
