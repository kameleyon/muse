import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpWithEmail } from '@/services/supabase';
import { addToast } from '@/store/slices/uiSlice';
import { useAuthModal } from '@/context/AuthModalContext';

import {
  CardHeader,
  CardTitle,
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

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openForm, closeForm } = useAuthModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      
      // Configure to require email verification
      const options = {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/login`
      };
      
      const { error } = await signUpWithEmail(data.email, data.password, options);

      if (error) throw error;

      // If email confirmation is required
      setVerificationSent(true);
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Please check your email to verify your account.',
        })
      );
      
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to create account',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    openForm('login');
  };

  const handleGoToLogin = () => {
    closeForm();
    setTimeout(() => {
      openForm('login');
    }, 300);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-light text-center">Create Your Account</CardTitle>
      </CardHeader>
      <CardContent>
        {verificationSent ? (
          <div className="text-center space-y-4">
            <div className="mx-auto bg-primary/20 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Verify your email</h3>
            <p className="text-neutral-medium">
              We've sent a verification link to your email address.
              Please check your inbox and click the link to complete your registration.
            </p>
            <div className="pt-4">
              <Button variant="outline" onClick={handleGoToLogin}>
                Go to Login
              </Button>
            </div>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <FormLabel htmlFor="fullName" required>
                Full Name
              </FormLabel>
              <Input
                id="fullName"
                type="text"
                className="bg-secondary/10 dark:bg-secondary/10 shadow-inner border border-primary shadow-black text-secondary rounded-lg"
                placeholder="John Doe"
                {...register('fullName')}
                error={errors.fullName?.message}
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="email" required>
                Email
              </FormLabel>
              <Input
                id="email"
                type="email"
                className="bg-secondary/10 dark:bg-secondary/10 shadow-inner border border-primary shadow-black text-secondary rounded-lg"
                placeholder="example@email.com"
                {...register('email')}
                error={errors.email?.message}
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="password" required>
                Password
              </FormLabel>
              <Input
                id="password"
                type="password"
                className="bg-secondary/10 dark:bg-secondary/10 shadow-inner border border-primary shadow-black text-secondary rounded-lg"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                disabled={isLoading}
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
                className="bg-secondary/10 dark:bg-secondary/10 shadow-inner border border-primary shadow-black text-secondary rounded-lg"
                placeholder="••••••••"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  className="rounded border-neutral-light text-primary focus:ring-primary"
                  {...register('termsAccepted')}
                />
                <label
                  htmlFor="termsAccepted"
                  className="text-sm text-neutral-medium"
                >
                  I accept the{' '}
                  <a href="/terms" className="text-primary hover:underline" target="_blank">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-primary hover:underline" target="_blank">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.termsAccepted && (
                <FormError>{errors.termsAccepted.message}</FormError>
              )}
            </FormGroup>

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
              Create Account
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-medium">
                Already have an account?{' '}
                <button 
                  type="button"
                  className="text-primary hover:underline"
                  onClick={handleLogin}
                >
                  Sign in
                </button>
              </p>
            </div>
          </Form>
        )}
      </CardContent>
    </div>
  );
};

export default Register;