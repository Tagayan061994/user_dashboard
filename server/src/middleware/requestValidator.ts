import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';
import { isValidSearchQuery } from '../utils/validation';

/**
 * Middleware to validate search query parameters
 */
export const validateSearchQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { query } = req.query;

  if (query !== undefined && !isValidSearchQuery(query)) {
    return next(
      new ValidationError('Invalid search query', {
        query: 'Search query contains invalid characters or is too long',
      })
    );
  }

  next();
};

/**
 * Generic middleware factory for validating request bodies
 */
export const validateRequestBody = <T>(
  validator: (body: any) => { isValid: boolean; errors: Record<string, string> }
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { isValid, errors } = validator(req.body);

    if (!isValid) {
      return next(
        new ValidationError('Invalid request data', errors)
      );
    }

    next();
  };
};
