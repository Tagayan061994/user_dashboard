import { config } from '../config';

// Simple logger implementation
export const logger = {
  info: (message: string, meta?: any) => {
    if (config.logger.level === 'info' || config.logger.level === 'debug') {
      console.info(`[INFO] ${new Date().toISOString()} - ${message}`, meta ? meta : '');
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error ? error : '');
  },
  debug: (message: string, meta?: any) => {
    if (config.logger.level === 'debug') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta ? meta : '');
    }
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta ? meta : '');
  },
};
