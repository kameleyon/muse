import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Camera, Upload, X } from 'lucide-react';

interface UserProfile {
  id: string;
  display_name?: string;
  professional_title?: string;
  bio?: string;
  avatar_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  website_url?: string;
  expertise_areas?: string;
  credentials?: string;
  created_at: string;
  updated_at: string;
}

const UserProfileSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    professional_title: '',
    bio: '',
    twitter_url: '',
    linkedin_url: '',
    website_url: '',
    expertise_areas: '',
    credentials: ''
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setFormData({
          display_name: data.display_name || '',
          professional_title: data.professional_title || '',
          bio: data.bio || '',
          twitter_url: data.twitter_url || '',
          linkedin_url: data.linkedin_url || '',
          website_url: data.website_url || '',
          expertise_areas: data.expertise_areas || '',
          credentials: data.credentials || ''
        });
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user?.id,
          user_id: user?.id,
          display_name: user?.email?.split('@')[0] || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          setProfile(createdProfile);
          setFormData({
            display_name: createdProfile.display_name || '',
            professional_title: '',
            bio: '',
            twitter_url: '',
            linkedin_url: '',
            website_url: '',
            expertise_areas: '',
            credentials: ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          ...updateData
        });

      if (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
      } else {
        alert('Profile saved successfully!');
        loadUserProfile(); // Reload to get fresh data
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        alert('Failed to upload avatar. Please try again.');
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-assets')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        console.error('Error updating profile with avatar:', updateError);
        alert('Failed to update profile with avatar. Please try again.');
      } else {
        loadUserProfile(); // Reload to get fresh data
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getInitials = () => {
    if (formData.display_name) {
      return formData.display_name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Profile Information</h3>
        <p className="settings-form-description">Manage how your profile appears to others</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="settings-label">
              Display Name
            </label>
            <input
              type="text"
              name="display_name"
              className="settings-input"
              placeholder="Your display name"
              value={formData.display_name}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="settings-label">
              Professional Title
            </label>
            <input
              type="text"
              name="professional_title"
              className="settings-input"
              placeholder="e.g. Writer, Designer, Developer"
              value={formData.professional_title}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="settings-label">
              Bio / About Me
            </label>
            <textarea
              name="bio"
              className="settings-textarea"
              placeholder="Write a short bio about yourself"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Profile Picture</h3>
        <p className="settings-form-description">Upload an avatar to personalize your account</p>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="relative">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-semibold">
                {getInitials()}
              </div>
            )}
            
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          
          <div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploadingAvatar}
              />
              <Button variant="outline" size="sm" className="mb-2" disabled={uploadingAvatar}>
                <Upload className="h-4 w-4 mr-2" />
                {uploadingAvatar ? 'Uploading...' : 'Upload New Image'}
              </Button>
            </label>
            <p className="text-xs text-neutral-medium">
              Recommended: Square JPG or PNG, at least 200×200 pixels
            </p>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Social Media Connections</h3>
        <p className="settings-form-description">Connect your social media accounts</p>
        
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="settings-field-group">
            <label className="settings-label">
              Twitter / X
            </label>
            <input
              type="url"
              name="twitter_url"
              className="settings-input"
              placeholder="https://twitter.com/username"
              value={formData.twitter_url}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="settings-field-group">
            <label className="settings-label">
              LinkedIn
            </label>
            <input
              type="url"
              name="linkedin_url"
              className="settings-input"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin_url}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="settings-field-group">
            <label className="settings-label">
              Personal Website
            </label>
            <input
              type="url"
              name="website_url"
              className="settings-input"
              placeholder="https://example.com"
              value={formData.website_url}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Professional Credentials</h3>
        <p className="settings-form-description">Add your expertise areas and credentials</p>
        
        <div className="space-y-4 mt-4">
          <div className="settings-field-group">
            <label className="settings-label">
              Areas of Expertise
            </label>
            <input
              type="text"
              name="expertise_areas"
              className="settings-input"
              placeholder="e.g. Fiction Writing, Content Marketing, UX Design"
              value={formData.expertise_areas}
              onChange={handleInputChange}
            />
            <p className="text-xs text-neutral-medium mt-1">
              Separate multiple areas with commas
            </p>
          </div>
          
          <div className="settings-field-group">
            <label className="settings-label">
              Credentials & Certifications
            </label>
            <textarea
              name="credentials"
              className="settings-textarea"
              placeholder="List your relevant credentials, degrees, or certifications"
              value={formData.credentials}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </div>
      </div>
      
      <div className="settings-footer">
        <Button 
          variant="primary" 
          className="text-white"
          onClick={handleSaveProfile}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default UserProfileSettings;