import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmail } from '@/services/supabase';
import { setUser, setSession } from '@/store/slices/authSlice';
import { addToast } from '@/store/slices/uiSlice';
import { useAuthModal } from '@/context/AuthModalContext';

import {
  Form,
  FormGroup,
  FormLabel,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openForm, closeForm } = useAuthModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setDebugError(null);
      
      const { data: authData, error } = await signInWithEmail(
        data.email,
        data.password
      );

      if (error) {
        setDebugError(`Login Error: ${error.message}`);
        throw error;
      }
      
      if (!authData || !authData.user || !authData.session) {
        throw new Error('Invalid response from server');
      }

      dispatch(setUser(authData.user));
      dispatch(setSession(authData.session.access_token));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Successfully logged in!',
        })
      );

      // Close the modal
      closeForm();
      
      // Redirect to app dashboard
      navigate('/app');
    } catch (error: any) {
      console.error('Login error:', error);
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to log in',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    openForm('forgotPassword');
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    openForm('register');
  };

  return (
    <div className="auth-modal auth-modal-animate">
      <button className="auth-close" onClick={closeForm}>×</button>
      
      <div className="auth-logo-container">
        <img src="/mmlogo.png" alt="MagicMuse Logo" className="auth-logo" />
      </div>
        
        <h1 className="auth-heading">Welcome Back!</h1>
        <p className="auth-subheading">Sign in to continue your journey</p>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          {debugError && (
            <div className="auth-error">
              {debugError}
            </div>
          )}
          
          <div className="mb-4">
            <label className="auth-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="auth-input"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <div className="auth-error">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-4">
            <div className="flex justify-between">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                className="auth-label-link"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="auth-input"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <div className="auth-error">{errors.password.message}</div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="auth-button"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="auth-social">
            <button
              type="button"
              className="auth-social-button"
            >
              <svg viewBox="0 0 24 24" className="auth-social-icon">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              className="auth-social-button"
            >
              <svg viewBox="0 0 24 24" className="auth-social-icon" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.756-1.332-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={handleRegister}
              >
                Sign up
              </button>
            </p>
          </div>
        </Form>
      </div>
  );
};

export default Login;
