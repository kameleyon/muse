import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordForEmail } from '@/services/supabase';
import { addToast } from '@/store/slices/uiSlice';

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
  FormActions,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      
      // Use Supabase to send password reset email
      const { error } = await resetPasswordForEmail(
        data.email, 
        `${window.location.origin}/auth/reset-password`
      );

      if (error) throw error;

      // Show success message
      setIsSubmitted(true);
      setSubmittedEmail(data.email);
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Password reset link sent to your email',
        })
      );
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to send password reset email',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend of password reset email
  const handleResendEmail = async () => {
    if (!submittedEmail) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await resetPasswordForEmail(
        submittedEmail, 
        `${window.location.origin}/auth/reset-password`
      );

      if (error) throw error;
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Password reset link resent to your email',
        })
      );
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to resend password reset email',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent a password reset link to your email address.
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-center text-neutral-medium mb-4">
            Please check your inbox and follow the instructions to reset your password.
            If you don't receive an email within a few minutes, check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/auth/login">Return to Login</Link>
          </Button>
          <Button variant="secondary" onClick={handleResendEmail} isLoading={isLoading}>
            Resend Email
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <FormLabel htmlFor="email" required>
              Email
            </FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register('email')}
              error={errors.email?.message}
              disabled={isLoading}
              className="bg-secondary/10 dark:bg-secondary/10 shadow-inner border border-primary shadow-black text-secondary rounded-lg"
            />
          </FormGroup>

          <Button type="submit" fullWidth isLoading={isLoading} className="mt-6 rounded-lg">
            Send Reset Link
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-medium">
              Remember your password?{' '}
              <Link to="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;