import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCountryBySlug } from "@/data/countries";
import { CoachCard } from "@/components/cards/CoachCard";

export default function CountryCoachesPage({ params }: { params: { country: string } }) {
  const country = getCountryBySlug(params.country);
  if (!country) notFound();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Local coaches"
        title={`${country.shortName} coach directory`}
        description="Chapter-level coach pages can support local filters, approvals, profile editing, and membership workflows without changing the route design."
      />
      <div className="mt-8 rounded-[1.5rem] border border-dashed border-brand-teal bg-brand-sand p-5 text-sm text-brand-ink">
        Backend hook: connect this page to chapter coach search, coach approval, and coach profile management endpoints.
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {country.coaches.map((coach) => (
          <CoachCard key={coach.name} coach={coach} />
        ))}
      </div>
    </PageShell>
  );
}
