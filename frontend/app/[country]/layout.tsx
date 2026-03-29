import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { countries, getCountryBySlug } from "@/data/countries";
import { CountrySubnav } from "@/components/layout/CountrySubnav";

export default function CountryLayout({ children, params }: { children: ReactNode; params: { country: string } }) {
  const country = getCountryBySlug(params.country);
  if (!country) {
    notFound();
  }

  return (
    <>
      <CountrySubnav slug={params.country} />
      {children}
    </>
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return countries.map((country) => ({ country: country.slug }));
}
