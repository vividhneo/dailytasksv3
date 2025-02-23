import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Modal, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import TaskInput from '../components/TaskInput';
import Task from '../components/Task';
import ProfileSelector from '../components/ProfileSelector';
import SwipeableDate from '../components/SwipeableDate';
import Settings from '../components/Settings';
import { useTaskContext } from '../contexts/TaskContext';
import type { Task as TaskType, Profile } from '../types/task';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarIcon from '../assets/icons/calendar.svg';

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
    console.log(`[UI] ${message}`, ...args);
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
    (task: TaskType) => task.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const completedTasks = filteredTasks.filter(
    (task: TaskType) => task.completed
  );

  const handleAddTask = (text: string) => {
    addTask(text, format(selectedDate, 'yyyy-MM-dd'));
  };

  // Replace handleCalendarClose with this more generic handler
  const handleComponentToggle = (component: OpenComponent, callback?: () => void) => {
    log(`Toggling component: ${component}, current: ${openComponent}`);
    
    if (openComponent === component) {
      // If clicking the same component, close it
      setOpenComponent('none');
    } else {
      // If clicking a different component, switch to it
      setOpenComponent(component);
      if (callback) {
        callback();
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8F8F8', '#F8F8F8', '#EAE8E8']}
        locations={[0, 0.67, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { paddingTop: insets.top }]}>
          {/* Add overlay first */}
          {openComponent !== 'none' && (
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => {
                log('Overlay pressed, closing component:', openComponent);
                setOpenComponent('none');
              }}
            />
          )}

          {/* Then add all other content */}
          <View style={styles.header}>
            <View style={[{ flex: 1 }, styles.profileSelectorContainer]}>
              <ProfileSelector
                currentProfile={currentProfile}
                profiles={profiles}
                isOpen={openComponent === 'profile'}
                onPress={() => handleComponentToggle('profile')}
                onProfileChange={(id) => {
                  setCurrentProfileId(id);
                  setOpenComponent('none');
                }}
                onCreateProfile={(name) => {
                  addProfile(name);
                  setOpenComponent('none');
                }}
              />
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                onPress={() => handleComponentToggle('calendar')}
                style={styles.calendarButton}
              >
                <CalendarIcon width={16} height={16} fill="#666666" />
              </TouchableOpacity>
              <Settings 
                profiles={profiles}
                isOpen={openComponent === 'settings'}
                onPress={() => handleComponentToggle('settings')}
                onRenameProfile={(id, name) => {
                  setProfiles(profiles.map(p => p.id === id ? {...p, name} : p));
                  setOpenComponent('none');
                }}
                onDeleteProfile={(id) => {
                  setProfiles(profiles.filter(p => p.id !== id));
                  if (currentProfileId === id) {
                    setCurrentProfileId('1');
                  }
                  setOpenComponent('none');
                }}
              />
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
                    setOpenComponent('none');
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
                  setOpenComponent('none');
                }}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
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
              {filteredTasks.map((task: TaskType) => (
                <Task
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </View>
            <TaskInput onSubmit={handleAddTask} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
    justifyContent: 'space-between',
    marginBottom: 20,
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
    flex: 1,
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
});