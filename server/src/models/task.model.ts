import { CellType } from '../types';
import { isValidString, isValidArray } from '../utils/validation';
import { User, validateUser } from './user.model';

export interface Cell {
  type: CellType;
  value: any;
  editable?: boolean;
}

export interface TextCell extends Cell {
  type: CellType.TEXT;
  value: string;
}

export interface TagCell extends Cell {
  type: CellType.TAG;
  value: string;
}

export interface MultiUserCell extends Cell {
  type: CellType.MULTI_USER;
  value: User[];
}

export interface Column {
  id: string;
  title: string;
  type: CellType;
  width?: string;
  editable?: boolean;
}

export interface Row {
  id: string;
  cells: {
    [key: string]: Cell;
  };
}

export interface Task {
  columns: Column[];
  rows: Row[];
}

/**
 * Validate column object
 */
export const validateColumn = (columnData: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Required fields
  if (!isValidString(columnData.id, { required: true })) {
    errors.id = 'Column ID is required';
  }

  if (!isValidString(columnData.title, { required: true })) {
    errors.title = 'Column title is required';
  }

  if (!Object.values(CellType).includes(columnData.type)) {
    errors.type = 'Invalid column type';
  }

  // Optional fields
  if (columnData.width !== undefined && !isValidString(columnData.width)) {
    errors.width = 'Width must be a string';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate cell object based on its type
 */
export const validateCell = (cellData: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Check cell has a valid type
  if (!Object.values(CellType).includes(cellData.type)) {
    errors.type = 'Invalid cell type';
    return { isValid: false, errors };
  }

  // Type-specific validation
  switch (cellData.type) {
    case CellType.TEXT:
      if (!isValidString(cellData.value)) {
        errors.value = 'Text cell value must be a string';
      }
      break;

    case CellType.TAG:
      if (!isValidString(cellData.value)) {
        errors.value = 'Tag cell value must be a string';
      }
      break;

    case CellType.MULTI_USER:
      if (!isValidArray(cellData.value)) {
        errors.value = 'Multi-user cell value must be an array';
      } else {
        // Validate each user
        const userValidations = cellData.value.map(validateUser);
        const invalidUsers = userValidations.filter(v => !v.isValid);

        if (invalidUsers.length > 0) {
          errors.value = 'One or more users are invalid';
        }
      }
      break;

    default:
      // Allow other cell types without specific validation for now
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate row object
 */
export const validateRow = (rowData: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Required fields
  if (!isValidString(rowData.id, { required: true })) {
    errors.id = 'Row ID is required';
  }

  if (!rowData.cells || typeof rowData.cells !== 'object') {
    errors.cells = 'Cells must be an object';
    return { isValid: false, errors };
  }

  // Validate each cell
  Object.entries(rowData.cells).forEach(([key, cell]) => {
    const validation = validateCell(cell);
    if (!validation.isValid) {
      errors[`cells.${key}`] = Object.values(validation.errors).join(', ');
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
