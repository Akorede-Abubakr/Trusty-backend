import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { AuthService } from '../services/authService.js';
import {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
  validateChangePasswordInput,
} from '../validators/authValidator.js';
import { ENV } from '../config/env.js';

// Helper to set cookie
const sendTokenResponse = (res, statusCode, { user, token, message }) => {
  const options = {
    expires: new Date(Date.now() + ENV.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, options);

  return ApiResponse.success(res, {
    statusCode,
    message,
    data: {
      user,
      token,
    },
  });
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const validation = validateRegisterInput(req.body);
  if (!validation.isValid) {
    throw ApiError.unprocessable('Validation error', validation.errors);
  }

  const result = await AuthService.registerUser(req.body);
  return sendTokenResponse(res, 201, {
    user: result.user,
    token: result.token,
    message: 'User registered successfully',
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const validation = validateLoginInput(req.body);
  if (!validation.isValid) {
    throw ApiError.unprocessable('Validation error', validation.errors);
  }

  const result = await AuthService.loginUser(validation.sanitized);
  return sendTokenResponse(res, 200, {
    user: result.user,
    token: result.token,
    message: 'Logged in successfully',
  });
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Logged out successfully',
    data: null,
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await AuthService.getCurrentUser(req.user._id);

  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'Profile retrieved successfully',
    data: { user },
  });
});

/**
 * @desc    Forgot Password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const validation = validateForgotPasswordInput(req.body);
  if (!validation.isValid) {
    throw ApiError.unprocessable('Validation error', validation.errors);
  }

  const result = await AuthService.forgotPassword(validation.sanitized.email);

  return ApiResponse.success(res, {
    statusCode: 200,
    message: result.message,
    data: result.resetToken ? { resetToken: result.resetToken } : null,
  });
});

/**
 * @desc    Reset Password
 * @route   POST /api/auth/reset-password or POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token || req.body.token;
  const payload = {
    token,
    password: req.body.password,
  };

  const validation = validateResetPasswordInput(payload);
  if (!validation.isValid) {
    throw ApiError.unprocessable('Validation error', validation.errors);
  }

  const result = await AuthService.resetPassword({
    token: validation.sanitized.token,
    newPassword: validation.sanitized.password,
  });

  return sendTokenResponse(res, 200, {
    user: result.user,
    token: result.token,
    message: result.message,
  });
});

/**
 * @desc    Change password
 * @route   PATCH /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const validation = validateChangePasswordInput(req.body);
  if (!validation.isValid) {
    throw ApiError.unprocessable('Validation error', validation.errors);
  }

  const result = await AuthService.changePassword(req.user._id, validation.sanitized);

  return sendTokenResponse(res, 200, {
    user: result.user,
    token: result.token,
    message: result.message,
  });
});
