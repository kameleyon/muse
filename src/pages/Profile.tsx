import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootState } from '@/store/store';
import { setUser } from '@/store/slices/authSlice';
import { addToast } from '@/store/slices/uiSlice';
import useThemeStore from '@/store/themeStore';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import {
  Form,
  FormGroup,
  FormLabel,
  FormError,
  FormHint,
  FormActions,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';

// Profile schema
const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').optional(),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Password schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

// Notification preferences schema
const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  productUpdates: z.boolean().default(true),
  securityAlerts: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, toggleTheme } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      bio: 'AI enthusiast and content creator',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

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

  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call with a delay
      await new Promise((r) => setTimeout(r, 1000));
      
      // Update user in state
      if (user) {
        dispatch(
          setUser({
            ...user,
            fullName: data.fullName,
          })
        );
      }
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Profile updated successfully',
        })
      );
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to update profile',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password update
  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call with a delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Password updated successfully',
        })
      );
      
      resetPassword();
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to update password',
        })
      );
    } finally {
      setIsLoading(false);
    }
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Profile Settings</h1>
        <p className="text-neutral-medium max-w-3xl">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-64"
        >
          <Card>
            <CardContent className="p-4">
              <nav className="flex flex-col space-y-1">
                <button
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'bg-primary text-secondary'
                      : 'text-secondary dark:text-neutral-light hover:bg-neutral-light/20 dark:hover:bg-neutral-dark/50'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile Information
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'password'
                      ? 'bg-primary text-secondary'
                      : 'text-secondary dark:text-neutral-light hover:bg-neutral-light/20 dark:hover:bg-neutral-dark/50'
                  }`}
                  onClick={() => setActiveTab('password')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Security
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'notifications'
                      ? 'bg-primary text-secondary'
                      : 'text-secondary dark:text-neutral-light hover:bg-neutral-light/20 dark:hover:bg-neutral-dark/50'
                  }`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Notifications
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'appearance'
                      ? 'bg-primary text-secondary'
                      : 'text-secondary dark:text-neutral-light hover:bg-neutral-light/20 dark:hover:bg-neutral-dark/50'
                  }`}
                  onClick={() => setActiveTab('appearance')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.172 2.172a2 2 0 010 2.828l-8.486 8.486a4 4 0 01-5.656 0 2 2 0 010-2.828l8.486-8.486z"
                    />
                  </svg>
                  Appearance
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'subscription'
                      ? 'bg-primary text-secondary'
                      : 'text-secondary dark:text-neutral-light hover:bg-neutral-light/20 dark:hover:bg-neutral-dark/50'
                  }`}
                  onClick={() => setActiveTab('subscription')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Subscription
                </button>
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {/* Profile Information */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form onSubmit={handleSubmitProfile(onProfileSubmit)}>
                  <div className="flex items-center mb-6">
                    <div className="relative mr-4">
                      <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                        {user?.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.fullName || user.email}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-medium text-secondary">
                            {user?.fullName
                              ? user.fullName.substring(0, 1)
                              : user?.email.substring(0, 1).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-secondary dark:bg-neutral-dark text-white p-1 rounded-full shadow-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium">Profile Picture</h3>
                      <p className="text-sm text-neutral-medium">
                        JPG, GIF or PNG. Max size 2MB.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Upload New Image
                      </Button>
                    </div>
                  </div>

                  <FormGroup>
                    <FormLabel htmlFor="fullName" required>
                      Full Name
                    </FormLabel>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      {...registerProfile('fullName')}
                      error={errorsProfile.fullName?.message}
                      disabled={isLoading}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="email" required>
                      Email Address
                    </FormLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      {...registerProfile('email')}
                      error={errorsProfile.email?.message}
                      disabled={true}
                      rightIcon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-success"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      }
                    />
                    <FormHint>Email address cannot be changed</FormHint>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="bio">Bio</FormLabel>
                    <textarea
                      id="bio"
                      className="w-full px-3 py-2 rounded-md border border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark text-secondary dark:text-neutral-white focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 h-24 resize-y"
                      placeholder="Tell us about yourself..."
                      {...registerProfile('bio')}
                      disabled={isLoading}
                    />
                    {errorsProfile.bio?.message && (
                      <FormError>{errorsProfile.bio.message}</FormError>
                    )}
                    <FormHint>
                      Brief description for your profile. Maximum 200 characters.
                    </FormHint>
                  </FormGroup>

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="mt-6"
                  >
                    Save Changes
                  </Button>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Password/Security */}
          {activeTab === 'password' && (
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Update your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
                  <FormGroup>
                    <FormLabel htmlFor="currentPassword" required>
                      Current Password
                    </FormLabel>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword('currentPassword')}
                      error={errorsPassword.currentPassword?.message}
                      disabled={isLoading}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="newPassword" required>
                      New Password
                    </FormLabel>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword('newPassword')}
                      error={errorsPassword.newPassword?.message}
                      disabled={isLoading}
                    />
                    <FormHint>
                      Password must be at least 8 characters and include uppercase,
                      lowercase, and numbers.
                    </FormHint>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="confirmPassword" required>
                      Confirm New Password
                    </FormLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword('confirmPassword')}
                      error={errorsPassword.confirmPassword?.message}
                      disabled={isLoading}
                    />
                  </FormGroup>

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="mt-6"
                  >
                    Update Password
                  </Button>
                </Form>

                <div className="mt-8 pt-6 border-t border-neutral-light dark:border-neutral-dark">
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
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
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
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
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
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
                    <h3 className="text-lg font-medium mb-4">Theme</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Dark Mode</h4>
                        <p className="text-sm text-neutral-medium">
                          Toggle between light and dark mode
                        </p>
                      </div>
                      <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subscription */}
          {activeTab === 'subscription' && (
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription plan and billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-neutral-light/20 dark:bg-neutral-dark/50 p-4 rounded-md mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Current Plan</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold">Premium</h4>
                      <p className="text-sm text-neutral-medium">
                        $19.99/month, billed monthly
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Plan
                    </Button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Plan Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Unlimited content generation
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Access to all AI models
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Priority support
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Advanced export options
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Billing Information</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Next billing date</span>
                    <span className="text-sm font-medium">April 21, 2025</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm">Payment method</span>
                    <span className="text-sm font-medium">Visa ending in 4242</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Update Payment Method
                    </Button>
                    <Button variant="outline" size="sm">
                      Billing History
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-light dark:border-neutral-dark">
                  <Button variant="danger">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
