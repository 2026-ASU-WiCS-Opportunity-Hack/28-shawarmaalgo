import { Coach } from "@/data/countries";

export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-navy">{coach.name}</h3>
          <p className="text-sm text-slate-600">{coach.location}</p>
        </div>
        <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">
          {coach.certification}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-brand-teal">{coach.focus}</p>
      <p className="mt-3 text-sm leading-7 text-slate-700">{coach.bio}</p>
    </article>
  );
}
