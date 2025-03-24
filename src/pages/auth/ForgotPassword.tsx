import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordForEmail } from '@/services/supabase';
import { addToast } from '@/store/slices/uiSlice';
import { useAuthModal } from '@/context/AuthModalContext';

import {
  Form,
  FormGroup,
  FormLabel,
  FormError,
  FormActions,
} from '@/components/ui/Form';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const dispatch = useDispatch();
  const { openForm, closeForm } = useAuthModal();

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

  const handleLogin = () => {
    openForm('login');
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal auth-modal-animate">
        <button className="auth-close" onClick={closeForm}>×</button>
        
        <div className="auth-logo-container">
          <img src="/mmlogo.png" alt="MagicMuse Logo" className="auth-logo" />
        </div>
        
        {isSubmitted ? (
          <>
            <h1 className="auth-heading">Check Your Email</h1>
            <p className="auth-subheading">
              We've sent a recovery link to {submittedEmail}
            </p>
            
            <div className="flex flex-col items-center mb-6">
              <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-center text-sm">
                Check your inbox and follow the instructions to reset your password.
                If you don't see the email, check your spam folder.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleLogin}
                className="auth-button-secondary"
              >
                Return to Login
              </button>
              <button 
                onClick={handleResendEmail}
                disabled={isLoading}
                className="auth-button"
              >
                {isLoading ? 'Sending...' : 'Resend Email'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="auth-heading">Reset Your Password</h1>
            <p className="auth-subheading">
              Enter your email and we'll send you a link to reset your password
            </p>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
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

              <button 
                type="submit" 
                disabled={isLoading} 
                className="auth-button"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="auth-footer">
                <p>
                  Remember your password?{' '}
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

export default ForgotPassword;