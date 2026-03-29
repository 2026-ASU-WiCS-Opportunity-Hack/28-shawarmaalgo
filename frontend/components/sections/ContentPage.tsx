import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CtaBlock } from '@/components/sections/CtaBlock';
import { RichContent } from '@/components/content/RichContent';

type ContentPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  heroImageUrl?: string;
  bodyContent?: string;
  sections: Array<{ title: string; body: string }>;
  cta?: {
    title: string;
    description: string;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
};

export function ContentPage({ eyebrow, title, intro, heroImageUrl, bodyContent, sections, cta }: ContentPageProps) {
  return (
    <PageShell>
      <SectionHeading eyebrow={eyebrow} title={title} description={intro} />
      {heroImageUrl ? (
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950">
          <img src={heroImageUrl} alt={title} className="max-h-[28rem] w-full object-cover" />
        </div>
      ) : null}
      {bodyContent ? <RichContent content={bodyContent} className="mt-8" /> : null}
      <div className="prose-lite mt-10 grid gap-8 md:grid-cols-2">
        {sections.map((section) => (
          <section key={section.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-xl font-semibold text-brand-navy dark:text-white">{section.title}</h3>
            <p className="mt-3 text-slate-700 dark:text-slate-300">{section.body}</p>
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
