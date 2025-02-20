import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Modal } from 'react-native';
import { format } from 'date-fns';
import { Calendar } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import TaskInput from '../components/TaskInput';
import Task from '../components/Task';
import ProfileSelector from '../components/ProfileSelector';
import SwipeableDate from '../components/SwipeableDate';

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
          <TouchableOpacity
            onPress={() => setShowCalendar(!showCalendar)}
            style={styles.calendarButton}
          >
            <Ionicons name="calendar" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        {showCalendar && (
          <View style={styles.calendarContainer}>
            {Platform.OS === 'web' ? (
              <input 
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => {
                  setSelectedDate(new Date(e.target.value));
                  setShowCalendar(false);
                }}
                style={styles.webDatePicker}
              />
            ) : (
              <Calendar
                current={selectedDate.toISOString()}
                onDayPress={(day) => {
                  setSelectedDate(new Date(day.timestamp));
                  setShowCalendar(false);
                }}
              />
            )}
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
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  calendarButton: {
    padding: 8,
    marginLeft: 8,
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