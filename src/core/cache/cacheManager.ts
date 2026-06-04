import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppError } from '../error/AppError';

/**
 * Thin AsyncStorage wrapper that serialises/deserialises JSON automatically.
 * Replaces Hive from the Flutter kit.
 *
 * All methods are async and return typed values. Errors are surfaced as
 * `AppError` with code `'CACHE_ERROR'` so callers can handle them uniformly.
 */
export const cacheManager = {
  /**
   * Retrieve a cached value by key.
   * Returns `null` when the key does not exist.
   */
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      throw new AppError('CACHE_ERROR', `Failed to read cache key "${key}": ${String(error)}`);
    }
  },

  /**
   * Persist a value under the given key (JSON serialised).
   */
  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new AppError('CACHE_ERROR', `Failed to write cache key "${key}": ${String(error)}`);
    }
  },

  /**
   * Remove a single key from the cache.
   */
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw new AppError('CACHE_ERROR', `Failed to remove cache key "${key}": ${String(error)}`);
    }
  },

  /**
   * Wipe the entire AsyncStorage (use with caution).
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw new AppError('CACHE_ERROR', `Failed to clear cache: ${String(error)}`);
    }
  },
};
