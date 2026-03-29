export function EventCard({ event }: { event: { title: string; date: string; location: string; summary: string } }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">{event.date}</p>
      <h3 className="mt-3 text-lg font-semibold text-brand-navy dark:text-white">{event.title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{event.location}</p>
      <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{event.summary}</p>
    </article>
  );
}
