export function EventCard({ event }: { event: { title: string; date: string; location: string; summary: string } }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">{event.date}</p>
      <h3 className="mt-3 text-lg font-semibold text-brand-navy">{event.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{event.location}</p>
      <p className="mt-4 text-sm leading-7 text-slate-700">{event.summary}</p>
    </article>
  );
}
