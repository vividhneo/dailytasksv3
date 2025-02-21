import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Bell, Trash2 } from 'lucide-react';
import Checkbox from './Checkbox';
import type { Task as TaskType } from '@shared/schema';
import ReminderDialog from './ReminderDialog';
import { format } from 'date-fns';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TaskProps {
  task: TaskType;
  onToggle: () => void;
  swipedTaskId: number | null;
  setSwipedTaskId: (id: number | null) => void;
}

export default function Task({ task, onToggle, swipedTaskId, setSwipedTaskId }: TaskProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0],
    ['#EDEDED', 'rgba(0, 0, 0, 0)']
  );

  const swipeControls = useTransform(
    x,
    [-100, 0],
    [1, 0]
  );

  const resetPosition = () => {
    console.log('Resetting position...');
    animate(x, 0);
  };

  // Reset position when another task is swiped
  useEffect(() => {
    if (swipedTaskId !== null && swipedTaskId !== task.id) {
      resetPosition();
    }
  }, [swipedTaskId]);

  const { mutate: deleteTask } = useMutation({
    mutationFn: async (taskId: number) => {
      console.log('Starting delete mutation for task:', taskId);
      try {
        const response = await apiRequest('DELETE', `/api/tasks/${taskId}`);
        console.log('Delete API response status:', response.status);
        if (response.status !== 204) {
          throw new Error(`Unexpected status: ${response.status}`);
        }
      } catch (error) {
        console.error('Delete API request failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Delete mutation succeeded, invalidating queries...');
      // Invalidate using the same query key structure as in useTasks
      const queryKey = ['/api/tasks', task.profileId, new Date(task.date).toISOString().split('T')[0]];
      console.log('Invalidating query with key:', queryKey);
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Task deleted",
        description: "The task has been removed",
      });
      console.log('Resetting position after successful deletion...');
      resetPosition();
    },
    onError: (error) => {
      console.error('Delete mutation failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      resetPosition();
    },
  });

  const handleDragStart = () => {
    console.log('Drag started, setting isSwiping to true');
    setIsSwiping(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    console.log('Drag ended, offset:', info.offset.x);
    if (info.offset.x < -50) {
      setSwipedTaskId(task.id);
    } else {
      resetPosition();
      if (swipedTaskId === task.id) {
        setSwipedTaskId(null);
      }
    }
    setTimeout(() => {
      console.log('Setting isSwiping to false');
      setIsSwiping(false);
    }, 100);
  };

  const handleDelete = (e: React.MouseEvent) => {
    console.log('Delete button clicked for task:', task.id);
    console.log('Current isSwiping state:', isSwiping);
    e.preventDefault();
    e.stopPropagation();
    console.log('Initiating delete task...');
    deleteTask(task.id);
  };

  const handleClick = () => {
    console.log('Task clicked, isSwiping:', isSwiping);
    if (!isSwiping) {
      onToggle();
    }
  };

  const handleSetReminder = (date: Date) => {
    setReminder({ taskId: task.id, reminderAt: date });
  };

  const { mutate: setReminder } = useMutation({
    mutationFn: async ({ taskId, reminderAt }: { taskId: number; reminderAt: Date }) => {
      console.log('Setting reminder for task:', taskId, 'at:', reminderAt);
      const response = await apiRequest('POST', `/api/tasks/${taskId}/reminder`, { reminderAt });
      console.log('Reminder API response:', response);
      return response.json();
    },
    onSuccess: () => {
      console.log('Reminder set successfully');
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Reminder set",
        description: "You will be reminded at the specified time",
      });
      resetPosition();
    },
    onError: (error) => {
      console.error('Failed to set reminder:', error);
      toast({
        title: "Error",
        description: "Failed to set reminder",
        variant: "destructive",
      });
      resetPosition();
    },
  });

  const { mutate: clearReminder } = useMutation({
    mutationFn: async (taskId: number) => {
      console.log('Clearing reminder for task:', taskId);
      await apiRequest('DELETE', `/api/tasks/${taskId}/reminder`);
      console.log('Reminder cleared successfully');
    },
    onSuccess: () => {
      console.log('Reminder cleared successfully, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Reminder cleared",
        description: "The reminder has been removed",
      });
      resetPosition();
    },
    onError: (error) => {
      console.error('Failed to clear reminder:', error);
      toast({
        title: "Error",
        description: "Failed to clear reminder",
        variant: "destructive",
      });
      resetPosition();
    },
  });


  return (
    <>
      <div className="relative">
        <motion.div
          style={{ x, background }}
          drag="x"
          dragConstraints={{ left: -100, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="flex items-start space-x-3 p-3 hover:bg-accent/5 cursor-pointer relative bg-background"
          onClick={handleClick}
        >
          <Checkbox checked={task.completed} onToggle={handleClick} />
          <motion.span
            animate={{
              textDecoration: task.completed ? 'line-through' : 'none',
              opacity: task.completed ? 0.5 : 1,
              color: task.completed ? '#2b2626' : 'var(--foreground)',
            }}
            className="flex-1 whitespace-pre-wrap break-words"
          >
            {task.text}
          </motion.span>
          {task.reminderAt && (
            <div
              className="text-xs text-muted-foreground flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                if (!isSwiping) {
                  clearReminder(task.id);
                  resetPosition();
                }
              }}
            >
              <Bell className="h-3 w-3" />
              {format(new Date(task.reminderAt), 'MMM d, h:mm a')}
            </div>
          )}
        </motion.div>
        <motion.div
          style={{ opacity: swipeControls }}
          className="absolute right-0 top-0 bottom-0 flex items-center gap-2 px-4"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReminderDialog(true);
              resetPosition();
            }}
            className="p-2 rounded-full hover:bg-accent/10 text-blue-500"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-accent/10 text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
      <ReminderDialog
        open={showReminderDialog}
        onOpenChange={(open) => {
          setShowReminderDialog(open);
          if (!open) resetPosition();
        }}
        onSetReminder={handleSetReminder}
        taskText={task.text}
      />
    </>
  );
}