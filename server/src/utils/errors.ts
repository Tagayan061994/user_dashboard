/**
 * Application-specific error classes and error handling utilities
 */

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string>) {
    super(message, 400);
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
  }
}

/**
 * Check if an error is an operational error (expected in normal operations)
 */
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

/**
 * Format error response object
 */
export const formatErrorResponse = (error: Error): Record<string, any> => {
  if (error instanceof ValidationError) {
    return {
      status: 'error',
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors,
    };
  }

  if (error instanceof AppError) {
    return {
      status: 'error',
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  // For non-app errors, return a generic message in production
  const isDev = process.env.NODE_ENV === 'development';
  return {
    status: 'error',
    statusCode: 500,
    message: isDev ? error.message : 'Internal server error',
    stack: isDev ? error.stack : undefined,
  };
};
