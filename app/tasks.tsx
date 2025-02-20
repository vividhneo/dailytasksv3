
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import TaskInput from '../components/TaskInput';
import Task from '../components/Task';

interface TaskType {
  id: string;
  text: string;
  completed: boolean;
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const addTask = (text: string) => {
    setTasks([...tasks, { id: Math.random().toString(), text, completed: false }]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.taskList}>
        {tasks.map(task => (
          <Task 
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id)}
          />
        ))}
      </ScrollView>
      <TaskInput onSubmit={addTask} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  taskList: {
    flex: 1,
  }
});
