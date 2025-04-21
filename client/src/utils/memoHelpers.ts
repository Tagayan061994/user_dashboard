/**
 * Utility functions for helping with memoization
 */

/**
 * Shallow comparison for arrays
 */
export const areArraysEqual = <T>(a: T[], b: T[]): boolean => {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }

  return true;
};

/**
 * Shallow comparison for objects
 */
export const areObjectsEqual = <T extends object>(
  a: T,
  b: T,
  ignoreKeys: string[] = []
): boolean => {
  if (a === b) return true;

  const aKeys = Object.keys(a).filter(key => !ignoreKeys.includes(key));
  const bKeys = Object.keys(b).filter(key => !ignoreKeys.includes(key));

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (a[key as keyof T] !== b[key as keyof T]) return false;
  }

  return true;
};

/**
 * Creates a memoized selector function
 */
export function createSelector<TInput, TOutput>(
  selector: (input: TInput) => TOutput
): (input: TInput) => TOutput {
  let lastInput: TInput | undefined;
  let lastOutput: TOutput | undefined;

  return (input: TInput): TOutput => {
    if (input === lastInput) {
      return lastOutput as TOutput;
    }

    const output = selector(input);
    lastInput = input;
    lastOutput = output;
    return output;
  };
}
