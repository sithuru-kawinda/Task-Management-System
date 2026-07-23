import { apiClient } from './client';
import type { SortOption, Task, TaskInput, TaskListResponse, TaskPriority, TaskStats, TaskStatus } from '../types';

export interface TaskQueryParams {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export async function fetchTasks(params: TaskQueryParams): Promise<TaskListResponse> {
  const { data } = await apiClient.get<TaskListResponse>('/tasks', { params });
  return data;
}

export async function fetchTaskStats(): Promise<TaskStats> {
  const { data } = await apiClient.get<TaskStats>('/tasks/stats');
  return data;
}

export async function createTask(input: TaskInput): Promise<Task> {
  const { data } = await apiClient.post<Task>('/tasks', input);
  return data;
}

export async function updateTask(id: number, input: Partial<TaskInput>): Promise<Task> {
  const { data } = await apiClient.put<Task>(`/tasks/${id}`, input);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}
