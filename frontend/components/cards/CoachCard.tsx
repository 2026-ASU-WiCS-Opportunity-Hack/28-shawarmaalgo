import { Coach } from "@/data/countries";

export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-navy dark:text-white">{coach.name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{coach.location}</p>
        </div>
        <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy dark:bg-slate-900 dark:text-slate-100">
          {coach.certification}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-brand-teal">{coach.focus}</p>
      <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{coach.bio}</p>
    </article>
  );
}
