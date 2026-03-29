import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CoachCard } from "@/components/cards/CoachCard";
import { getChapters, getCoachDirectory } from "@/lib/server-data";

const certifications = ["All levels", "CALC", "PALC", "SALC", "MALC"];

export default async function CoachesPage() {
  const [allCoaches, chapters] = await Promise.all([getCoachDirectory(), getChapters()]);

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Coach Directory"
        title="Search WIAL certified coaches"
        description="Browse certified coaches across the WIAL network and discover chapter-based expertise."
      />

      <section className="mt-8 grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft lg:grid-cols-[1.4fr_1fr_1fr_auto]">
        <input
          aria-label="Search coaches"
          placeholder="Search by specialty, location, or name"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-brand-teal placeholder:text-slate-400 focus:ring-2"
        />
        <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-teal">
          <option>All chapters</option>
          {chapters.map((country) => (
            <option key={country.slug}>{country.shortName}</option>
          ))}
        </select>
        <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-teal">
          {certifications.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>
        <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">Search</button>
      </section>

      {allCoaches.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allCoaches.map((coach) => (
            <div key={`${coach.name}-${coach.country}`}>
              <CoachCard coach={coach} />
              <p className="mt-2 text-sm text-slate-500">Chapter: {coach.country}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-soft">
          No coaches are published yet.
        </div>
      )}
    </PageShell>
  );
}
