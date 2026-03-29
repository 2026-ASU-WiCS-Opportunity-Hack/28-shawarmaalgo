type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">{eyebrow}</p> : null}
      <h2 className="text-3xl font-bold tracking-tight text-brand-navy dark:text-white sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}
