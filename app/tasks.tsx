import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import TaskInput from '../components/TaskInput';
import Task from '../components/Task';

export default function TasksScreen() {
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
        <View style={styles.tasksContainer}>
          {tasks.map(task => (
            <Task 
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
            />
          ))}
        </View>
        <TaskInput onSubmit={addTask} />
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
  },
  tasksContainer: {
    flex: 1,
  },
});