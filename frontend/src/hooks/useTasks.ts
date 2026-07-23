import { useCallback, useEffect, useState } from 'react';
import { fetchTasks, type TaskQueryParams } from '../api/tasks';
import type { Pagination, Task } from '../types';

export function useTasks(params: TaskQueryParams) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTasks(params);
      setTasks(response.data);
      setPagination(response.pagination);
    } catch {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    load();
  }, [load]);

  return { tasks, pagination, loading, error, refetch: load };
}
