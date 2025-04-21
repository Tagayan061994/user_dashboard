import { CellType } from '../types';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { cache } from '../utils/cache';
import { logger } from '../utils/logger';
import { NotFoundError } from '../utils/errors';
import { getUserById } from './userService';

// Reference to mock user data for task assignment
const getKnownUser = (id: string): User => {
  try {
    return getUserById(id);
  } catch (error) {
    logger.error(`Failed to get user with ID ${id}`);
    throw error;
  }
};

// Mock tasks data
const tasks: Task = {
  columns: [
    { id: 'id', title: 'ID', type: CellType.TEXT, width: '80px' },
    { id: 'summary', title: 'Summary', type: CellType.TEXT, width: '300px', editable: true },
    { id: 'status', title: 'Status', type: CellType.TAG, width: '120px', editable: true },
    { id: 'assignee', title: 'Assignee', type: CellType.MULTI_USER, width: '200px', editable: true },
  ],
  rows: [
    {
      id: 'ID-1',
      cells: {
        id: { type: CellType.TEXT, value: 'ID-1' },
        summary: { type: CellType.TEXT, value: '400 pix for mura', editable: true },
        status: { type: CellType.TAG, value: 'todo', editable: true },
        assignee: {
          type: CellType.MULTI_USER,
          value: [getKnownUser('1')],
          editable: true
        },
      },
    },
    {
      id: 'ID-2',
      cells: {
        id: { type: CellType.TEXT, value: 'ID-2' },
        summary: { type: CellType.TEXT, value: 'Select option ordering', editable: true },
        status: { type: CellType.TAG, value: 'todo', editable: true },
        assignee: {
          type: CellType.MULTI_USER,
          value: [getKnownUser('2')],
          editable: true
        },
      },
    },
    {
      id: 'ID-3',
      cells: {
        id: { type: CellType.TEXT, value: 'ID-3' },
        summary: { type: CellType.TEXT, value: 'Database filter bug v2', editable: true },
        status: { type: CellType.TAG, value: 'in-progress', editable: true },
        assignee: {
          type: CellType.MULTI_USER,
          value: [getKnownUser('1'), getKnownUser('2')],
          editable: true
        },
      },
    },
    {
      id: 'ID-4',
      cells: {
        id: { type: CellType.TEXT, value: 'ID-4' },
        summary: { type: CellType.TEXT, value: 'Colored labels for select', editable: true },
        status: { type: CellType.TAG, value: 'todo', editable: true },
        assignee: {
          type: CellType.MULTI_USER,
          value: [getKnownUser('3')],
          editable: true
        },
      },
    },
    {
      id: 'ID-5',
      cells: {
        id: { type: CellType.TEXT, value: 'ID-5' },
        summary: { type: CellType.TEXT, value: 'Default values for select columns', editable: true },
        status: { type: CellType.TAG, value: 'todo', editable: true },
        assignee: {
          type: CellType.MULTI_USER,
          value: [getKnownUser('4')],
          editable: true
        },
      },
    },
  ],
};

/**
 * Get all tasks
 */
export const getAllTasks = (): Task => {
  const cacheKey = 'tasks:all';

  // Check cache first
  const cachedTasks = cache.get<Task>(cacheKey);
  if (cachedTasks) {
    logger.debug('Cache hit for all tasks');
    return cachedTasks;
  }

  logger.debug('Getting all tasks');

  // Cache result
  cache.set<Task>(cacheKey, tasks);

  return tasks;
};

/**
 * Get task row by ID
 */
export const getTaskRowById = (id: string) => {
  const cacheKey = `task:row:${id}`;

  // Check cache first
  const cachedRow = cache.get(cacheKey);
  if (cachedRow) {
    logger.debug(`Cache hit for task row: ${id}`);
    return cachedRow;
  }

  // Find row
  const row = tasks.rows.find(r => r.id === id);
  if (!row) {
    throw new NotFoundError(`Task row with ID ${id} not found`);
  }

  // Cache result
  cache.set(cacheKey, row);

  return row;
};

/**
 * Update a cell in a task row
 */
export const updateTaskCell = (rowId: string, columnId: string, value: any) => {
  // Find row
  const rowIndex = tasks.rows.findIndex(r => r.id === rowId);
  if (rowIndex === -1) {
    throw new NotFoundError(`Task row with ID ${rowId} not found`);
  }

  // Check if column exists
  if (!tasks.columns.some(c => c.id === columnId)) {
    throw new NotFoundError(`Column with ID ${columnId} not found`);
  }

  // Check if cell exists
  if (!tasks.rows[rowIndex].cells[columnId]) {
    throw new NotFoundError(`Cell with column ID ${columnId} not found in row ${rowId}`);
  }

  // Update cell value
  tasks.rows[rowIndex].cells[columnId].value = value;

  // Invalidate caches
  cache.delete(`task:row:${rowId}`);
  cache.delete('tasks:all');

  return tasks.rows[rowIndex];
};
