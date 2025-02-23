import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { typography } from '../constants/theme';

interface TaskInputProps {
  onSubmit: (text: string) => void;
}

export default function TaskInput({ onSubmit }: TaskInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a task..."
        placeholderTextColor="#716666"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    color: '#716666',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderBottomColor: '#716666',
    fontFamily: typography.fontFamily.regular,
  },
});