import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpWithEmail, sendEmailVerification, createProfileIfNotExists } from '@/services/supabase';
import { addToast } from '@/store/slices/uiSlice';
import { useAuthModal } from '@/context/AuthModalContext';

import {
  Form,
  FormGroup,
  FormLabel,
  FormError,
  FormHint,
} from '@/components/ui/Form';

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
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [debugError, setDebugError] = useState<string | null>(null);
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
      setDebugError(null);
      
      // Configure to require email verification
      const redirectUrl = `${window.location.origin}/auth/login`;
      
      // Pass full_name as user metadata to ensure it's saved in the Supabase user record
      // and properly propagated to the profile by the database trigger
      const { error: signUpError, data: signUpData } = await signUpWithEmail(
        data.email, 
        data.password,
        { 
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.fullName
          }
        }
      );

      if (signUpError) {
        setDebugError(`Registration Error: ${signUpError.message}`);
        console.error('Sign-up error details:', signUpError);
        throw signUpError;
      }

      // Create user profile using the provided full name and email.
      if (signUpData?.user?.id) {
        const { error: profileError } = await createProfileIfNotExists(signUpData.user.id, {
          full_name: data.fullName
        });

        if (profileError) {
          setDebugError(`Profile Creation Error: ${profileError.message}`);
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
      }

      // If email confirmation is required.
      setVerificationSent(true);
      setRegisteredEmail(data.email);
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Please check your email to verify your account.',
        })
      );
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
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

  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    
    try {
      setIsLoading(true);
      
      const redirectUrl = `${window.location.origin}/auth/login`;
      const { error } = await sendEmailVerification(registeredEmail, redirectUrl);
      
      if (error) throw error;
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Verification email has been resent.',
        })
      );
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to resend verification email',
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
    <div className="auth-overlay">
      <div className="auth-modal auth-modal-animate">
        <button className="auth-close" onClick={closeForm}>×</button>
        
        <div className="auth-logo-container">
          <img src="/mmlogo.png" alt="MagicMuse Logo" className="auth-logo" />
        </div>
        
        {verificationSent ? (
          <>
            <h1 className="auth-heading">Verify Your Email</h1>
            <p className="auth-subheading">
              We've sent a verification link to {registeredEmail}
            </p>
            
            <div className="flex flex-col items-center mb-6">
              <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-center text-sm">
                Please check your inbox and click the link to complete your registration.
                If you don't see the email, check your spam folder.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleGoToLogin}
                className="auth-button-secondary"
                style={{ 
                  borderRadius: '12px',
                  padding: '12px 24px',
                  border: '1px solid #bcb7af',
                  fontFamily: "'Comfortaa', cursive",
                  transition: 'all 0.2s ease'
                }}
              >
                Go to Login
              </button>
              <button 
                onClick={handleResendVerification}
                disabled={isLoading}
                className="auth-button"
                style={{ 
                  borderRadius: '12px',
                  padding: '12px 24px',
                  backgroundColor: '#ae5630',
                  color: '#EDEAE2',
                  fontFamily: "'Comfortaa', cursive",
                  border: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(61, 61, 58, 0.3)'
                }}
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="auth-heading">Create Your Account</h1>
            <p className="auth-subheading">Join MagicMuse to start your creative journey</p>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
              {debugError && (
                <div className="auth-error">
                  {debugError}
                </div>
              )}
              
              <div className="mb-4">
                <label className="auth-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="auth-input"
                  placeholder="John Doe"
                  {...register('fullName')}
                  disabled={isLoading}
                />
                {errors.fullName && (
                  <div className="auth-error">{errors.fullName.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="auth-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="auth-input"
                  placeholder="your@email.com"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="auth-error">{errors.email.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="auth-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={isLoading}
                />
                {errors.password && (
                  <div className="auth-error">{errors.password.message}</div>
                )}
                <div className="auth-hint">
                  Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                </div>
              </div>

              <div className="mb-4">
                <label className="auth-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <div className="auth-error">{errors.confirmPassword.message}</div>
                )}
              </div>

              <div className="auth-terms-container">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  className="auth-checkbox"
                  {...register('termsAccepted')}
                />
                <label
                  htmlFor="termsAccepted"
                  className="auth-terms-text"
                >
                  I accept the{' '}
                  <a href="/terms" className="auth-link" target="_blank">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="auth-link" target="_blank">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.termsAccepted && (
                <div className="auth-error">{errors.termsAccepted.message}</div>
              )}

              <button 
                type="submit" 
                disabled={isLoading} 
                className="auth-button"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <button 
                    type="button"
                    className="auth-link"
                    onClick={handleLogin}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
