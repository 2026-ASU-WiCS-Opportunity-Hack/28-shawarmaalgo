import { ReactNode } from "react";

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <h3 className="text-lg font-semibold text-brand-navy dark:text-white">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{children}</div>
    </article>
  );
}
