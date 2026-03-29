import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Field, Panel } from '@/components/portal/PortalCards';
import { getChapter } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterContactPage({ params }: { params: { country: string } }) {
  const chapter = await getChapter(params.country);
  if (!chapter) notFound();
  return (
    <PortalShell eyebrow="Chapter leader console" title={`${chapter.name} contact details`} description="Update the local email, phone number, city, and any additional chapter-specific contact messaging shown to visitors." chapterSlug={chapter.slug}>
      <Panel title="Chapter contact information">
        <form className="grid gap-4 md:grid-cols-2">
          <Field label="Email" defaultValue={chapter.contact.email} />
          <Field label="Phone" defaultValue={chapter.contact.phone} />
          <Field label="City" defaultValue={chapter.contact.city} />
          <Field label="Office hours" defaultValue="Mon-Fri, 9:00 AM-5:00 PM" />
          <div className="md:col-span-2">
            <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Save contact details</button>
          </div>
        </form>
      </Panel>
    </PortalShell>
  );
}
