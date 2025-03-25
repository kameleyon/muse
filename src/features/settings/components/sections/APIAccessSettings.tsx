import React from 'react';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

const APIAccessSettings: React.FC = () => {
  const [showAPIKey, setShowAPIKey] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">API Keys</h3>
        <p className="settings-form-description">Manage your API keys for programmatic access</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Your API Key</label>
            <div className="flex">
              <input
                type={showAPIKey ? "text" : "password"}
                className="settings-input flex-grow"
                defaultValue="mm-api-xxxx-yyyy-zzzz-abcdefghijklm"
                readOnly
              />
              <button 
                className="ml-2 p-2 bg-[#f9f7f1] border border-[#bcb7af] rounded-md hover:bg-[#edeae2] transition-colors"
                onClick={() => setShowAPIKey(!showAPIKey)}
                aria-label={showAPIKey ? "Hide API key" : "Show API key"}
              >
                {showAPIKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Copy API Key
            </Button>
            <Button variant="outline" size="sm">
              Regenerate API Key
            </Button>
          </div>
          
          <div className="text-xs text-[#3d3d3a] bg-[#f9f7f1] p-3 rounded-md border border-[#bcb7af]">
            <p>⚠️ Warning: Keep your API key secure. Anyone with your API key has full access to your account via the API. If you believe your API key has been compromised, regenerate it immediately.</p>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">API Usage</h3>
        <p className="settings-form-description">Monitor your API usage and limits</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Monthly Usage</label>
            <div className="mt-2">
              <div className="h-2 bg-[#bcb7af] rounded-full">
                <div className="h-full bg-[#ae5630] rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-[#3d3d3a] mt-1">
                <span>0</span>
                <span>4,500 / 10,000 requests</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="settings-label">Rate Limits</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f9f7f1] p-3 rounded-md border border-[#bcb7af]">
                <p className="text-sm font-medium">60 requests</p>
                <p className="text-xs text-[#3d3d3a]">Per minute</p>
              </div>
              <div className="bg-[#f9f7f1] p-3 rounded-md border border-[#bcb7af]">
                <p className="text-sm font-medium">10,000 requests</p>
                <p className="text-xs text-[#3d3d3a]">Per month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">API Access Control</h3>
        <p className="settings-form-description">Manage API access permissions</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Allowed Origins</label>
            <textarea
              className="settings-textarea"
              placeholder="Enter domain names, one per line (e.g., example.com)"
              defaultValue="localhost
example.com
app.example.com"
            ></textarea>
            <p className="text-xs text-[#3d3d3a] mt-1">
              Leave empty to allow requests from any origin
            </p>
          </div>
          
          <div>
            <label className="settings-label">IP Restrictions</label>
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable IP restrictions</span>
            </div>
            <textarea
              className="settings-textarea mt-2"
              placeholder="Enter IP addresses or CIDR ranges, one per line"
              disabled
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Webhook Configuration</h3>
        <p className="settings-form-description">Configure webhooks for event notifications</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Webhook URL</label>
            <input
              type="text"
              className="settings-input"
              placeholder="https://example.com/webhook"
            />
          </div>
          
          <div>
            <label className="settings-label">Events</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">content.created</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">content.updated</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">content.deleted</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">user.login</span>
              </label>
            </div>
          </div>
          
          <div>
            <Button variant="outline" size="sm">
              Test Webhook
            </Button>
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

export default APIAccessSettings;
