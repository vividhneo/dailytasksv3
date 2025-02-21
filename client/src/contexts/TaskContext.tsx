import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Task } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  addTask: (title: string, profileId: number) => Promise<void>;
  toggleTask: (id: number, completed: boolean) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ 
  children, 
  profileId 
}: { 
  children: ReactNode;
  profileId: number;
}) {
  const { toast } = useToast();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['/api/tasks', profileId],
    enabled: !!profileId,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      await apiRequest('POST', '/api/tasks', {
        title,
        completed: false,
        profileId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks', profileId] });
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add task: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      await apiRequest('PATCH', `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks', profileId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks', profileId] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete task: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error: error as Error | null,
        addTask: (title: string) => addTaskMutation.mutateAsync(title),
        toggleTask: (id: number, completed: boolean) =>
          toggleTaskMutation.mutateAsync({ id, completed }),
        deleteTask: (id: number) => deleteTaskMutation.mutateAsync(id),
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
