import express from 'express';
import cors from 'cors';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler, rateLimiter } from './middleware';
import apiRoutes from './routes';
import { NotFoundError } from './utils/errors';

// Create Express app
const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors({
  origin: config.server.cors.origin,
  credentials: config.server.cors.credentials,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.url}`));
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
