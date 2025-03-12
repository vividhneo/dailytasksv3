import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, isToday, startOfDay } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '../constants/theme';

interface DateNavigatorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  taskCount: number;
  completedCount: number;
}

export default function DateNavigator({ date, onDateChange, taskCount, completedCount }: DateNavigatorProps) {
  const isCurrentDay = isToday(startOfDay(date));
  const progress = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;

  return (

        <View style={styles.container}>
         <View style={styles.shadowContainer}>
          <LinearGradient
            colors={['rgb(234, 234, 234)', 'rgb(255, 255, 255)']}
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
                  }
                ]}
              />
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    height: 70,
    backgroundColor: 'white',
    borderRadius: 9,
    shadowColor: 'rgba(255, 255, 255, 1)',
    shadowOffset: {
      width: -10,
      height: -10,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    fontSize: 24,
    fontWeight: '600',
    fontFamily: typography.fontFamily.medium,
    color: '#716666',
    textAlign: 'center',
    paddingVertical: 16,
  },
  progressContainer: {
    overflow: 'hidden',
    height: 6,
    // borderBottomLeftRadius: 2,
    // borderBottomRightRadius: 9,
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#E9E8E8',
    // borderBottomLeftRadius: 9,
    // borderBottomRightRadius: 9,
  },
  progressBar: {
    height: 6,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});
