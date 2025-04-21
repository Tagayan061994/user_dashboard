import { config } from '../config';
import { logger } from './logger';

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

/**
 * A simple in-memory cache implementation
 */
class Cache {
  private store: Map<string, CacheItem<any>> = new Map();
  private enabled: boolean = config.cache.enabled;
  private defaultTtl: number = config.cache.ttl; // ttl in seconds

  /**
   * Get a value from the cache
   * @param key The cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    if (!this.enabled) return undefined;

    const item = this.store.get(key);
    if (!item) return undefined;

    const now = Date.now();
    if (item.expiresAt < now) {
      this.store.delete(key);
      logger.debug(`Cache miss (expired): ${key}`);
      return undefined;
    }

    logger.debug(`Cache hit: ${key}`);
    return item.value as T;
  }

  /**
   * Set a value in the cache
   * @param key The cache key
   * @param value The value to cache
   * @param ttl Time-to-live in seconds
   */
  set<T>(key: string, value: T, ttl: number = this.defaultTtl): void {
    if (!this.enabled) return;

    const expiresAt = Date.now() + ttl * 1000;
    this.store.set(key, { value, expiresAt });
    logger.debug(`Cache set: ${key}, expires in ${ttl}s`);
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key The cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    if (!this.enabled) return false;

    const item = this.store.get(key);
    if (!item) return false;

    const now = Date.now();
    if (item.expiresAt < now) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a key from the cache
   * @param key The cache key
   */
  delete(key: string): void {
    this.store.delete(key);
    logger.debug(`Cache delete: ${key}`);
  }

  /**
   * Delete all keys that match a prefix
   * @param prefix The prefix to match
   */
  deleteByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        logger.debug(`Cache delete (prefix match): ${key}`);
      }
    }
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.store.clear();
    logger.debug('Cache cleared');
  }
}

export const cache = new Cache();
