import type { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { taskModel } from '../models/taskModel';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { CreateTaskInput, TaskQueryInput, UpdateTaskInput } from '../validators/taskValidators';

function getUserId(req: AuthenticatedRequest): number {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }
  return req.user.userId;
}

export const getTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = getUserId(req);
  const filters = req.query as unknown as TaskQueryInput;
  const result = await taskModel.findAll(userId, filters);
  res.status(200).json(result);
});

export const getTaskStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = getUserId(req);
  const stats = await taskModel.getStats(userId);
  res.status(200).json(stats);
});

export const getTaskById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = getUserId(req);
  const task = await taskModel.findById(Number(req.params.id), userId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  res.status(200).json(task);
});

export const createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = getUserId(req);
  const input = req.body as CreateTaskInput;
  const task = await taskModel.create(userId, input);
  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = getUserId(req);
  const input = req.body as UpdateTaskInput;

  const existing = await taskModel.findById(Number(req.params.id), userId);
  if (!existing) {
    throw new AppError('Task not found', 404);
  }

  const updated = await taskModel.update(Number(req.params.id), userId, input);
  res.status(200).json(updated);
});

export const deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = getUserId(req);
  const deletedCount = await taskModel.remove(Number(req.params.id), userId);
  if (deletedCount === 0) {
    throw new AppError('Task not found', 404);
  }
  res.status(204).send();
});
