import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/cards/EventCard";
import { getGlobalEvents } from "@/lib/server-data";

export default async function EventsPage() {
  const events = await getGlobalEvents();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Events"
        title="Global and chapter programming in one calendar experience"
        description="This page now reads from the backend events endpoint when available, while preserving the existing frontend presentation."
      />
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-brand-navy">Upcoming events</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={`${event.title}-${event.date}`} event={event} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
