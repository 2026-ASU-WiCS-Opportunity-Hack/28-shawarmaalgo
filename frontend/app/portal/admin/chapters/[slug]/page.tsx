import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Field, Panel } from '@/components/portal/PortalCards';
import { getChapter } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function AdminChapterDetailPage({ params }: { params: { slug: string } }) {
  const chapter = await getChapter(params.slug);
  if (!chapter) notFound();

  return (
    <PortalShell
      eyebrow="Admin console"
      title={`Manage ${chapter.name}`}
      description="Control chapter-level settings, assign or replace chapter leadership, and adjust publishing details without affecting the shared platform template."
    >
      <div className="grid gap-8 xl:grid-cols-2">
        <Panel title="Chapter settings">
          <form className="grid gap-4">
            <Field label="Chapter name" defaultValue={chapter.name} />
            <Field label="Slug" defaultValue={chapter.slug} />
            <Field label="Contact email" defaultValue={chapter.contact.email} />
            <Field label="Phone" defaultValue={chapter.contact.phone} />
            <Field label="City" defaultValue={chapter.contact.city} />
            <button className="w-fit rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Save changes</button>
          </form>
        </Panel>
        <Panel title="Assign chapter leader">
          <form className="grid gap-4">
            <Field label="Leader name" defaultValue={chapter.team[0]?.name || ''} />
            <Field label="Leader email" defaultValue={`${chapter.slug}.lead@wial.org`} />
            <Field label="Role" defaultValue="Chapter Leader" />
            <button className="w-fit rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Assign leader</button>
          </form>
        </Panel>
      </div>
    </PortalShell>
  );
}
