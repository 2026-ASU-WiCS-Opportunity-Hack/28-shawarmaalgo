import { PortalShell } from '@/components/portal/PortalShell';
import { Field, Panel } from '@/components/portal/PortalCards';

export const dynamic = 'force-dynamic';

export default function NewChapterPage() {
  return (
    <PortalShell
      eyebrow="Admin console"
      title="Create a new chapter"
      description="Provision a new chapter from the shared WIAL template. Once connected, this form should create the chapter, assign a leader, and make the new public route available immediately."
    >
      <Panel title="New chapter details" description="Example: create WIAL Canada with the slug canada, assign a chapter leader, and publish the chapter under the same shared design system.">
        <form className="grid gap-4 md:grid-cols-2">
          <Field label="Chapter name" defaultValue="WIAL Canada" />
          <Field label="Slug" defaultValue="canada" />
          <Field label="Country" defaultValue="Canada" />
          <Field label="Primary language" defaultValue="English" />
          <Field label="Contact email" defaultValue="canada@wial.org" />
          <Field label="Chapter leader email" defaultValue="leader.canada@wial.org" />
          <div className="md:col-span-2">
            <Field label="Hero title" defaultValue="Action Learning for organizations, leaders, and teams across Canada" />
          </div>
          <div className="md:col-span-2">
            <Field
              label="Hero description"
              textarea
              defaultValue="WIAL Canada extends the global WIAL mission locally through Action Learning programming, coach development, and chapter-based engagement."
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Provision chapter</button>
            <button className="rounded-full border border-brand-navy px-5 py-3 text-sm font-semibold text-brand-navy">Save draft</button>
          </div>
        </form>
      </Panel>
    </PortalShell>
  );
}
