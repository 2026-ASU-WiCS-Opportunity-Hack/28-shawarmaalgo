import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InfoCard } from '@/components/cards/InfoCard';
import { getGlobalPageContent, getGlobalResources } from '@/lib/server-data';

export default async function ResourcesPage() {
  const [resources, page] = await Promise.all([getGlobalResources(), getGlobalPageContent('resources')]);

  return (
    <PageShell>
      <SectionHeading
        eyebrow={page?.title || 'Resources'}
        title={page?.heroHeading || 'Programs, learning materials, and coach-development resources'}
        description={
          page?.introContent ||
          'WIAL points visitors to certification information, WIAL Talk, directory search, and other learning materials that help people explore Action Learning and connect with the community.'
        }
      />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {resources.map((resource) => (
          <InfoCard key={resource.title} title={resource.title}>
            <p className="font-medium text-brand-teal">{resource.type}</p>
            <p>{resource.summary}</p>
            {resource.url ? (
              <a href={resource.url} className="mt-4 inline-flex text-sm font-semibold text-brand-navy hover:text-brand-teal">
                Visit resource →
              </a>
            ) : null}
          </InfoCard>
        ))}
      </div>
    </PageShell>
  );
}
