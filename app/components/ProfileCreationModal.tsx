import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  TouchableWithoutFeedback,
  Keyboard,
  GestureResponderEvent,
  Platform
} from 'react-native';

interface ProfileCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateProfile: (name: string) => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}

export default function ProfileCreationModal({
  visible,
  onClose,
  onCreateProfile,
  onInputFocus = () => {},
  onInputBlur = () => {},
}: ProfileCreationModalProps) {
  const [profileName, setProfileName] = useState('');
  const inputRef = useRef<TextInput>(null);
  const modalContentRef = useRef<View>(null);
  
  // Track touch events
  const touchStartedInContent = useRef(false);

  const log = (message: string, ...args: any[]) => {
    console.log(`[ProfileCreationModal] ${message}`, ...args);
  };

  // Log when visibility changes
  useEffect(() => {
    log(`Modal visibility changed to: ${visible}`);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      log('Modal became visible');
      // Focus the input when modal becomes visible
      setTimeout(() => {
        if (inputRef.current) {
          log('Focusing input field');
          inputRef.current.focus();
        }
      }, 100);
    } else {
      log('Modal became hidden');
      // Reset state when modal is closed
      setProfileName('');
    }
  }, [visible]);

  const handleCreateProfile = () => {
    log('Creating profile with name:', profileName);
    if (profileName.trim()) {
      onCreateProfile(profileName.trim());
      setProfileName('');
    }
  };

  const handleContentPress = (e: GestureResponderEvent) => {
    log('Modal content pressed');
    // Prevent event from bubbling up
    e.stopPropagation();
  };

  const handleContentTouchStart = (e: GestureResponderEvent) => {
    log('Touch started in modal content');
    touchStartedInContent.current = true;
    // Prevent event from bubbling up
    e.stopPropagation();
  };

  const handleOverlayPress = (e: GestureResponderEvent) => {
    log('Modal overlay pressed, touchStartedInContent:', touchStartedInContent.current);
    
    // Only close if the touch started outside the content
    if (!touchStartedInContent.current) {
      log('Closing modal from overlay press');
      Keyboard.dismiss();
      onClose();
    } else {
      log('Ignoring overlay press because touch started in content');
    }
    
    // Reset for next press
    touchStartedInContent.current = false;
  };

  // Special handling for web platform
  const handleInputFocus = () => {
    log('Input focused');
    onInputFocus();
    // On web, we need to make sure the event doesn't propagate
    if (Platform.OS === 'web') {
      // This helps prevent the dropdown from closing on web
      setTimeout(() => {
        log('Setting touchStartedInContent to true after focus');
        touchStartedInContent.current = true;
      }, 0);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        log('Modal back button pressed');
        onClose();
      }}
    >
      <TouchableWithoutFeedback 
        onPress={handleOverlayPress}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback 
            onPress={handleContentPress}
          >
            <View 
              ref={modalContentRef}
              style={styles.modalContent}
              onTouchStart={handleContentTouchStart}
            >
              <Text style={styles.modalTitle}>Create New Profile</Text>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Enter profile name"
                value={profileName}
                onChangeText={(text) => {
                  log('Profile name changed:', text);
                  setProfileName(text);
                }}
                autoFocus
                onFocus={handleInputFocus}
                onBlur={() => {
                  log('Input blurred');
                  onInputBlur();
                }}
                onPressIn={(e) => {
                  log('Input pressed in');
                  onInputFocus();
                  // Critical: stop propagation on press in
                  e.stopPropagation();
                }}
                // For web platform, we need to capture all touch events
                onTouchStart={(e) => {
                  log('Input touch start');
                  e.stopPropagation();
                }}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={(e) => {
                    log('Cancel button pressed');
                    // Stop propagation to prevent the dropdown from closing
                    if (e && e.stopPropagation) {
                      e.stopPropagation();
                    }
                    onClose();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.createButton]}
                  onPress={(e) => {
                    log('Create button pressed');
                    // Stop propagation to prevent the dropdown from closing
                    if (e && e.stopPropagation) {
                      e.stopPropagation();
                    }
                    handleCreateProfile();
                  }}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  createButton: {
    backgroundColor: '#E76F51',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 