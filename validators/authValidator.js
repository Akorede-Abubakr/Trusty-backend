import validator from 'validator';
import { USER_ROLES } from '../models/User.js';

export const validateRegisterInput = (data) => {
  const errors = [];

  const firstName = data.firstName ? String(data.firstName).trim() : '';
  const lastName = data.lastName ? String(data.lastName).trim() : '';
  const email = data.email ? String(data.email).trim().toLowerCase() : '';
  const password = data.password ? String(data.password) : '';
  const role = data.role ? String(data.role).trim().toLowerCase() : 'buyer';
  const phone = data.phone ? String(data.phone).trim() : '';

  if (validator.isEmpty(firstName)) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (validator.isEmpty(lastName)) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (validator.isEmpty(email)) {
    errors.push({ field: 'email', message: 'Email address is required' });
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (validator.isEmpty(password)) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (!validator.isLength(password, { min: 6 })) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  if (role && !USER_ROLES.includes(role)) {
    errors.push({
      field: 'role',
      message: `Invalid role specified. Allowed roles: ${USER_ROLES.join(', ')}`,
    });
  }

  return {
    errors,
    isValid: errors.length === 0,
    sanitized: {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
    },
  };
};

export const validateLoginInput = (data) => {
  const errors = [];
  const email = data.email ? String(data.email).trim().toLowerCase() : '';
  const password = data.password ? String(data.password) : '';

  if (validator.isEmpty(email)) {
    errors.push({ field: 'email', message: 'Email address is required' });
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (validator.isEmpty(password)) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    errors,
    isValid: errors.length === 0,
    sanitized: { email, password },
  };
};

export const validateForgotPasswordInput = (data) => {
  const errors = [];
  const email = data.email ? String(data.email).trim().toLowerCase() : '';

  if (validator.isEmpty(email)) {
    errors.push({ field: 'email', message: 'Email address is required' });
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  return {
    errors,
    isValid: errors.length === 0,
    sanitized: { email },
  };
};

export const validateResetPasswordInput = (data) => {
  const errors = [];
  const password = data.password ? String(data.password) : '';
  const token = data.token ? String(data.token).trim() : '';

  if (validator.isEmpty(password)) {
    errors.push({ field: 'password', message: 'New password is required' });
  } else if (!validator.isLength(password, { min: 6 })) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  return {
    errors,
    isValid: errors.length === 0,
    sanitized: { password, token },
  };
};

export const validateChangePasswordInput = (data) => {
  const errors = [];
  const currentPassword = data.currentPassword ? String(data.currentPassword) : '';
  const newPassword = data.newPassword ? String(data.newPassword) : '';

  if (validator.isEmpty(currentPassword)) {
    errors.push({ field: 'currentPassword', message: 'Current password is required' });
  }

  if (validator.isEmpty(newPassword)) {
    errors.push({ field: 'newPassword', message: 'New password is required' });
  } else if (!validator.isLength(newPassword, { min: 6 })) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters' });
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push({ field: 'newPassword', message: 'New password must be different from current password' });
  }

  return {
    errors,
    isValid: errors.length === 0,
    sanitized: { currentPassword, newPassword },
  };
};
