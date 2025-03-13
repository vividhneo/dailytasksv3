import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileCreationModal from './ProfileCreationModal';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { typography } from '../../constants/theme';

// Import Profile type from TaskContext
interface Profile {
  id: string;
  name: string;
}

interface ProfileSelectorProps {
  profiles: Profile[];
  currentProfileId: string;
  onProfileSelect: (profileId: string) => void;
  onProfileCreate: (name: string) => void;
  logCloseAttempt?: (reason: string) => void;
}

export default function ProfileSelector({
  profiles,
  currentProfileId,
  onProfileSelect,
  onProfileCreate,
  logCloseAttempt
}: ProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [isInteractingWithInput, setIsInteractingWithInput] = useState(false);

  // Set isInteractingWithInput to true when profile creation modal is open
  useEffect(() => {
    if (showCreateProfile) {
      setIsInteractingWithInput(true);
      console.log('ProfileSelector: Setting isInteractingWithInput to true because modal is open');
    }
  }, [showCreateProfile]);

  const handleProfileSelectorClick = () => {
    console.log('ProfileSelector: handleProfileSelectorClick called, isInteractingWithInput:', isInteractingWithInput);
    
    // If user is interacting with input, don't toggle dropdown
    if (isInteractingWithInput) {
      console.log('ProfileSelector: Ignoring click because user is interacting with input');
      return;
    }
    
    setIsOpen(!isOpen);
    console.log('ProfileSelector: Toggling dropdown, new state:', !isOpen);
    
    if (isOpen && logCloseAttempt) {
      logCloseAttempt('Profile selector clicked while open');
    }
  };

  const handleProfileSelect = (profileId: string) => {
    onProfileSelect(profileId);
    setIsOpen(false);
    console.log('ProfileSelector: Profile selected, closing dropdown');
  };

  const handleCreateProfile = (name: string) => {
    onProfileCreate(name);
    setShowCreateProfile(false);
    setIsOpen(false);
    setIsInteractingWithInput(false);
    console.log('ProfileSelector: Profile created, closing modal and dropdown');
  };

  const handleInputFocus = () => {
    setIsInteractingWithInput(true);
    console.log('ProfileSelector: Input focused, setting isInteractingWithInput to true');
  };

  const handleInputBlur = () => {
    setIsInteractingWithInput(false);
    console.log('ProfileSelector: Input blurred, setting isInteractingWithInput to false');
  };

  const currentProfile = profiles.find(profile => profile.id === currentProfileId) || profiles[0];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={handleProfileSelectorClick}
        onPressIn={() => {
          console.log('ProfileSelector: Container touched');
          // Don't stop propagation here to allow the parent to handle the touch
        }}
      >
        <Text style={styles.selectorText}>{currentProfile?.name || 'Select Profile'}</Text>
        <View style={styles.iconContainer}>
          {isOpen ? (
            <ArrowDownIcon width={24} height={24} color="#716666" />

        ) : (
            <ArrowDownIcon width={24} height={24} color="#716666" />
          )}
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {profiles.map(profile => (
            <TouchableOpacity
              key={profile.id}
              style={[
                styles.option,
                profile.id === currentProfileId && styles.selectedOption
              ]}
              onPress={() => handleProfileSelect(profile.id)}
              onPressIn={(e: GestureResponderEvent) => {
                console.log('ProfileSelector: Profile option touched');
                e.stopPropagation();
              }}
            >
              <Text style={styles.optionText}>{profile.name}</Text>
              {profile.id === currentProfileId && (
                <Ionicons name="checkmark" size={16} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.createOption}
            onPress={() => {
              console.log('ProfileSelector: Create profile button pressed');
              setShowCreateProfile(true);
            }}
            onPressIn={(e: GestureResponderEvent) => {
              console.log('ProfileSelector: Create profile button touched');
              e.stopPropagation();
            }}
          >
            <Text style={styles.createOptionText}>Add Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      <ProfileCreationModal
        visible={showCreateProfile}
        onClose={() => {
          setShowCreateProfile(false);
          setIsInteractingWithInput(false);
          console.log('ProfileSelector: Modal closed, setting isInteractingWithInput to false');
        }}
        onCreateProfile={handleCreateProfile}
        onInputFocus={handleInputFocus}
        onInputBlur={handleInputBlur}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    minWidth: 120,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#716666',
    fontFamily: typography.fontFamily.medium,
  },
  iconContainer: {
    marginLeft: 40,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    minWidth: 150,
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
    fontFamily: typography.fontFamily.regular,
  },
  createOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  createOptionText: {
    fontSize: 14,
    color: '#000',
    fontFamily: typography.fontFamily.regular,
  },
}); 