import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res, next) => {
  const err = new ApiError(`Resource not found on path: ${req.originalUrl}`, 404);
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error Occurred] ${err.name || 'Error'}: ${err.message}`);
    if (err.stack) console.error(err.stack);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with identifier: ${err.value}`;
    error = new ApiError(message, 404);
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `An account with this ${duplicateField} already exists. Please login or use a different ${duplicateField}.`;
    error = new ApiError(message, 409, [{ field: duplicateField, message }]);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    error = new ApiError('Validation failed on input fields', 400, errors);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError('Invalid authentication token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError('Authentication token has expired. Please log in again.', 401);
  }

  return ApiResponse.error(res, {
    statusCode: error.statusCode || 500,
    message: error.message || 'Internal Server Error',
    errors: error.errors || null,
    stack: err.stack,
  });
};
