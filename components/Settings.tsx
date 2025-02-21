
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Profile {
  id: string;
  name: string;
}

interface SettingsProps {
  profiles: Profile[];
  onRenameProfile: (id: string, newName: string) => void;
  onDeleteProfile: (id: string) => void;
}

export default function Settings({ profiles, onRenameProfile, onDeleteProfile }: SettingsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [renamingProfile, setRenamingProfile] = useState<{id: string, name: string} | null>(null);
  const [newName, setNewName] = useState('');

  const handleRename = () => {
    if (renamingProfile && newName.trim()) {
      onRenameProfile(renamingProfile.id, newName.trim());
      setRenamingProfile(null);
      setNewName('');
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.iconButton}>
        <Ionicons name="settings-outline" size={24} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Profiles</Text>
            {profiles.map((profile) => (
              <View key={profile.id} style={styles.profileItem}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <View style={styles.profileActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      setRenamingProfile(profile);
                      setNewName(profile.name);
                    }}
                  >
                    <Text style={styles.actionButtonText}>Rename</Text>
                  </TouchableOpacity>
                  {profile.id !== '1' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => onDeleteProfile(profile.id)}
                    >
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!renamingProfile}
        onRequestClose={() => setRenamingProfile(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Profile</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new name"
              autoFocus
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setRenamingProfile(null);
                  setNewName('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.renameButton]}
                onPress={handleRename}
              >
                <Text style={styles.buttonText}>Rename</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#343a40',
  },
  closeButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  profileName: {
    fontSize: 16,
    color: '#343a40',
  },
  profileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f1f3f5',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#343a40',
  },
  deleteButton: {
    backgroundColor: '#ffe3e3',
  },
  deleteButtonText: {
    color: '#e03131',
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
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#f1f3f5',
  },
  renameButton: {
    backgroundColor: '#339af0',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
});
