import { notFound } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EventCard } from '@/components/cards/EventCard';
import { EmptyState } from '@/components/content/EmptyState';
import { getChapter, getCountryEvents } from '@/lib/server-data';

export default async function CountryEventsPage({ params }: { params: { country: string } }) {
  const [country, events] = await Promise.all([getChapter(params.country), getCountryEvents(params.country)]);
  if (!country) notFound();

  return (
    <PageShell>
      <SectionHeading eyebrow="Chapter events" title={`${country.shortName} events`} description="Local chapter sessions, certification information events, and chapter programming can be published here while staying aligned with the wider WIAL calendar and chapter experience." />
      {events.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={`${event.title}-${event.date}`} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState className="mt-8" title="No events at this time" description={`There are no published events for ${country.shortName} right now.`} />
      )}
    </PageShell>
  );
}
