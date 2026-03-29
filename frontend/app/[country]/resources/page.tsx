import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCountryBySlug } from "@/data/countries";
import { InfoCard } from "@/components/cards/InfoCard";

export default function CountryResourcesPage({ params }: { params: { country: string } }) {
  const country = getCountryBySlug(params.country);
  if (!country) notFound();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Chapter resources"
        title={`${country.shortName} resources`}
        description="Each chapter can maintain local resources while inheriting shared page structure and design patterns from the global platform."
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {country.resources.map((resource) => (
          <InfoCard key={resource.title} title={resource.title}>
            <p className="font-medium text-brand-teal">{resource.type}</p>
            <p>{resource.summary}</p>
          </InfoCard>
        ))}
      </div>
    </PageShell>
  );
}
