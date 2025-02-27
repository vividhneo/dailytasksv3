import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define Profile interface
interface Profile {
  id: string;
  name: string;
}

interface SettingsProps {
  profiles: Profile[];
  isOpen: boolean;
  onPress: () => void;
  onRenameProfile: (id: string, name: string) => void;
  onDeleteProfile: (id: string) => void;
  children?: React.ReactNode;
}

export default function Settings({ 
  profiles, 
  isOpen, 
  onPress, 
  onRenameProfile, 
  onDeleteProfile,
  children
}: SettingsProps) {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.settingsButton}>
        {children || <Ionicons name="settings-outline" size={16} color="#666666" />}
      </TouchableOpacity>
      
      {/* ... rest of the component */}
    </>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    padding: 8,
  },
  // Add other styles as needed
}); 