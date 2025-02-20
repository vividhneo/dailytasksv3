
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { format, addDays, subDays } from 'date-fns';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

const SWIPE_THRESHOLD = 80;
const { width } = Dimensions.get('window');

interface SwipeableDateProps {
  date: Date;
  onDateChange: (date: Date) => void;
  taskCount: number;
}

export default function SwipeableDate({ date, onDateChange, taskCount }: SwipeableDateProps) {
  const translateX = useSharedValue(0);
  const isSwipeInProgress = useSharedValue(false);

  const handleDateChange = (newDate: Date) => {
    onDateChange(newDate);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      isSwipeInProgress.value = true;
    },
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        if (event.translationX > 0) {
          // Swipe right (previous day)
          translateX.value = withTiming(width, {
            duration: 200,
          }, () => {
            runOnJS(handleDateChange)(subDays(date, 1));
            translateX.value = withTiming(0, { duration: 0 });
          });
        } else {
          // Swipe left (next day)
          translateX.value = withTiming(-width, {
            duration: 200,
          }, () => {
            runOnJS(handleDateChange)(addDays(date, 1));
            translateX.value = withTiming(0, { duration: 0 });
          });
        }
      } else {
        translateX.value = withSpring(0);
      }
      isSwipeInProgress.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{format(date, 'EEEE, MMMM d')}</Text>
            <Text style={styles.taskCount}>{taskCount} tasks</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  container: {
    width: width - 40,
    marginVertical: 10,
    alignSelf: 'center',
  },
  dateContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  taskCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  }
});
