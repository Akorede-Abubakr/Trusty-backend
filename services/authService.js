import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { sendEmail } from '../utils/sendEmail.js';
import { ENV } from '../config/env.js';
import { isDbConnected } from '../config/db.js';

// In-Memory fallback store when MongoDB Atlas connection is pending IP whitelisting
const memoryUsers = new Map();

const generateAuthToken = (userObj) => {
  return jwt.sign(
    {
      id: userObj._id || userObj.id,
      email: userObj.email,
      role: userObj.role,
      fullName: `${userObj.firstName} ${userObj.lastName}`,
    },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRE }
  );
};

export class AuthService {
  /**
   * Register a new user
   */
  static async registerUser(userData) {
    const { firstName, lastName, email, password, role = 'buyer', phone, location, bio } = userData;

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw ApiError.conflict('An account with this email address is already registered.');
      }

      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
        phone: phone || '',
        location: location || {},
        bio: bio || '',
        verificationStatus: role === 'agent' || role === 'agency' ? 'pending' : 'unverified',
      });

      const token = user.generateAuthToken();
      return {
        user: user.toJSON(),
        token,
      };
    }

    // In-memory fallback
    if (memoryUsers.has(email.toLowerCase())) {
      throw ApiError.conflict('An account with this email address is already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser = {
      _id: userId,
      id: userId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone || '',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      location: location || { city: '', state: '', country: 'United States' },
      bio: bio || '',
      verificationStatus: role === 'agent' || role === 'agency' ? 'pending' : 'unverified',
      accountStatus: 'active',
      notificationPreferences: { email: true, sms: false, push: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryUsers.set(email.toLowerCase(), newUser);

    const safeUser = { ...newUser };
    delete safeUser.password;

    const token = generateAuthToken(safeUser);
    return {
      user: safeUser,
      token,
    };
  }

  /**
   * Login user with credentials
   */
  static async loginUser({ email, password }) {
    if (isDbConnected()) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw ApiError.unauthorized('Invalid email or password credentials');
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        throw ApiError.unauthorized('Invalid email or password credentials');
      }

      if (user.accountStatus !== 'active') {
        throw ApiError.forbidden(`Account is ${user.accountStatus}. Please contact TRUSTY support.`);
      }

      const token = user.generateAuthToken();
      return {
        user: user.toJSON(),
        token,
      };
    }

    // In-memory fallback
    const user = memoryUsers.get(email.toLowerCase());
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password credentials');
    }

    if (user.accountStatus !== 'active') {
      throw ApiError.forbidden(`Account is ${user.accountStatus}. Please contact TRUSTY support.`);
    }

    const safeUser = { ...user };
    delete safeUser.password;

    const token = generateAuthToken(safeUser);
    return {
      user: safeUser,
      token,
    };
  }

  /**
   * Fetch current authenticated user profile
   */
  static async getCurrentUser(userId) {
    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        throw ApiError.notFound('User profile not found');
      }
      return user.toJSON();
    }

    // Search in-memory
    for (const u of memoryUsers.values()) {
      if (u._id === userId || u.id === userId) {
        const safeUser = { ...u };
        delete safeUser.password;
        return safeUser;
      }
    }

    throw ApiError.notFound('User profile not found');
  }

  /**
   * Initiate forgot password flow
   */
  static async forgotPassword(email) {
    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email });
    } else {
      user = memoryUsers.get(email.toLowerCase());
    }

    if (!user) {
      return {
        message: 'If an account with that email exists, password reset instructions have been sent.',
      };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expireTime = Date.now() + 30 * 60 * 1000;

    if (isDbConnected()) {
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = expireTime;
      await user.save({ validateBeforeSave: false });
    } else {
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = expireTime;
    }

    const resetUrl = `${ENV.CLIENT_URL}/reset-password?token=${rawToken}`;
    const messageHtml = `
      <h1>Password Reset Request</h1>
      <p>Hello ${user.firstName},</p>
      <p>You requested a password reset for your TRUSTY Real Estate account.</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>Token: <strong>${rawToken}</strong></p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'TRUSTY Real Estate - Password Reset Request',
        html: messageHtml,
        text: `Reset your password at: ${resetUrl} (Token: ${rawToken})`,
      });

      return {
        message: 'Password reset link sent to your email',
        resetToken: rawToken,
      };
    } catch (error) {
      throw ApiError.internal('Email could not be dispatched. Please try again.');
    }
  }

  /**
   * Reset user password using token
   */
  static async resetPassword({ token, newPassword }) {
    if (!token) {
      throw ApiError.badRequest('Password reset token is required');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    if (isDbConnected()) {
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        throw ApiError.badRequest('Password reset token is invalid or has expired');
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      const authToken = user.generateAuthToken();
      return {
        user: user.toJSON(),
        token: authToken,
        message: 'Password has been reset successfully',
      };
    }

    // In-memory lookup
    let targetUser = null;
    for (const u of memoryUsers.values()) {
      if (u.resetPasswordToken === hashedToken && u.resetPasswordExpire > Date.now()) {
        targetUser = u;
        break;
      }
    }

    if (!targetUser) {
      throw ApiError.badRequest('Password reset token is invalid or has expired');
    }

    const salt = await bcrypt.genSalt(10);
    targetUser.password = await bcrypt.hash(newPassword, salt);
    targetUser.resetPasswordToken = undefined;
    targetUser.resetPasswordExpire = undefined;

    const safeUser = { ...targetUser };
    delete safeUser.password;

    const authToken = generateAuthToken(safeUser);
    return {
      user: safeUser,
      token: authToken,
      message: 'Password has been reset successfully',
    };
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(userId, { currentPassword, newPassword }) {
    if (isDbConnected()) {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw ApiError.notFound('User profile not found');
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        throw ApiError.badRequest('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      const authToken = user.generateAuthToken();
      return {
        user: user.toJSON(),
        token: authToken,
        message: 'Password changed successfully',
      };
    }

    // In-memory
    let targetUser = null;
    for (const u of memoryUsers.values()) {
      if (u._id === userId || u.id === userId) {
        targetUser = u;
        break;
      }
    }

    if (!targetUser) {
      throw ApiError.notFound('User profile not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, targetUser.password);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    targetUser.password = await bcrypt.hash(newPassword, salt);

    const safeUser = { ...targetUser };
    delete safeUser.password;

    const authToken = generateAuthToken(safeUser);
    return {
      user: safeUser,
      token: authToken,
      message: 'Password changed successfully',
    };
  }
}
