
import React, { useState, useMemo } from 'react';
import { Task, Category } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import TaskForm from './components/TaskForm';
import CategorySection from './components/CategorySection';
import { PlusIcon } from './components/Icons';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setIsFormVisible(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
    setIsFormVisible(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleOpenFormForEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormVisible(true);
  };
  
  const handleOpenFormForAdd = () => {
    setEditingTask(null);
    setIsFormVisible(true);
  }

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingTask(null);
  };

  const categorizedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<Category, Task[]>);
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">My Tasks</h1>
          <button
            onClick={handleOpenFormForAdd}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <PlusIcon />
            Add Task
          </button>
        </header>

        <TaskForm
          isVisible={isFormVisible}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onClose={handleCloseForm}
          editingTask={editingTask}
        />

        <main className="space-y-12">
          <CategorySection
            title={Category.Work}
            tasks={categorizedTasks[Category.Work] || []}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={handleOpenFormForEdit}
            color="border-purple-500"
          />
          <CategorySection
            title={Category.Personal}
            tasks={categorizedTasks[Category.Personal] || []}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={handleOpenFormForEdit}
            color="border-cyan-500"
          />
          <CategorySection
            title={Category.Other}
            tasks={categorizedTasks[Category.Other] || []}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={handleOpenFormForEdit}
            color="border-amber-500"
          />
        </main>
      </div>
    </div>
  );
}

export default App;
