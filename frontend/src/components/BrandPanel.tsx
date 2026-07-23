function Logomark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <path
        d="M10 16.5 14 20.5 22 11.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TaskCard({
  className,
  rows,
}: {
  className?: string;
  rows: { done: boolean; width: string }[];
}) {
  return (
    <div className={`w-64 rounded-2xl bg-surface p-4 shadow-xl shadow-brand-950/20 ${className ?? ''}`}>
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-brand-400" />
        <div className="h-2 w-20 rounded-full bg-ink/10" />
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                row.done ? 'border-brand-500 bg-brand-500' : 'border-ink/20'
              }`}
            >
              {row.done && (
                <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5">
                  <path
                    d="M2.5 6.2 4.8 8.5 9.5 3.5"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div
              className={`h-2 rounded-full ${row.done ? 'bg-ink/10' : 'bg-ink/15'}`}
              style={{ width: row.width }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Original illustration in the spirit of the reference mockup: a stack of
 * task-card mockups instead of a stock illustrated figure, since redrawing
 * someone else's character art isn't something to reproduce.
 */
export function BrandPanel() {
  return (
    <div
      className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-500 to-brand-800 px-12 py-12 lg:flex"
      aria-hidden={false}
    >
      <div
        className="pointer-events-none absolute -right-16 top-1/2 h-[140%] w-40 -translate-y-1/2 bg-surface [clip-path:polygon(0_0,100%_0,0_100%)]"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-white/8 blur-2xl" />
        <div className="absolute bottom-24 right-24 h-40 w-40 rounded-full bg-white/8 blur-xl" />
      </div>

      <div className="relative z-10 flex items-center gap-2.5 text-white">
        <Logomark className="h-8 w-8 text-white/95" />
        <span className="text-lg font-semibold tracking-tight">Task Manager</span>
      </div>

      <div className="relative z-10">
        <div className="relative h-72">
          <TaskCard
            className="absolute left-6 top-6 -rotate-6 opacity-90"
            rows={[
              { done: true, width: '70%' },
              { done: true, width: '55%' },
              { done: false, width: '80%' },
            ]}
          />
          <TaskCard
            className="absolute left-0 top-0 rotate-3"
            rows={[
              { done: true, width: '60%' },
              { done: false, width: '85%' },
              { done: false, width: '45%' },
            ]}
          />
          <div className="absolute -bottom-3 left-40 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 shadow-lg shadow-brand-950/30 motion-safe:animate-[float_4s_ease-in-out_infinite]">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-brand-700">
              <path
                d="M4 10.5 8 14.5 16 5.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-xs text-white">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Stay on top of every task.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          Create, prioritize, and track your work in one place, so nothing due today slips
          through.
        </p>
      </div>
    </div>
  );
}
