import { NavigateFunction } from 'react-router-dom';

// Store the navigate function when it becomes available
let navigateFunction: NavigateFunction | null = null;

/**
 * Sets the navigate function from a component
 * @param navigate - The navigate function from useNavigate hook
 */
export const setNavigate = (navigate: NavigateFunction) => {
  navigateFunction = navigate;
};

/**
 * Navigate to a new route
 * @param to - The path to navigate to
 * @param options - Navigation options
 */
export const navigate = (to: string, options?: any) => {
  if (navigateFunction) {
    navigateFunction(to, options);
  } else {
    console.error('Navigation function not set. Call setNavigate first.');
    // Fallback to window.location if navigate function is not available
    if (typeof window !== 'undefined') {
      window.location.href = to;
    }
  }
};
