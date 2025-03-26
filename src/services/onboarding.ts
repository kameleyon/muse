import { supabase } from './supabase';

// Define the structure of the onboarding data payload
interface OnboardingData {
  primaryContentPurpose: string;
  mainGoals: string[];
  contentFrequency: string;
  industry: string;
  customIndustry?: string;
  writingStyle: {
    formal: number; // Assuming sliders provide numerical values (e.g., 0-100)
    technical: number;
    traditional: number;
    detailed: number;
  };
  aiAssistanceLevel: string;
}

/**
 * Saves the user's onboarding data to the backend.
 * @param data - The onboarding data collected from the modal.
 * @returns The response from the backend API.
 */
export const saveOnboardingData = async (data: OnboardingData) => {
  try {
    // Get the current session which includes the user ID
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error('Authentication error: Could not retrieve user session.');
    }

    if (!session) {
      throw new Error('Authentication error: User is not logged in.');
    }

    const userId = session.user.id;

    // Modified implementation to directly update Supabase profile
    // instead of calling the API endpoint, which seems to be unavailable (404)
    console.log('Saving onboarding data directly to Supabase for user:', userId);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        primary_content_purpose: data.primaryContentPurpose,
        main_goals: data.mainGoals,
        content_frequency: data.contentFrequency,
        industry: data.industry,
        custom_industry: data.customIndustry,
        writing_style: data.writingStyle,
        ai_assistance_level: data.aiAssistanceLevel,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(`Failed to save onboarding data: ${error.message}`);
    }

    // Return success response
    return { 
      success: true, 
      message: 'Onboarding data saved successfully' 
    };
    
  } catch (error) {
    console.error('Error in saveOnboardingData service:', error);
    // Re-throw the error so the component can handle it (e.g., show a message)
    throw error;
  }
};
