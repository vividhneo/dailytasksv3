import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}

export default function Checkbox({ checked, onPress, disabled, style }: CheckboxProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={[styles.container, style]}
    >
      {checked && <View style={styles.checked} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#716666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: '#716666',
    borderRadius: 2,
  },
});
