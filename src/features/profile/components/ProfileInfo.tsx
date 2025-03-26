import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootState } from '@/store/store';
import { setUser } from '@/store/slices/authSlice';
import { addToast } from '@/store/slices/uiSlice';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import {
  Form,
  FormGroup,
  FormLabel,
  FormHint,
  FormError,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// Profile schema
const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').optional(),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileInfo: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
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

  return (
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
                  <span className="text-2xl font-medium text-white">
                    {user?.fullName
                      ? user.fullName.substring(0, 1)
                      : user?.email?.substring(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-secondary text-white p-1 rounded-full shadow-md"
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
              className="w-full px-3 py-2 rounded-md border border-neutral-light bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 h-24 resize-y"
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
  );
};

export default ProfileInfo;
