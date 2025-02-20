
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

interface SwipeableDateProps {
  date: Date;
  onDateChange: (date: Date) => void;
  progress?: number;
}

export default function SwipeableDate({ date, progress = 0 }: SwipeableDateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{format(date, 'EEEE, MMMM d')}</Text>
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${progress}%` }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
