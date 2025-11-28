
import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import Table3D, { TableRow3D, TableCell } from '../common/Table3D';
import Modal from '../common/Modal';
import { calculateExamAverage } from '../../utils/calculations';

interface ExamMenuProps {
  students: Student[];
  onUpdateStudents: (updatedStudents: Student[]) => void;
}

const ExamMenu: React.FC<ExamMenuProps> = ({ students, onUpdateStudents }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLocalStudents(JSON.parse(JSON.stringify(students)));
  }, [students]);

  const handleInputChange = (studentId: number, field: keyof Student['exams'], type: 'score' | 'date', value: string) => {
    setLocalStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
            const updatedExams = { ...student.exams };
            const examEntry = { ...updatedExams[field] };

            if (type === 'score') {
                examEntry.score = parseInt(value, 10) || 0;
            } else {
                examEntry.date = value;
            }
            
            updatedExams[field] = examEntry;
            return { ...student, exams: updatedExams };
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

  const renderCell = (student: Student, field: keyof Student['exams']) => {
    if (isEditing) {
        return (
            <div className="flex flex-col gap-1">
                <input 
                    type="number" 
                    value={student.exams[field].score} 
                    onChange={(e) => handleInputChange(student.id, field, 'score', e.target.value)} 
                    className="w-20 bg-gray-700/50 p-1 rounded text-white"
                />
                <input 
                    type="date"
                    value={student.exams[field].date}
                    onChange={(e) => handleInputChange(student.id, field, 'date', e.target.value)}
                    className="w-full bg-gray-700/50 p-1 rounded text-white text-xs"
                />
            </div>
        );
    }
    return (
        <div>
            <p className="text-gray-200 text-lg">{student.exams[field].score}</p>
            <p className="text-gray-500 text-xs">{student.exams[field].date}</p>
        </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">Nilai Ujian</h1>
        <div>
            {!isEditing && <button onClick={() => setIsEditing(true)} className="mr-4 px-4 py-2 font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:from-yellow-400 hover:to-orange-400 transform hover:scale-105 transition-all">Revise</button>}
            {isEditing && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-400 hover:to-blue-400 transform hover:scale-105 transition-all">Submit</button>}
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-cyan-400/20 overflow-hidden p-1">
        <Table3D headers={['Name', 'NIM', 'Mid Sem 1', 'Final Sem 1', 'Mid Sem 2', 'Final Sem 2', 'Average']}>
          {localStudents.map(student => (
            <TableRow3D key={student.id}>
              <TableCell><p className="text-gray-400">{student.name}</p></TableCell>
              <TableCell><p className="text-gray-400">{student.nim}</p></TableCell>
              <TableCell>{renderCell(student, 'mid1')}</TableCell>
              <TableCell>{renderCell(student, 'final1')}</TableCell>
              <TableCell>{renderCell(student, 'mid2')}</TableCell>
              <TableCell>{renderCell(student, 'final2')}</TableCell>
              <TableCell><p className="font-bold text-lg text-cyan-300">{calculateExamAverage(student.exams)}</p></TableCell>
            </TableRow3D>
          ))}
        </Table3D>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSubmit} title="Confirm Changes">
        <p>Are you sure you want to save these exam scores? This action will update the students' summary scores.</p>
      </Modal>
    </div>
  );
};

export default ExamMenu;
