import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-brand-navy text-slate-100">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">WIAL</p>
          <h2 className="mt-3 text-2xl font-semibold">The global home for Action Learning, certification, and coach discovery.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">{site.description}</p>
          <p className="mt-4 text-sm text-slate-300">{site.contact.address}</p>
          <p className="text-sm text-slate-300">{site.contact.email}</p>
        </div>
        {site.footerLinks.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">{group.title}</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
