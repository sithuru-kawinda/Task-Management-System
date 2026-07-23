import type { Knex } from 'knex';
import db from '../config/db';
import type { Task } from '../types';
import type { CreateTaskInput, TaskQueryInput, UpdateTaskInput } from '../validators/taskValidators';

const SORT_COLUMNS: Record<TaskQueryInput['sortBy'], { column: string; order: 'asc' | 'desc' }> = {
  newest: { column: 'created_at', order: 'desc' },
  oldest: { column: 'created_at', order: 'asc' },
  dueDate: { column: 'due_date', order: 'asc' },
};

function applyFilters(
  query: Knex.QueryBuilder<Task, Task[]>,
  filters: Pick<TaskQueryInput, 'search' | 'status' | 'priority'>
) {
  if (filters.search) {
    query.where('title', 'like', `%${filters.search}%`);
  }
  if (filters.status) {
    query.andWhere('status', filters.status);
  }
  if (filters.priority) {
    query.andWhere('priority', filters.priority);
  }
  return query;
}

export const taskModel = {
  async findAll(userId: number, filters: TaskQueryInput) {
    const baseQuery = db<Task>('tasks').where({ user_id: userId });
    applyFilters(baseQuery, filters);

    const countQuery = baseQuery.clone();
    const [{ count }] = await countQuery.count<{ count: string }[]>('id as count');

    const { column, order } = SORT_COLUMNS[filters.sortBy];
    const offset = (filters.page - 1) * filters.limit;

    const data = await baseQuery
      .clone()
      .orderBy(column, order)
      .limit(filters.limit)
      .offset(offset);

    return {
      data,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / filters.limit),
      },
    };
  },

  findById(id: number, userId: number): Promise<Task | undefined> {
    return db<Task>('tasks').where({ id, user_id: userId }).first();
  },

  async create(userId: number, input: CreateTaskInput): Promise<Task> {
    const [id] = await db<Task>('tasks').insert({ ...input, user_id: userId });
    return this.findById(id, userId) as Promise<Task>;
  },

  async update(id: number, userId: number, input: UpdateTaskInput): Promise<Task | undefined> {
    await db<Task>('tasks')
      .where({ id, user_id: userId })
      .update({ ...input, updated_at: db.fn.now() });
    return this.findById(id, userId);
  },

  async remove(id: number, userId: number): Promise<number> {
    return db<Task>('tasks').where({ id, user_id: userId }).delete();
  },

  async getStats(userId: number) {
    const rows = await db<Task>('tasks')
      .where({ user_id: userId })
      .select('status')
      .count<{ status: string; count: string }[]>('id as count')
      .groupBy('status');

    const counts: Record<string, number> = { Pending: 0, 'In Progress': 0, Completed: 0 };
    for (const row of rows) {
      counts[row.status] = Number(row.count);
    }

    const overdue = await db<Task>('tasks')
      .where({ user_id: userId })
      .andWhere('due_date', '<', db.fn.now())
      .andWhereNot('status', 'Completed')
      .count<{ count: string }[]>('id as count');

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    return {
      total,
      pending: counts.Pending,
      inProgress: counts['In Progress'],
      completed: counts.Completed,
      overdue: Number(overdue[0]?.count ?? 0),
    };
  },
};
