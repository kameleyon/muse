import React from 'react';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import ChangePassword from './ChangePassword';

const SecuritySettings: React.FC = () => {
  return (
    <>
      {/* Import and use our enhanced ChangePassword component */}
      <div className="mb-6">
        <ChangePassword />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Additional Security Settings</CardTitle>
          <CardDescription>
            Enhance your account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-neutral-medium">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch id="2fa" />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium">Login Notifications</h4>
                <p className="text-sm text-neutral-medium">
                  Receive email notifications when your account is accessed from a new device
                </p>
              </div>
              <Switch id="loginNotifications" defaultChecked={true} />
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Recent Login Activity</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between items-center p-2 bg-neutral-light/10 rounded">
                <div>
                  <div className="font-medium">Chrome on Windows</div>
                  <div className="text-neutral-medium">United States · Current Session</div>
                </div>
                <div className="text-success text-xs">Active now</div>
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-light/10 rounded">
                <div>
                  <div className="font-medium">Safari on MacOS</div>
                  <div className="text-neutral-medium">United Kingdom · March 18, 2025</div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-6">Sign out</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SecuritySettings;
