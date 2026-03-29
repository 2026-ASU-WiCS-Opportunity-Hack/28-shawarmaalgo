import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCountryBySlug } from "@/data/countries";

export default function ChapterContentPage({ params }: { params: { country: string } }) {
  const country = getCountryBySlug(params.country);
  if (!country) notFound();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Chapter workspace"
        title={`Edit ${country.name}`}
        description="This is the frontend shell for chapter leaders to adjust content online without touching code. Connect the form fields to your backend publishing workflow."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form className="space-y-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Hero title</label>
            <input defaultValue={country.hero.title} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Hero description</label>
            <textarea defaultValue={country.hero.description} className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Chapter overview</label>
            <textarea defaultValue={country.overview} className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input defaultValue={country.contact.email} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input defaultValue={country.contact.phone} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white hover:bg-brand-ink">Save draft</button>
            <button className="rounded-full border border-brand-navy px-5 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-sand">Submit for review</button>
          </div>
        </form>

        <aside className="rounded-[1.75rem] bg-brand-sand p-6">
          <h2 className="text-xl font-semibold text-brand-navy">Connected endpoints</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            <li>GET chapter content</li>
            <li>PATCH chapter overview and hero content</li>
            <li>PATCH chapter contact details</li>
            <li>POST or PATCH team, events, resources, and coach changes</li>
            <li>Publish or submit content for approval</li>
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
