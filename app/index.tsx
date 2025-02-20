import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
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
            onPress={() => setShowCalendar(true)}
            style={styles.calendarButton}
          >
            <Ionicons name="calendar" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        {showCalendar && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowCalendar(false);
              if (selectedDate) {
                setSelectedDate(selectedDate);
              }
            }}
          />
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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