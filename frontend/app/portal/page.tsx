import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function PortalLandingPage({ searchParams }: { searchParams?: { role?: string } }) {
  const role = searchParams?.role;
  if (role === 'admin') redirect('/portal/admin');
  if (role === 'chapter-leader') redirect('/portal/chapter');
  if (role === 'coach') redirect('/portal/coach');

  return (
    <div className="container-shell py-16">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-brand-navy">Choose your portal</h1>
        <p className="mt-3 max-w-2xl text-slate-700">Access global administration, chapter management, or coach account tools from the WIAL management console.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link className="rounded-[1.5rem] bg-brand-sand p-6 text-brand-navy" href="/portal/admin">Admin console</Link>
          <Link className="rounded-[1.5rem] bg-brand-sand p-6 text-brand-navy" href="/portal/chapter">Chapter leader console</Link>
          <Link className="rounded-[1.5rem] bg-brand-sand p-6 text-brand-navy" href="/portal/coach">Coach account</Link>
        </div>
      </div>
    </div>
  );
}
