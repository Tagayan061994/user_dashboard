import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';

// Simple in-memory rate limiter
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number;
  private readonly max: number;
  private readonly enabled: boolean;

  constructor() {
    this.windowMs = config.rateLimit.windowMs;
    this.max = config.rateLimit.max;
    this.enabled = config.rateLimit.enabled;

    // Clean up expired entries
    setInterval(() => this.cleanup(), this.windowMs);
  }

  public check(key: string): { limited: boolean; remaining: number; resetAt: number } {
    if (!this.enabled) {
      return { limited: false, remaining: this.max, resetAt: Date.now() + this.windowMs };
    }

    const now = Date.now();
    let entry = this.store.get(key);

    // Create a new entry if none exists or the previous one expired
    if (!entry || entry.resetAt <= now) {
      entry = {
        count: 0,
        resetAt: now + this.windowMs
      };
      this.store.set(key, entry);
    }

    // Increment count
    entry.count += 1;

    // Check if limit is reached
    const limited = entry.count > this.max;
    const remaining = Math.max(0, this.max - entry.count);

    if (limited) {
      logger.warn(`Rate limit exceeded for ${key}`);
    }

    return { limited, remaining, resetAt: entry.resetAt };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt <= now) {
        this.store.delete(key);
      }
    }
  }
}

const limiter = new RateLimiter();

/**
 * Rate limiting middleware
 */
export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Use IP address or some other identifier as the rate limit key
  const key = req.ip || 'unknown';
  const { limited, remaining, resetAt } = limiter.check(key);

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', config.rateLimit.max.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(resetAt / 1000).toString());

  if (limited) {
    return res.status(429).json({
      status: 'error',
      statusCode: 429,
      message: 'Too many requests, please try again later',
    });
  }

  next();
};
