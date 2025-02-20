import React, { useEffect, useState } from 'react';
import Task from '@/components/Task';
import TaskInput from '@/components/TaskInput';
import { useTasks } from '@/hooks/useTasks';
import ProfileSelector from '@/components/ProfileSelector';
import Settings from '@/components/Settings';
import SwipeableDate from '@/components/SwipeableDate';
import type { Profile } from '@shared/schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';

export default function TaskList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentProfileId, setCurrentProfileId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [swipedTaskId, setSwipedTaskId] = useState<number | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Reset time part for today

  const { data: profiles = [], isLoading: isLoadingProfiles } = useQuery<Profile[]>({
    queryKey: ['/api/profiles'],
  });

  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];
  const { tasks, toggleTask, addTask } = useTasks(currentProfile?.id, selectedDate);

  useEffect(() => {
    console.log('Current tasks:', tasks);
  }, [tasks]);

  const { mutate: createProfile } = useMutation({
    mutationFn: async (name: string) => {
      console.log('Creating new profile:', name);
      const response = await apiRequest('POST', '/api/profiles', { name });
      return response.json();
    },
    onSuccess: (newProfile: Profile) => {
      console.log('Profile created successfully:', newProfile);
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      setCurrentProfileId(newProfile.id);
      toast({
        title: "Profile created",
        description: "Your new profile has been created successfully",
      });
    },
    onError: (error) => {
      console.error('Failed to create profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (currentProfile?.id) {
      const lastCarryOver = localStorage.getItem(`lastCarryOver_${currentProfile.id}`);
      const today = new Date().toISOString().split('T')[0];

      if (lastCarryOver !== today) {
        const carryOverTasks = async () => {
          try {
            await apiRequest('POST', `/api/tasks/carry-over?profileId=${currentProfile.id}`);
            localStorage.setItem(`lastCarryOver_${currentProfile.id}`, today);
          } catch (error) {
            console.error('Failed to carry over tasks:', error);
          }
        };
        carryOverTasks();
      }
    }
  }, [currentProfile?.id]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const compareToday = new Date(today);
    compareToday.setHours(0, 0, 0, 0);

    if (compareDate <= compareToday) {
      setSelectedDate(date);
    }
  };

  if (isLoadingProfiles) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="w-64">
          <div 
            className="h-1.5 overflow-hidden bg-[#E9E8E8] rounded-full"
          >
            <div
              className="h-full w-full transition-all duration-300 ease-in-out rounded-full animate-[progress_1s_ease-in-out_infinite]"
              style={{
                background: 'linear-gradient(to right, #38F2B8, #157356)',
                animation: 'progress 1s ease-in-out infinite',
              }}
            />
          </div>
        </div>
        <style>
          {`
            @keyframes progress {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}
        </style>
      </div>
    );
  }

  const taskProgress = tasks.length > 0 
    ? (tasks.filter(task => task.completed).length / tasks.length) * 100 
    : 0;

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-start">
          <ProfileSelector
            profiles={profiles}
            currentProfile={currentProfile}
            onProfileChange={setCurrentProfileId}
            onCreateProfile={createProfile}
          />
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 p-0">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    const compareDate = new Date(date);
                    compareDate.setHours(0, 0, 0, 0);
                    const compareToday = new Date(today);
                    compareToday.setHours(0, 0, 0, 0);
                    return compareDate > compareToday;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Settings profiles={profiles} />
          </div>
        </div>
        <SwipeableDate 
          date={selectedDate} 
          onDateChange={setSelectedDate} 
          progress={taskProgress}
        />
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id)}
            swipedTaskId={swipedTaskId}
            setSwipedTaskId={setSwipedTaskId}
          />
        ))}
        <TaskInput onSubmit={addTask} />
      </div>
    </div>
  );
}