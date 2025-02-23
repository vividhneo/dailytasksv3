import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../constants/theme';

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
}

export default function Settings({ profiles, isOpen, onPress, onRenameProfile, onDeleteProfile }: SettingsProps) {
  const [editingProfile, setEditingProfile] = useState<{ id: string; name: string } | null>(null);

  const handleRename = (id: string, newName: string) => {
    if (newName.trim()) {
      onRenameProfile(id, newName.trim());
      setEditingProfile(null);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Ionicons name="settings-outline" size={16} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isOpen}
        onRequestClose={onPress}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={onPress}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Settings</Text>
                <TouchableOpacity onPress={onPress}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profiles</Text>
                {profiles.map(profile => (
                  <View key={profile.id} style={styles.profileContainer}>
                    <Text style={styles.profileText}>{profile.name}</Text>
                    <TouchableOpacity onPress={() => onRenameProfile(profile.id, 'New Name')}>
                      <Text style={styles.renameText}>Rename</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDeleteProfile(profile.id)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: 320,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.semiBold,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileText: {
    fontFamily: typography.fontFamily.regular,
  },
  renameText: {
    color: '#007BFF',
    fontFamily: typography.fontFamily.semiBold,
  },
  deleteText: {
    color: 'red',
    fontFamily: typography.fontFamily.semiBold,
  },
});
