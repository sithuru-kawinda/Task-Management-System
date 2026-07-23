export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type SortOption = 'newest' | 'oldest' | 'dueDate';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TaskListResponse {
  data: Task[];
  pagination: Pagination;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorPayload {
  message: string;
  errors?: FieldError[];
}
