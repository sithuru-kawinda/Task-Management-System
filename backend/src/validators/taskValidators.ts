import { z } from 'zod';

const priorityEnum = z.enum(['Low', 'Medium', 'High'], {
  message: 'Priority must be one of Low, Medium, High',
});

const statusEnum = z.enum(['Pending', 'In Progress', 'Completed'], {
  message: 'Status must be one of Pending, In Progress, Completed',
});

function isTodayOrLater(dateStr: string): boolean {
  const dueDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate >= today;
}

const dueDateField = z
  .string()
  .min(1, 'Due date is required')
  .refine((val) => !Number.isNaN(Date.parse(val)), 'Due date must be a valid date')
  .refine(isTodayOrLater, 'Due date cannot be earlier than today');

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or fewer'),
  description: z.string().max(2000).optional().nullable(),
  priority: priorityEnum,
  status: statusEnum,
  due_date: dueDateField,
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  due_date: dueDateField.optional(),
});

export const taskQuerySchema = z.object({
  search: z.string().optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  sortBy: z.enum(['newest', 'oldest', 'dueDate']).optional().default('newest'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
