
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

interface TaskProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggle: () => void;
  onDelete: (id: string) => void;
}

const SWIPE_THRESHOLD = -70;
const { width } = Dimensions.get('window');

export default function Task({ task, onToggle, onDelete }: TaskProps) {
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      translateX.value = withSpring(0);
    },
    onActive: (event) => {
      const newTranslateX = Math.max(-100, Math.min(0, event.translationX));
      translateX.value = newTranslateX;
    },
    onEnd: (event) => {
      if (event.translationX < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-100);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.taskContainer, animatedStyle]}>
            <TouchableOpacity onPress={onToggle} style={styles.taskContent}>
              <View style={[styles.checkbox, task.completed && styles.checked]} />
              <Text style={[styles.text, task.completed && styles.completedText]}>
                {task.text}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
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
    width: 100,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
