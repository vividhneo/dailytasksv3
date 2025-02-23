import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import Task from '@/components/Task';
import TaskInput from '@/components/TaskInput';
import { useTasks } from '@/hooks/useTasks';
import ProfileSelector from '@/components/ProfileSelector';
import Settings from '@/components/Settings';
import SwipeableDate from '@/components/SwipeableDate';
import type { Profile } from '@shared/schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
// import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import CalendarIcon from '@/assets/icons/calendar.svg';
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/styles';
import { LinearGradient } from 'expo-linear-gradient';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  profileId: string;
  date: string;
}

interface TasksState {
  tasks: Task[];
  toggleTask: (id: string) => void;
  addTask: (text: string) => void;
}

export default function TaskList() {
  console.log('==================== TASK LIST RENDER START ====================');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentProfileId, setCurrentProfileId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [swipedTaskId, setSwipedTaskId] = useState<number | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Force log to ensure it's running
  console.log('FORCE LOG: TaskList component is rendering');

  const { data: profiles = [], isLoading: isLoadingProfiles } = useQuery<Profile[]>({
    queryKey: ['/api/profiles'],
  });

  console.log('Progress Step 1: Initial component render', {
    currentProfileId,
    selectedDate: selectedDate.toISOString(),
    hasProfiles: profiles.length > 0
  });

  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];
  console.log('Progress Step 2: Current profile', {
    profileId: currentProfile?.id,
    profileName: currentProfile?.name
  });

  const { tasks = [], toggleTask, addTask, isLoading: isLoadingTasks } = useTasks(currentProfile?.id, selectedDate);
  
  // Immediate task validation
  const validTasks = Array.isArray(tasks) ? tasks : [];
  console.log('Progress Step 3: Tasks validation', {
    rawTasks: tasks,
    isArray: Array.isArray(tasks),
    validTasks,
    taskCount: validTasks.length,
    isLoading: isLoadingTasks,
    taskStatuses: validTasks.map(t => ({ id: t.id, completed: t.completed }))
  });

  // Calculate progress with explicit typing and logging
  const progress = useMemo(() => {
    console.log('Progress Step 4: Starting progress calculation', {
      isLoadingTasks,
      hasValidTasks: validTasks.length > 0
    });
    
    if (isLoadingTasks) {
      console.log('Progress Step 4.0: Tasks still loading, returning 0');
      return 0;
    }

    if (validTasks.length === 0) {
      console.log('Progress Step 4.1: No tasks available, returning 0');
      return 0;
    }

    const completedCount = validTasks.filter((task: Task) => {
      const isCompleted = task.completed === true;
      console.log('Progress Step 4.2: Task completion check', {
        taskId: task.id,
        completed: task.completed,
        isCompleted
      });
      return isCompleted;
    }).length;

    const totalCount = validTasks.length;
    const calculatedProgress = Math.round((completedCount / totalCount) * 100);

    console.log('Progress Step 4.3: Progress calculation', {
      completedTasks: completedCount,
      totalTasks: totalCount,
      calculatedProgress,
      rawCalculation: (completedCount / totalCount) * 100
    });

    return calculatedProgress;
  }, [validTasks, isLoadingTasks]);

  // Log after progress calculation
  console.log('Progress Step 5: Final progress value', {
    progress,
    type: typeof progress,
    isNumber: !isNaN(progress),
    isLoadingTasks
  });

  // Render validation
  useEffect(() => {
    console.log('Progress Step 5.1: Progress validation in effect', {
      progress,
      tasks: validTasks.length,
      type: typeof progress,
      isValid: typeof progress === 'number' && !isNaN(progress),
      isLoadingTasks
    });
  }, [progress, validTasks, isLoadingTasks]);

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

  if (isLoadingProfiles || isLoadingTasks) {
    console.log('TaskList: Loading state...', {
      isLoadingProfiles,
      isLoadingTasks
    });
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar}>
          <LinearGradient
            colors={[colors.primary.main, colors.primary.dark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loadingProgress}
          />
        </View>
      </View>
    );
  }

  // Final validation before render
  console.log('Progress Step 5.2: Pre-render validation', {
    progress,
    taskCount: validTasks.length,
    completedCount: validTasks.filter(t => t.completed).length,
    progressType: typeof progress,
    isLoadingTasks
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ProfileSelector
              profiles={profiles}
              currentProfile={currentProfile}
              onProfileChange={setCurrentProfileId}
              onCreateProfile={createProfile}
            />
            <View style={styles.headerActions}>
              <Settings profiles={profiles} />
            </View>
          </View>
          <Text style={{ color: 'red', marginBottom: 8 }}>
            DEBUG - Tasks: {validTasks.length} | Completed: {validTasks.filter(t => t.completed).length} | Progress: {progress}% | Loading: {isLoadingTasks ? 'yes' : 'no'}
          </Text>
          <SwipeableDate 
            date={selectedDate} 
            onDateChange={setSelectedDate} 
            progress={progress} 
          />
        </View>
        <View style={styles.taskList}>
          {validTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onToggle={() => {
                console.log('Task toggle:', {
                  taskId: task.id,
                  currentStatus: task.completed,
                  totalTasks: validTasks.length,
                  currentProgress: progress
                });
                toggleTask(task.id);
              }}
              swipedTaskId={swipedTaskId}
              setSwipedTaskId={setSwipedTaskId}
            />
          ))}
          <TaskInput onSubmit={addTask} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBar: {
    width: 256,
    height: 4,
    overflow: 'hidden',
    borderRadius: 2,
  },
  loadingProgress: {
    flex: 1,
  },
});

// Type assertion to ensure styles are treated as string literals
type Styles = typeof styles;