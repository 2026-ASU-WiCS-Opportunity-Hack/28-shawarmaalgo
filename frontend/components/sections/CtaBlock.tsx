import { Button } from "@/components/ui/Button";

export function CtaBlock({
  title,
  description,
  primary,
  secondary
}: {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="rounded-[2rem] bg-brand-sand px-6 py-10 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy">{title}</h2>
          <p className="mt-4 text-base leading-7 text-slate-700">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={primary.href}>{primary.label}</Button>
          {secondary ? <Button href={secondary.href} variant="secondary">{secondary.label}</Button> : null}
        </div>
      </div>
    </section>
  );
}
