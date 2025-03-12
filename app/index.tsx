import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Modal, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TaskInput from '../components/TaskInput';
import Task from '../components/Task';
import ProfileSelector from './components/ProfileSelector';
import SwipeableDate from '../components/SwipeableDate';
import Settings from './components/Settings';
import { useTaskContext } from '../contexts/TaskContext';
import { SvgIcon, ICONS } from './utils/svg-utils';
import { CalendarIcon } from './components/icons/CalendarIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';

// Define types inline to avoid import errors
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

interface CalendarDay {
  timestamp: number;
  dateString: string;
  day: number;
  month: number;
  year: number;
}

// First, create a type for components that can be opened
type OpenComponent = 'none' | 'calendar' | 'profile' | 'settings';

export default function IndexScreen() {
  const { 
    tasks, 
    addTask, 
    toggleTask, 
    deleteTask, 
    profiles, 
    currentProfileId, 
    setCurrentProfileId,
    loading,
    addProfile,
    setProfiles
  } = useTaskContext();
  const [openComponent, setOpenComponent] = useState<OpenComponent>('none');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const insets = useSafeAreaInsets();
  const isHandlingAction = useRef(false);

  const log = (message: string, ...args: any[]) => {
    console.log(`[IndexScreen] ${message}`, ...args);
  };

  // Add a ref to track touch events
  const touchStartTarget = useRef<any>(null);

  // Enhanced logging for state changes
  const setOpenComponentWithLogging = useCallback((component: OpenComponent, source: string) => {
    log(`Setting openComponent to ${component} from source: ${source}`);
    log(`Previous value was: ${openComponent}`);
    setOpenComponent(component);
  }, [openComponent]);
  
  // Enhanced logging for touch events
  const handleTouchStart = (e: any, componentName: string) => {
    log(`Touch start on ${componentName}, target:`, e.target);
    log(`Current openComponent: ${openComponent}`);
    // Log the event path if available
    if (e.nativeEvent && e.nativeEvent.path) {
      log(`Event path:`, e.nativeEvent.path);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#F8F8F8', '#F8F8F8', '#EAE8E8']}
          locations={[0, 0.67, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.content, { paddingTop: insets.top }]}>
            <Text>Loading...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];

  const filteredTasks = tasks.filter(
    (task: Task) => task.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const completedTasks = filteredTasks.filter(
    (task: Task) => task.completed
  );

  const handleAddTask = (text: string) => {
    addTask(text, format(selectedDate, 'yyyy-MM-dd'));
  };

  // Replace handleCalendarClose with this more generic handler
  const handleComponentToggle = (component: OpenComponent, callback?: () => void, forceOpen: boolean = false) => {
    log(`Toggling component: ${component}, current: ${openComponent}, forceOpen: ${forceOpen}`);
    
    if (openComponent === component && !forceOpen) {
      // If clicking the same component and not forcing open, close it
      log(`Closing component ${component} because it's already open`);
      setOpenComponentWithLogging('none', 'handleComponentToggle-close');
    } else {
      // If clicking a different component or forcing open, switch to it
      log(`Opening component ${component} from previous ${openComponent}`);
      setOpenComponentWithLogging(component, 'handleComponentToggle-open');
      if (callback) {
        callback();
      }
    }
  };

  return (
    <View 
      style={styles.container}
      onTouchStart={(e) => handleTouchStart(e, 'container')}
    >
      <LinearGradient
        colors={['#EAE8E8', '#F8F8F8', '#F8F8F8']}
        locations={[0, 0.67, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView 
        style={styles.safeArea}
        onTouchStart={(e) => handleTouchStart(e, 'safeArea')}
      >
        <View 
          style={[styles.content, { paddingTop: insets.top }]}
          onTouchStart={(e) => {
            handleTouchStart(e, 'content');
            // Don't stop propagation here to see if events bubble up
          }}
        >
          {/* Add overlay first */}
          {openComponent !== 'none' && (
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={(e) => {
                log('Overlay pressed, target:', e.target);
                log('touchStartTarget:', touchStartTarget.current);
                
                // Check if the press started and ended on the overlay itself
                if (e.target === e.currentTarget) {
                  log('Closing component from overlay press:', openComponent);
                  setOpenComponentWithLogging('none', 'overlay-press');
                } else {
                  log('Press ignored - not directly on overlay');
                }
              }}
            />
          )}

          {/* Then add all other content */}
          <View 
            style={styles.header}
            onTouchStart={(e) => {
              handleTouchStart(e, 'header');
              // Don't stop propagation to see if events bubble up
            }}
          >
            <View 
              style={[{ flex: 1 }, styles.profileSelectorContainer]}
              onTouchStart={(e) => {
                handleTouchStart(e, 'profileSelectorContainer');
                // Stop propagation
                e.stopPropagation();
              }}
            >
              <ProfileSelector
                profiles={profiles}
                currentProfileId={currentProfileId}
                onProfileSelect={(id: string) => {
                  log('Profile changed to:', id);
                  setCurrentProfileId(id);
                  setOpenComponentWithLogging('none', 'profile-change');
                }}
                onProfileCreate={(name: string) => {
                  log('Creating new profile:', name);
                  addProfile(name);
                  setOpenComponentWithLogging('none', 'profile-create');
                }}
                logCloseAttempt={(reason: string) => {
                  log(`ProfileSelector requested close: ${reason}`);
                }}
              />
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                onPress={() => handleComponentToggle('calendar')}
                style={styles.calendarButton}
              >
                <CalendarIcon color="#716666" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleComponentToggle('settings')}
                style={styles.settingsButton}
              >
                <SettingsIcon color="#716666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Calendar popup */}
          {openComponent === 'calendar' && (
            <View style={styles.calendarPopup}>
              <Calendar
                current={selectedDate.toISOString()}
                onDayPress={(day: CalendarDay) => {
                  log('Day pressed', day);
                  const selectedDay = new Date(day.timestamp);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  if (selectedDay <= today) {
                    setSelectedDate(selectedDay);
                    setOpenComponentWithLogging('none', 'calendar-day-press');
                  }
                }}
                maxDate={new Date().toISOString()}
                theme={{
                  backgroundColor: 'transparent',
                  calendarBackground: 'transparent',
                  textSectionTitleColor: '#666',
                  selectedDayBackgroundColor: '#E76F51',
                  selectedDayTextColor: '#fff',
                  todayTextColor: '#E76F51',
                  dayTextColor: '#2d4150',
                  textDisabledColor: '#d9e1e8',
                  dotColor: '#E76F51',
                  monthTextColor: '#666',
                  textMonthFontSize: 16,
                  textDayFontSize: 14,
                }}
              />
              <TouchableOpacity 
                style={styles.todayButton}
                onPress={() => {
                  setSelectedDate(new Date());
                  setOpenComponentWithLogging('none', 'today-button-press');
                }}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Settings popup */}
          {openComponent === 'settings' && (
            <View style={styles.settingsPopup}>
              <Settings
                profiles={profiles}
                isOpen={true}
                onPress={() => setOpenComponentWithLogging('none', 'settings-close')}
                onRenameProfile={(id: string, name: string) => {
                  const updatedProfiles = profiles.map(profile => 
                    profile.id === id ? { ...profile, name } : profile
                  );
                  setProfiles(updatedProfiles);
                }}
                onDeleteProfile={(id: string) => {
                  // Don't delete the last profile
                  if (profiles.length <= 1) return;
                  
                  const updatedProfiles = profiles.filter(profile => profile.id !== id);
                  setProfiles(updatedProfiles);
                  
                  // If the deleted profile was the current one, switch to the first available
                  if (id === currentProfileId) {
                    setCurrentProfileId(updatedProfiles[0].id);
                  }
                }}
              />
            </View>
          )}

          <View style={[styles.mainContent, { zIndex: 1 }]}>
            <SwipeableDate
              date={selectedDate}
              onDateChange={setSelectedDate}
              taskCount={filteredTasks.length}
              completedCount={completedTasks.length}
            />
            <View style={styles.taskList}>
              {filteredTasks.map((task: Task) => (
                <Task
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </View>
            <View style={styles.addTaskContainer}>
              <TaskInput onSubmit={handleAddTask} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  dateContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.5,
    elevation: 2,
  },
  calendarPopup: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayText: {
    color: '#666',
    fontSize: 12,
  },
  todayButton: {
    backgroundColor: '#E76F51',
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  todayButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxWidth: 400,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  webDatePicker: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 1000,
    width: '100%',
    marginBottom: 20,
    marginTop: 40,
    zIndex: 1000,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarButton: {
    padding: 8,
  },
  taskList: {
    paddingTop: 20,
    paddingLeft: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  addTaskContainer: {
    paddingLeft: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  profileSelectorContainer: {
    marginRight: 16,
    zIndex: 999,
    elevation: 999,
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
    elevation: 1,
    alignItems: 'center',
    width: '100%',
    maxWidth: 1000,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: '#716666',
    marginBottom: 8,
  },
  taskCount: {
    fontSize: 14,
    color: '#716666',
  },
  settingsButton: {
    padding: 8,
  },
  settingsPopup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
});