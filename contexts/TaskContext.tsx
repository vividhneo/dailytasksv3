import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { format, addDays } from 'date-fns';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  profileId: string;
  date: string;
}

interface Profile {
  id: string;
  name: string;
}

interface TaskContextType {
  tasks: Task[];
  profiles: Profile[];
  currentProfileId: string;
  loading: boolean;
  addTask: (text: string, date: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addProfile: (name: string) => void;
  setCurrentProfileId: (id: string) => void;
  setProfiles: (profiles: Profile[]) => void;
  rolloverTasks: (fromDate: string, toDate: string) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

const DEFAULT_PROFILE: Profile = {
  id: '1',
  name: 'Personal'
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const { value: tasks, setValue: setTasks, loading: tasksLoading } = useAsyncStorage<Task[]>('tasks', []);
  const { value: profiles, setValue: setProfiles, loading: profilesLoading } = 
    useAsyncStorage<Profile[]>('profiles', [DEFAULT_PROFILE]);
  const { value: currentProfileId, setValue: setCurrentProfileId, loading: profileLoading } = 
    useAsyncStorage<string>('currentProfileId', DEFAULT_PROFILE.id);

  const sanitizeString = (str: string) => {
    try {
      return typeof str === 'string' && str.startsWith('"') ? JSON.parse(str) : str;
    } catch {
      return str;
    }
  };

  const addTask = async (text: string, date: string) => {
    try {
      const newTask = {
        id: Date.now().toString(),
        text,
        completed: false,
        profileId: sanitizeString(currentProfileId),
        date
      };
      const updatedTasks = [...tasks, newTask];
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addProfile = async (name: string) => {
    try {
      const newProfile = { id: Date.now().toString(), name };
      const updatedProfiles = [...profiles, newProfile];
      await AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
      await AsyncStorage.setItem('currentProfileId', newProfile.id);
      setCurrentProfileId(newProfile.id);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const rolloverTasks = async (fromDate: string, toDate: string) => {
    try {
      const incompleteTasks = tasks.filter(task => 
        task.date === fromDate && 
        !task.completed
      );

      if (incompleteTasks.length === 0) return;

      const rolledOverTasks = incompleteTasks.map(task => ({
        ...task,
        id: Date.now().toString() + Math.random(),
        date: toDate
      }));

      const updatedTasks = [...tasks, ...rolledOverTasks];
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error rolling over tasks:', error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [tasksData, profilesData, currentProfileData] = await Promise.all([
          AsyncStorage.getItem('tasks'),
          AsyncStorage.getItem('profiles'),
          AsyncStorage.getItem('currentProfileId')
        ]);

        if (tasksData && tasksData.includes('\\\\"')) {
          await AsyncStorage.clear();
          setTasks([]);
          setProfiles([DEFAULT_PROFILE]);
          setCurrentProfileId(DEFAULT_PROFILE.id);
          return;
        }

        if (tasksData) {
          const parsedTasks = JSON.parse(tasksData).map((task: Task) => ({
            ...task,
            profileId: sanitizeString(task.profileId)
          }));
          setTasks(parsedTasks);
        }

        if (profilesData) {
          const loadedProfiles = JSON.parse(profilesData);
          const profiles = loadedProfiles.length > 0 ? loadedProfiles : [DEFAULT_PROFILE];
          setProfiles(profiles);
        }

        if (currentProfileData) {
          setCurrentProfileId(sanitizeString(currentProfileData));
        } else {
          setCurrentProfileId(DEFAULT_PROFILE.id);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setTasks([]);
        setProfiles([DEFAULT_PROFILE]);
        setCurrentProfileId(DEFAULT_PROFILE.id);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const checkAndRolloverTasks = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const lastRolloverDate = await AsyncStorage.getItem('lastRolloverDate');

        if (!lastRolloverDate || lastRolloverDate !== today) {
          const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd');
          await rolloverTasks(yesterday, today);
          await AsyncStorage.setItem('lastRolloverDate', today);
        }
      } catch (error) {
        console.error('Error checking rollover:', error);
      }
    };

    checkAndRolloverTasks();
    const interval = setInterval(checkAndRolloverTasks, 300000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Helper function to sort tasks
  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      // First sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // Completed tasks go to bottom
      }
      // Then sort by creation time (assuming id contains timestamp)
      return parseInt(a.id) - parseInt(b.id);
    });
  };

  return (
    <TaskContext.Provider value={{
      // Sort tasks when providing them to consumers
      tasks: sortTasks(tasks.filter(task => task.profileId === currentProfileId)),
      profiles: profiles.length > 0 ? profiles : [DEFAULT_PROFILE],
      currentProfileId: currentProfileId || DEFAULT_PROFILE.id,
      loading: tasksLoading || profilesLoading || profileLoading,
      addTask,
      toggleTask,
      deleteTask,
      addProfile,
      setCurrentProfileId,
      setProfiles,
      rolloverTasks,
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

export default TaskContext;
