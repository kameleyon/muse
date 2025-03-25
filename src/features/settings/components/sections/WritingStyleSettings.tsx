import React from 'react';
import { Button } from '@/components/ui/Button';

const WritingStyleSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Personal Writing Style Learning</h3>
        <p className="settings-form-description">Configure how the AI learns and adapts to your writing style</p>
        
        {/* Content would go here - this is just a placeholder for now */}
        <div className="p-4 text-center text-gray-500">
          Writing Style Settings content would go here
        </div>
      </div>
      
      <div className="settings-footer">
        <Button variant="outline" className="mr-2">
          Reset to Default
        </Button>
        <Button variant="primary" className="text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default WritingStyleSettings;