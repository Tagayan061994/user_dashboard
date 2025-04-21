import { Request, Response, NextFunction } from 'express';
import { formatErrorResponse, isOperationalError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  if (isOperationalError(err)) {
    logger.info(`Operational error: ${err.message}`);
  } else {
    logger.error('Unexpected error', err);
  }

  // Format error response
  const errorResponse = formatErrorResponse(err);

  // Send response
  res.status(errorResponse.statusCode || 500).json(errorResponse);
};
