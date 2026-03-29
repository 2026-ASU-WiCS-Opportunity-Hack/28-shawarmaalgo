import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Panel } from '@/components/portal/PortalCards';
import { getChapters } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function AdminChaptersPage() {
  const chapters = await getChapters();

  return (
    <PortalShell
      eyebrow="Admin console"
      title="Chapter management"
      description="Review every chapter, open chapter settings, and provision new chapter sites such as WIAL Canada from the shared base template."
    >
      <Panel title="All chapters" description="Each chapter inherits the core global template while retaining local content areas for leadership, coaches, events, resources, and contact information.">
        <div className="mb-5 flex justify-end">
          <Link href="/portal/admin/chapters/new" className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">Create new chapter</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3 font-medium">Chapter</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter) => (
                <tr key={chapter.slug} className="border-b border-slate-100">
                  <td className="px-4 py-4 font-semibold text-brand-navy">{chapter.name}</td>
                  <td className="px-4 py-4 text-slate-600">/{chapter.slug}</td>
                  <td className="px-4 py-4 text-slate-600">{chapter.contact.email}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-4 text-sm font-semibold">
                      <Link href={`/portal/admin/chapters/${chapter.slug}`} className="text-brand-navy hover:text-brand-teal">Edit</Link>
                      <Link href={`/${chapter.slug}`} className="text-brand-navy hover:text-brand-teal">Preview</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PortalShell>
  );
}
