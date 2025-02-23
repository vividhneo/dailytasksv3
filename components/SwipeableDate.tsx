import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '../constants/theme';

interface SwipeableDateProps {
  date: Date;
  onDateChange: (date: Date) => void;
  progress: number;
}

export default function SwipeableDate({ date, onDateChange, progress }: SwipeableDateProps) {
  console.log('Progress Step 6: SwipeableDate received props', {
    receivedProgress: progress,
    progressType: typeof progress,
    isNumber: !isNaN(Number(progress))
  });

  // Ensure progress is a valid number between 0 and 100
  const safeProgress = React.useMemo(() => {
    console.log('Progress Step 7: Converting progress to safe value');
    
    const numericProgress = Number(progress);
    if (isNaN(numericProgress)) {
      console.log('Progress Step 7.1: Invalid progress value', {
        progress,
        numericProgress,
        returning: 0
      });
      return 0;
    }

    const boundedProgress = Math.min(Math.max(numericProgress, 0), 100);
    console.log('Progress Step 7.2: Bounded progress value', {
      original: numericProgress,
      bounded: boundedProgress
    });
    
    return boundedProgress;
  }, [progress]);

  console.log('Progress Step 8: Final progress values for render', {
    originalProgress: progress,
    safeProgress,
    cssWidth: `${safeProgress}%`,
    date: date.toISOString()
  });

  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > 50) {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + (event.translationX > 0 ? -1 : 1));
        runOnJS(onDateChange)(newDate);
      }
      translateX.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.dateContainer, animatedStyle]}>
          <Text style={styles.dateText}>
            {format(date, 'EEEE, MMMM d')}
          </Text>
          <Text style={styles.debugText}>
            DEBUG - Raw: {progress} | Safe: {safeProgress}% | Type: {typeof progress}
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${safeProgress}%` }
                ]}
              >
                <LinearGradient
                  colors={['#38F2B8', '#157356']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    alignItems: 'center',
  },
  dateContainer: {
    width: 384,
    height: 70,
    backgroundColor: '#EEEEEE',
    borderRadius: 9,
    shadowColor: 'rgba(13, 39, 80, 0.25)',
    shadowOffset: {
      width: 12,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 5,
    overflow: 'hidden',
  },
  dateText: {
    fontSize: 20,
    color: '#716666',
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    paddingVertical: 16,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#E9E8E8',
  },
  progressBar: {
    height: '100%',
    minWidth: 1,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  debugText: {
    fontSize: 12,
    color: 'red', // Make it obvious
    textAlign: 'center',
    position: 'absolute',
    top: 40,
    width: '100%',
    zIndex: 1000,
  },
});

