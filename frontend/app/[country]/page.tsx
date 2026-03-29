import { notFound } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { Hero } from '@/components/sections/Hero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InfoCard } from '@/components/cards/InfoCard';
import { CoachCard } from '@/components/cards/CoachCard';
import { EventCard } from '@/components/cards/EventCard';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { EmptyState } from '@/components/content/EmptyState';
import { getChapter, getCountryCoaches, getCountryEvents } from '@/lib/server-data';

export default async function CountryOverviewPage({ params }: { params: { country: string } }) {
  const [country, coaches, events] = await Promise.all([
    getChapter(params.country),
    getCountryCoaches(params.country),
    getCountryEvents(params.country)
  ]);
  if (!country) notFound();

  return (
    <PageShell>
      <Hero
        eyebrow={country.hero.eyebrow}
        title={country.hero.title}
        description={country.hero.description}
        primaryCta={{ label: 'See local coaches', href: `/${country.slug}/coaches` }}
        secondaryCta={{ label: 'See local events', href: `/${country.slug}/events` }}
      />

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <InfoCard title="About this chapter">
          <p>{country.overview}</p>
        </InfoCard>
        <InfoCard title="Contact">
          <p>{country.contact.email}</p>
          <p>{country.contact.phone}</p>
          <p>{country.contact.city}</p>
        </InfoCard>
        <InfoCard title="Chapter leadership">
          <p>Chapter leaders can keep chapter content, coaches, events, resources, and contact details current so the public chapter pages stay accurate.</p>
        </InfoCard>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Featured coaches" title={`Meet ${country.shortName} coaches`} />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <CoachCard key={coach.name} coach={coach} />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Local events" title={`Upcoming events in ${country.shortName}`} />
        {events.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <EventCard key={`${event.title}-${event.date}`} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState className="mt-8" title="No events at this time" description={`There are no published events for ${country.shortName} right now.`} />
        )}
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Testimonials" title="What organizations say about Action Learning" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {country.testimonials.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
