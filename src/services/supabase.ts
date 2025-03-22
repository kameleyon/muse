import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gzwcntyautnkwltepkys.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6d2NudHlhdXRua3dsdGVwa3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMDg5OTIsImV4cCI6MjA1NzU4NDk5Mn0.lI68rRljIVdsUIcvn5xzwA_OOiaPXtsrSW0PQ-nFRcs';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUpWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signInWithMagicLink = async (email: string) => {
  return await supabase.auth.signInWithOtp({
    email,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
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

export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });
    
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
    
  await updateUserProfile(userId, { avatar_url: urlData.publicUrl });
  
  return urlData.publicUrl;
};