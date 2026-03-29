import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/cards/InfoCard";
import { getChapter } from "@/lib/server-data";

export default async function CountryTeamPage({ params }: { params: { country: string } }) {
  const country = await getChapter(params.country);
  if (!country) notFound();

  return (
    <PageShell>
      <SectionHeading eyebrow="Chapter team" title={`${country.shortName} chapter leadership`} description="Local chapter leaders and program owners help keep chapter information, programming, and coach visibility current within the broader WIAL network." />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {country.team.map((member) => (
          <InfoCard key={member.name} title={member.name}>
            <p className="font-medium text-brand-teal">{member.role}</p>
            <p>{member.blurb}</p>
          </InfoCard>
        ))}
      </div>
    </PageShell>
  );
}
