/**
 * Validation utility functions
 */

/**
 * Check if a value is a valid string and optionally check min and max length
 */
export const isValidString = (
  value: any,
  options: { required?: boolean; minLength?: number; maxLength?: number } = {}
): boolean => {
  const { required = false, minLength, maxLength } = options;

  if (typeof value !== 'string') return false;
  if (required && value.trim() === '') return false;
  if (minLength !== undefined && value.length < minLength) return false;
  if (maxLength !== undefined && value.length > maxLength) return false;

  return true;
};

/**
 * Check if a string is a valid email format
 */
export const isValidEmail = (value: string): boolean => {
  if (!isValidString(value, { required: true })) return false;

  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

/**
 * Check if a value is a valid number within optional range
 */
export const isValidNumber = (
  value: any,
  options: { required?: boolean; min?: number; max?: number } = {}
): boolean => {
  const { required = false, min, max } = options;

  if (typeof value !== 'number' || isNaN(value)) return false;
  if (required && value === undefined) return false;
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;

  return true;
};

/**
 * Check if a value is a valid array with optional length constraints
 */
export const isValidArray = (
  value: any,
  options: { required?: boolean; minLength?: number; maxLength?: number } = {}
): boolean => {
  const { required = false, minLength, maxLength } = options;

  if (!Array.isArray(value)) return false;
  if (required && value.length === 0) return false;
  if (minLength !== undefined && value.length < minLength) return false;
  if (maxLength !== undefined && value.length > maxLength) return false;

  return true;
};

/**
 * Validates a search query parameter
 */
export const isValidSearchQuery = (query: any): boolean => {
  if (query === undefined || query === null) return true; // Allow empty query
  if (typeof query !== 'string') return false;

  // Ensure query isn't too long
  if (query.length > 100) return false;

  // Check for potentially malicious patterns
  const dangerousPatterns = [
    /--/,             // SQL comment
    /;/,              // Command separator
    /\/\*/,           // SQL comment
    /union\s+select/i // SQL injection
  ];

  return !dangerousPatterns.some(pattern => pattern.test(query));
};

/**
 * Type guard for User object
 */
export const isValidUserObject = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object') return false;

  return (
    isValidString(obj.id, { required: true }) &&
    isValidString(obj.name, { required: true, maxLength: 100 }) &&
    (obj.email === undefined || isValidEmail(obj.email)) &&
    (obj.avatar === undefined || isValidString(obj.avatar))
  );
};
