import { useCallback, useEffect, useState } from 'react';
import { fetchTaskStats } from '../api/tasks';
import type { TaskStats } from '../types';

export function useTaskStats() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTaskStats();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, refetch: load };
}
