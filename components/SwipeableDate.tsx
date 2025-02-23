import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, addDays, subDays, isToday, startOfDay } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '../constants/theme';
import { GestureHandlerRootView, PanGestureHandler, GestureEvent } from 'react-native-gesture-handler';
import { Neomorph } from 'react-native-neomorph-shadows';

interface DateNavigatorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  taskCount: number;
  completedCount: number;
}

export default function DateNavigator({ date, onDateChange, taskCount, completedCount }: DateNavigatorProps) {
  const isCurrentDay = isToday(startOfDay(date));
  const progress = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;

  const gestureHandler = (event: GestureEvent) => {
    // Handle gesture events here if needed
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <View style={styles.container}>
          <LinearGradient
            colors={['rgb(238, 238, 238)', 'rgb(255, 255, 255)']}
            style={[styles.dateContainer, { 
              shadowColor: 'rgba(13, 39, 80, 0.25)',
              shadowOffset: { width: 12, height: 12 },
              shadowOpacity: 1,
              shadowRadius: 32,
            }]}
          >
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateText}>
                {format(date, 'EEEE, MMMM d')}
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                {progress > 0 && (
                  <LinearGradient
                    colors={['#38F2B8', '#157356']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${progress}%`,
                        borderBottomRightRadius: progress === 100 ? 9 : 0
                      }
                    ]}
                  />
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    width: '100%',
    maxWidth: 1000,
    alignContent: 'center',
  },
  dateContainer: {
    height: 70,
    backgroundColor: 'white',
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
  dateTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    color: '#716666',
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    paddingVertical: 16,
  },
  progressContainer: {
    overflow: 'hidden',
    height: 10,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  progressBackground: {
    height: 10,
    backgroundColor: '#E9E8E8',
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  progressBar: {
    height: '100%',
    borderTopRightRadius: 9,
    // borderBottomRightRadius: 9,
  },
});
