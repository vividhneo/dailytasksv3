
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { format, addDays, subDays } from 'date-fns';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const SWIPE_THRESHOLD = 100;
const { width } = Dimensions.get('window');

interface SwipeableDateProps {
  date: Date;
  onDateChange: (date: Date) => void;
  progress?: number;
}

export default function SwipeableDate({ date, onDateChange, progress = 0 }: SwipeableDateProps) {
  const translateX = useSharedValue(0);

  const handleDateChange = (newDate: Date) => {
    onDateChange(newDate);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        if (event.translationX > 0) {
          runOnJS(handleDateChange)(subDays(date, 1));
        } else {
          runOnJS(handleDateChange)(addDays(date, 1));
        }
      }
      translateX.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{format(date, 'EEEE, MMMM d')}</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    marginVertical: 10,
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
  progressContainer: {
    height: 4,
    backgroundColor: '#E9E8E8',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#38F2B8',
    borderRadius: 2,
  },
});
