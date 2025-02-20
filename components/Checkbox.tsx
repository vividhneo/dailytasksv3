
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export default function Checkbox({ checked, onToggle }: CheckboxProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.checkbox,
        checked ? styles.checkedBox : styles.uncheckedBox
      ]}
    />
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
  },
  checkedBox: {
    backgroundColor: '#F25B38',
    borderColor: '#B64328',
  },
  uncheckedBox: {
    backgroundColor: '#EAEDFD',
    borderColor: '#809AF7',
  },
});
