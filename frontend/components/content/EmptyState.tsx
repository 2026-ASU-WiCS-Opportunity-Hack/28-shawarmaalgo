export function EmptyState({
  title,
  description,
  className = ''
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={["rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900/40", className].filter(Boolean).join(' ')}>
      <p className="text-lg font-semibold text-brand-navy dark:text-white">{title}</p>
      {description ? <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}
