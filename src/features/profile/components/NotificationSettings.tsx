import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addToast } from '@/store/slices/uiSlice';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Form } from '@/components/ui/Form';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';

// Notification preferences schema
const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  productUpdates: z.boolean().default(true),
  securityAlerts: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

const NotificationSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Notification form
  const {
    register: registerNotifications,
    handleSubmit: handleSubmitNotifications,
    formState: { errors: errorsNotifications },
    setValue: setNotificationValue,
    watch: watchNotifications,
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      productUpdates: true,
      securityAlerts: true,
      marketingEmails: false,
    },
  });

  // Toggle notification preference
  const toggleNotification = (field: keyof NotificationFormData) => {
    setNotificationValue(field, !watchNotifications(field));
  };

  // Handle notification preferences update
  const onNotificationsSubmit = async (data: NotificationFormData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call with a delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Notification preferences updated',
        })
      );
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to update notification preferences',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how we contact you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleSubmitNotifications(onNotificationsSubmit)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-neutral-medium">
                  Receive email notifications
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={watchNotifications('emailNotifications')}
                onCheckedChange={() =>
                  toggleNotification('emailNotifications')
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Product Updates</h4>
                <p className="text-sm text-neutral-medium">
                  Receive updates about new features and improvements
                </p>
              </div>
              <Switch
                id="productUpdates"
                checked={watchNotifications('productUpdates')}
                onCheckedChange={() => toggleNotification('productUpdates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Security Alerts</h4>
                <p className="text-sm text-neutral-medium">
                  Receive alerts about security incidents and unusual activity
                </p>
              </div>
              <Switch
                id="securityAlerts"
                checked={watchNotifications('securityAlerts')}
                onCheckedChange={() => toggleNotification('securityAlerts')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Emails</h4>
                <p className="text-sm text-neutral-medium">
                  Receive marketing emails and promotional offers
                </p>
              </div>
              <Switch
                id="marketingEmails"
                checked={watchNotifications('marketingEmails')}
                onCheckedChange={() => toggleNotification('marketingEmails')}
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="mt-6"
          >
            Save Preferences
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
