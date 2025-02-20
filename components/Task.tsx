
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TaskProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggle: () => void;
}

export default function Task({ task, onToggle }: TaskProps) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
      <View style={[styles.checkbox, task.completed && styles.checked]} />
      <Text style={[styles.text, task.completed && styles.completedText]}>
        {task.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 15,
  },
  checked: {
    backgroundColor: '#000',
  },
  text: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
