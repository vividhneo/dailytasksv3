import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  profileId: string;
  date: string;
}

export function useTasks(profileId: string | null | undefined, selectedDate: Date) {
  const queryClient = useQueryClient();
  const dateString = selectedDate.toISOString().split('T')[0];

  console.log('useTasks Hook: Starting', {
    profileId,
    dateString,
    timestamp: new Date().toISOString()
  });

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', profileId, dateString],
    queryFn: async () => {
      console.log('useTasks Hook: Fetching tasks', {
        profileId,
        dateString
      });

      if (!profileId) {
        console.log('useTasks Hook: No profile ID, returning empty array');
        return [];
      }

      try {
        const response = await apiRequest(
          'GET', 
          `/api/tasks?profileId=${profileId}&date=${dateString}`
        );
        const data = await response.json();
        console.log('useTasks Hook: Fetch successful', {
          taskCount: data.length,
          tasks: data
        });
        return data;
      } catch (error) {
        console.error('useTasks Hook: Fetch failed', error);
        throw error;
      }
    },
    enabled: !!profileId,
  });

  // Toggle task completion
  const { mutate: toggleTask } = useMutation({
    mutationFn: async (taskId: string) => {
      console.log('useTasks Hook: Toggling task', { taskId });
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      
      const response = await apiRequest(
        'PATCH',
        `/api/tasks/${taskId}`,
        { completed: !task.completed }
      );
      return response.json();
    },
    onSuccess: () => {
      console.log('useTasks Hook: Toggle successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['tasks', profileId, dateString] });
    },
  });

  // Add new task
  const { mutate: addTask } = useMutation({
    mutationFn: async (text: string) => {
      console.log('useTasks Hook: Adding new task', { text });
      if (!profileId) throw new Error('No profile selected');
      
      const response = await apiRequest('POST', '/api/tasks', {
        text,
        profileId,
        date: dateString,
        completed: false,
      });
      return response.json();
    },
    onSuccess: () => {
      console.log('useTasks Hook: Add successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['tasks', profileId, dateString] });
    },
  });

  console.log('useTasks Hook: Returning', {
    taskCount: tasks?.length || 0,
    isLoading,
    hasProfileId: !!profileId
  });

  return {
    tasks,
    toggleTask,
    addTask,
    isLoading
  };
} 