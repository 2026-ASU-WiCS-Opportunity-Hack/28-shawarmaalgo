import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";

export default function ContactPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch with WIAL"
        description="The current WIAL site provides a clear global contact path. This page keeps that simple while leaving room for chapter routing and form handling through the backend."
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-[1.5rem] border border-slate-200 p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-brand-navy">Global contact</h3>
          <p className="mt-4 text-sm leading-7 text-slate-700">Email: {site.contact.email}</p>
          <p className="text-sm leading-7 text-slate-700">Address: {site.contact.address}</p>
        </section>
        <section className="rounded-[1.5rem] border border-slate-200 bg-brand-sand p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-brand-navy">Message WIAL</h3>
          <form className="mt-4 space-y-4">
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Your name" />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Your email" />
            <textarea className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="How can we help?" />
            <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white hover:bg-brand-ink">Send message</button>
          </form>
        </section>
      </div>
    </PageShell>
  );
}
