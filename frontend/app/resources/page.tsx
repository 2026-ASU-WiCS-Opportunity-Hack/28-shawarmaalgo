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
        title={page?.heroHeading || 'Library, articles, and chapter-ready materials'}
        description={
          page?.introContent ||
          "WIAL's global site points visitors toward its library, WIAL Talk content, endorsed products, and educational materials. This route gives those materials a clean home in the new platform."
        }
      />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {resources.map((resource) => (
          <InfoCard key={resource.title} title={resource.title}>
            <p className="font-medium text-brand-teal">{resource.type}</p>
            <p>{resource.summary}</p>
          </InfoCard>
        ))}
      </div>
    </PageShell>
  );
}
