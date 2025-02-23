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
      onSubmit(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a task..."
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
      />
      {/* <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    fontFamily: typography.fontFamily.regular,
    color: '#716666',
    paddingTop: 20,


  },
  buttonText: { 
    marginLeft: 10,
    fontFamily: typography.fontFamily.semiBold,
    color: '#716666',
  },
});