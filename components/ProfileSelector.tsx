
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selector}>
        <Text style={styles.selectorText}>{currentProfile?.name || 'Personal'}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {profiles.map((profile) => (
              <TouchableOpacity
                key={profile.id}
                style={styles.profileItem}
                onPress={() => {
                  onProfileChange(profile.id);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.profileText}>{profile.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                const name = prompt('Enter profile name:');
                if (name) {
                  onCreateProfile(name);
                  setModalVisible(false);
                }
              }}
            >
              <Text style={styles.addButtonText}>+ Add New Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  profileItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileText: {
    fontSize: 16,
  },
  addButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
});
