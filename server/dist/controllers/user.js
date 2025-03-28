"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOnboardingData = exports.getUserAnalytics = exports.updatePreferences = exports.getPreferences = exports.uploadAvatar = exports.updatePassword = exports.updateProfile = exports.getProfile = void 0;
const supabase_1 = require("../services/supabase"); // Use supabaseAdmin
// Get user profile
const getProfile = async (req, res) => {
    try {
        // TODO: Implement profile retrieval logic
        const userId = req.user?.id;
        res.status(200).json({ message: `Get profile for user ${userId}` });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const updates = req.body;
        // TODO: Implement profile update logic
        res.status(200).json({ message: `Profile updated for user ${userId}`, updates });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateProfile = updateProfile;
// Update user password
const updatePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { currentPassword, newPassword } = req.body;
        // TODO: Implement password update logic
        res.status(200).json({ message: `Password updated for user ${userId}` });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updatePassword = updatePassword;
// Upload user avatar
const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user?.id;
        // TODO: Implement avatar upload logic
        res.status(200).json({ message: `Avatar uploaded for user ${userId}` });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.uploadAvatar = uploadAvatar;
// Get user preferences
const getPreferences = async (req, res) => {
    try {
        const userId = req.user?.id;
        // TODO: Implement preferences retrieval logic
        res.status(200).json({ message: `Get preferences for user ${userId}` });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getPreferences = getPreferences;
// Update user preferences
const updatePreferences = async (req, res) => {
    try {
        const userId = req.user?.id;
        const preferences = req.body;
        // TODO: Implement preferences update logic
        res.status(200).json({ message: `Preferences updated for user ${userId}`, preferences });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updatePreferences = updatePreferences;
// Get user analytics
const getUserAnalytics = async (req, res) => {
    try {
        const userId = req.user?.id;
        // TODO: Implement user analytics retrieval logic
        res.status(200).json({ message: `Get analytics for user ${userId}` });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserAnalytics = getUserAnalytics;
// Save onboarding data
const saveOnboardingData = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { primaryContentPurpose, mainGoals, contentFrequency, industry, customIndustry, writingStyle, aiAssistanceLevel } = req.body;
        // Update profile with onboarding data
        const { error } = await supabase_1.supabaseAdmin // Use supabaseAdmin
            .from('profiles')
            .update({
            primary_content_purpose: primaryContentPurpose,
            main_goals: mainGoals,
            content_frequency: contentFrequency,
            industry: industry,
            custom_industry: customIndustry,
            writing_style: writingStyle,
            ai_assistance_level: aiAssistanceLevel,
            updated_at: new Date()
        })
            .eq('id', userId);
        if (error)
            throw error;
        // Always return a complete JSON response, even if Supabase returns no data
        res.status(200).json({
            success: true,
            message: 'Onboarding data saved successfully'
        });
    }
    catch (error) {
        console.error('Error saving onboarding data:', error);
        res.status(500).json({ error: 'Failed to save onboarding data' });
    }
};
exports.saveOnboardingData = saveOnboardingData;
