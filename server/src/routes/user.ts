import express from 'express';
import * as userController from '../controllers/user';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.updatePassword);
router.post('/avatar', userController.uploadAvatar);

// User preferences
router.get('/preferences', userController.getPreferences);
router.put('/preferences', userController.updatePreferences);

// User analytics
router.get('/analytics', userController.getUserAnalytics);

// Onboarding data
router.patch('/profile/onboarding', userController.saveOnboardingData); // Add onboarding route

export default router;
