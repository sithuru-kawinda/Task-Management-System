interface StatCardProps {
  label: string;
  value: number;
  accentClassName: string;
}

export function StatCard({ label, value, accentClassName }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accentClassName}`}>{value}</p>
    </div>
  );
}
