
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  tasksContainer: {
    marginTop: 20,
  },
});
