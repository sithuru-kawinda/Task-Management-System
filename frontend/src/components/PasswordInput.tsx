import { useId, useState, type InputHTMLAttributes } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label: string;
  error?: string;
}

export function PasswordInput({ label, error, className, ...inputProps }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative mt-1.5">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35"
        >
          <rect x="4" y="8.5" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={`w-full rounded-lg border border-ink/15 bg-surface py-2.5 pl-9 pr-10 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 ${className ?? ''}`}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-ink/40 transition-colors hover:text-ink/70 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        >
          {visible ? (
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path
                d="M2.5 10s2.917-5.833 7.5-5.833S17.5 10 17.5 10s-2.917 5.833-7.5 5.833S2.5 10 2.5 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="10" cy="10" r="2.083" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3.5 3.5 16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path
                d="M2.5 10s2.917-5.833 7.5-5.833S17.5 10 17.5 10s-2.917 5.833-7.5 5.833S2.5 10 2.5 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="10" cy="10" r="2.083" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
