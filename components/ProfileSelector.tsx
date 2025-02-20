
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Profile {
  id: string;
  name: string;
}

interface ProfileSelectorProps {
  currentProfile: Profile;
  profiles: Profile[];
  onProfileChange: (profileId: string) => void;
  onCreateProfile: (name: string) => void;
}

export default function ProfileSelector({ currentProfile, profiles, onProfileChange, onCreateProfile }: ProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
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
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.selectorText}>{currentProfile?.name}</Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666"
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
                setIsOpen(false);
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
              setIsOpen(false);
              setNewProfileModalVisible(true);
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>New Profile</Text>
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
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleCreateProfile}
              >
                <Text style={styles.buttonText}>Create</Text>
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
    zIndex: 1000,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectorText: {
    fontSize: 16,
    color: '#343a40',
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  option: {
    padding: 12,
    borderRadius: 6,
  },
  selectedOption: {
    backgroundColor: '#e7f3ff',
  },
  optionText: {
    fontSize: 16,
    color: '#343a40',
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
