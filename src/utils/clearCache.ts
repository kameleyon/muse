/**
 * Utility for clearing various types of browser storage
 */

import { supabase } from '@/services/supabase';
import { logout } from '@/store/slices/authSlice';

/**
 * Clear all authentication-related data from localStorage
 */
export const clearAuthData = () => {
  console.log('Clearing authentication-related data');
  
  try {
    // Clear auth token
    localStorage.removeItem('auth_token');
    
    // Clear all items that match our patterns
    const keysToRemove: string[] = [];
    
    // Find all keys to remove
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('magicmuse_') || 
        key.startsWith('sb-') || 
        key.includes('auth') ||
        key.includes('supabase')
      )) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all matched keys
    keysToRemove.forEach(key => {
      console.log(`Removing localStorage item: ${key}`);
      localStorage.removeItem(key);
    });
    
    console.log(`Cleared ${keysToRemove.length} items from localStorage`);
    return keysToRemove.length;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return 0;
  }
};

/**
 * Clear all localStorage
 */
export const clearAllLocalStorage = () => {
  console.log('Clearing all localStorage');
  
  try {
    const count = localStorage.length;
    localStorage.clear();
    console.log(`Cleared ${count} items from localStorage`);
    return count;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return 0;
  }
};

/**
 * Clear all browser storage (localStorage, sessionStorage, cookies)
 */
export const nuclearReset = async () => {
  console.log('Performing nuclear reset of all browser storage');
  
  try {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Unregister service workers if available
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
      console.log('Service workers unregistered');
    }

    // Clear Cache API if available
    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map(key => caches.delete(key)));
      console.log('Cache storage cleared');
    }
    
    console.log('Nuclear reset completed');
    return true;
  } catch (error) {
    console.error('Error during nuclear reset:', error);
    return false;
  }
};

/**
 * Perform a complete logout, clearing all auth data and invalidating the Supabase session
 */
export const completeLogout = async (dispatch: any) => {
  console.log('Performing complete logout');
  
  try {
    // Clear local auth data
    clearAuthData();
    
    // Sign out from Supabase to invalidate the session
    await supabase.auth.signOut();
    
    // Update Redux state
    if (dispatch) {
      dispatch(logout());
    }
    
    await nuclearReset();
    window.location.href = window.location.origin;
    console.log('Complete logout successful');
    return true;
  } catch (error) {
    console.error('Error during complete logout:', error);
    return false;
  }
};
