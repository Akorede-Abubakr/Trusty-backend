/**
 * Standardized API Response Helper
 */
export class ApiResponse {
  static success(res, { statusCode = 200, message = 'Success', data = null, meta = null }) {
    const responsePayload = {
      success: true,
      statusCode,
      message,
      data,
    };

    if (meta) {
      responsePayload.meta = meta;
    }

    return res.status(statusCode).json(responsePayload);
  }

  static created(res, { message = 'Resource created successfully', data = null, meta = null }) {
    return ApiResponse.success(res, { statusCode: 201, message, data, meta });
  }

  static error(res, { statusCode = 500, message = 'Internal Server Error', errors = null, stack = null }) {
    const responsePayload = {
      success: false,
      statusCode,
      message,
    };

    if (errors) {
      responsePayload.errors = errors;
    }

    if (stack && process.env.NODE_ENV === 'development') {
      responsePayload.stack = stack;
    }

    return res.status(statusCode).json(responsePayload);
  }
}
