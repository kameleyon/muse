import { NavigateFunction } from 'react-router-dom';

// Global reference to the navigate function from react-router-dom
let navigateRef: NavigateFunction | null = null;

/**
 * Set the navigate function reference
 * This should be called once when the app initializes
 */
export const setNavigate = (navigate: NavigateFunction): void => {
  navigateRef = navigate;
};

/**
 * Helper to use navigate function from anywhere in the app
 * No need to use the useNavigate hook in every component
 */
export const navigateTo = (path: string, options?: { replace?: boolean; state?: any }): void => {
  if (!navigateRef) {
    console.error('Navigation is not initialized');
    return;
  }
  
  navigateRef(path, options);
};
