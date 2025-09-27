
import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';
import { EditIcon, TrashIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  animationDelay: number;
}

const categoryColors = {
  Personal: 'border-cyan-500',
  Work: 'border-purple-500',
  Other: 'border-amber-500',
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit, animationDelay }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const nodeRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsEntering(false);
    }, 50 + animationDelay); // Staggered entry animation
    return () => clearTimeout(timeoutId);
  }, [animationDelay]);


  const handleDelete = () => {
    setIsExiting(true);
  };
  
  useEffect(() => {
    if (!isExiting) return;

    const node = nodeRef.current;
    if (!node) return;
    
    const handleTransitionEnd = (event: TransitionEvent) => {
        // We only want to fire onDelete when the opacity transition is complete
        if (event.propertyName === 'opacity') {
            onDelete(task.id);
        }
    };

    node.addEventListener('transitionend', handleTransitionEnd);

    return () => {
        node.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isExiting, onDelete, task.id]);


  const categoryColorClass = categoryColors[task.category] || 'border-gray-500';

  const baseClasses = "flex items-center bg-gray-800 p-4 rounded-lg shadow-md border-l-4 transition-all duration-500 ease-in-out";
  const entryClasses = "opacity-0 transform -translate-y-4";
  const exitClasses = "opacity-0 transform scale-95 -mb-20";
  const completedClasses = "opacity-60";
  
  const combinedClasses = `
    ${baseClasses}
    ${categoryColorClass}
    ${task.completed ? completedClasses : ''}
    ${isEntering ? entryClasses : ''}
    ${isExiting ? exitClasses : ''}
  `;

  return (
    <li ref={nodeRef} className={combinedClasses}>
      <div className="flex-grow flex items-center cursor-pointer" onClick={() => onToggleComplete(task.id)}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            e.stopPropagation(); // Prevent li onClick from firing twice
            onToggleComplete(task.id);
          }}
          className="h-6 w-6 rounded-full bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-500 cursor-pointer transition-colors duration-300"
        />
        <span className={`ml-4 text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-100'} transition-all duration-300`}>
          {task.text}
        </span>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-cyan-400 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Edit task"
        >
          <EditIcon />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Delete task"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
