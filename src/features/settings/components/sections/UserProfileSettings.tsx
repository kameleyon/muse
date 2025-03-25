import React from 'react';
import { Button } from '@/components/ui/Button';

const UserProfileSettings: React.FC = () => {
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
              className="settings-input"
              placeholder="Your display name"
              defaultValue="Arcanadraconi"
            />
          </div>
          
          <div>
            <label className="settings-label">
              Professional Title
            </label>
            <input
              type="text"
              className="settings-input"
              placeholder="e.g. Writer, Designer, Developer"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="settings-label">
              Bio / About Me
            </label>
            <textarea
              className="settings-textarea"
              placeholder="Write a short bio about yourself"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Profile Picture</h3>
        <p className="settings-form-description">Upload an avatar to personalize your account</p>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="w-20 h-20 rounded-full bg-[#6d371f] flex items-center justify-center text-white text-2xl">
            A
          </div>
          
          <div>
            <Button variant="outline" size="sm" className="mb-2">
              Upload New Image
            </Button>
            <p className="text-xs text-[#3d3d3a]">
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
              type="text"
              className="settings-input"
              placeholder="https://twitter.com/username"
            />
          </div>
          
          <div className="settings-field-group">
            <label className="settings-label">
              LinkedIn
            </label>
            <input
              type="text"
              className="settings-input"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          
          <div className="settings-field-group">
            <label className="settings-label">
              Personal Website
            </label>
            <input
              type="text"
              className="settings-input"
              placeholder="https://example.com"
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
              className="settings-input"
              placeholder="e.g. Fiction Writing, Content Marketing, UX Design"
            />
            <p className="text-xs text-[#3d3d3a] mt-1">
              Separate multiple areas with commas
            </p>
          </div>
          
          <div className="settings-field-group">
            <label className="settings-label">
              Credentials & Certifications
            </label>
            <textarea
              className="settings-textarea"
              placeholder="List your relevant credentials, degrees, or certifications"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Portfolio Showcase</h3>
        <p className="settings-form-description">Select projects to showcase on your profile</p>
        
        <div className="space-y-2 mt-4">
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox text-[#ae5630]" />
            <span className="ml-2">Fantasy Novel</span>
          </label>
          
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox text-[#ae5630]" />
            <span className="ml-2">Character Profiles</span>
          </label>
          
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox text-[#ae5630]" />
            <span className="ml-2">World Building</span>
          </label>
          
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox text-[#ae5630]" />
            <span className="ml-2">Plot Outline</span>
          </label>
        </div>
      </div>
      
      <div className="settings-footer">
        <Button variant="primary" className="text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default UserProfileSettings;