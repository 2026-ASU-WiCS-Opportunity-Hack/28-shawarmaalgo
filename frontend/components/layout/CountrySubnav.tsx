import Link from "next/link";
import { countrySubnav } from "@/data/countries";

export function CountrySubnav({ slug }: { slug: string }) {
  return (
    <div className="overflow-x-auto border-y border-slate-200 bg-brand-sand">
      <div className="container-shell flex min-w-max gap-2 py-3">
        {countrySubnav.map((item) => {
          const href = item.segment ? `/${slug}/${item.segment}` : `/${slug}`;
          return (
            <Link
              key={item.label}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-medium text-brand-navy hover:bg-white"
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
