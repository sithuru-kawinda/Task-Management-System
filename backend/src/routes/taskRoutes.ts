import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTaskStats,
  getTasks,
  updateTask,
} from '../controllers/taskController';
import { requireAuth } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import { createTaskSchema, taskQuerySchema, updateTaskSchema } from '../validators/taskValidators';

const router = Router();

router.use(requireAuth);

router.get('/stats', getTaskStats);
router.get('/', validateQuery(taskQuerySchema), getTasks);
router.get('/:id', getTaskById);
router.post('/', validateBody(createTaskSchema), createTask);
router.put('/:id', validateBody(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
