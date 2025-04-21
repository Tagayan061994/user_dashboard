export const config = {
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: process.env.CORS_CREDENTIALS === 'true' || false,
    },
  },
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true' || true,
    ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes in seconds
  },
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === 'true' || true,
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // limit each IP to 100 requests per windowMs
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
