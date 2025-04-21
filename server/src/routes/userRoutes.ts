import { Router } from 'express';
import * as userController from '../controllers/userController';
import { validateSearchQuery } from '../middleware';

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users or search users by query
 * @access  Public
 */
router.get('/', validateSearchQuery, userController.getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID
 * @access  Public
 */
router.get('/:id', userController.getUser);

export default router;
