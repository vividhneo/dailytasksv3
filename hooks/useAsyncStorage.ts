import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const DEBUG = true;

function log(...args: any[]) {
  if (DEBUG) {
    console.log('[AsyncStorage]', ...args);
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
      log(`Loading value for key: ${key}`);
      const item = await AsyncStorage.getItem(key);
      log(`Loaded raw value:`, item);

      if (item) {
        const parsedValue = JSON.parse(item);
        log(`Parsed value for ${key}:`, parsedValue);
        setStoredValue(parsedValue);
      } else {
        log(`No stored value found for ${key}, using initial value:`, initialValue);
        await AsyncStorage.setItem(key, JSON.stringify(initialValue));
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(`[AsyncStorage] Error loading ${key}:`, error);
      setStoredValue(initialValue);
    } finally {
      setLoading(false);
    }
  }

  async function setValue(value: T) {
    try {
      log(`Setting value for ${key}:`, value);
      const jsonValue = JSON.stringify(value, (_, v) => 
        typeof v === 'string' && v.startsWith('"') ? JSON.parse(v) : v
      );
      await AsyncStorage.setItem(key, jsonValue);
      log(`Successfully stored value for ${key}`);
      setStoredValue(value);
    } catch (error) {
      console.error(`[AsyncStorage] Error saving ${key}:`, error);
    }
  }

  return { value: storedValue, setValue, loading };
}
