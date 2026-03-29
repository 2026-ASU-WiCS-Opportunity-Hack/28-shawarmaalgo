import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { loginRoles } from "@/data/content";

export default function LoginPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Account access"
        title="Sign in to manage chapters, coaches, and network content"
        description="This frontend includes production-ready sign-in screens for global admins, chapter leaders, and coaches. Wire the form to your backend auth provider when ready."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-2xl font-semibold text-brand-navy">Welcome back</h2>
          <form className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <input type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="you@wial.org" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Enter your password" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" /> Keep me signed in
              </label>
              <a href="#" className="font-medium text-brand-navy hover:text-brand-teal">Forgot password?</a>
            </div>
            <button className="w-full rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white hover:bg-brand-ink">Sign in</button>
            <button className="w-full rounded-full border border-brand-navy px-5 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-sand">Continue with single sign-on</button>
          </form>
        </section>

        <section className="rounded-[1.75rem] bg-brand-sand p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-brand-navy">Access by role</h2>
          <div className="mt-6 space-y-4">
            {loginRoles.map((role) => (
              <article key={role.title} className="rounded-[1.25rem] border border-white bg-white p-5 shadow-soft">
                <h3 className="text-lg font-semibold text-brand-navy">{role.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{role.body}</p>
                <Link href={role.href} className="mt-4 inline-flex text-sm font-semibold text-brand-navy hover:text-brand-teal">
                  Preview {role.title} portal →
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
