import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
  GestureHandlerRootView,
  State,
} from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { typography } from '../constants/theme';

interface TaskProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggle: () => void;
  onDelete: (id: string) => void;
}

const SWIPE_THRESHOLD = 70;
const DELETE_WIDTH = 100;

export default function Task({ task, onToggle, onDelete }: TaskProps) {
  const translateX = useSharedValue(0);
  const [isPanning, setIsPanning] = useState(false);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      runOnJS(setIsPanning)(true);
    },
    onActive: (event) => {
      translateX.value = Math.max(-DELETE_WIDTH, Math.min(0, event.translationX));
    },
    onEnd: (event) => {
      const shouldDelete = translateX.value < -SWIPE_THRESHOLD;
      translateX.value = withSpring(shouldDelete ? -DELETE_WIDTH : 0, {
        damping: 20,
        stiffness: 200,
      });
      // Reset panning state after animation
      setTimeout(() => runOnJS(setIsPanning)(false), 100);
    },
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteStyle = useAnimatedStyle(() => {
    const opacity = Math.min(1, -translateX.value / DELETE_WIDTH);
    return { opacity };
  });

  const handleTapStateChange = ({ nativeEvent }: { nativeEvent: { state: number } }) => {
    if (nativeEvent.state === State.END && !isPanning) {
      onToggle();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={onToggle}
        style={styles.taskRow}
      >
        <View style={[
          styles.checkbox,
          task.completed ? styles.checkedBox : styles.uncheckedBox
        ]} />
        <Text style={[
          styles.taskText,
          task.completed && styles.completedText,
          { fontFamily: typography.fontFamily.regular }
        ]}>
          {task.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: '#F25B38',
    borderColor: '#B64328',
  },
  uncheckedBox: {
    backgroundColor: '#EAEDFD',
    borderColor: '#809AF7',
  },
  taskText: {
    fontSize: 16,
    color: '#716666',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
});
