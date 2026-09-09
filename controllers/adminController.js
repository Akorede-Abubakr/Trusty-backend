import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AdminService } from '../services/adminService.js';

// ==================== USER MANAGEMENT ====================
export const getUsers = asyncHandler(async (req, res) => {
  const result = await AdminService.getUsers(req.query);
  return ApiResponse.success(res, { statusCode: 200, message: 'Users retrieved', data: result.users, meta: result.pagination });
});

export const getUserById = asyncHandler(async (req, res) => {
  const result = await AdminService.getUserById(req.params.id);
  return ApiResponse.success(res, { statusCode: 200, message: 'User details retrieved', data: result });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const updated = await AdminService.updateUserStatus(req.params.id, status);
  return ApiResponse.success(res, { statusCode: 200, message: `User status set to ${status}`, data: updated });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await AdminService.deleteUser(req.params.id);
  return ApiResponse.success(res, { statusCode: 200, message: result.message, data: null });
});

// ==================== PROPERTY MANAGEMENT & MODERATION ====================
export const getProperties = asyncHandler(async (req, res) => {
  const result = await AdminService.getProperties(req.query);
  return ApiResponse.success(res, { statusCode: 200, message: 'Properties retrieved', data: result.properties, meta: result.pagination });
});

export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await AdminService.getPropertyById(req.params.id);
  return ApiResponse.success(res, { statusCode: 200, message: 'Property details retrieved', data: property });
});

export const updatePropertyVerification = asyncHandler(async (req, res) => {
  const { verificationStatus, rejectionReason } = req.body;
  const property = await AdminService.updatePropertyVerification(req.params.id, { verificationStatus, rejectionReason });
  return ApiResponse.success(res, { statusCode: 200, message: `Property verification status updated`, data: property });
});

export const updatePropertyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const property = await AdminService.updatePropertyStatus(req.params.id, status);
  return ApiResponse.success(res, { statusCode: 200, message: `Property status set to ${status}`, data: property });
});

export const deleteProperty = asyncHandler(async (req, res) => {
  const result = await AdminService.deleteProperty(req.params.id);
  return ApiResponse.success(res, { statusCode: 200, message: result.message, data: null });
});

// ==================== AGENTS & AGENCIES ====================
export const getAgents = asyncHandler(async (req, res) => {
  const result = await AdminService.getAgents(req.query);
  return ApiResponse.success(res, { statusCode: 200, message: 'Agents retrieved', data: result.agents, meta: result.pagination });
});

export const getAgentById = asyncHandler(async (req, res) => {
  const result = await AdminService.getAgentById(req.params.id);
  return ApiResponse.success(res, { statusCode: 200, message: 'Agent details retrieved', data: result });
});

export const updateAgentVerification = asyncHandler(async (req, res) => {
  const { verificationStatus } = req.body;
  const agent = await AdminService.updateAgentVerification(req.params.id, verificationStatus);
  return ApiResponse.success(res, { statusCode: 200, message: `Agent verification updated`, data: agent });
});

export const updateAgentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const agent = await AdminService.updateAgentStatus(req.params.id, status);
  return ApiResponse.success(res, { statusCode: 200, message: `Agent status set to ${status}`, data: agent });
});

export const getAgencies = asyncHandler(async (req, res) => {
  const result = await AdminService.getAgencies(req.query);
  return ApiResponse.success(res, { statusCode: 200, message: 'Agencies retrieved', data: result.agencies, meta: result.pagination });
});

export const getAgencyById = asyncHandler(async (req, res) => {
  const result = await AdminService.getAgencyById(req.params.id);
  return ApiResponse.success(res, { statusCode: 200, message: 'Agency details retrieved', data: result });
});

export const updateAgencyVerification = asyncHandler(async (req, res) => {
  const { verificationStatus } = req.body;
  const agency = await AdminService.updateAgencyVerification(req.params.id, verificationStatus);
  return ApiResponse.success(res, { statusCode: 200, message: `Agency verification updated`, data: agency });
});

export const updateAgencyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const agency = await AdminService.updateAgencyStatus(req.params.id, status);
  return ApiResponse.success(res, { statusCode: 200, message: `Agency status set to ${status}`, data: agency });
});

// ==================== REPORTS & COMPLIANCE ====================
export const getReports = asyncHandler(async (req, res) => {
  const result = await AdminService.getReports(req.query);
  return ApiResponse.success(res, { statusCode: 200, message: 'Reports retrieved', data: result.reports, meta: result.pagination });
});

export const updateReportStatus = asyncHandler(async (req, res) => {
  const { status, resolutionNotes } = req.body;
  const report = await AdminService.updateReportStatus(req.params.id, { status, resolutionNotes });
  return ApiResponse.success(res, { statusCode: 200, message: `Report status updated to ${status}`, data: report });
});

export const resolveReportAction = asyncHandler(async (req, res) => {
  const { action, reason } = req.body;
  const report = await AdminService.resolveReportAction(req.params.id, { action, reason });
  return ApiResponse.success(res, { statusCode: 200, message: `Report action executed: ${action}`, data: report });
});

// ==================== REVIEWS MODERATION ====================
export const getReviews = asyncHandler(async (req, res) => {
  const result = await AdminService.getReviews(req.query);
  return ApiResponse.success(res, { statusCode: 200, message: 'Reviews retrieved', data: result.reviews, meta: result.pagination });
});

export const updateReviewVisibility = asyncHandler(async (req, res) => {
  const { isHidden } = req.body;
  const review = await AdminService.updateReviewVisibility(req.params.id, isHidden);
  return ApiResponse.success(res, { statusCode: 200, message: `Review visibility set to ${isHidden ? 'hidden' : 'visible'}`, data: review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const result = await AdminService.deleteReview(req.params.id);
  return ApiResponse.success(res, { statusCode: 200, message: result.message, data: null });
});

// ==================== CUSTOMER INQUIRIES ====================
export const getInquiries = asyncHandler(async (req, res) => {
  const result = await AdminService.getInquiries(req.query);
  return ApiResponse.success(res, { statusCode: 200, message: 'Inquiries retrieved', data: result.inquiries, meta: result.pagination });
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const inq = await AdminService.updateInquiryStatus(req.params.id, status);
  return ApiResponse.success(res, { statusCode: 200, message: `Inquiry status updated to ${status}`, data: inq });
});

// ==================== VIEWING REQUESTS ====================
export const getViewings = asyncHandler(async (req, res) => {
  const result = await AdminService.getViewings(req.query);
  return ApiResponse.success(res, { statusCode: 200, message: 'Viewings retrieved', data: result.viewings, meta: result.pagination });
});

export const updateViewingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const viewing = await AdminService.updateViewingStatus(req.params.id, status);
  return ApiResponse.success(res, { statusCode: 200, message: `Viewing status set to ${status}`, data: viewing });
});

export const rescheduleViewing = asyncHandler(async (req, res) => {
  const { date, time, notes } = req.body;
  const viewing = await AdminService.rescheduleViewing(req.params.id, { date, time, notes });
  return ApiResponse.success(res, { statusCode: 200, message: 'Viewing appointment rescheduled successfully', data: viewing });
});

// ==================== ADMIN NOTIFICATIONS ====================
export const getNotifications = asyncHandler(async (req, res) => {
  const result = await AdminService.getNotifications(req.query);
  return ApiResponse.success(res, { statusCode: 200, message: 'Notifications retrieved', data: result.notifications, meta: result.pagination });
});

export const sendAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, targetAudience, type, priority, recipientId, recipientName } = req.body;
  const notif = await AdminService.sendAnnouncement({ title, message, targetAudience, type, priority, recipientId, recipientName });
  return ApiResponse.created(res, { message: 'Announcement dispatched successfully', data: notif });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notif = await AdminService.markNotificationRead(req.params.id);
  return ApiResponse.success(res, { statusCode: 200, message: 'Notification marked as read', data: notif });
});

// ==================== ANALYTICS & SETTINGS ====================
export const getAnalytics = asyncHandler(async (req, res) => {
  const summary = await AdminService.getAnalyticsSummary();
  return ApiResponse.success(res, { statusCode: 200, message: 'Platform analytics aggregated', data: summary });
});

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await AdminService.getSettings();
  return ApiResponse.success(res, { statusCode: 200, message: 'Settings retrieved', data: settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { section, data } = req.body;
  const updated = await AdminService.updateSettings(section, data);
  return ApiResponse.success(res, { statusCode: 200, message: `Settings for '${section}' updated successfully`, data: updated });
});
