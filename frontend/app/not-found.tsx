import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="rounded-[2rem] border border-slate-200 p-10 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">Not found</p>
        <h1 className="mt-4 text-3xl font-bold text-brand-navy">That page does not exist yet.</h1>
        <p className="mt-4 text-slate-700">Use the shared route structure to add more global or country pages.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">
          Back home
        </Link>
      </div>
    </PageShell>
  );
}
