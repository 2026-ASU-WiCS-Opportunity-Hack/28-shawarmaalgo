import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBlock } from "@/components/sections/CtaBlock";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  cta?: {
    title: string;
    description: string;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
};

export function ContentPage({ eyebrow, title, intro, sections, cta }: ContentPageProps) {
  return (
    <PageShell>
      <SectionHeading eyebrow={eyebrow} title={title} description={intro} />
      <div className="prose-lite mt-10 grid gap-8 md:grid-cols-2">
        {sections.map((section) => (
          <section key={section.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-xl font-semibold">{section.title}</h3>
            <p className="mt-3">{section.body}</p>
          </section>
        ))}
      </div>
      {cta ? (
        <div className="mt-16">
          <CtaBlock title={cta.title} description={cta.description} primary={cta.primary} secondary={cta.secondary} />
        </div>
      ) : null}
    </PageShell>
  );
}
