import { Button } from '@/components/ui/button';

type CtaBlockProps = {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function CtaBlock({ title, description, primary, secondary }: CtaBlockProps) {
  return (
    <section className="rounded-[2rem] bg-brand-sand px-6 py-10 sm:px-8">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-semibold text-brand-navy">{title}</h2>
        <p className="mt-4 text-base leading-8 text-slate-700">{description}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href={primary.href}>{primary.label}</Button>
        {secondary ? <Button href={secondary.href}>{secondary.label}</Button> : null}
      </div>
    </section>
  );
}
