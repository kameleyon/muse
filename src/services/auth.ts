// src/services/auth.ts

// Define expected user data structure (adjust as needed)
import { signOut as supabaseSignOut } from './supabase'; // Renamed to avoid naming conflict

// Define expected user data structure (adjust as needed)
interface User {
  id: string;
  name: string;
  email: string;
  // Add other relevant user fields (e.g., token, roles)
}

/**
 * Placeholder function for user login API call.
 * Replace with actual API call logic.
 * @param email User's email
 * @param password User's password
 * @returns Promise resolving to user data or rejecting with an error
 */
export const loginUser = async (email: string, password: string): Promise<User> => {
  console.log('Placeholder: loginUser called with', email, password);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate success/failure
  if (email === 'test@example.com' && password === 'password') {
    // Simulate successful login response
    return {
      id: 'user-123',
      name: 'Test User',
      email: email,
    };
  } else {
    // Simulate login failure
    throw new Error('Invalid credentials');
  }
};

/**
 * Placeholder function for user signup API call.
 * Replace with actual API call logic.
 * @param name User's full name
 * @param email User's email
 * @param password User's password
 * @returns Promise resolving to user data or rejecting with an error
 */
export const signupUser = async (name: string, email: string, password: string): Promise<User> => {
  console.log('Placeholder: signupUser called with', name, email, password);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate success/failure (e.g., check if email exists)
  if (email.includes('existing')) {
      throw new Error('Email already exists');
  } else {
      // Simulate successful signup response
      return {
          id: `user-${Date.now()}`, // Simple unique ID generation
          name: name,
          email: email,
      };
  }
};

/**
 * Logs the user out by calling Supabase signout and redirecting to the home page.
 */
export const logoutUser = async (): Promise<void> => {
  console.log('logoutUser called');
  try {
    const { error } = await supabaseSignOut();
    if (error) {
      console.error('Error logging out:', error);
      // Optionally handle the error, e.g., show a notification
    }
    // Redirect to the home page after successful logout or even if there's an error,
    // as the session might be invalid anyway.
    window.location.href = '/'; 
  } catch (err) {
    console.error('Unexpected error during logout:', err);
    // Fallback redirect in case of unexpected errors
    window.location.href = '/';
  }
};

// Add other auth-related service functions as needed (e.g., password reset, verify email)
