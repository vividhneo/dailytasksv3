import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const DEBUG = true;

function log(...args: any[]) {
  if (DEBUG) {
  }
}

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValue();
  }, []);

  async function loadValue() {
    try {
      const item = await AsyncStorage.getItem(key);

      if (item) {
        const parsedValue = JSON.parse(item);
        setStoredValue(parsedValue);
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(initialValue));
        setStoredValue(initialValue);
      }
    } catch (error) {
      setStoredValue(initialValue);
    } finally {
      setLoading(false);
    }
  }

  async function setValue(value: T) {
    try {
      const jsonValue = JSON.stringify(value, (_, v) => 
        typeof v === 'string' && v.startsWith('"') ? JSON.parse(v) : v
      );
      await AsyncStorage.setItem(key, jsonValue);
      setStoredValue(value);
    } catch (error) {
      console.error(`[AsyncStorage] Error saving ${key}:`, error);
    }
  }

  return { value: storedValue, setValue, loading };
}
