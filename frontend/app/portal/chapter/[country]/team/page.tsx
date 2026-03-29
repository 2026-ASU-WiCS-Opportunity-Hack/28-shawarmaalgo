import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Field, Panel } from '@/components/portal/PortalCards';
import { getChapter } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterTeamPage({ params }: { params: { country: string } }) {
  const chapter = await getChapter(params.country);
  if (!chapter) notFound();
  return (
    <PortalShell eyebrow="Chapter leader console" title={`${chapter.name} team management`} description="Maintain chapter leadership and contributor records shown on the public chapter pages.">
      <div className="grid gap-6 xl:grid-cols-2">
        {chapter.team.map((member) => (
          <Panel key={member.name} title={member.name} description={member.role}>
            <div className="grid gap-4">
              <Field label="Name" defaultValue={member.name} />
              <Field label="Role" defaultValue={member.role} />
              <Field label="Profile summary" textarea defaultValue={member.blurb} />
              <button className="w-fit rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Save member</button>
            </div>
          </Panel>
        ))}
      </div>
    </PortalShell>
  );
}
