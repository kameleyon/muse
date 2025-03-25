import React from 'react';
import { Button } from '@/components/ui/Button';

const AccountSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Account Information</h3>
        <p className="settings-form-description">Manage your account details</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="settings-label">Email Address</label>
            <input
              type="email"
              className="settings-input"
              defaultValue="user@example.com"
              disabled
            />
            <p className="text-xs text-[#3d3d3a] mt-1">
              To change your email, contact support
            </p>
          </div>
          
          <div>
            <label className="settings-label">Username</label>
            <input
              type="text"
              className="settings-input"
              defaultValue="arcanadraconi"
            />
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Password</h3>
        <p className="settings-form-description">Update your password</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Current Password</label>
            <input
              type="password"
              className="settings-input"
              placeholder="Enter your current password"
            />
          </div>
          
          <div>
            <label className="settings-label">New Password</label>
            <input
              type="password"
              className="settings-input"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="settings-label">Confirm New Password</label>
            <input
              type="password"
              className="settings-input"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Two-Factor Authentication</h3>
        <p className="settings-form-description">Add an extra layer of security to your account</p>
        
        <div className="space-y-4 mt-4">
          <div className="toggle-switch-container">
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Enable two-factor authentication</span>
          </div>
          
          <div>
            <Button variant="outline" size="sm">
              Set Up Two-Factor Authentication
            </Button>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Account Preferences</h3>
        <p className="settings-form-description">Configure account behavior</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Default Landing Page</label>
            <select className="settings-select">
              <option>Dashboard</option>
              <option>Projects</option>
              <option>Templates</option>
              <option>Content Generator</option>
            </select>
          </div>
          
          <div className="toggle-switch-container">
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Stay logged in on this device</span>
          </div>
          
          <div className="toggle-switch-container">
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Receive account-related emails</span>
          </div>
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

export default AccountSettings;
