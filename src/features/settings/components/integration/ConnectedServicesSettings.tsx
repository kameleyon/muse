import React from 'react';
import { Button } from '@/components/ui/Button';
import { PlusCircle } from 'lucide-react';

const ConnectedServicesSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Cloud Storage Integration</h3>
        <p className="settings-form-description">Connect cloud storage services to MagicMuse</p>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#4285F4] rounded-lg flex items-center justify-center text-white mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 13L17 10L14 7V13Z" fill="white"/>
                    <path d="M7 13L4 10L7 7V13Z" fill="white"/>
                    <path d="M4 10L9 15H15L20 10L15 5H9L4 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Google Drive</p>
                  <p className="text-xs text-[#3d3d3a]">Connected as user@example.com</p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#0062ff] rounded-lg flex items-center justify-center text-white mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 15H5V9H19V15Z" fill="white"/>
                    <path d="M5 15L8 18H16L19 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M5 9L8 6H16L19 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Dropbox</p>
                  <p className="text-xs text-[#3d3d3a]">Connected as user@example.com</p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#28a8ea] rounded-lg flex items-center justify-center text-white mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6L3 11L12 16L21 11L12 6Z" fill="white"/>
                    <path d="M3 17L12 22L21 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">OneDrive</p>
                  <p className="text-xs text-[#3d3d3a]">Not connected</p>
                </div>
              </div>
              <div>
                <Button variant="primary" size="sm" className="text-white">Connect</Button>
              </div>
            </div>
          </div>
          
          <div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <PlusCircle size={16} />
              <span>Add New Service</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">CMS Connections</h3>
        <p className="settings-form-description">Connect content management systems</p>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#21759b] rounded-lg flex items-center justify-center text-white mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM3.5 12C3.5 8.4 5.5 5.2 8.5 3.8L8.7 4C8.9 4.2 9 4.5 9 5C9 5.5 9.5 6 10 6C10.5 6 11 6.5 11 7C11 7.5 10.5 8 10 8C9.5 8 9 8.5 9 9C9 9.5 9.5 10 10 10H11C12.5 10 13.5 11 13.5 12.5C13.5 13.5 13 14.4 12.1 14.8L12 14.9C12 15.9 11.5 16.8 10.7 17.3C14.8 17.2 18 14.9 18 12C18 9.8 16 8 13.5 8H13C12.8 8 12.6 7.9 12.5 7.8C12.2 7.5 12.3 7 12.6 6.8C13.3 6.3 13.7 5.5 13.7 4.7C13.7 4.3 13.6 3.9 13.4 3.6C16.5 5 18.5 8.3 18.5 12C18.5 17.2 15.6 21.7 10.5 22C10.8 21.6 11 21 11 20.5C11 19.1 9.9 18 8.5 18C8.3 18 8 18 7.8 18.1C7.3 18.3 6.7 18.1 6.4 17.7C5.9 16.9 5.9 15.9 6.4 15C6.6 14.7 6.9 14.5 7.2 14.3C7.6 14.1 7.9 13.7 7.9 13.2C7.9 12.3 8.7 11.5 9.6 11.5C11 11.5 12 10.5 12 9.1C12 8.3 11.5 7.6 10.8 7.3C10.5 7.2 10.1 7.2 9.9 7.4C9.7 7.6 9.4 7.7 9.1 7.7C8.8 7.7 8.5 7.6 8.3 7.4C8 7.1 8 6.6 8.3 6.3C8.5 6.1 8.7 6 9 6C9.3 6 9.5 5.8 9.5 5.5C9.5 5.2 9.3 5 9 5C8.5 5 8 4.5 8 4C8 3.7 8.2 3.4 8.4 3.2C5.3 4.6 3.5 8 3.5 12ZM10.5 20.5C10.5 20.8 10.3 21 10 21C6.4 20.5 3.5 16.7 3.5 12.1C3.5 11.1 3.7 10.1 4 9.2C4.8 9.8 5.8 10 6.7 9.8C7.2 9.7 7.7 9.8 8.1 10.1C8.5 10.4 8.7 10.9 8.7 11.4C8.7 11.7 8.5 11.9 8.2 11.9C8.1 11.9 7.9 11.9 7.7 11.9C7.3 11.9 7.1 12.1 7.1 12.5C7.1 12.9 7.3 13.1 7.7 13.1C8.1 13.1 8.5 13.3 8.7 13.7C8.9 14.1 8.9 14.5 8.7 14.9C8.4 15.3 8.2 15.8 8 16.3C8 16.7 8.2 17.1 8.5 17.3C8.8 17.5 9.3 17.5 9.7 17.3C9.9 17.2 10.1 17.1 10.2 17C10.4 17 10.5 17.2 10.5 17.4V20.5Z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">WordPress</p>
                  <p className="text-xs text-[#3d3d3a]">Not connected</p>
                </div>
              </div>
              <div>
                <Button variant="primary" size="sm" className="text-white">Connect</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#000000] rounded-lg flex items-center justify-center text-white mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6V18H12V20H3C2.4 20 2 19.6 2 19V5C2 4.4 2.4 4 3 4H12V6H4Z" fill="white"/>
                    <path d="M21 16V8C21 6.9 20.1 6 19 6H14V8H19V16H14V18H19C20.1 18 21 17.1 21 16Z" fill="white"/>
                    <path d="M15 12L10 8V10.5H3V13.5H10V16L15 12Z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Medium</p>
                  <p className="text-xs text-[#3d3d3a]">Connected as user@example.com</p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Social Media Platforms</h3>
        <p className="settings-form-description">Connect social media platforms for sharing</p>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#1DA1F2] rounded-lg flex items-center justify-center text-white mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 5.8C21.2 6.1 20.4 6.3 19.5 6.4C20.4 5.9 21.1 5 21.4 4C20.6 4.5 19.7 4.8 18.8 5C18 4.1 16.9 3.5 15.7 3.5C13.5 3.5 11.6 5.3 11.6 7.6C11.6 7.9 11.6 8.2 11.7 8.5C8.3 8.3 5.2 6.7 3.2 4.2C2.9 4.8 2.7 5.4 2.7 6.1C2.7 7.4 3.3 8.5 4.3 9.2C3.6 9.2 2.9 9 2.4 8.7V8.8C2.4 10.7 3.9 12.4 5.8 12.7C5.5 12.8 5.1 12.8 4.8 12.8C4.5 12.8 4.3 12.8 4 12.7C4.5 14.3 6 15.5 7.7 15.5C6.3 16.6 4.6 17.2 2.8 17.2C2.5 17.2 2.3 17.2 2 17.1C3.7 18.3 5.8 19 7.9 19C15.7 19 20 12.8 20 7.5C20 7.3 20 7.2 20 7C20.8 6.4 21.5 5.7 22 5.8Z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Twitter</p>
                  <p className="text-xs text-[#3d3d3a]">Not connected</p>
                </div>
              </div>
              <div>
                <Button variant="primary" size="sm" className="text-white">Connect</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#0077B5] rounded-lg flex items-center justify-center text-white mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H6.5V10H9V17ZM7.7 8.7C6.8 8.7 6 7.9 6 7C6 6.1 6.8 5.3 7.7 5.3C8.6 5.3 9.4 6.1 9.4 7C9.4 7.9 8.6 8.7 7.7 8.7ZM18 17H15.5V13.5C15.5 12.7 14.8 12 14 12C13.2 12 12.5 12.7 12.5 13.5V17H10V10H12.5V11.3C12.9 10.5 13.8 10 14.9 10C16.6 10 18 11.4 18 13.1V17Z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <p className="text-xs text-[#3d3d3a]">Connected as user@example.com</p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-footer">
        <Button variant="outline" className="mr-2">
          Refresh Connections
        </Button>
        <Button variant="primary" className="text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ConnectedServicesSettings;
