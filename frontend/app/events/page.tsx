import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EventCard } from '@/components/cards/EventCard';
import { EmptyState } from '@/components/content/EmptyState';
import { getGlobalEvents } from '@/lib/server-data';

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
        <h3 className="text-xl font-semibold text-brand-navy dark:text-white">Upcoming events</h3>
        {events.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <EventCard key={`${event.title}-${event.date}`} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState className="mt-6" title="No events at this time" description="Please check back soon for new WIAL and chapter programming." />
        )}
      </div>
    </PageShell>
  );
}
