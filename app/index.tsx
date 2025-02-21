import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import TaskInput from '../components/TaskInput';
import Task from '../components/Task';
import ProfileSelector from '../components/ProfileSelector';
import SwipeableDate from '../components/SwipeableDate';
import Settings from '../components/Settings';
import { useTaskContext } from '../contexts/TaskContext';

export default function IndexScreen() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    tasks,
    profiles,
    currentProfileId,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    addProfile,
    setCurrentProfileId
  } = useTaskContext();

  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];

  const filteredTasks = tasks.filter(task => 
    task.profileId === currentProfileId
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ProfileSelector
          profiles={profiles}
          currentProfile={currentProfile}
          onSelectProfile={setCurrentProfileId}
          onAddProfile={addProfile}
        />
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <Ionicons name="calendar" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <SwipeableDate date={selectedDate} onDateChange={setSelectedDate} />

      <TaskInput onAddTask={addTask} />

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

      <Modal
        visible={showCalendar}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(new Date(day.timestamp));
                setShowCalendar(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  taskList: {
    flex: 1,
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});