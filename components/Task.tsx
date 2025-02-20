
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, PanResponder } from 'react-native';

interface TaskProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggle: () => void;
  onDelete: (id: string) => void;
}

export default function Task({ task, onToggle, onDelete }: TaskProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const deleteButtonWidth = 70;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0 && gestureState.dx > -deleteButtonWidth) {
        pan.x.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -deleteButtonWidth / 2) {
        Animated.spring(pan.x, {
          toValue: -deleteButtonWidth,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(pan.x, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.taskContainer, { transform: [{ translateX: pan.x }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity onPress={onToggle} style={styles.taskContent}>
          <View style={[styles.checkbox, task.completed && styles.checked]} />
          <Text style={[styles.text, task.completed && styles.completedText]}>
            {task.text}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 1,
  },
  taskContainer: {
    backgroundColor: '#fff',
    zIndex: 2,
  },
  taskContent: {
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
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
