import { Router } from 'express';
import * as taskController from '../controllers/taskController';

const router = Router();

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks
 * @access  Public
 */
router.get('/', taskController.getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a task row by ID
 * @access  Public
 */
router.get('/:id', taskController.getTaskRow);

/**
 * @route   PATCH /api/tasks/:rowId/cells/:columnId
 * @desc    Update a cell in a task row
 * @access  Public
 */
router.patch('/:rowId/cells/:columnId', taskController.updateCell);

export default router;
