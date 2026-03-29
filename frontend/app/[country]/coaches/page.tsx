import { notFound } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CoachCard } from '@/components/cards/CoachCard';
import { getChapter, getCountryCoaches } from '@/lib/server-data';

export default async function CountryCoachesPage({ params }: { params: { country: string } }) {
  const [country, coaches] = await Promise.all([getChapter(params.country), getCountryCoaches(params.country)]);
  if (!country) notFound();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Local coaches"
        title={`${country.shortName} coach directory`}
        description="Discover certified Action Learning coaches connected to this chapter, with local context and alignment to the global WIAL network."
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coaches.map((coach) => (
          <CoachCard key={coach.name} coach={coach} />
        ))}
      </div>
    </PageShell>
  );
}
