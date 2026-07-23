import type { Task } from '../types';
import { formatDate, isOverdue, PRIORITY_BADGE, STATUS_BADGE } from '../utils/taskDisplay';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-slate-500">No tasks found.</p>;
  }

  return (
    <div className="divide-y divide-slate-200">
      {tasks.map((task) => {
        const overdue = isOverdue(task.due_date, task.status);
        return (
          <div key={task.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-medium text-slate-900">{task.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_BADGE[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[task.status]}`}>
                  {task.status}
                </span>
                {overdue && (
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
                    Overdue
                  </span>
                )}
              </div>
              {task.description && (
                <p className="mt-1 truncate text-sm text-slate-500">{task.description}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">Due {formatDate(task.due_date)}</p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
