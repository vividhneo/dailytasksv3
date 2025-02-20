
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Checkbox from './Checkbox';

interface TaskType {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskProps {
  task: TaskType;
  onToggle: () => void;
}

export default function Task({ task, onToggle }: TaskProps) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
      <Checkbox checked={task.completed} onToggle={onToggle} />
      <Text style={[
        styles.text,
        task.completed && styles.completedText
      ]}>
        {task.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    backgroundColor: '#fff',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
    color: '#2b2626',
  },
});
