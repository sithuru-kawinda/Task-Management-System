import { useState } from 'react';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { TaskFilters } from '../components/TaskFilters';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Pagination } from '../components/Pagination';
import { useTasks } from '../hooks/useTasks';
import { useTaskStats } from '../hooks/useTaskStats';
import { useDebounce } from '../hooks/useDebounce';
import { createTask, deleteTask, updateTask } from '../api/tasks';
import type { SortOption, Task, TaskInput, TaskPriority, TaskStatus } from '../types';

const PAGE_SIZE = 10;

export function DashboardPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<TaskPriority | ''>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { stats, refetch: refetchStats } = useTaskStats();
  const { tasks, pagination, loading, error, refetch: refetchTasks } = useTasks({
    search: debouncedSearch || undefined,
    status: status || undefined,
    priority: priority || undefined,
    sortBy,
    page,
    limit: PAGE_SIZE,
  });

  function resetToFirstPage() {
    setPage(1);
  }

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleFormSubmit(input: TaskInput) {
    if (editingTask) {
      await updateTask(editingTask.id, input);
      toast.success('Task updated');
    } else {
      await createTask(input);
      toast.success('Task created');
    }
    setFormOpen(false);
    setEditingTask(null);
    await Promise.all([refetchTasks(), refetchStats()]);
  }

  async function handleDeleteConfirm() {
    if (!taskPendingDelete) return;
    try {
      await deleteTask(taskPendingDelete.id);
      toast.success('Task deleted');
      await Promise.all([refetchTasks(), refetchStats()]);
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setTaskPendingDelete(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total Tasks" value={stats?.total ?? 0} accentClassName="text-slate-900" />
          <StatCard label="Pending" value={stats?.pending ?? 0} accentClassName="text-slate-700" />
          <StatCard label="In Progress" value={stats?.inProgress ?? 0} accentClassName="text-blue-600" />
          <StatCard label="Completed" value={stats?.completed ?? 0} accentClassName="text-green-600" />
          <StatCard label="Overdue" value={stats?.overdue ?? 0} accentClassName="text-red-600" />
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 p-4 pb-0 sm:pb-4">
            <h2 className="text-base font-semibold text-slate-900">Tasks</h2>
            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              + New Task
            </button>
          </div>

          <TaskFilters
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              resetToFirstPage();
            }}
            status={status}
            onStatusChange={(value) => {
              setStatus(value);
              resetToFirstPage();
            }}
            priority={priority}
            onPriorityChange={(value) => {
              setPriority(value);
              resetToFirstPage();
            }}
            sortBy={sortBy}
            onSortByChange={(value) => {
              setSortBy(value);
              resetToFirstPage();
            }}
          />

          {loading && <LoadingSpinner label="Loading tasks..." />}
          {!loading && error && (
            <p className="px-4 py-10 text-center text-sm text-red-600">{error}</p>
          )}
          {!loading && !error && (
            <TaskList tasks={tasks} onEdit={openEditForm} onDelete={setTaskPendingDelete} />
          )}

          {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
        </section>
      </main>

      {formOpen && (
        <TaskForm
          initialTask={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {taskPendingDelete && (
        <ConfirmDialog
          title="Delete task"
          message={`Are you sure you want to delete "${taskPendingDelete.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setTaskPendingDelete(null)}
        />
      )}
    </div>
  );
}
