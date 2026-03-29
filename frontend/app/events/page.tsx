import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/cards/EventCard";
import { globalEvents } from "@/data/content";
import { countries } from "@/data/countries";

export default function EventsPage() {
  const chapterEvents = countries.flatMap((country) =>
    country.events.map((event) => ({ ...event, title: `${event.title} — ${country.shortName}` }))
  );

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Events"
        title="Global and chapter programming in one calendar experience"
        description="WIAL already promotes conferences, webinars, and certification opportunities. This structure lets global programming and chapter activity live together without splitting the experience."
      />
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-brand-navy">Global events</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {globalEvents.map((event) => (
            <EventCard key={event.title} event={event} />
          ))}
        </div>
      </div>
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-brand-navy">Chapter events</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {chapterEvents.map((event) => (
            <EventCard key={event.title} event={event} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
