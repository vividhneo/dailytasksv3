import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import {
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../constants/theme';
import { useSwipe } from '../contexts/SwipeContext';

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
  const swipeableRef = useRef<Swipeable>(null);
  const { swipedItemId, setSwipedItemId } = useSwipe();
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  React.useEffect(() => {
    if (swipedItemId && swipedItemId !== task.id && swipeableRef.current) {
      swipeableRef.current.close();
    }
  }, [swipedItemId]);

  const renderRightActions = () => {
    return (
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => {
          onDelete(task.id);
          setSwipedItemId(null);
        }}
      >
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    );
  };

  const handleTaskPress = () => {
    if (!isSwipeActive) {
      onToggle();
    }
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.taskContainer}>
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          onSwipeableOpen={() => {
            setIsSwipeActive(true);
            setSwipedItemId(task.id);
          }}
          onSwipeableClose={() => {
            setIsSwipeActive(false);
            setSwipedItemId(null);
          }}
          onSwipeableWillOpen={() => setIsSwipeActive(true)}
          rightThreshold={40}
        >
          <TouchableOpacity 
            onPress={handleTaskPress}
            style={[styles.container, styles.taskRow]}
          >
            <View style={[
              styles.checkbox,
              task.completed ? styles.checkedBox : styles.uncheckedBox
            ]} />
            <Text style={[
              styles.taskText,
              task.completed && styles.completedText
            ]}>
              {task.text}
            </Text>
          </TouchableOpacity>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    position: 'relative',
    marginVertical: 6,
  },
  container: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 0,
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
    fontFamily: typography.fontFamily.regular,
  },
  completedText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#B64328',
    opacity: 0.7,
  },
  deleteButton: {
    backgroundColor: '#EDEDED',
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
