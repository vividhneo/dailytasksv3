import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform, TextInput, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../constants/theme';

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
  const [editingProfile, setEditingProfile] = useState<{ id: string; name: string } | null>(null);

  const handleRename = (id: string, newName: string) => {
    if (newName.trim()) {
      onRenameProfile(id, newName.trim());
      setEditingProfile(null);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onPress}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={onPress}
        >
          <View style={styles.centerContainer}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
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
                    {editingProfile && editingProfile.id === profile.id ? (
                      <TextInput
                        style={styles.input}
                        value={editingProfile.name}
                        onChangeText={(text) => setEditingProfile({ ...editingProfile, name: text })}
                        autoFocus
                        onBlur={() => handleRename(profile.id, editingProfile.name)}
                        onSubmitEditing={() => handleRename(profile.id, editingProfile.name)}
                      />
                    ) : (
                      <Text style={styles.profileText}>{profile.name}</Text>
                    )}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        onPress={() => setEditingProfile({ id: profile.id, name: profile.name })}
                      >
                        <Text style={styles.renameText}>Rename</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onDeleteProfile(profile.id)}>
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    marginHorizontal: 'auto',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
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
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  renameText: {
    color: '#007BFF',
    fontFamily: typography.fontFamily.semiBold,
  },
  deleteText: {
    color: 'red',
    fontFamily: typography.fontFamily.semiBold,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    flex: 1,
    marginRight: 10,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
  },
}); 