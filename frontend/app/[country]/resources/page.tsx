import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/cards/InfoCard";
import { getChapter } from "@/lib/server-data";

export default async function CountryResourcesPage({ params }: { params: { country: string } }) {
  const country = await getChapter(params.country);
  if (!country) notFound();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Chapter resources"
        title={`${country.shortName} resources`}
        description="Each chapter can maintain local resources while staying connected to WIAL’s broader learning materials, certification information, and coach-development pathways."
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {country.resources.map((resource) => (
          <InfoCard key={resource.title} title={resource.title}>
            <p className="font-medium text-brand-teal">{resource.type}</p>
            <p>{resource.summary}</p>
            {resource.url ? (
              <a href={resource.url} className="mt-4 inline-flex text-sm font-semibold text-brand-navy hover:text-brand-teal">
                Open resource
              </a>
            ) : null}
          </InfoCard>
        ))}
      </div>
    </PageShell>
  );
}
