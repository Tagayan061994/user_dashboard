import { Request, Response, NextFunction } from 'express';
import { getAllUsers, getUserById, searchUsers } from '../services/userService';
import { logger } from '../utils/logger';
import { isValidSearchQuery } from '../utils/validation';
import { ValidationError, NotFoundError } from '../utils/errors';

/**
 * Controller to get all users
 */
export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.query;

    // Validate query if provided
    if (query !== undefined && !isValidSearchQuery(query as string)) {
      throw new ValidationError('Invalid search query', {
        query: 'Search query contains invalid characters or is too long',
      });
    }

    let users;
    if (query) {
      logger.info(`Searching users with query: ${query}`);
      users = searchUsers(query as string);
    } else {
      logger.info('Getting all users');
      users = getAllUsers();
    }

    res.json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get a single user by ID
 */
export const getUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError('User ID is required', {
        id: 'User ID is required',
      });
    }

    logger.info(`Getting user with ID: ${id}`);
    const user = getUserById(id);

    res.json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(error);
    }
    next(error);
  }
};
