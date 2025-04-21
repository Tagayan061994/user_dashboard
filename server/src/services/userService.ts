import { User } from '../models/user.model';
import { cache } from '../utils/cache';
import { logger } from '../utils/logger';
import { normalizeText, createSearchableIndex, searchItems } from '../utils/search';
import { NotFoundError } from '../utils/errors';

// Mock user data
const users: User[] = [
  { id: '1', name: 'Kenny Williams', email: 'kenny@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Gabriel Lima', email: 'gabriel@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Srinivas Gorur Shandilya', email: 'srinivas@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Akash Guru', email: 'akash@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Aram Davtyan', email: 'aram@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Bilal Shaikh', email: 'bilal@example.com', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '7', name: 'Dilpreet Singh', email: 'dilpreet@example.com', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '8', name: 'Elin Barnes', email: 'elin@example.com', avatar: 'https://i.pravatar.cc/150?img=8' },
];

// Create search index for users
const searchIndex = createSearchableIndex<User>(users, (user) => [
  user.name,
  user.email || '',
]);

/**
 * Get all users
 */
export const getAllUsers = (): User[] => {
  logger.debug('Getting all users');
  return users;
};

/**
 * Get user by ID
 */
export const getUserById = (id: string): User => {
  const cacheKey = `user:${id}`;

  // Check cache first
  const cachedUser = cache.get<User>(cacheKey);
  if (cachedUser) {
    logger.debug(`Cache hit for user: ${id}`);
    return cachedUser;
  }

  // Find user
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new NotFoundError(`User with ID ${id} not found`);
  }

  // Cache result
  cache.set<User>(cacheKey, user);

  return user;
};

/**
 * Search users by query
 */
export const searchUsers = (query?: string, limit: number = 20): User[] => {
  // If no query, return all users up to the limit
  if (!query) {
    logger.debug('No search query, returning all users');
    return users.slice(0, limit);
  }

  const cacheKey = `search:users:${normalizeText(query)}:${limit}`;

  // Check cache first
  const cachedResults = cache.get<User[]>(cacheKey);
  if (cachedResults) {
    logger.debug(`Cache hit for search query: ${query}`);
    return cachedResults;
  }

  // Perform search
  logger.debug(`Searching users with query: ${query}`);
  const results = searchItems<User>(searchIndex, query, limit);

  // Cache results
  cache.set<User[]>(cacheKey, results);

  return results;
};
