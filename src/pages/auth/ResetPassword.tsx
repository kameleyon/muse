import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserPassword, getCurrentUser } from '@/services/supabase';
import { addToast } from '@/store/slices/uiSlice';
import { useAuthModal } from '@/context/AuthModalContext';

import {
  Form,
  FormGroup,
  FormLabel,
  FormError,
  FormHint,
  FormActions,
} from '@/components/ui/Form';

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
  const { openForm, closeForm } = useAuthModal();

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

  const handleLogin = () => {
    openForm('login');
  };
  
  const handleForgotPassword = () => {
    openForm('forgotPassword');
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal auth-modal-animate">
        <button className="auth-close" onClick={closeForm}>×</button>
        
        <div className="auth-logo-container">
          <img src="/mmlogo.png" alt="MagicMuse Logo" className="auth-logo" />
        </div>
        
        {isCheckingToken && (
          <>
            <h1 className="auth-heading">Verifying Link</h1>
            <p className="auth-subheading">Please wait while we verify your password reset link</p>
            
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </>
        )}

        {!isCheckingToken && !isValidToken && (
          <>
            <h1 className="auth-heading">Invalid Link</h1>
            <p className="auth-subheading">This password reset link is invalid or has expired</p>
            
            <button 
              onClick={handleForgotPassword}
              className="auth-button mt-6"
            >
              Request a new link
            </button>
          </>
        )}

        {!isCheckingToken && isValidToken && isSubmitted && (
          <>
            <h1 className="auth-heading">Password Reset Complete</h1>
            <p className="auth-subheading">Your password has been reset successfully</p>
            
            <div className="flex flex-col items-center mb-6">
              <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-center text-sm">
                You will be redirected to the login page in a few seconds.
              </p>
            </div>
            
            <button 
              onClick={handleLogin}
              className="auth-button"
            >
              Go to Login
            </button>
          </>
        )}

        {!isCheckingToken && isValidToken && !isSubmitted && (
          <>
            <h1 className="auth-heading">Create New Password</h1>
            <p className="auth-subheading">Enter and confirm your new password</p>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="auth-label" htmlFor="password">
                  New Password
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

              <button 
                type="submit" 
                disabled={isLoading} 
                className="auth-button"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;