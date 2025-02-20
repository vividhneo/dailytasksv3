
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import TaskInput from '../components/TaskInput';
import Task from '../components/Task';
import ProfileSelector from '../components/ProfileSelector';

interface TaskType {
  id: string;
  text: string;
  completed: boolean;
  profileId: string;
}

interface Profile {
  id: string;
  name: string;
}

export default function IndexScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: 'Personal' }
  ]);
  const [currentProfileId, setCurrentProfileId] = useState('1');

  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];
  const filteredTasks = tasks.filter(task => task.profileId === currentProfileId);

  const addTask = (text: string) => {
    setTasks([
      ...tasks,
      {
        id: Math.random().toString(),
        text,
        completed: false,
        profileId: currentProfileId
      }
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const createProfile = (name: string) => {
    const newProfile = {
      id: Math.random().toString(),
      name
    };
    setProfiles([...profiles, newProfile]);
    setCurrentProfileId(newProfile.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ProfileSelector
            currentProfile={currentProfile}
            profiles={profiles}
            onProfileChange={setCurrentProfileId}
            onCreateProfile={createProfile}
          />
        </View>
        <View style={styles.taskList}>
          {filteredTasks.map(task => (
            <Task
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={deleteTask}
            />
          ))}
        </View>
        <TaskInput onSubmit={addTask} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  taskList: {
    flex: 1,
  }
});
