
import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Task from '../../components/Task';
import TaskInput from '../../components/TaskInput';

interface TaskType {
  id: number;
  text: string;
  completed: boolean;
}

export default function TaskScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const handleAddTask = (text: string) => {
    setTasks(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  };

  const handleToggleTask = (taskId: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  return (
    <View style={styles.container}>
      <TaskInput onSubmit={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Task
            task={item}
            onToggle={() => handleToggleTask(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
