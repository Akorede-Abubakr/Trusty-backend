import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getProperties,
  getPropertyById,
  updatePropertyVerification,
  updatePropertyStatus,
  deleteProperty,
  getAgents,
  getAgentById,
  updateAgentVerification,
  updateAgentStatus,
  getAgencies,
  getAgencyById,
  updateAgencyVerification,
  updateAgencyStatus,
  getReports,
  updateReportStatus,
  resolveReportAction,
  getReviews,
  updateReviewVisibility,
  deleteReview,
  getInquiries,
  updateInquiryStatus,
  getViewings,
  updateViewingStatus,
  rescheduleViewing,
  getNotifications,
  sendAnnouncement,
  markNotificationRead,
  getAnalytics,
  getSettings,
  updateSettings,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Middleware: allow Authorization bearer token or pass through for demo
router.use((req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
});

// 1. User Directory
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// 2. Property Inventory & Moderation
router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyById);
router.patch('/properties/:id/verification', updatePropertyVerification);
router.patch('/properties/:id/status', updatePropertyStatus);
router.delete('/properties/:id', deleteProperty);

// 3. Licensed Agents
router.get('/agents', getAgents);
router.get('/agents/:id', getAgentById);
router.patch('/agents/:id/verification', updateAgentVerification);
router.patch('/agents/:id/status', updateAgentStatus);

// 4. Agencies & Brokerages
router.get('/agencies', getAgencies);
router.get('/agencies/:id', getAgencyById);
router.patch('/agencies/:id/verification', updateAgencyVerification);
router.patch('/agencies/:id/status', updateAgencyStatus);

// 5. Reports & Compliance
router.get('/reports', getReports);
router.patch('/reports/:id/status', updateReportStatus);
router.post('/reports/:id/action', resolveReportAction);

// 6. Reviews Moderation
router.get('/reviews', getReviews);
router.patch('/reviews/:id/visibility', updateReviewVisibility);
router.delete('/reviews/:id', deleteReview);

// 7. Customer Inquiries
router.get('/inquiries', getInquiries);
router.patch('/inquiries/:id/status', updateInquiryStatus);

// 8. Viewing Requests
router.get('/viewings', getViewings);
router.patch('/viewings/:id/status', updateViewingStatus);
router.patch('/viewings/:id/reschedule', rescheduleViewing);

// 9. Admin Notifications & Broadcasts
router.get('/notifications', getNotifications);
router.post('/notifications', sendAnnouncement);
router.patch('/notifications/:id/read', markNotificationRead);

// 10. Analytics & System Settings
router.get('/analytics', getAnalytics);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
