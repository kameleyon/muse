import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions

export const signUpWithEmail = async (email: string, password: string, options?: any) => {
  // Removed user metadata from signup options to avoid database errors;
  // profile creation will be handled separately.
  const signUpOptions = {
    emailRedirectTo: options?.emailRedirectTo || `${window.location.origin}/auth/login`
  };

  return await supabase.auth.signUp({
    email,
    password,
    options: signUpOptions
  });
};

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const signInWithMagicLink = async (email: string) => {
  return await supabase.auth.signInWithOtp({
    email
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

export const resetPasswordForEmail = async (email: string, redirectTo: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo
  });
};

export const updateUserPassword = async (password: string) => {
  return await supabase.auth.updateUser({
    password
  });
};

export const sendEmailVerification = async (email: string, redirectTo: string) => {
  return await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: redirectTo
    }
  });
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

// Content functions
export const getContents = async () => {
  return await supabase
    .from('contents')
    .select('*')
    .order('created_at', { ascending: false });
};

export const getContentById = async (id: string) => {
  return await supabase
    .from('contents')
    .select('*')
    .eq('id', id)
    .single();
};

export const createContent = async (content: any) => {
  return await supabase
    .from('contents')
    .insert([content]);
};

export const updateContent = async (id: string, updates: any) => {
  return await supabase
    .from('contents')
    .update(updates)
    .eq('id', id);
};

export const deleteContent = async (id: string) => {
  return await supabase
    .from('contents')
    .delete()
    .eq('id', id);
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
};

export const updateUserProfile = async (userId: string, updates: any) => {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
};

// Create profile if it doesn't exist - this helps with registration issues
export const createProfileIfNotExists = async (userId: string, userData = {}) => {
  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (!existingProfile) {
    // Create new profile
    return await supabase
      .from('profiles')
      .insert([{ 
        id: userId,
        created_at: new Date().toISOString(),
        ...userData 
      }]);
  }
  
  return { data: existingProfile, error: null };
};

export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });
    
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
    
  await updateUserProfile(userId, { avatar_url: urlData.publicUrl });
  
  return urlData.publicUrl;
};