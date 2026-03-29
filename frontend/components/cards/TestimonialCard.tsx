export function TestimonialCard({ item }: { item: { quote: string; name: string; role: string } }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <p className="text-base leading-8 text-slate-700 dark:text-slate-300">“{item.quote}”</p>
      <div className="mt-5">
        <p className="font-semibold text-brand-navy dark:text-white">{item.name}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{item.role}</p>
      </div>
    </article>
  );
}
