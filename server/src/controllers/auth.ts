import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { supabaseClient } from '../services/supabase';
import { ApiError } from '../middleware/error';
import logger from '../utils/logger';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, fullName } = req.body;

  if (!email || !password) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Email and password are required'));
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
    },
  });

  if (error) {
    logger.error(`Registration error: ${error.message}`);
    return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: data.user,
      session: data.session,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Email and password are required'));
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    logger.warn(`Login failed for ${email}: ${error.message}`);
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials'));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      user: data.user,
      session: data.session,
    },
  });
});

/**
 * @desc    Send magic link
 * @route   POST /api/auth/magic-link
 * @access  Public
 */
export const sendMagicLink = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Email is required'));
  }

  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
  });

  if (error) {
    logger.error(`Magic link error for ${email}: ${error.message}`);
    return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Magic link sent to your email',
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: req.user,
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    logger.error(`Logout error: ${error.message}`);
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Refresh token is required'));
  }

  const { data, error } = await supabaseClient.auth.refreshSession({
    refresh_token,
  });

  if (error) {
    logger.error(`Token refresh error: ${error.message}`);
    return next(new ApiError(StatusCodes.UNAUTHORIZED, error.message));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      user: data.user,
      session: data.session,
    },
  });
});

/**
 * @desc    Request password reset
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const requestPasswordReset = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Email is required'));
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

  if (error) {
    logger.error(`Password reset request error for ${email}: ${error.message}`);
    return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Password reset email sent',
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Password is required'));
  }

  if (!token) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Reset token is required'));
  }

  const { error } = await supabaseClient.auth.updateUser({
    password,
  });

  if (error) {
    logger.error(`Password reset error: ${error.message}`);
    return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Password reset successful',
  });
});