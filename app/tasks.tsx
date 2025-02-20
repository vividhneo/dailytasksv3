
import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import TaskInput from '../components/TaskInput';
import Task from '../components/Task';
import SwipeableDate from '../components/SwipeableDate';

export default function TasksScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState([]);

  const addTask = (text) => {
    setTasks([...tasks, { id: Math.random().toString(), text, completed: false }]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SwipeableDate 
          date={selectedDate} 
          onDateChange={setSelectedDate}
          progress={tasks.length > 0 ? (tasks.filter(task => task.completed).length / tasks.length) * 100 : 0}
        />
        <TaskInput onAddTask={addTask} />
        <View style={styles.tasksContainer}>
          {tasks.map(task => (
            <Task 
              key={task.id}
              text={task.text}
              completed={task.completed}
              onToggle={() => toggleTask(task.id)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  tasksContainer: {
    marginTop: 20,
    flex: 1,
  },
});
