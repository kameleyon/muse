import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearAuthData } from '@/utils/clearCache';
import { logout } from '@/store/slices/authSlice';
import { addToast } from '@/store/slices/uiSlice';

/**
 * Component that initializes app-wide settings and performs checks
 * This runs before authentication is initialized
 */
const AppInit: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for force logout parameter
    const urlParams = new URLSearchParams(window.location.search);
    const forceLogout = urlParams.get('forceLogout');
    
    if (forceLogout === 'true') {
      console.log('Force logout requested via URL parameter');
      
      // Clear all auth data
      const clearedCount = clearAuthData();
      
      // Update Redux state
      dispatch(logout());
      
      // Show notification
      dispatch(addToast({
        type: 'info',
        message: `You have been logged out completely. Cleared ${clearedCount} stored items.`,
        duration: 5000
      }));
      
      // Remove the parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('forceLogout');
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default AppInit;
