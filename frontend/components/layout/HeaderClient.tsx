"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";

type HeaderClientProps = {
  portalHref: string | null;
};

export function HeaderClient({ portalHref }: HeaderClientProps) {
  const [open, setOpen] = useState(false);
  const accountLabel = portalHref ? "Portal" : "Login";
  const accountHref = portalHref || "/login";
  const mobileAccountClassName = portalHref
    ? "mt-2 inline-flex items-center justify-center rounded-full border border-brand-navy px-5 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-sand"
    : "mt-2 inline-flex items-center justify-center rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img src="/wial-logo.png" alt="WIAL logo" width="100" height="52" className="h-12 w-auto" />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-teal">World Institute for Action Learning</div>
            <div className="truncate text-sm text-brand-navy">Global network and chapter platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {site.primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 hover:text-brand-navy">
              {item.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            className="inline-flex items-center rounded-full border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-sand"
          >
            {accountLabel}
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-brand-navy lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-shell flex flex-col gap-1 py-4">
            {site.primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-brand-sand hover:text-brand-navy"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={accountHref}
              onClick={() => setOpen(false)}
              className={mobileAccountClassName}
            >
              {accountLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
