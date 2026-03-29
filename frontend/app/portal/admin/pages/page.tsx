import { PortalShell } from '@/components/portal/PortalShell';
import { Field, Panel } from '@/components/portal/PortalCards';
import { getGlobalPages } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  const pages = await getGlobalPages();

  return (
    <PortalShell
      eyebrow="Admin console"
      title="Global page management"
      description="Maintain shared public content for pages such as Home, About, Action Learning, Certification, Resources, and Contact."
    >
      <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel title="Published pages">
          <div className="space-y-3">
            {pages.map((page) => (
              <div key={page.slug} className="rounded-[1.25rem] border border-slate-200 p-4">
                <p className="font-semibold text-brand-navy">{page.title}</p>
                <p className="text-sm text-slate-600">{page.status} • Updated {page.lastUpdated}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Edit shared page content">
          <form className="grid gap-4">
            <Field label="Page title" defaultValue="About WIAL" />
            <Field label="Hero heading" defaultValue="Developing leaders and organizations through Action Learning" />
            <Field label="Introductory content" textarea defaultValue="WIAL is a global nonprofit organization dedicated to advancing Action Learning and supporting certified coaches, organizations, and chapters around the world." />
            <button className="w-fit rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">Save page content</button>
          </form>
        </Panel>
      </div>
    </PortalShell>
  );
}
