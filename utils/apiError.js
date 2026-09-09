/**
 * Custom operational API Error class
 */
export class ApiError extends Error {
  constructor(message = 'Something went wrong', statusCode = 500, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(message, 400, errors);
  }

  static unauthorized(message = 'Not authorized to access this resource') {
    return new ApiError(message, 401);
  }

  static forbidden(message = 'Forbidden: You do not have permission') {
    return new ApiError(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404);
  }

  static conflict(message = 'Resource already exists') {
    return new ApiError(message, 409);
  }

  static unprocessable(message = 'Unprocessable Entity', errors = []) {
    return new ApiError(message, 422, errors);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(message, 500);
  }
}
