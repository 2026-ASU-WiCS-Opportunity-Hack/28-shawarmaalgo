import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CoachCard } from "@/components/cards/CoachCard";
import { countries } from "@/data/countries";

const allCoaches = countries.flatMap((country) => country.coaches.map((coach) => ({ ...coach, country: country.shortName })));
const certifications = ["All levels", "CALC", "PALC", "SALC", "MALC"];

export default function CoachesPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Coach Directory"
        title="Search WIAL certified coaches"
        description="WIAL highlights its coach directory as a fast way to discover certified Action Learning coaches. This page gives you a production-ready shell for global search and chapter filtering."
      />

      <section className="mt-8 grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft lg:grid-cols-[1.4fr_1fr_1fr_auto]">
        <input
          aria-label="Search coaches"
          placeholder="Search by specialty, location, or name"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-brand-teal placeholder:text-slate-400 focus:ring-2"
        />
        <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-teal">
          <option>All chapters</option>
          {countries.map((country) => (
            <option key={country.slug}>{country.shortName}</option>
          ))}
        </select>
        <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-teal">
          {certifications.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>
        <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white hover:bg-brand-ink">Search</button>
      </section>

      <div className="mt-8 rounded-[1.5rem] border border-dashed border-brand-teal bg-brand-sand p-5 text-sm text-brand-ink">
        Backend hook: connect this page to filtered coach search, chapter membership rules, and coach profile visibility controls.
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allCoaches.map((coach) => (
          <div key={`${coach.name}-${coach.country}`}>
            <CoachCard coach={coach} />
            <p className="mt-2 text-sm text-slate-500">Chapter: {coach.country}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
