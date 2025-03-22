import express from 'express';
import * as authController from '../controllers/auth';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/magic-link', authController.sendMagicLink);
router.post('/reset-password', authController.requestPasswordReset);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh-token', authController.refreshToken);

export default router;