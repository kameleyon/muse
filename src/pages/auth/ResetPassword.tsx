import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserPassword, getCurrentUser } from '@/services/supabase';
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
  FormActions,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams<{ token: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        setIsCheckingToken(true);
        // Validate by checking if user is authenticated with this recovery token
        const { data, error } = await getCurrentUser();
        
        // If we can get the user, the token is valid
        if (data?.user && !error) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          dispatch(
            addToast({
              type: 'error',
              message: 'Invalid or expired password reset link',
            })
          );
        }
      } catch (error) {
        setIsValidToken(false);
        dispatch(
          addToast({
            type: 'error',
            message: 'Invalid or expired password reset link',
          })
        );
      } finally {
        setIsCheckingToken(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsValidToken(false);
      setIsCheckingToken(false);
    }
  }, [token, dispatch]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      
      // Update password using Supabase
      const { error } = await updateUserPassword(data.password);

      if (error) throw error;

      // Show success message
      setIsSubmitted(true);
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Password reset successfully',
        })
      );

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to reset password',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verifying Link</CardTitle>
          <CardDescription className="text-center">
            Please wait while we verify your password reset link...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!isValidToken) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Invalid Link</CardTitle>
          <CardDescription className="text-center">
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button variant="outline" asChild>
            <Link to="/auth/forgot-password">Request a new link</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Password Reset Complete</CardTitle>
          <CardDescription className="text-center">
            Your password has been reset successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-success mb-4"
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
          <p className="text-center text-neutral-medium mb-4">
            You will be redirected to the login page in a few seconds.
          </p>
          <Button asChild>
            <Link to="/auth/login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create new password</CardTitle>
        <CardDescription className="text-center">
          Please enter and confirm your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <FormLabel htmlFor="password" required>
              New Password
            </FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
              disabled={isLoading}
              className="bg-secondary/10    shadow-inner border border-primary shadow-black text-secondary rounded-lg"
            />
            <FormHint>
              Password must be at least 8 characters and include uppercase, lowercase, and numbers.
            </FormHint>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="confirmPassword" required>
              Confirm Password
            </FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              className="bg-secondary/10    shadow-inner border border-primary shadow-black text-secondary rounded-lg"
            />
          </FormGroup>

          <Button type="submit" fullWidth isLoading={isLoading} className="mt-6 rounded-lg">
            Reset Password
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;