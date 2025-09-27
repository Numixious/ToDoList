
import React, { useState, useEffect, useRef } from 'react';
import { Task, Category } from '../types';

interface TaskFormProps {
  isVisible: boolean;
  onSubmit: (taskData: Omit<Task, 'id' | 'completed'> | Task) => void;
  onClose: () => void;
  editingTask: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ isVisible, onSubmit, onClose, editingTask }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>(Category.Personal);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
      setCategory(editingTask.category);
    } else {
      setText('');
      setCategory(Category.Personal);
    }
    if (isVisible) {
      // Focus the input when the form becomes visible
      setTimeout(() => textInputRef.current?.focus(), 300);
    }
  }, [editingTask, isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editingTask) {
      onSubmit({ ...editingTask, text, category });
    } else {
      onSubmit({ text, category });
    }
  };

  return (
    <div
      className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isVisible ? 'max-h-96 mb-8 opacity-100' : 'max-h-0 mb-0 opacity-0'
      }`}
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          {editingTask ? 'Edit Task' : 'Add a New Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-text" className="sr-only">
              Task description
            </label>
            <input
              ref={textInputRef}
              id="task-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Finish the report"
              className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="task-category" className="sr-only">
              Category
            </label>
            <select
              id="task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
