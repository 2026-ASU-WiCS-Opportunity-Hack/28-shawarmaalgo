import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import CoachDirectory from "@/app/coaches/CoachDirectory";
import { getChapters, getCoachDirectory } from "@/lib/server-data";

export default async function CoachesPage() {
  const [allCoaches, chapters] = await Promise.all([getCoachDirectory(), getChapters()]);

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Coach Directory"
        title="Search WIAL certified coaches"
        description="Browse certified coaches across the WIAL network and discover chapter-based expertise."
      />

      <CoachDirectory initialCoaches={allCoaches} chapters={chapters} />
    </PageShell>
  );
}
