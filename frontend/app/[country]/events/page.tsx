import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCountryBySlug } from "@/data/countries";
import { EventCard } from "@/components/cards/EventCard";

export default function CountryEventsPage({ params }: { params: { country: string } }) {
  const country = getCountryBySlug(params.country);
  if (!country) notFound();

  return (
    <PageShell>
      <SectionHeading eyebrow="Chapter events" title={`${country.shortName} events`} description="Local chapter sessions, certification information events, and chapter programming can roll into the global calendar while remaining easy to manage here." />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {country.events.map((event) => (
          <EventCard key={event.title} event={event} />
        ))}
      </div>
    </PageShell>
  );
}
