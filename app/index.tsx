import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Modal, Text } from 'react-native';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import TaskInput from '../components/TaskInput';
import Task from '../components/Task';
import ProfileSelector from '../components/ProfileSelector';
import SwipeableDate from '../components/SwipeableDate';
import Settings from '../components/Settings';

interface TaskType {
  id: string;
  text: string;
  completed: boolean;
  profileId: string;
  date: string;
}

export default function IndexScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: 'Personal' }
  ]);
  const [currentProfileId, setCurrentProfileId] = useState('1');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];

  const addTask = (text: string) => {
    const newTask: TaskType = {
      id: Math.random().toString(),
      text,
      completed: false,
      profileId: currentProfile.id,
      date: format(selectedDate, 'yyyy-MM-dd')
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(
    task => task.date === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <ProfileSelector
              currentProfile={currentProfile}
              profiles={profiles}
              onProfileChange={setCurrentProfileId}
              onCreateProfile={(name) => {
                const newProfile = {
                  id: Math.random().toString(),
                  name
                };
                setProfiles([...profiles, newProfile]);
                setCurrentProfileId(newProfile.id);
              }}
            />
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => setShowCalendar(!showCalendar)}
              style={styles.calendarButton}
            >
              <Ionicons name="calendar" size={24} color="#666" />
            </TouchableOpacity>
            <Settings 
              profiles={profiles}
              onRenameProfile={(id, name) => {
                setProfiles(profiles.map(p => 
                  p.id === id ? {...p, name} : p
                ));
              }}
              onDeleteProfile={(id) => {
                setProfiles(profiles.filter(p => p.id !== id));
                if (currentProfileId === id) {
                  setCurrentProfileId('1');
                }
              }}
            />
          </View>
        </View>
        {showCalendar && (
          <View style={styles.calendarPopup}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity>
                <Ionicons name="chevron-back" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>{format(selectedDate, 'MMMM yyyy')}</Text>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.weekDaysHeader}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>
            <Calendar
              current={selectedDate.toISOString()}
              onDayPress={(day) => {
                const selectedDay = new Date(day.timestamp);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDay <= today) {
                  setSelectedDate(selectedDay);
                  setShowCalendar(false);
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
                setShowCalendar(false);
              }}
            >
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          </View>
        )}
        <SwipeableDate
          date={selectedDate}
          onDateChange={setSelectedDate}
          taskCount={filteredTasks.length}
        />
        <View style={styles.taskList}>
          {filteredTasks.map(task => (
            <Task
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </View>
        <TaskInput onSubmit={addTask} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calendarPopup: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
    width: '100%',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  taskList: {
    flex: 1,
  }
});