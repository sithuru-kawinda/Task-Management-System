import { useState, type FormEvent } from 'react';
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types';
import { todayIsoDate } from '../utils/taskDisplay';
import { getErrorMessage } from '../utils/getErrorMessage';

interface TaskFormProps {
  initialTask?: Task | null;
  onSubmit: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
}

type FormErrors = Partial<Record<keyof TaskInput, string>>;

export function TaskForm({ initialTask, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? 'Medium');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? 'Pending');
  const [dueDate, setDueDate] = useState(initialTask?.due_date?.slice(0, 10) ?? '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = 'Title is required';
    }
    if (!priority) {
      nextErrors.priority = 'Priority is required';
    }
    if (!status) {
      nextErrors.status = 'Status is required';
    }
    if (!dueDate) {
      nextErrors.due_date = 'Due date is required';
    } else if (dueDate < todayIsoDate()) {
      nextErrors.due_date = 'Due date cannot be earlier than today';
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        due_date: dueDate,
      });
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Something went wrong. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
        <h2 className="text-base font-semibold text-slate-900">
          {initialTask ? 'Edit Task' : 'Create Task'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-700">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && <p className="mt-1 text-xs text-red-600">{errors.priority}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-slate-700">
              Due Date
            </label>
            <input
              id="due_date"
              type="date"
              min={todayIsoDate()}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {errors.due_date && <p className="mt-1 text-xs text-red-600">{errors.due_date}</p>}
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
