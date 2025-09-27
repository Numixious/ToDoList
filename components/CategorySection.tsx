
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface CategorySectionProps {
  title: string;
  tasks: Task[];
  color: string;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId:string) => void;
  onEdit: (task: Task) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, tasks, color, onToggleComplete, onDelete, onEdit }) => {
  return (
    <section>
      <h2 className={`text-2xl font-bold mb-4 pb-2 border-b-2 ${color} text-white`}>
        {title}
      </h2>
      {tasks.length > 0 ? (
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
              animationDelay={index * 100}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic mt-4">No tasks in this category yet. Well done!</p>
      )}
    </section>
  );
};

export default CategorySection;
