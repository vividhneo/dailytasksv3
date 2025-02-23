import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Platform, Dimensions } from 'react-native';
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
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const selectorRef = useRef<View>(null);

  // Measure the position of the selector button to position the dropdown
  useEffect(() => {
    if (isOpen && selectorRef.current) {
      selectorRef.current.measureInWindow((x, y, width, height) => {
        setDropdownLayout({ x, y, width, height });
      });
    }
  }, [isOpen]);

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName.trim());
      setNewProfileName('');
      setNewProfileModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View ref={selectorRef}>
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
      </View>

      {/* Profile Selection Dropdown */}
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
            <View 
              style={[
                styles.dropdownContainer,
                {
                  position: 'absolute',
                  top: dropdownLayout.y + dropdownLayout.height,
                  left: dropdownLayout.x,
                  width: dropdownLayout.width,
                  minWidth: 200,
                }
              ]}
            >
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
                      onPress();
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
                    onPress();
                    setNewProfileModalVisible(true);
                  }}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
                  <Text style={styles.addButtonText}>Add Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* New Profile Creation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={newProfileModalVisible}
        onRequestClose={() => setNewProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setNewProfileModalVisible(false)}
          >
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
                  <Text style={[styles.buttonText, { color: '#fff' }]}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 'auto',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  option: {
    padding: 10,
  },
  selectedOption: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 14,
    color: '#716666',
    fontFamily: typography.fontFamily.regular,
  },
  selectedOptionText: {
    color: '#B64328',
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e9ecef',
  },
  addButtonText: {
    marginLeft: 8,
    color: '#716666',
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#343a40',
    fontFamily: typography.fontFamily.semiBold,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
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
    fontFamily: typography.fontFamily.semiBold,
    color: '#343a40',
  },
});
