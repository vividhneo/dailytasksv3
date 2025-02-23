import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../constants/theme';

interface Profile {
  id: string;
  name: string;
}

interface ProfileSelectorProps {
  currentProfile: Profile;
  profiles: Profile[];
  isOpen: boolean;
  onPress: () => void;
  onProfileChange: (id: string) => void;
  onCreateProfile: (name: string) => void;
}

export default function ProfileSelector({ currentProfile, profiles, isOpen, onPress, onProfileChange, onCreateProfile }: ProfileSelectorProps) {
  const [newProfileModalVisible, setNewProfileModalVisible] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName.trim());
      setNewProfileName('');
      setNewProfileModalVisible(false);
    }
  };

  return (
    <View style={[styles.container, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={onPress}
      >
        <Text style={styles.profileName}>
          {currentProfile?.name || 'Select Profile'}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={14} 
          color="#716666" 
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {profiles.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={[
                styles.option,
                currentProfile?.id === profile.id && styles.selectedOption
              ]}
              onPress={() => {
                onProfileChange(profile.id);
              }}
            >
              <Text style={[
                styles.optionText,
                currentProfile?.id === profile.id && styles.selectedOptionText
              ]}>
                {profile.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setNewProfileModalVisible(true);
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            <Text style={[styles.addButtonText, { fontFamily: typography.fontFamily.regular }]}>New Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={newProfileModalVisible}
        onRequestClose={() => setNewProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter profile name"
              value={newProfileName}
              onChangeText={setNewProfileName}
              autoFocus
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setNewProfileModalVisible(false);
                  setNewProfileName('');
                }}
              >
                <Text style={[styles.buttonText, { fontFamily: typography.fontFamily.regular }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleCreateProfile}
              >
                <Text style={[styles.buttonText, { fontFamily: typography.fontFamily.regular }]}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  profileName: {
    fontSize: 14,
    color: '#716666',
    fontFamily: typography.fontFamily.regular,
    marginRight: 8,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 9999,
    elevation: 9999,
  },
  option: {
    padding: 12,
    borderRadius: 6,
  },
  selectedOption: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 16,
    color: '#716666',
    fontFamily: typography.fontFamily.regular,
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    marginTop: 4,
  },
  addButtonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#343a40',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f3f5',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
  },
});
