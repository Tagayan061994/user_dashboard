import { isValidString, isValidEmail } from '../utils/validation';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

/**
 * Validate user object
 */
export const validateUser = (userData: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Required fields
  if (!isValidString(userData.id, { required: true })) {
    errors.id = 'User ID is required';
  }

  if (!isValidString(userData.name, { required: true, maxLength: 100 })) {
    errors.name = 'User name is required and must be less than 100 characters';
  }

  // Optional fields
  if (userData.email !== undefined && !isValidEmail(userData.email)) {
    errors.email = 'Invalid email format';
  }

  if (userData.avatar !== undefined && !isValidString(userData.avatar, { maxLength: 500 })) {
    errors.avatar = 'Avatar URL must be a string less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
