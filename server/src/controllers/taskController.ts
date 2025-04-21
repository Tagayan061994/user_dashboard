import { Request, Response, NextFunction } from 'express';
import { getAllTasks, getTaskRowById, updateTaskCell } from '../services/taskService';
import { logger } from '../utils/logger';
import { ValidationError, NotFoundError } from '../utils/errors';

/**
 * Controller to get all tasks
 */
export const getTasks = (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Getting all tasks');
    const tasks = getAllTasks();

    res.json({
      status: 'success',
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get a task row by ID
 */
export const getTaskRow = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError('Task row ID is required', {
        id: 'Task row ID is required',
      });
    }

    logger.info(`Getting task row with ID: ${id}`);
    const row = getTaskRowById(id);

    res.json({
      status: 'success',
      data: {
        row,
      },
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(error);
    }
    next(error);
  }
};

/**
 * Controller to update a task cell
 */
export const updateCell = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rowId, columnId } = req.params;
    const { value } = req.body;

    // Validate parameters
    if (!rowId) {
      throw new ValidationError('Row ID is required', {
        rowId: 'Row ID is required',
      });
    }

    if (!columnId) {
      throw new ValidationError('Column ID is required', {
        columnId: 'Column ID is required',
      });
    }

    if (value === undefined) {
      throw new ValidationError('Cell value is required', {
        value: 'Cell value is required',
      });
    }

    logger.info(`Updating cell in row ${rowId}, column ${columnId}`);
    const updatedRow = updateTaskCell(rowId, columnId, value);

    res.json({
      status: 'success',
      data: {
        row: updatedRow,
      },
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(error);
    }
    next(error);
  }
};
