import type { ApplicationState } from '@/types';

const STORAGE_KEY = 'instanvi-app-state';

/**
 * Persistence service for managing localStorage operations
 */
export const persistenceService = {
  /**
   * Save application state to localStorage
   */
  save: (state: ApplicationState): void => {
    try {
      const stateWithTimestamp = {
        ...state,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithTimestamp));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
      // Handle quota exceeded or other errors gracefully
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider clearing old data.');
      }
    }
  },

  /**
   * Load application state from localStorage
   */
  load: (): ApplicationState | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return null;
      }
      return JSON.parse(data) as ApplicationState;
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      return null;
    }
  },

  /**
   * Clear persisted state
   */
  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable: (): boolean => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};

