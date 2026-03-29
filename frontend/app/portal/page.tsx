import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { countries } from "@/data/countries";

const roleCopy: Record<string, { title: string; description: string; actions: string[] }> = {
  admin: {
    title: "Global Admin Portal",
    description: "Manage shared page content, chapter approvals, network standards, and coach visibility across the WIAL platform.",
    actions: ["Approve chapter updates", "Manage global content", "Review coach records", "Monitor events and inquiries"]
  },
  "chapter-leader": {
    title: "Chapter Leader Portal",
    description: "Update chapter content without code, publish local events, review chapter coaches, and keep chapter information current.",
    actions: ["Edit chapter homepage", "Update team and contact info", "Publish events and resources", "Review local coach listings"]
  },
  coach: {
    title: "Coach Portal",
    description: "Maintain your coach profile, review certification status, and stay connected to chapter activity.",
    actions: ["Update your profile", "Review certification details", "Track chapter events", "Manage contact preferences"]
  }
};

export default function PortalPage({ searchParams }: { searchParams?: { role?: string } }) {
  const role = searchParams?.role && roleCopy[searchParams.role] ? searchParams.role : "chapter-leader";
  const config = roleCopy[role];

  return (
    <PageShell>
      <SectionHeading eyebrow="Portal" title={config.title} description={config.description} />

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-brand-navy">Quick actions</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {config.actions.map((action) => (
              <div key={action} className="rounded-[1.25rem] border border-slate-200 p-4 text-sm text-slate-700">
                {action}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-brand-sand p-6">
          <h2 className="text-xl font-semibold text-brand-navy">Connected workflows</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            <li>Authentication and session validation</li>
            <li>Role-based access for admins, chapter leaders, and coaches</li>
            <li>Chapter content editing with publishing status</li>
            <li>Coach profile and event management</li>
          </ul>
        </div>
      </section>

      <section className="mt-12 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-brand-navy">Chapter content management</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">Chapter leaders can edit structured fields for hero copy, local team details, chapter resources, and chapter events.</p>
          </div>
          <Link href="/login" className="text-sm font-semibold text-brand-navy hover:text-brand-teal">Switch role →</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {countries.map((country) => (
            <article key={country.slug} className="rounded-[1.25rem] border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-brand-navy">{country.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">Edit chapter overview, team members, coaches, events, resources, and local contact details.</p>
              <Link href={`/portal/chapters/${country.slug}/content`} className="mt-4 inline-flex text-sm font-semibold text-brand-navy hover:text-brand-teal">
                Open content workspace →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
