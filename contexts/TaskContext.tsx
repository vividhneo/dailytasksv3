
import React, { createContext, useContext, ReactNode } from 'react';
import { Task, Profile } from '../types/task';
import { useAsyncStorage } from '../hooks/useAsyncStorage';

interface TaskContextType {
  tasks: Task[];
  profiles: Profile[];
  currentProfileId: string;
  loading: boolean;
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addProfile: (name: string) => void;
  setCurrentProfileId: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { value: tasks, setValue: setTasks, loading: tasksLoading } = useAsyncStorage<Task[]>('tasks', []);
  const { value: profiles, setValue: setProfiles, loading: profilesLoading } = useAsyncStorage<Profile[]>('profiles', []);
  const { value: currentProfileId, setValue: setCurrentProfileId, loading: profileLoading } = 
    useAsyncStorage<string>('currentProfileId', '');

  const addTask = (text: string) => {
    setTasks([
      ...tasks,
      { id: Date.now().toString(), text, completed: false, profileId: currentProfileId }
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addProfile = (name: string) => {
    const newProfile = { id: Date.now().toString(), name };
    setProfiles([...profiles, newProfile]);
    if (!currentProfileId) {
      setCurrentProfileId(newProfile.id);
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks: tasks.filter(task => task.profileId === currentProfileId),
      profiles,
      currentProfileId,
      loading: tasksLoading || profilesLoading || profileLoading,
      addTask,
      toggleTask,
      deleteTask,
      addProfile,
      setCurrentProfileId
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
