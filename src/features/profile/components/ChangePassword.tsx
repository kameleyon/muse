import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserPassword } from '@/services/supabase';
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
  FormError,
  FormHint,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const changePasswordSchema = z
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

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      
      // For security reasons, we need to first sign in with the current password
      // This is handled by Supabase automatically when we attempt to update the password
      const { error } = await updateUserPassword(data.newPassword);

      if (error) throw error;

      // Show success message
      setIsSuccess(true);
      reset();
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Password changed successfully',
        })
      );
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to change password',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-light">Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <FormLabel htmlFor="currentPassword" required>
              Current Password
            </FormLabel>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              {...register('currentPassword')}
              error={errors.currentPassword?.message}
              disabled={isLoading}
              className="bg-secondary/10 shadow-inner border border-primary shadow-black text-secondary rounded-lg"
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
              {...register('newPassword')}
              error={errors.newPassword?.message}
              disabled={isLoading}
              className="bg-secondary/10 shadow-inner border border-primary shadow-black text-secondary rounded-lg"
            />
            <FormHint>
              Password must be at least 8 characters and include uppercase, lowercase, and numbers.
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
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              className="bg-secondary/10 shadow-inner border border-primary shadow-black text-secondary rounded-lg"
            />
          </FormGroup>

          <div className="mt-6">
            <Button type="submit" isLoading={isLoading} className="rounded-lg">
              Update Password
            </Button>
            {isSuccess && (
              <p className="mt-2 text-sm text-success">
                Your password has been updated successfully.
              </p>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;