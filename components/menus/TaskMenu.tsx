
import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import Table3D, { TableRow3D, TableCell } from '../common/Table3D';
import Modal from '../common/Modal';
import { TOTAL_TASKS } from '../../constants';
import { calculateTaskScore } from '../../utils/calculations';

interface TaskMenuProps {
  students: Student[];
  onUpdateStudents: (updatedStudents: Student[]) => void;
}

const TaskMenu: React.FC<TaskMenuProps> = ({ students, onUpdateStudents }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    setLocalStudents(JSON.parse(JSON.stringify(students)));
  }, [students]);
  
  const handleTaskChange = (studentId: number, field: keyof Student['tasks'], value: string) => {
    const numericValue = parseInt(value, 10) || 0;

    setLocalStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
          let newSelesai = student.tasks.selesai;
          let newTidakSelesai = student.tasks.tidak_selesai;

          if (field === 'selesai') {
            newSelesai = Math.min(Math.max(0, numericValue), TOTAL_TASKS);
            newTidakSelesai = TOTAL_TASKS - newSelesai;
          } else { // field === 'tidak_selesai'
            newTidakSelesai = Math.min(Math.max(0, numericValue), TOTAL_TASKS);
            newSelesai = TOTAL_TASKS - newTidakSelesai;
          }

          return { ...student, tasks: { selesai: newSelesai, tidak_selesai: newTidakSelesai } };
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
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">Tugas</h1>
        <div>
            {!isEditing && <button onClick={() => setIsEditing(true)} className="mr-4 px-4 py-2 font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:from-yellow-400 hover:to-orange-400 transform hover:scale-105 transition-all">Revise</button>}
            {isEditing && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-400 hover:to-blue-400 transform hover:scale-105 transition-all">Submit</button>}
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-cyan-400/20 overflow-hidden p-1">
        <Table3D headers={['Name', 'NIM', 'Completed Tasks', 'Incomplete Task', 'Total Tasks', 'Task Score']}>
            {localStudents.map(student => {
                return (
                    <TableRow3D key={student.id}>
                        <TableCell><p className="text-gray-400">{student.name}</p></TableCell>
                        <TableCell><p className="text-gray-400">{student.nim}</p></TableCell>
                        <TableCell>
                            {isEditing ? <input type="number" value={student.tasks.selesai} onChange={(e) => handleTaskChange(student.id, 'selesai', e.target.value)} className="w-20 bg-gray-700/50 p-1 rounded text-white" max={TOTAL_TASKS} min={0}/> : <p className="text-gray-400">{student.tasks.selesai}</p>}
                        </TableCell>
                        <TableCell>
                            {isEditing ? <input type="number" value={student.tasks.tidak_selesai} onChange={(e) => handleTaskChange(student.id, 'tidak_selesai', e.target.value)} className="w-20 bg-gray-700/50 p-1 rounded text-white" max={TOTAL_TASKS} min={0}/> : <p className="text-gray-400">{student.tasks.tidak_selesai}</p>}
                        </TableCell>
                        <TableCell><p className="text-gray-400">{TOTAL_TASKS}</p></TableCell>
                        <TableCell><p className="font-bold text-lg text-cyan-300">{calculateTaskScore(student.tasks)}</p></TableCell>
                    </TableRow3D>
                );
            })}
        </Table3D>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSubmit} title="Confirm Changes">
        <p>Are you sure you want to save these task records? This will update student scores.</p>
      </Modal>
    </div>
  );
};

export default TaskMenu;