import { Router } from 'express';
import userRoutes from './userRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

// User routes
router.use('/users', userRoutes);

// Task routes
router.use('/tasks', taskRoutes);

export default router;
