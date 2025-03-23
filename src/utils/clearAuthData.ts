/**
 * Utility to completely clear all authentication and user data from localStorage
 * This can be used when authentication issues occur or for debugging
 */
export const clearAllAuthData = () => {
  console.log('Clearing all authentication and user data from localStorage');
  
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
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

export default clearAllAuthData;
