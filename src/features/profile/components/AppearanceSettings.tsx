import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const AppearanceSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how MagicMuse looks for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
            <p className="text-sm text-neutral-medium">
              MagicMuse uses a clean, light theme designed for optimal readability and reduced eye strain.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Font Size</h3>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Small</Button>
              <Button variant="primary" size="sm">Medium</Button>
              <Button variant="outline" size="sm">Large</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
