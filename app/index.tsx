
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import TaskInput from '../components/TaskInput';
import Task from '../components/Task';

interface TaskType {
  id: string;
  text: string;
  completed: boolean;
}

export default function IndexScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const addTask = (text: string) => {
    setTasks([...tasks, { id: Math.random().toString(), text, completed: false }]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {tasks.map(task => (
          <Task 
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id)}
            onDelete={deleteTask}
          />
        ))}
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
  }
});
