import { Button } from "@/components/ui/button";

type HeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function Hero({ eyebrow, title, description, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-brand-navy via-brand-ink to-brand-teal text-white shadow-soft">
      <div className="grid gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100/90">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={primaryCta.href}>{primaryCta.label}</Button>
            {secondaryCta ? <Button href={secondaryCta.href} variant="secondary">{secondaryCta.label}</Button> : null}
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">WIAL network</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-100/90">
            <li>Global certification, chapter development, and coach visibility</li>
            <li>Shared site structure with room for local chapter content</li>
            <li>Production-ready frontend routes for coaches, events, resources, and sign-in</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
