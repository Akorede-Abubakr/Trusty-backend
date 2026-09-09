import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

// Public authentication routes (with rate limiting)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);

// Protected routes (require JWT)
router.get('/me', protect, getMe);
router.patch('/change-password', protect, changePassword);

// Role test / verification route for RBAC testing
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Welcome Admin! Access granted.', user: req.user });
});

router.get('/agent-agency-only', protect, authorize('agent', 'agency', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Welcome Real Estate Professional! Access granted.', user: req.user });
});

export default router;
